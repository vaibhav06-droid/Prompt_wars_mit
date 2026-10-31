import { CampusItem, MockEmail, MockWhatsAppMessage, UserProfile } from '@/types';
import { format, addDays, subDays } from 'date-fns';

const today = new Date();
const todayStr = format(today, 'yyyy-MM-dd');
const tomorrowStr = format(addDays(today, 1), 'yyyy-MM-dd');
const in2DaysStr = format(addDays(today, 2), 'yyyy-MM-dd');
const in3DaysStr = format(addDays(today, 3), 'yyyy-MM-dd');
const in5DaysStr = format(addDays(today, 5), 'yyyy-MM-dd');
const in7DaysStr = format(addDays(today, 7), 'yyyy-MM-dd');
const yesterdayStr = format(subDays(today, 1), 'yyyy-MM-dd');
const twoDaysAgoStr = format(subDays(today, 2), 'yyyy-MM-dd');

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Aarav Sharma',
  email: 'aarav.sharma@campus.edu',
  rollNumber: '2023CSB1042',
  branch: 'Computer Science & Engineering',
  semester: '5th Semester (Year 3)',
  collegeName: 'National Institute of Technology',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  settings: {
    yellowWarningDays: 3,
    redWarningHours: 24,
    enableBrowserNotifications: true,
    enableEmailDigest: true,
    theme: 'dark',
  },
};

