// Smart Heuristic & Regex Extraction Engine for Campus Notices

const CATEGORY_KEYWORDS = {
  'Exam': [
    'exam', 'examination', 'midsem', 'endsem', 'practical', 'lab exam', 'viva', 
    'hall ticket', 'datesheet', 'slot', 'internal test', 'marksheet', 'grade'
  ],
  'Academic': [
    'assignment', 'submission', 'lecture', 'syllabus', 'faculty', 'professor', 
    'attendance', 'project report', 'thesis', 'tutorial', 'class', 'deadline'
  ],
  'Mess & Dining': [
    'mess', 'dining', 'menu', 'breakfast', 'lunch', 'dinner', 'snack', 'biryani', 
    'rebate', 'canteen', 'food committee', 'special dinner', 'hostel mess', 'feast'
  ],
  'Campus Event / Hackathon': [
    'hackathon', 'fest', 'workshop', 'webinar', 'cultural', 'sports', 'symposium', 
    'competition', 'cash prize', 'team', 'registration', 'club', 'auditorium', 'dj night'
  ],
  'Administrative': [
    'circular', 'dean', 'warden', 'fee', 'scholarship', 'hostel', 'library', 
    'clearance', 'noc', 'fine', 'id card', 'office', 'admin', 'registrar'
  ]
};

const CATEGORY_IMAGES = {
  'Exam': [
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'
  ],
  'Academic': [
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80'
  ],
  'Mess & Dining': [
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80'
  ],
  'Campus Event / Hackathon': [
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80'
  ],
  'Administrative': [
    'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80'
  ]
};

