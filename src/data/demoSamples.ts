export interface DemoSample {
  id: string;
  label: string;
  category: string;
  description: string;
  type: 'text' | 'image' | 'pdf' | 'chat' | 'completion';
  content: string;
}

export const DEMO_SAMPLES: DemoSample[] = [
  {
    id: 'sample-1',
    label: 'Official Prompt (Hinglish AI Workshop)',
    category: 'WhatsApp Forward',
    description: 'Messy Hinglish forwarded message with compulsory attendance, venue, and certificate.',
    type: 'text',
    content: 'Guys kal 10 baje auditorium mein AI workshop hai. Sabko aana compulsory hai. Registration ki last date 5 November hai. Bring your laptop. Certificate bhi milega.',
  },
  {
    id: 'sample-2',
    label: 'Multi-Event Notice (Splits into 2 Entries)',
    category: 'Class Group Forward',
    description: 'Single announcement containing both an assignment deadline and an exam viva.',
    type: 'text',
    content: 'Attention 3rd Years! Kal raat 11:59 PM tak Physics Lab 3 report upload karni hai LMS portal par. Aur parso subah 9:30 AM compiler design mid-term examination hai Exam Hall A mein. Don’t forget original hall ticket and calculator!',
  },
  {
    id: 'sample-3',
    label: 'Poster Circular (Hackathon Announcement)',
    category: 'Club Notice',
    description: 'Semi-structured text extracted from an event flyer/poster with cash prizes & swag.',
    type: 'text',
    content: `BYTECODE CODING HACKATHON 2026
Venue: Central Computing Centre, Block C
Date: November 8, 2026 | Time: 09:00 AM - 09:00 PM
Prize Pool: ₹75,000 + Internship Interview Shortlisting!
Registration Deadline: November 4, 2026 (Free entry for NIT students).
Rules: Teams of 3-4 members. Bring laptops, extension cords.
Refreshments, Red Bull & Lunch will be provided for all participants.`,
  },
  {
    id: 'sample-4',
    label: 'AI-Assisted Completion Detection',
    category: 'Student Voice/Message',
    description: 'Natural language statement signaling task completion for automatic detection.',
    type: 'completion',
    content: 'I have finished and uploaded my CS301 Distributed Systems Lab 3 report on LMS.',
  },
  {
    id: 'sample-5',
    label: 'WhatsApp Export Format (.txt)',
    category: 'Exported Chat File',
    description: 'Real WhatsApp chat export transcript with timestamps and multiple sender notices.',
    type: 'chat',
    content: `[30/10/26, 8:45:10 PM] Prof. Mukherjee: Dear Class, The AI workshop is confirmed for tomorrow 10:00 AM at Main Auditorium. Attendance will be recorded.
[30/10/26, 9:15:22 PM] Aarav Sharma: Sir will certificates be given to all attendees?
[30/10/26, 9:18:04 PM] Prof. Mukherjee: Yes, certificates from Google Developers Group will be issued to participants who complete the hands-on lab.
[31/10/26, 7:30:15 AM] Class Rep Pooja: Reminder: Last date to register for the SIH internal round is Nov 3 at 5 PM!`,
  },
];

