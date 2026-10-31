import { NextRequest, NextResponse } from 'next/server';
import { CampusItem } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { question, items = [], apiKey } = await req.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    const qLower = question.toLowerCase();
    const typedItems = items as CampusItem[];

    // If API key is provided, query Gemini with grounded context
    if (apiKey && apiKey.length > 15) {
      const contextSummary = typedItems
        .map(
          (i) =>
            `- [ID: ${i.id}] "${i.title}" | Category: ${i.category} | Date: ${i.date} ${i.time || ''} | Venue: ${i.venue || 'N/A'} | Status: ${i.status} | Priority: ${i.priority} | Reg/Sub Deadline: ${i.submissionDeadline || i.registrationDeadline || 'N/A'}`
        )
        .join('\n');

      const prompt = `You are CampusPulse AI, the student's personal campus productivity assistant.
Answer the student's question accurately using ONLY the stored campus database below.
Never hallucinate or invent events, assignments, or deadlines not in this list.
If you refer to an item, include its exact title and date.

Stored student items:
${contextSummary}

Student question: "${question}"

Provide a friendly, helpful, structured response with bullet points and clear priority guidance.`;

      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
            }),
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            // Find references to items
            const matchedItems = typedItems.filter((it) =>
              reply.toLowerCase().includes(it.title.toLowerCase().slice(0, 15))
            );
            return NextResponse.json({ reply, referencedItemIds: matchedItems.map((m) => m.id) });
          }
        }
      } catch {
        // Fallback to grounded local answer engine
      }
    }

    // --- Deterministic Grounded Campus Assistant Engine ---
    let reply = '';
    const referencedItemIds: string[] = [];

    if (qLower.includes('today') || qLower.includes('aaj')) {
      const today = new Date().toISOString().split('T')[0];
      const todayItems = typedItems.filter(
        (i) => i.date === today || i.submissionDeadline === today || i.registrationDeadline === today
      );

      if (todayItems.length === 0) {
        reply = `You have no scheduled deadlines or events due specifically for today! You can focus on upcoming assignments like your mid-semester exam prep.`;
      } else {
        reply = `Here is what you need to focus on today:\n\n` +
          todayItems
            .map((item) => {
              referencedItemIds.push(item.id);
              return `• **${item.title}** (${item.category.replace('_', ' ')}): ${item.time || 'All day'} at ${item.venue || 'Campus'}. Status: ${item.status.toUpperCase()}.`;
            })
            .join('\n') +
          `\n\nMake sure to prioritize high-urgency submissions before midnight!`;
      }
    } else if (qLower.includes('nearest deadline') || qLower.includes('about to miss') || qLower.includes('urgent')) {
      const pendingWithDeadlines = typedItems
        .filter((i) => i.status !== 'completed' && (i.submissionDeadline || i.registrationDeadline || i.date))
        .sort((a, b) => {
          const dateA = a.submissionDeadline || a.registrationDeadline || a.date;
          const dateB = b.submissionDeadline || b.registrationDeadline || b.date;
          return dateA.localeCompare(dateB);
        });

      if (pendingWithDeadlines.length === 0) {
        reply = `Great news! You have no pending deadlines right now.`;
      } else {
        const nearest = pendingWithDeadlines[0];
        referencedItemIds.push(nearest.id);
        const deadlineDate = nearest.submissionDeadline || nearest.registrationDeadline || nearest.date;
        reply = `Your nearest deadline is **${nearest.title}**!\n\n` +
          `• **Type:** ${nearest.category.replace('_', ' ').toUpperCase()}\n` +
          `• **Due Date:** ${deadlineDate} at ${nearest.time || '11:59 PM'}\n` +
          `• **Priority:** ${nearest.priority.toUpperCase()}\n` +
          `• **Action Required:** ${nearest.actionRequired || 'Submit via portal'}\n\n` +
          `Make sure to complete this before the portal closes!`;
      }
    } else if (qLower.includes('event') || qLower.includes('workshop') || qLower.includes('fest')) {
      const events = typedItems.filter((i) => i.isEvent).slice(0, 5);
      if (events.length === 0) {
        reply = `You do not have any upcoming events saved. Use the AI Smart Input to add event posters or announcements!`;
      } else {
        reply = `Here are your upcoming campus events:\n\n` +
          events
            .map((ev) => {
              referencedItemIds.push(ev.id);
              return `• **${ev.title}**\n  📅 Date: ${ev.date} at ${ev.time || 'TBD'} | 📍 Venue: ${ev.venue || 'Campus'}\n  🏷️ Attendance: ${ev.attendance?.toUpperCase() || 'OPTIONAL'}`;
            })
            .join('\n\n');
      }
    } else if (qLower.includes('this week') || qLower.includes('complete this week')) {
      const pending = typedItems.filter((i) => i.status !== 'completed').slice(0, 5);
      reply = `Here are your key action items for this week:\n\n` +
        pending
          .map((p) => {
            referencedItemIds.push(p.id);
            return `• **${p.title}** (Due: ${p.submissionDeadline || p.date}) - Priority: ${p.priority.toUpperCase()}`;
          })
          .join('\n') +
        `\n\nTip: Click on any item to view details, subtasks, and original source notes.`;
    } else {
      // General summary
      const pendingCount = typedItems.filter((i) => i.status !== 'completed').length;
      const completedCount = typedItems.filter((i) => i.status === 'completed').length;
      reply = `You currently have **${pendingCount} pending items** and **${completedCount} completed items** in your CampusPulse workspace.\n\n` +
        `You can ask me:\n` +
        `• "What should I do today?"\n` +
        `• "Which assignment has the nearest deadline?"\n` +
        `• "What are my upcoming college events?"\n` +
        `• "What do I need to complete this week?"`;
    }

    return NextResponse.json({ reply, referencedItemIds });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