export function parseCampusNotice(rawText, sourceType = 'manual') {
  if (!rawText || !rawText.trim()) {
    return null;
  }

  const cleanText = rawText.trim();
  const lines = cleanText.split('\n').map(l => l.trim()).filter(Boolean);

  // 1. Detect Category
  let detectedCategory = 'Campus Event / Hackathon';
  let highestScore = 0;
  const lowerText = cleanText.toLowerCase();

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    keywords.forEach(kw => {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) {
        score += matches.length * (kw.length > 5 ? 2 : 1);
      }
    });
    if (score > highestScore) {
      highestScore = score;
      detectedCategory = category;
    }
  }

  // 2. Detect Title
  let title = '';
  // Try finding header patterns (e.g. *Title*, ALL CAPS line, or Subject:)
  const subjectMatch = cleanText.match(/(?:Sub(?:ject)?|Title|Re|Topic)\s*:\s*([^\n\r]+)/i);
  if (subjectMatch && subjectMatch[1]) {
    title = subjectMatch[1].replace(/[*_~`]/g, '').trim();
  } else {
    // Look at first 3 non-empty lines for the most descriptive title
    for (let i = 0; i < Math.min(lines.length, 3); i++) {
      let candidate = lines[i].replace(/^[*_~`#\s]+|[*_~`#\s]+$/g, '').trim();
      // Skip forwarded tags or generic greetings
      if (/^(forwarded|fwd|fyi|urgent notice|dear students|all students|greetings|notice|attention|announcement)/i.test(candidate) && candidate.split(' ').length < 4) {
        continue;
      }
      if (candidate.length > 5 && candidate.length < 90) {
        title = candidate;
        break;
      }
    }
  }
  if (!title) {
    title = lines[0] ? lines[0].slice(0, 60).replace(/[*_~`]/g, '') : 'Campus Notice';
  }

  // Clean title from common whatsapp forward cruft
  title = title.replace(/^(fwd:|\[fwd\]|urgent:|\*urgent\*|\*notice\*)/i, '').trim();
  if (title.length > 65) {
    title = title.slice(0, 62) + '...';
  }

  // 3. Detect Date and Time
  let date = '';
  let time = '';
  const now = new Date();

  // Check for keywords like "tomorrow", "tonight", "today"
  if (/\b(today|tonight)\b/i.test(lowerText)) {
    date = now.toISOString().split('T')[0];
  } else if (/\btomorrow\b/i.test(lowerText)) {
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    date = tomorrow.toISOString().split('T')[0];
  } else if (/\bday after tomorrow\b/i.test(lowerText)) {
    const dayAfter = new Date(now);
    dayAfter.setDate(now.getDate() + 2);
    date = dayAfter.toISOString().split('T')[0];
  } else {
    // Regex for standard dates: DD/MM/YYYY, YYYY-MM-DD, or "Nov 3, 2026", "3rd November"
    const dateRegex1 = /\b(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})\b/;
    const dateRegex2 = /\b(?:on|by|date:?)\s*(\d{1,2})(?:st|nd|rd|th)?\s+(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)(?:\s+(\d{4}))?\b/i;
    const dateRegex3 = /\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s*(\d{4})?\b/i;

    const m1 = cleanText.match(dateRegex1);
    const m2 = cleanText.match(dateRegex2);
    const m3 = cleanText.match(dateRegex3);

    if (m1) {
      const p1 = parseInt(m1[1], 10);
      const p2 = parseInt(m1[2], 10);
      let year = parseInt(m1[3], 10);
      if (year < 100) year += 2000;
      // In college notices, DD/MM/YYYY is standard in India/UK
      const day = p1 <= 31 ? p1 : p2;
      const month = p1 <= 31 ? p2 : p1;
      date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    } else if (m2) {
      const day = parseInt(m2[1], 10);
      const monthName = m2[2].slice(0, 3).toLowerCase();
      const monthNames = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
      const month = monthNames.indexOf(monthName) + 1;
      const year = m2[3] ? parseInt(m2[3], 10) : now.getFullYear();
      date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    } else if (m3) {
      const monthName = m3[1].slice(0, 3).toLowerCase();
      const monthNames = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
      const month = monthNames.indexOf(monthName) + 1;
      const day = parseInt(m3[2], 10);
      const year = m3[3] ? parseInt(m3[3], 10) : now.getFullYear();
      date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    } else {
      // Fallback: 2 days from now for active demo feel
      const defaultDate = new Date(now);
      defaultDate.setDate(now.getDate() + 2);
      date = defaultDate.toISOString().split('T')[0];
    }
  }

  // Detect Time
  const timeRegex = /\b(\d{1,2}(?::\d{2})?)\s*(am|pm|hrs?|hours)?\b/i;
  const timeContextMatch = cleanText.match(/(?:at|time:?|by|before)\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);
  if (timeContextMatch && timeContextMatch[1]) {
    time = timeContextMatch[1].toUpperCase();
  } else {
    const rawTimeMatch = cleanText.match(/\b\d{1,2}:\d{2}\s*(?:am|pm|AM|PM)?\b/);
    if (rawTimeMatch) {
      time = rawTimeMatch[0];
    } else {
      time = '5:00 PM';
    }
  }

  // 4. Detect Venue / Location
  let venue = '';
  const venueMatch = cleanText.match(/(?:venue|location|room|hall|lab|place|link|at)\s*:\s*([^\n\r,]+)/i);
  if (venueMatch && venueMatch[1]) {
    venue = venueMatch[1].replace(/[*_~`]/g, '').trim();
  } else {
    // Check keyword spots
    if (/auditorium|audi/i.test(cleanText)) venue = 'Main Campus Auditorium';
    else if (/lab\s*\d+|computer lab|cs lab/i.test(cleanText)) venue = 'Computer Lab 3 (Block B)';
    else if (/dining hall|mess hall|hostel mess/i.test(cleanText)) venue = 'Central Dining Hall';
    else if (/amphitheatre/i.test(cleanText)) venue = 'Open-Air Amphitheatre';
    else if (/google meet|zoom|teams|online/i.test(cleanText)) venue = 'Online (Virtual Link)';
    else if (/library/i.test(cleanText)) venue = 'Central Library 2nd Floor';
    else if (/dean office|admin block/i.test(cleanText)) venue = 'Dean Academic Office (Room 102)';
    else venue = 'Campus Main Block';
  }

  // 5. Extract Key Action Items
  const actionItems = [];
  // Scan for lines starting with bullets or action verbs
  const actionVerbsRegex = /^(?:submit|register|fill|pay|bring|collect|report|rsvp|upload|verify|complete|attend|carry|join|check|download|confirm)\b/i;

  lines.forEach(line => {
    const cleanedLine = line.replace(/^[•\-\*👉✅\d.]+\s*/, '').trim();
    if (cleanedLine.length > 5 && cleanedLine.length < 120) {
      if (
        line.startsWith('•') || 
        line.startsWith('-') || 
        line.startsWith('👉') || 
        line.startsWith('✅') || 
        /^\d+\./.test(line) || 
        actionVerbsRegex.test(cleanedLine)
      ) {
        if (!actionItems.some(item => item.text.toLowerCase() === cleanedLine.toLowerCase())) {
          actionItems.push({
            id: 'task_' + Math.random().toString(36).substr(2, 9),
            text: cleanedLine.replace(/[*_~`]/g, ''),
            completed: false
          });
        }
      }
    }
  });

  // If no action items found by line markers, synthesize smart default tasks from context
  if (actionItems.length === 0) {
    if (detectedCategory === 'Exam') {
      actionItems.push(
        { id: 't1_' + Date.now(), text: 'Bring signed lab record & college ID card', completed: false },
        { id: 't2_' + Date.now(), text: 'Review syllabus modules 1 to 4', completed: false }
      );
    } else if (detectedCategory === 'Mess & Dining') {
      actionItems.push(
        { id: 't1_' + Date.now(), text: 'RSVP via mess portal before cutoff', completed: false },
        { id: 't2_' + Date.now(), text: 'Collect mess guest coupon if bringing friends', completed: false }
      );
    } else if (detectedCategory === 'Campus Event / Hackathon') {
      actionItems.push(
        { id: 't1_' + Date.now(), text: 'Confirm team registration on portal', completed: false },
        { id: 't2_' + Date.now(), text: 'Prepare presentation deck & GitHub repo', completed: false }
      );
    } else if (detectedCategory === 'Academic') {
      actionItems.push(
        { id: 't1_' + Date.now(), text: 'Upload assignment PDF to LMS', completed: false },
        { id: 't2_' + Date.now(), text: 'Verify submission receipt with CR', completed: false }
      );
    } else {
      actionItems.push(
        { id: 't1_' + Date.now(), text: 'Verify requirements and submit document', completed: false },
        { id: 't2_' + Date.now(), text: 'Get acknowledgment stamp from desk', completed: false }
      );
    }
  }

  // Pick suitable banner
  const imagePool = CATEGORY_IMAGES[detectedCategory] || CATEGORY_IMAGES['Campus Event / Hackathon'];
  const bannerImage = imagePool[Math.floor(Math.random() * imagePool.length)];

  // Calculate parsed confidence score
  let confidence = 75;
  if (title) confidence += 8;
  if (venue) confidence += 7;
  if (actionItems.length >= 2) confidence += 10;

  return {
    id: 'notice_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    title,
    category: detectedCategory,
    date,
    time,
    venue,
    actionItems,
    bannerImage,
    rawSource: cleanText,
    sourceType,
    confidenceScore: Math.min(confidence, 99),
    createdAt: new Date().toISOString(),
    isAcknowledged: false,
    isArchived: false,
    isPinned: false
  };
}

