import { NextRequest, NextResponse } from 'next/server';
import { parseUnstructuredInput } from '@/lib/ai/extractor';

export async function POST(req: NextRequest) {
  try {
    const { rawText, sourceType = 'whatsapp', apiKey } = await req.json();

    if (!rawText || typeof rawText !== 'string') {
      return NextResponse.json({ error: 'rawText is required' }, { status: 400 });
    }

    // If apiKey is provided, attempt Gemini 1.5 Flash structured output
    if (apiKey && apiKey.length > 15) {
      const todayISO = new Date().toISOString().split('T')[0];
      const prompt = `You are CampusPulse AI, an intelligent college campus information extractor.
Analyze the following unstructured campus message/notice.
The current date is: ${todayISO}.
Extract all events, assignments, exams, and deadlines as a JSON array of items.
Message language may be English or Hinglish (Hindi written in Latin script, e.g., 'kal', 'parso', 'compulsory', 'baje').
If multiple events or deadlines are present, output separate item objects.
Do not invent information. If a field like venue or time is missing, omit it or set it to null and list it in 'unspecifiedFields'.

Return ONLY valid JSON matching this schema:
{
  "detectedLanguage": "en" | "hinglish" | "mixed",
  "overallSummary": "Brief 1-line summary",
  "items": [
    {
      "title": "Clear event or task title",
      "description": "Short clean description",
      "date": "YYYY-MM-DD",
      "time": "HH:MM AM/PM" or null,
      "venue": "Location" or null,
      "category": "workshop" | "seminar" | "assignment" | "examination" | "registration_deadline" | "cultural_festival" | "sports_event" | "announcement" | "personal_task",
      "priority": "high" | "medium" | "low",
      "attendance": "compulsory" | "optional" | "recommended" | "unspecified",
      "registrationDeadline": "YYYY-MM-DD" or null,
      "submissionDeadline": "YYYY-MM-DD" or null,
      "instructions": ["string"],
      "benefits": ["string"],
      "actionRequired": "string" or null,
      "confidence": number 0-100,
      "unspecifiedFields": ["string"],
      "isTask": boolean,
      "isEvent": boolean,
      "sourceSnippet": "string"
    }
  ]
}

Input text to analyze:
"""
${rawText}
"""`;

      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.1,
                responseMimeType: 'application/json',
              },
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const textResponse = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (textResponse) {
            const parsed = JSON.parse(textResponse);
            return NextResponse.json({
              ...parsed,
              rawText,
              sourceType,
            });
          }
        }
      } catch {
        // Fall through to deterministic extractor
      }
    }

    // Default fast local offline-capable extraction
    const result = await parseUnstructuredInput(rawText, sourceType);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { error: 'Failed to process AI extraction', details: error.message },
      { status: 500 }
    );
  }
}

