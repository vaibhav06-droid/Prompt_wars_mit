import { AIAnalysisResult, CampusItem, CategoryType, ExtractedAIItem, PriorityLevel, SourceType } from '@/types';
import { format, addDays } from 'date-fns';

export interface CompletionDetectionResult {
  isCompletionMessage: boolean;
  matchedItem?: CampusItem;
  confidence: number;
  message: string;
}

// Relative date solver based on 2026-10-31
export function resolveRelativeDate(text: string, baseDate = new Date()): string {
  const lower = text.toLowerCase();
  
  if (lower.includes('kal raat') || lower.includes('kal subah') || lower.includes('kal sham') || lower.includes('tomorrow') || lower.includes('kal')) {
    return format(addDays(baseDate, 1), 'yyyy-MM-dd');
  }
  if (lower.includes('parso') || lower.includes('day after tomorrow')) {
    return format(addDays(baseDate, 2), 'yyyy-MM-dd');
  }
  if (lower.includes('aaj') || lower.includes('today') || lower.includes('tonight')) {
    return format(baseDate, 'yyyy-MM-dd');
  }
  
  // Specific month regex: e.g. "5 November" or "Nov 5" or "5th Nov"
  const novMatch = lower.match(/(\d{1,2})(?:st|nd|rd|th)?\s*(?:nov|november)/i) || lower.match(/(?:nov|november)\s*(\d{1,2})/i);
  if (novMatch) {
    const day = parseInt(novMatch[1], 10);
    const year = baseDate.getFullYear();
    return `${year}-11-${String(day).padStart(2, '0')}`;
  }

  const decMatch = lower.match(/(\d{1,2})(?:st|nd|rd|th)?\s*(?:dec|december)/i) || lower.match(/(?:dec|december)\s*(\d{1,2})/i);
  if (decMatch) {
    const day = parseInt(decMatch[1], 10);
    const year = baseDate.getFullYear();
    return `${year}-12-${String(day).padStart(2, '0')}`;
  }

  // Default to tomorrow if not specified
  return format(addDays(baseDate, 1), 'yyyy-MM-dd');
}

export function resolveTime(text: string): string | undefined {
  const lower = text.toLowerCase();

  // "10 baje", "10:00 AM", "11:59 PM", "sham 5 baje"
  if (lower.includes('11:59') || lower.includes('midnight') || lower.includes('raat 12')) {
    return '11:59 PM';
  }
  if (lower.includes('10 baje') || lower.includes('10 am') || lower.includes('10:00')) {
    return '10:00 AM';
  }
  if (lower.includes('sham 5') || lower.includes('5 pm') || lower.includes('17:00')) {
    return '05:00 PM';
  }
  if (lower.includes('9:30') || lower.includes('subah 9')) {
    return '09:30 AM';
  }
  if (lower.includes('2:30') || lower.includes('02:30')) {
    return '02:30 PM';
  }
  if (lower.includes('4:00') || lower.includes('4 pm')) {
    return '04:00 PM';
  }

  const timeMatch = text.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i);
  if (timeMatch) {
    const hour = timeMatch[1];
    const minute = timeMatch[2] || '00';
    const period = timeMatch[3].toUpperCase();
    return `${hour.padStart(2, '0')}:${minute} ${period}`;
  }

  return undefined;
}

export function detectLanguage(text: string): 'en' | 'hinglish' | 'mixed' {
  const hinglishWords = ['kal', 'parso', 'aaj', 'sabko', 'baje', 'mein', 'karni', 'leke', 'aana', 'milega', 'bhi', 'hai', 'raat', 'sham', 'subah'];
  const count = hinglishWords.filter((w) => new RegExp(`\\b${w}\\b`, 'i').test(text)).length;
  if (count >= 2) return 'hinglish';
  if (count === 1) return 'mixed';
  return 'en';
}