export const INITIAL_CAMPUS_ITEMS: CampusItem[] = [
  {
    id: 'item-1',
    title: 'AI & Generative Agents Hands-on Workshop',
    description: 'Intensive 4-hour workshop on building autonomous agents, prompt engineering, and LLM fine-tuning. Organised by Google Developer Student Club.',
    date: tomorrowStr,
    time: '10:00 AM',
    venue: 'College Main Auditorium (Block B)',
    category: 'workshop',
    priority: 'high',
    status: 'pending',
    source: 'whatsapp',
    sourceSender: 'Prof. Mukherjee (HOD CS)',
    sourceRawText: 'Guys kal 10 baje auditorium mein AI workshop hai. Sabko aana compulsory hai. Registration ki last date 5 November hai. Bring your laptop. Certificate bhi milega.',
    sourceSnippet: 'WhatsApp: CS Department Official 2026',
    isEvent: true,
    isTask: true,
    attendance: 'compulsory',
    registrationDeadline: todayStr,
    instructions: ['Bring fully charged laptop with Python 3.10+', 'Install VS Code and Node.js prior to session', 'Keep College ID card ready at entrance'],
    benefits: ['Official Certificate of Completion', 'Access to Google Cloud credits voucher', 'Refreshments provided'],
    actionRequired: 'Register on portal before 6:00 PM today & setup dev environment',
    subtasks: [
      { id: 'sub-1-1', title: 'Complete Google Form registration', completed: true },
      { id: 'sub-1-2', title: 'Install Python packages and API keys', completed: false },
      { id: 'sub-1-3', title: 'Charge laptop and power bank', completed: false },
    ],
    createdAt: format(subDays(today, 2), "yyyy-MM-dd'T'HH:mm:ss"),
    updatedAt: format(subDays(today, 1), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: 'item-2',
    title: 'CS301: Distributed Systems Lab 3 Submission',
    description: 'Implement Raft consensus algorithm leader election in Go/Python. Submit GitHub repository link and PDF report on LMS.',
    date: todayStr,
    time: '11:59 PM',
    venue: 'LMS Portal (Online Submission)',
    category: 'assignment',
    priority: 'high',
    status: 'pending',
    source: 'gmail',
    sourceSender: 'Prof. Ramesh K. (Lab Instructor)',
    sourceRawText: 'Reminder: Lab Assignment 3 deadline is tonight at 23:59. No late submissions will be accepted.',
    sourceSnippet: 'Gmail: lms-notifications@campus.edu',
    isEvent: false,
    isTask: true,
    attendance: 'unspecified',
    submissionDeadline: todayStr,
    instructions: ['Include README with execution steps', 'Run unit tests before submitting', 'Plagiarism check will be enforced via MOSS'],
    benefits: ['Carries 15% of internal evaluation marks'],
    actionRequired: 'Push commits to Git and upload report PDF on LMS',
    subtasks: [
      { id: 'sub-2-1', title: 'Finish Heartbeat & Election logic', completed: true },
      { id: 'sub-2-2', title: 'Pass all 5 test cases locally', completed: true },
      { id: 'sub-2-3', title: 'Write 3-page analysis report and PDF export', completed: false },
    ],
    createdAt: format(subDays(today, 5), "yyyy-MM-dd'T'HH:mm:ss"),
    updatedAt: todayStr,
  },
  {
    id: 'item-3',
    title: 'Google & Microsoft Pre-Placement Campus Talk',
    description: 'Campus recruitment team presentation for Summer 2027 SDE internships and Full-Time Graduate roles. Overview of interview roadmap and coding rounds.',
    date: in2DaysStr,
    time: '02:30 PM',
    venue: 'Seminar Hall 1, Academic Complex',
    category: 'seminar',
    priority: 'high',
    status: 'pending',
    source: 'gmail',
    sourceSender: 'Training & Placement Cell (T&P)',
    sourceRawText: 'All 3rd and 4th year CSE/ECE students are requested to attend the Pre-Placement Talk by Google & Microsoft engineering leads.',
    sourceSnippet: 'Gmail: placements@campus.edu',
    isEvent: true,
    isTask: false,
    attendance: 'recommended',
    registrationDeadline: tomorrowStr,
    instructions: ['Formal dress code mandatory', 'Keep updated 1-page resume copy handy'],
    benefits: ['Fast-track interview shortlisting for attendees', 'Direct Q&A with Senior Staff Engineers'],
    actionRequired: 'RSVP on the T&P portal before tomorrow 5 PM',
    createdAt: format(subDays(today, 3), "yyyy-MM-dd'T'HH:mm:ss"),
    updatedAt: format(subDays(today, 1), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: 'item-4',
    title: 'CS302: Compiler Design Mid-Semester Examination',
    description: 'Covers Lexical Analysis, Top-Down Parsing (LL1), Bottom-Up Parsing (LR0, SLR1, LALR1), and Syntax Directed Translation.',
    date: in5DaysStr,
    time: '09:30 AM',
    venue: 'Exam Hall A & B (New Building)',
    category: 'examination',
    priority: 'high',
    status: 'pending',
    source: 'pdf',
    sourceSender: 'Controller of Examinations',
    sourceRawText: 'Office of Dean Academics: Mid-Semester Examination Schedule for Odd Semester 2026-27. CS302 scheduled on Nov 5th morning session.',
    sourceSnippet: 'PDF Notice: Circular_MidSem_2026_Final.pdf',
    isEvent: true,
    isTask: true,
    attendance: 'compulsory',
    instructions: ['Non-programmable calculators allowed', 'Reporting time 9:00 AM sharp', 'Original hall ticket required'],
    benefits: ['Counts for 30 marks in final grade'],
    actionRequired: 'Review lecture notes and solve last 3 years question papers',
    subtasks: [
      { id: 'sub-4-1', title: 'Revise LL(1) parsing tables & First/Follow sets', completed: false },
      { id: 'sub-4-2', title: 'Practice Shift-Reduce conflict resolution in LR', completed: false },
      { id: 'sub-4-3', title: 'Review Syntax Directed Definitions (SDD)', completed: false },
    ],
    createdAt: format(subDays(today, 7), "yyyy-MM-dd'T'HH:mm:ss"),
    updatedAt: format(subDays(today, 2), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: 'item-5',
    title: 'Smart India Hackathon 2026: Team Idea Submission',
    description: 'Internal college qualification round. Submit 5-slide PPT proposing tech solution for Ministry problem statements.',
    date: in3DaysStr,
    time: '05:00 PM',
    venue: 'Innovation & Incubation Centre Portal',
    category: 'registration_deadline',
    priority: 'medium',
    status: 'pending',
    source: 'poster',
    sourceSender: 'Campus Innovation Council',
    sourceRawText: 'SIH 2026 Internal Hackathon registrations closing soon! Submit problem statement choice, abstract, and architecture diagram.',
    sourceSnippet: 'Poster Upload: SIH_2026_College_Round.png',
    isEvent: true,
    isTask: true,
    attendance: 'optional',
    registrationDeadline: in3DaysStr,
    instructions: ['Teams must have 6 members with at least 1 female student', 'Include system block diagram and tech stack in PPT'],
    benefits: ['Cash prize ₹50,000 for top 3 college teams', 'Direct nomination to National SIH Finals'],
    actionRequired: 'Finalize PPT with team and upload PDF before deadline',
    subtasks: [
      { id: 'sub-5-1', title: 'Draft problem statement abstract', completed: true },
      { id: 'sub-5-2', title: 'Draw architecture diagram in Figma', completed: true },
      { id: 'sub-5-3', title: 'Collect team member signatures and submit', completed: false },
    ],
    createdAt: format(subDays(today, 4), "yyyy-MM-dd'T'HH:mm:ss"),
    updatedAt: format(subDays(today, 1), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: 'item-6',
    title: 'Vibrance 2026: Annual Cultural Fest Stage Crew Auditions',
    description: 'Calling all vocalists, dancers, choreographers, and stage management volunteers for the flagship inter-college fest.',
    date: in7DaysStr,
    time: '04:00 PM',
    venue: 'Open Air Amphitheatre',
    category: 'cultural_festival',
    priority: 'low',
    status: 'pending',
    source: 'whatsapp',
    sourceSender: 'Student Council President',
    sourceRawText: 'Vibrance 2026 auditions this weekend! All batches welcome. Prepare a 2-min performance or apply for logistics team.',
    sourceSnippet: 'WhatsApp: Cultural Club Vibrance Official',
    isEvent: true,
    isTask: false,
    attendance: 'optional',
    instructions: ['Carry your backing track on USB drive or phone', 'Registration opens 30 min before auditions'],
    benefits: ['Official volunteer certificate', 'Free fest passes and merchandise'],
    createdAt: format(subDays(today, 3), "yyyy-MM-dd'T'HH:mm:ss"),
    updatedAt: format(subDays(today, 3), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: 'item-7',
    title: 'Central Library: Overdue Book Return & Renewal',
    description: 'Return "Introduction to Algorithms (CLRS 3rd Ed)" and "Operating System Concepts" to avoid daily fine accumulation.',
    date: todayStr,
    time: '04:30 PM',
    venue: 'Ground Floor Circulation Desk, Central Library',
    category: 'personal_task',
    priority: 'medium',
    status: 'pending',
    source: 'manual',
    sourceSender: 'Self',
    sourceRawText: 'Need to return CLRS book before 4:30 PM today or renew online at library.campus.edu',
    sourceSnippet: 'Self Note',
    isEvent: false,
    isTask: true,
    attendance: 'unspecified',
    submissionDeadline: todayStr,
    actionRequired: 'Visit library desk or execute 1-click renewal on library portal',
    createdAt: todayStr,
    updatedAt: todayStr,
  },
  {
    id: 'item-8',
    title: 'EE204: Signals & Systems Weekly Quiz 4',
    description: 'Online 20-minute multiple choice quiz covering Fast Fourier Transform (FFT) and Z-Transform region of convergence.',
    date: yesterdayStr,
    time: '08:00 PM',
    venue: 'Moodle LMS',
    category: 'assignment',
    priority: 'medium',
    status: 'completed',
    completedAt: yesterdayStr,
    source: 'gmail',
    sourceSender: 'Prof. Ananya Sen',
    sourceSnippet: 'Gmail: moodle-quiz@campus.edu',
    isEvent: false,
    isTask: true,
    attendance: 'compulsory',
    submissionDeadline: yesterdayStr,
    benefits: ['Scored 18/20'],
    createdAt: format(subDays(today, 6), "yyyy-MM-dd'T'HH:mm:ss"),
    updatedAt: yesterdayStr,
  },
  {
    id: 'item-9',
    title: 'Inter-Department Football Tournament: Round 1 vs Mechanical',
    description: 'First knock-out match of the annual sports meet. Come support CSE department!',
    date: in2DaysStr,
    time: '04:45 PM',
    venue: 'University Sports Complex Ground 1',
    category: 'sports_event',
    priority: 'low',
    status: 'pending',
    source: 'whatsapp',
    sourceSender: 'CSE Sports Captain (Rahul)',
    sourceSnippet: 'WhatsApp: CSE Sports Team',
    isEvent: true,
    isTask: false,
    attendance: 'optional',
    benefits: ['Free jersey for playing XI', 'Campus cheer points'],
    createdAt: format(subDays(today, 2), "yyyy-MM-dd'T'HH:mm:ss"),
    updatedAt: format(subDays(today, 1), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: 'item-10',
    title: 'Semester Tuition Fee Installment 2 Deadline',
    description: 'Final date to pay remaining academic fees through SBI Collect portal without late payment fine of ₹1,000.',
    date: twoDaysAgoStr,
    time: '05:00 PM',
    venue: 'Accounts Section / SBI Collect',
    category: 'registration_deadline',
    priority: 'high',
    status: 'completed',
    completedAt: twoDaysAgoStr,
    source: 'pdf',
    sourceSender: 'Finance Officer',
    sourceSnippet: 'PDF: Circular_Fee_Installment_2.pdf',
    isEvent: false,
    isTask: true,
    actionRequired: 'Save transaction receipt PDF for registration clearance',
    createdAt: format(subDays(today, 10), "yyyy-MM-dd'T'HH:mm:ss"),
    updatedAt: twoDaysAgoStr,
  },
  {
    id: 'item-11',
    title: 'Dean Student Affairs: Campus Wi-Fi Maintenance Downtime',
    description: 'Campus IT infrastructure team will conduct scheduled core switch upgrades. Wi-Fi will be offline in Hostels 4 to 8 between 1 AM and 5 AM.',
    date: todayStr,
    time: '11:00 PM',
    venue: 'Hostel Zone & Library',
    category: 'announcement',
    priority: 'low',
    status: 'pending',
    source: 'gmail',
    sourceSender: 'Dean of Student Affairs Office',
    sourceSnippet: 'Gmail: notifications@campus.edu',
    isEvent: false,
    isTask: false,
    attendance: 'unspecified',
    createdAt: todayStr,
    updatedAt: todayStr,
  },
  {
    id: 'item-12',
    title: 'Hinglish Demo: RoboSoccer Club Tryouts & Tech Talk',
    description: 'Kal sham 5 baje Robotics lab mein trial match hai. Sabhi second and third year students invite hain. Autonomous bot coding demo included.',
    date: tomorrowStr,
    time: '05:00 PM',
    venue: 'Robotics & Automation Lab, Mechatronics Block',
    category: 'workshop',
    priority: 'medium',
    status: 'pending',
    source: 'whatsapp',
    sourceSender: 'Robotics Club Lead (Harsh)',
    sourceRawText: 'Kal sham 5 baje Robotics lab mein trial match hai. Sabhi second and third year students invite hain. Autonomous bot coding demo included.',
    sourceSnippet: 'WhatsApp: Robotics Society',
    isEvent: true,
    isTask: false,
    attendance: 'recommended',
    benefits: ['Hands-on ROS2 demo', 'Opportunity to join RoboCup 2027 team'],
    createdAt: todayStr,
    updatedAt: todayStr,
  },
];

export const MOCK_EMAILS: MockEmail[] = [
  {
    id: 'email-1',
    fromName: 'Prof. Ramesh K. (Lab Instructor)',
    fromEmail: 'ramesh.k@campus.edu',
    subject: 'Urgent: CS301 Distributed Systems Lab 3 Submission Due Tonight',
    snippet: 'Dear Students, Please note that Lab 3 on Raft Consensus Algorithm is strictly due tonight at 23:59 PM...',
    body: `Dear Students,

Please note that Lab Assignment 3 on Raft Consensus Algorithm is strictly due tonight, ${todayStr} at 23:59 PM.

Ensure that:
1. All unit tests for leader election pass.
2. Your PDF report includes performance benchmark graphs.
3. Submit the GitHub repository link and report on the LMS portal.

No extensions will be granted.

Best regards,
Prof. Ramesh K.
Dept of Computer Science & Engineering`,
    date: `${todayStr} 08:30 AM`,
    read: false,
    category: 'assignment',
    extractedItemId: 'item-2',
  },
  {
    id: 'email-2',
    fromName: 'Training & Placement Cell',
    fromEmail: 'placements@campus.edu',
    subject: 'Google & Microsoft Campus Visit: Pre-Placement Talk on November 2nd',
    snippet: 'All eligible 3rd & 4th year B.Tech students are invited to attend the interactive session...',
    body: `Dear Candidates,

We are pleased to announce that Senior Engineering Leaders from Google and Microsoft will be visiting our campus on ${in2DaysStr} at 02:30 PM in Seminar Hall 1.

Agenda:
- 2027 Summer Internship Hiring Process
- System Design & DSA Expectations
- Open Q&A Session

Registration deadline: ${tomorrowStr} by 5:00 PM.
Dress code: Formal attire required.

Warm regards,
Head, Training & Placement Cell`,
    date: `${yesterdayStr} 04:15 PM`,
    read: true,
    category: 'seminar',
    extractedItemId: 'item-3',
  },
  {
    id: 'email-3',
    fromName: 'Controller of Examinations',
    fromEmail: 'coe-office@campus.edu',
    subject: 'Final Schedule: Odd Semester Mid-Term Examinations 2026-27',
    snippet: 'The approved timetable for Mid-Semester Examinations is now officially released...',
    body: `Notice to all B.Tech Students:

The mid-term examination timetable has been finalized. CS302 Compiler Design is scheduled for ${in5DaysStr} at 09:30 AM in Examination Halls A & B.

Please collect your printed admit cards from the academic section by ${in3DaysStr}.

Controller of Examinations`,
    date: `${format(subDays(today, 3), 'yyyy-MM-dd')} 11:00 AM`,
    read: true,
    category: 'examination',
    extractedItemId: 'item-4',
  },
  {
    id: 'email-4',
    fromName: 'Dean of Student Affairs',
    fromEmail: 'dosa@campus.edu',
    subject: 'Notice: Hostels 4-8 Wi-Fi Network Maintenance Tonight',
    snippet: 'Scheduled core switch firmware upgrade will take place between 01:00 AM and 05:00 AM...',
    body: `Dear Resident Students,

Please be informed that network maintenance will take place tonight starting at 11:00 PM. Internet and intranet services in Hostels 4 to 8 and Central Library will experience temporary downtime.

We regret any inconvenience caused.

Dean of Student Affairs`,
    date: `${todayStr} 10:15 AM`,
    read: false,
    category: 'announcement',
    extractedItemId: 'item-11',
  },
  {
    id: 'email-5',
    fromName: 'Dr. Sunita Rao (ECE Dept)',
    fromEmail: 'sunita.rao@campus.edu',
    subject: 'Guest Lecture: Quantum Computing & Qiskit by IBM Quantum Team',
    snippet: 'An exclusive online lecture by IBM Quantum ambassadors this Friday at 4 PM...',
    body: `Dear Students,

ECE Department cordially invites you to a guest lecture on "Introduction to Quantum Circuits with Qiskit" on Friday, ${in5DaysStr} at 04:00 PM in ECE Seminar Hall.

E-certificates will be provided to all registered attendees.

Register here: https://forms.gle/quantum-ibm-campus

Regards,
Dr. Sunita Rao`,
    date: `${yesterdayStr} 02:40 PM`,
    read: false,
    category: 'seminar',
  },
];

export const MOCK_WHATSAPP_MESSAGES: MockWhatsAppMessage[] = [
  {
    id: 'wa-1',
    sender: 'Prof. Mukherjee (HOD CS)',
    timestamp: 'Yesterday 10:45 PM',
    content: 'Guys kal 10 baje auditorium mein AI workshop hai. Sabko aana compulsory hai. Registration ki last date 5 November hai. Bring your laptop. Certificate bhi milega.',
    extractedItemId: 'item-1',
  },
  {
    id: 'wa-2',
    sender: 'Rahul (Sports Captain)',
    timestamp: 'Today 09:12 AM',
    content: 'Inter-department cricket match against Mechanical has been confirmed for day after tomorrow 4:45 PM at Ground 1. Team lineup will be shared by evening!',
    extractedItemId: 'item-9',
  },
  {
    id: 'wa-3',
    sender: 'Pooja (Class Representative)',
    timestamp: 'Today 11:30 AM',
    content: 'CR notice: Mathematics tutorial sheet 4 questions 5, 8, 12 submit karni hai on Tuesday morning before 10 AM in Faculty room 204. Hand-written only!',
  },
  {
    id: 'wa-4',
    sender: 'TechFest Coordinator',
    timestamp: 'Yesterday 06:20 PM',
    content: 'Urgent reminder! Hackathon registration portal will close sharp at midnight on Sunday. Don’t forget to upload your project synopsis PDF!',
  },
];