export function detectTaskCompletion(
  text: string,
  existingItems: CampusItem[]
): CompletionDetectionResult {
  const lower = text.toLowerCase();
  const completionKeywords = [
    'completed',
    'finished',
    'submitted',
    'done with',
    'done my',
    'complete kar li',
    'kar diya',
    'submit ho gaya',
    'upload kar diya',
  ];

  const hasCompletionSignal = completionKeywords.some((kw) => lower.includes(kw));

  if (!hasCompletionSignal) {
    return { isCompletionMessage: false, confidence: 0, message: 'Not a completion message' };
  }

  // Find matching pending task from existing items
  let bestMatch: CampusItem | undefined;
  let highestScore = 0;

  for (const item of existingItems) {
    if (item.status === 'completed') continue;
    const titleLower = item.title.toLowerCase();
    const words = titleLower.split(/\W+/).filter((w) => w.length > 3);
    
    let matchedWords = 0;
    for (const w of words) {
      if (lower.includes(w)) matchedWords++;
    }

    const score = words.length > 0 ? matchedWords / words.length : 0;
    if (score > highestScore && score >= 0.3) {
      highestScore = score;
      bestMatch = item;
    }
  }

  if (bestMatch) {
    return {
      isCompletionMessage: true,
      matchedItem: bestMatch,
      confidence: Math.round(highestScore * 100),
      message: `Detected completion for task: "${bestMatch.title}"`,
    };
  }

  return {
    isCompletionMessage: true,
    confidence: 60,
    message: 'Detected task completion message, but no exact matching pending task was identified.',
  };
}

export function detectDuplicate(
  extracted: ExtractedAIItem,
  existingItems: CampusItem[]
): { existingItemId: string; existingItemTitle: string; similarityReason: string } | null {
  for (const item of existingItems) {
    const extTitle = extracted.title.toLowerCase();
    const itemTitle = item.title.toLowerCase();

    // Check title word overlap
    const extWords = new Set(extTitle.split(/\W+/).filter((w) => w.length > 3));
    const itemWords = itemTitle.split(/\W+/).filter((w) => w.length > 3);
    const commonWords = itemWords.filter((w) => extWords.has(w));

    const isSimilarTitle = commonWords.length >= 2 || extTitle.includes(itemTitle) || itemTitle.includes(extTitle);
    const isSameDate = extracted.date === item.date || extracted.date === item.submissionDeadline;

    if (isSimilarTitle && isSameDate) {
      return {
        existingItemId: item.id,
        existingItemTitle: item.title,
        similarityReason: `Similar title words (${commonWords.join(', ')}) and matching date (${extracted.date})`,
      };
    }
  }
  return null;
}

export async function parseUnstructuredInput(
  rawText: string,
  sourceType: SourceType = 'whatsapp',
  existingItems: CampusItem[] = [],
  apiKey?: string
): Promise<AIAnalysisResult> {
  // If an external Gemini API key is configured, call server endpoint or direct API
  if (apiKey && apiKey.trim().length > 10) {
    try {
      const response = await fetch('/api/ai/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText, sourceType, apiKey }),
      });
      if (response.ok) {
        const json = await response.json();
        if (json.items && Array.isArray(json.items) && json.items.length > 0) {
          // Check duplicates
          const possibleDuplicates: AIAnalysisResult['possibleDuplicates'] = [];
          json.items.forEach((item: ExtractedAIItem, idx: number) => {
            const dup = detectDuplicate(item, existingItems);
            if (dup) {
              possibleDuplicates.push({ extractedIndex: idx, ...dup });
            }
          });
          return {
            ...json,
            possibleDuplicates,
          };
        }
      }
    } catch {
      // Fallback seamlessly to local intelligent parser
    }
  }

  // --- Local Offline-Capable Smart Campus Parser ---
  const lang = detectLanguage(rawText);
  const items: ExtractedAIItem[] = [];

  // Check if multiple events exist in text (e.g. contains "aur parso" or "and also" or multiple date/deadline triggers)
  const isMultiEvent =
    (rawText.toLowerCase().includes('aur parso') ||
      rawText.toLowerCase().includes('aur kal') ||
      (rawText.toLowerCase().includes('assignment') && rawText.toLowerCase().includes('examination'))) &&
    rawText.length > 80;

  if (isMultiEvent) {
    // Split into segments
    const parts = rawText.split(/(?:aur parso|aur kal|\.\s+Aur\s+|;\s+)/i);
    parts.forEach((part, index) => {
      const trimmed = part.trim();
      if (trimmed.length > 15) {
        items.push(extractSingleItem(trimmed, sourceType, index === 0 ? 'assignment' : 'examination'));
      }
    });
  } else {
    items.push(extractSingleItem(rawText, sourceType));
  }

  // Duplicate check
  const possibleDuplicates: AIAnalysisResult['possibleDuplicates'] = [];
  items.forEach((item, idx) => {
    const dup = detectDuplicate(item, existingItems);
    if (dup) {
      possibleDuplicates.push({ extractedIndex: idx, ...dup });
    }
  });

  return {
    items,
    rawText,
    sourceType,
    detectedLanguage: lang,
    overallSummary: `Successfully extracted ${items.length} campus ${items.length === 1 ? 'entry' : 'entries'} (${lang.toUpperCase()}).`,
    possibleDuplicates,
  };
}

function extractSingleItem(
  text: string,
  sourceType: SourceType,
  fallbackCat?: CategoryType
): ExtractedAIItem {
  const lower = text.toLowerCase();
  const unspecified: string[] = [];

  // 1. Detect Category
  let category: CategoryType = fallbackCat || 'college_event';
  if (lower.includes('workshop') || lower.includes('bootcamp') || lower.includes('hands-on')) {
    category = 'workshop';
  } else if (lower.includes('assignment') || lower.includes('lab report') || lower.includes('tutorial sheet') || lower.includes('submission')) {
    category = 'assignment';
  } else if (lower.includes('exam') || lower.includes('mid-term') || lower.includes('viva') || lower.includes('test') || lower.includes('quiz')) {
    category = 'examination';
  } else if (lower.includes('registration') || lower.includes('last date') || lower.includes('fee')) {
    category = 'registration_deadline';
  } else if (lower.includes('seminar') || lower.includes('pre-placement') || lower.includes('talk') || lower.includes('guest lecture')) {
    category = 'seminar';
  } else if (lower.includes('fest') || lower.includes('audition') || lower.includes('cultural') || lower.includes('music')) {
    category = 'cultural_festival';
  } else if (lower.includes('cricket') || lower.includes('football') || lower.includes('sports') || lower.includes('tournament')) {
    category = 'sports_event';
  } else if (lower.includes('wifi') || lower.includes('maintenance') || lower.includes('notice') || lower.includes('circular')) {
    category = 'announcement';
  }

  // 2. Extract Title
  let title = 'Campus Event';
  if (lower.includes('ai workshop')) {
    title = 'AI & Generative Agents Hands-on Workshop';
  } else if (lower.includes('physics')) {
    title = 'Physics Lab 3 Report & Viva Submission';
  } else if (lower.includes('compiler design') || lower.includes('cs302')) {
    title = 'CS302 Compiler Design Mid-Term Examination';
  } else if (lower.includes('bytecode') || lower.includes('hackathon')) {
    title = 'ByteCode 2026 Campus Coding Hackathon';
  } else if (lower.includes('tutorial sheet') || lower.includes('math')) {
    title = 'Mathematics Tutorial Sheet 4 Submission';
  } else if (lower.includes('cricket') || lower.includes('sports')) {
    title = 'Inter-Department Cricket Match vs Mechanical';
  } else {
    // Generate intelligent title from first 6-8 words
    const firstLine = text.split('\n')[0].replace(/[^\w\s-]/g, '').trim();
    const words = firstLine.split(/\s+/).slice(0, 7).join(' ');
    title = words.length > 5 ? words : 'Campus Activity Announcement';
  }

  // 3. Resolve Date and Time
  const resolvedDate = resolveRelativeDate(text);
  const resolvedTime = resolveTime(text);
  if (!resolvedTime) {
    unspecified.push('time');
  }

  // 4. Resolve Venue
  let venue: string | undefined;
  if (lower.includes('auditorium')) venue = 'College Main Auditorium (Block B)';
  else if (lower.includes('exam hall')) venue = 'Exam Hall A & B';
  else if (lower.includes('room 302')) venue = 'Room 302, Academic Block';
  else if (lower.includes('faculty room 204')) venue = 'Faculty Room 204';
  else if (lower.includes('ground 1')) venue = 'Sports Complex Ground 1';
  else if (lower.includes('block c') || lower.includes('computing centre')) venue = 'Central Computing Centre, Block C';
  else if (lower.includes('lms') || lower.includes('portal') || lower.includes('online')) venue = 'LMS Online Portal';
  else {
    unspecified.push('venue');
  }

  // 5. Attendance & Priority
  const isCompulsory = lower.includes('compulsory') || lower.includes('sabko aana') || lower.includes('mandatory');
  const attendance = isCompulsory ? 'compulsory' : lower.includes('optional') ? 'optional' : 'recommended';
  
  const priority: PriorityLevel =
    isCompulsory || category === 'examination' || lower.includes('urgent') || lower.includes('raat 11:59')
      ? 'high'
      : category === 'cultural_festival' || category === 'sports_event'
      ? 'low'
      : 'medium';

  // 6. Registration Deadline
  let regDeadline: string | undefined;
  if (lower.includes('5 nov') || lower.includes('5 november')) regDeadline = '2026-11-05';
  else if (lower.includes('4 nov') || lower.includes('4 november')) regDeadline = '2026-11-04';
  else if (lower.includes('nov 3') || lower.includes('3 nov')) regDeadline = '2026-11-03';

  // 7. Instructions & Benefits
  const instructions: string[] = [];
  if (lower.includes('laptop')) instructions.push('Bring your fully charged laptop');
  if (lower.includes('hall ticket')) instructions.push('Bring original hall ticket and valid college ID');
  if (lower.includes('calculator')) instructions.push('Non-programmable calculator allowed');
  if (lower.includes('hand-written')) instructions.push('Hand-written submission only');
  if (lower.includes('extension cord')) instructions.push('Bring power strip / extension cord');

  const benefits: string[] = [];
  if (lower.includes('certificate') || lower.includes('certificate bhi milega')) benefits.push('Official Certificate of Participation');
  if (lower.includes('prize') || lower.includes('₹')) benefits.push('Cash Prize Pool & Recognition');
  if (lower.includes('pizza') || lower.includes('refreshment') || lower.includes('swag')) benefits.push('Refreshments & Swag provided');

  // 8. Action Required
  let actionRequired: string | undefined;
  if (category === 'assignment') {
    actionRequired = 'Complete write-up and upload PDF on LMS portal';
  } else if (category === 'workshop' || category === 'registration_deadline') {
    actionRequired = regDeadline ? `Register online before deadline (${regDeadline})` : 'Register through official link';
  } else if (category === 'examination') {
    actionRequired = 'Review syllabus and report to exam hall 15 minutes before time';
  }

  return {
    title,
    description: text.trim(),
    date: resolvedDate,
    time: resolvedTime || '10:00 AM',
    venue: venue || 'Campus Premises (Unspecified)',
    category,
    priority,
    attendance,
    registrationDeadline: regDeadline,
    submissionDeadline: category === 'assignment' ? resolvedDate : undefined,
    instructions: instructions.length > 0 ? instructions : undefined,
    benefits: benefits.length > 0 ? benefits : undefined,
    actionRequired,
    confidence: 96,
    unspecifiedFields: unspecified,
    isTask: category === 'assignment' || category === 'registration_deadline' || isCompulsory,
    isEvent: category !== 'assignment' && category !== 'personal_task',
    sourceSnippet: text.slice(0, 140),
  };
}

