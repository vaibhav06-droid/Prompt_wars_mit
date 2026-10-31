// Realistic mock dataset pre-seeded for judges and first-time users
// Dynamic relative dates ensure Urgency badges (Urgent, Attention Needed, On Track, Expired) are always vivid!

export function getInitialMockNotices() {
  const now = new Date();

  // Helper to get relative ISO date string
  const getRelativeDate = (offsetHours) => {
    const d = new Date(now.getTime() + offsetHours * 60 * 60 * 1000);
    return d.toISOString();
  };

  return [
    {
      id: 'notice_demo_1',
      title: 'CS302 Distributed Systems Lab Exam & Record Submission',
      category: 'Exam',
      date: getRelativeDate(5).split('T')[0],
      time: '04:30 PM',
      venue: 'Turing Computer Lab 3 (Block B)',
      urgency: 'red',
      confidenceScore: 98,
      sourceType: 'whatsapp',
      isAcknowledged: false,
      isArchived: false,
      isPinned: true,
      bannerImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      rawSource: `*URGENT NOTICE FOR CS BATCH 2026 - CS302 LAB EXAM* 🚨🚨
Forwarded as received from Prof. Sharma:
All students must report to CS Lab 3 at 4:30 PM sharp for the Distributed Systems practical examination.
Tasks required before entry:
• Submit physically signed spiral lab record with all 10 experiment outputs
• Bring official college ID card & hall pass
• Be prepared for 5-minute individual viva on Raft Consensus Algorithm
NO ENTRY after 4:40 PM!`,
      actionItems: [
        { id: 'act_1_1', text: 'Get lab record signed by lab assistant', completed: false },
        { id: 'act_1_2', text: 'Pack College ID card and Hall Pass in bag', completed: true },
        { id: 'act_1_3', text: 'Quick review of Raft Consensus questions', completed: false }
      ],
      createdAt: new Date(now.getTime() - 2 * 3600 * 1000).toISOString()
    },
    {
      id: 'notice_demo_2',
      title: 'Mess Committee Special Sunday Feast RSVP & Rebate Cutoff',
      category: 'Mess & Dining',
      date: getRelativeDate(18).split('T')[0],
      time: '11:00 PM Tonight',
      venue: 'Dining Halls 1 & 2 (Central Mess)',
      urgency: 'red',
      confidenceScore: 95,
      sourceType: 'whatsapp',
      isAcknowledged: false,
      isArchived: false,
      isPinned: false,
      bannerImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      rawSource: `*HOSTEL COUNCIL CIRCULAR: SUNDAY SPECIAL FEAST & REBATE* 🍛🍗
Dear Hostellers,
The grand monthly feast (Dum Biryani / Paneer Butter Masala + Gulab Jamun) is scheduled for Sunday lunch.
Important instructions:
👉 Mark your attendance (Veg / Non-Veg) on the hostel portal before 11:00 PM tonight.
👉 Those going home this weekend must apply for rebate before the cutoff to claim meal refund.
👉 Guest coupons (₹180) can be collected from Warden Office desk till 8 PM.`,
      actionItems: [
        { id: 'act_2_1', text: 'RSVP meal preference (Non-Veg/Veg) on Hostel Portal', completed: false },
        { id: 'act_2_2', text: 'Apply for weekend meal rebate if leaving campus', completed: false }
      ],
      createdAt: new Date(now.getTime() - 4 * 3600 * 1000).toISOString()
    },
    {
      id: 'notice_demo_3',
      title: 'MIT HackPulse 2026: Team Formation & Phase 1 Pitch Deck',
      category: 'Campus Event / Hackathon',
      date: getRelativeDate(46).split('T')[0],
      time: '06:00 PM',
      venue: 'Dr. APJ Abdul Kalam Auditorium',
      urgency: 'yellow',
      confidenceScore: 96,
      sourceType: 'email',
      isAcknowledged: true,
      isArchived: false,
      isPinned: true,
      bannerImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
      rawSource: `From: hackathon-leads@mit.edu
Subject: [REMINDER] HackPulse 2026 - Phase 1 Submission Deadline & Mentorship Slot
Greetings Innovators!
Over 180 teams have registered. Phase 1 PPT submission closes in less than 48 hours.
Deliverables:
- 5-slide problem statement and architecture diagram deck
- GitHub repository link with initial README
- Confirm your team size (3-4 members) on Devfolio dashboard
Prizes worth ₹1,50,000 + Summer Internship interviews with sponsor tech firms!`,
      actionItems: [
        { id: 'act_3_1', text: 'Finalize 5-slide Pitch Deck PDF', completed: true },
        { id: 'act_3_2', text: 'Initialize public GitHub repo with MIT License', completed: true },
        { id: 'act_3_3', text: 'Confirm all 4 team members on Devfolio', completed: false }
      ],
      createdAt: new Date(now.getTime() - 12 * 3600 * 1000).toISOString()
    },
    {
      id: 'notice_demo_4',
      title: 'Fee Clearance & End-Sem Hall Ticket NOC Verification',
      category: 'Administrative',
      date: getRelativeDate(62).split('T')[0],
      time: '03:00 PM',
      venue: 'Dean Academic Administration Block (Room 104)',
      urgency: 'yellow',
      confidenceScore: 92,
      sourceType: 'circular',
      isAcknowledged: false,
      isArchived: false,
      isPinned: false,
      bannerImage: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=800&q=80',
      rawSource: `OFFICE OF THE DEAN (ACADEMIC AFFAIRS)
CIRCULAR REF: MIT/ACAD/2026/NOV-09
Subject: Clearance of Pending Semester Dues for Hall Ticket Generation.
All undergraduate & postgraduate students are hereby notified that the clearance portal will close on Tuesday at 3:00 PM.
• Clear any pending tuition, library dues, or laboratory breakages
• Download provisional clearance receipt
• Verify physical stamp on Hall Ticket from Faculty Advisor`,
      actionItems: [
        { id: 'act_4_1', text: 'Check Student ERP dues status', completed: true },
        { id: 'act_4_2', text: 'Get Faculty Advisor physical sign on clearance slip', completed: false }
      ],
      createdAt: new Date(now.getTime() - 24 * 3600 * 1000).toISOString()
    },
    {
      id: 'notice_demo_5',
      title: 'Acoustic Jam & Open Mic: Campus Cultural Night',
      category: 'Campus Event / Hackathon',
      date: getRelativeDate(96).split('T')[0],
      time: '07:30 PM',
      venue: 'Open-Air Campus Amphitheatre',
      urgency: 'green',
      confidenceScore: 94,
      sourceType: 'whatsapp',
      isAcknowledged: true,
      isArchived: false,
      isPinned: false,
      bannerImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
      rawSource: `🎸✨ *CAMPUS ACOUSTIC NIGHT & FOOD TRUCKS* ✨🎸
Music Club invites everyone for an evening of unplugged indie rock, chai, and food stalls under the stars!
Date: Thursday Evening | 7:30 PM onwards
Venue: Open-Air Amphitheatre
Free Entry for all students with valid ID!
• Musicians interested in performing solo or band slots: register your performance with Club Secy by Wednesday.
• Entry wristbands distributed at amphitheatre north gate.`,
      actionItems: [
        { id: 'act_5_1', text: 'Register guitar solo performance with club secretary', completed: false },
        { id: 'act_5_2', text: 'Collect visitor wristband for roommates', completed: false }
      ],
      createdAt: new Date(now.getTime() - 36 * 3600 * 1000).toISOString()
    },
    {
      id: 'notice_demo_6',
      title: 'Google Developer Group: GenAI & Agentic Systems Workshop',
      category: 'Academic',
      date: getRelativeDate(140).split('T')[0],
      time: '02:00 PM - 05:00 PM',
      venue: 'Aryabhatta Seminar Complex (Hall A)',
      urgency: 'green',
      confidenceScore: 97,
      sourceType: 'email',
      isAcknowledged: true,
      isArchived: false,
      isPinned: false,
      bannerImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
      rawSource: `From: gdg-oncampus@mit.edu
Subject: Hands-on Workshop: Building Autonomous AI Agents with Google Antigravity & Gemini API
We are thrilled to announce a 3-hour weekend code-along workshop.
Prerequisites:
• Laptop with Node.js v20+ and Python 3.10+ installed
• Active GitHub account
• Free Gemini API key generated via Google AI Studio
Free pizza & swag kits provided to the first 100 attendees!`,
      actionItems: [
        { id: 'act_6_1', text: 'Generate API key in Google AI Studio', completed: true },
        { id: 'act_6_2', text: 'Install Node.js & clone workshop repo', completed: false }
      ],
      createdAt: new Date(now.getTime() - 48 * 3600 * 1000).toISOString()
    },
    {
      id: 'notice_demo_7',
      title: 'Library Overdue Book Amnesty & Fine Exemption Window',
      category: 'Administrative',
      date: getRelativeDate(-30).split('T')[0], // 30 hours in past -> expired!
      time: '05:00 PM',
      venue: 'Central Library Circulation Counter',
      urgency: 'expired',
      confidenceScore: 90,
      sourceType: 'circular',
      isAcknowledged: true,
      isArchived: true,
      isPinned: false,
      bannerImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
      rawSource: `CENTRAL LIBRARY NOTICE
Window for returning overdue books with 100% fine waiver ends today at 5:00 PM.
Any books returned after this deadline will incur regular late penalties of ₹5/day per volume.
• Bring books to Counter 2
• Collect digitized return slip`,
      actionItems: [
        { id: 'act_7_1', text: 'Return Distributed Systems textbook', completed: true },
        { id: 'act_7_2', text: 'Collect return slip stamp', completed: true }
      ],
      createdAt: new Date(now.getTime() - 96 * 3600 * 1000).toISOString()
    }
  ];
}

// Realistic WhatsApp group message samples for judges to inspect and import
export const WHATSAPP_SIMULATED_GROUPS = [
  {
    id: 'grp_1',
    groupName: 'CS Batch 2026 Official (Announcements)',
    sender: 'CR Rahul (CS-B) 📱',
    avatar: '👨‍💻',
    unreadCount: 3,
    time: '11:42 AM',
    badge: 'Academics',
    message: `*CR NOTICE - COMPILER DESIGN PROJECT DEMO SLOTS* ⚠️⚠️
Guys, Prof. Raman just sent the final slot allocation for Compiler Design mini-project evaluations.
Date: Tomorrow (Nov 1st) | 02:00 PM sharp
Venue: Software Lab 1
Important:
👉 Teams 1 to 15 will be evaluated first.
👉 You must have your Lex/Yacc specification files running locally.
👉 Print a 2-page project synopsis and submit it to the TA before demo starts.
👉 Late submission will result in a 20% penalty. Please be on time!`,
    buttonLabel: 'Load Lab Exam / Demo Notice'
  },
  {
    id: 'grp_2',
    groupName: 'Hostel 4 Mess & Maintenance Committee',
    sender: 'Warden Dr. Kulkarni 🍲',
    avatar: '🥘',
    unreadCount: 1,
    time: '09:15 AM',
    badge: 'Mess & Dining',
    message: `*NOTICE: DIWALI SWEET BOX DISTRIBUTION & CHAI PE CHARCHA* 🪔✨
Dear Residents of Block 4,
The hostel management is organizing an evening high tea and festive sweet box distribution:
• Date: Day after tomorrow (Nov 2) at 05:30 PM
• Venue: Hostel Courtyard Garden
• Bring your hostel biometric ID card for scanning
• Special menu: Kaju Katli, Samosas, Masala Chai & Gulab Jamun
Please RSVP on the notice board sheet by 8 PM tonight so the caterer can prepare counts.`,
    buttonLabel: 'Load Mess Feast Notice'
  },
  {
    id: 'grp_3',
    groupName: 'E-Cell & Hackathon Community MIT',
    sender: 'Priya (Tech Lead) 🚀',
    avatar: '💡',
    unreadCount: 2,
    time: 'Yesterday',
    badge: 'Hackathons',
    message: `🚨 *NATIONAL AGENTIC AI HACKATHON 2026 - ₹2,00,000 PRIZE POOL* 🚨
Hey developers! Registration is officially OPEN for AI Ignite 2026.
• Offline Finale Venue: Innovation Centre Auditorium
• Date: In 4 days (Nov 4, 2026) | 10:00 AM kickoff
• Eligibility: 2 to 4 members per team
Action items:
1. Submit team abstract and problem track selection on portal
2. Join the official Discord server for mentor office hours
3. Bring your own extension cord and student ID cards
Free midnight red bull, pizza, and swag bags for all shortlisted participants!`,
    buttonLabel: 'Load Hackathon Alert'
  },
  {
    id: 'grp_4',
    groupName: 'MIT Sports Council & Gymkhana',
    sender: 'Sports Secy Vikram 🏅',
    avatar: '⚽',
    unreadCount: 1,
    time: '10:05 AM',
    badge: 'Events',
    message: `🏆 *INTER-HOSTEL CRICKET & BADMINTON TOURNAMENT FIXTURES* 🏆
Captains meeting today at 5:00 PM at Sports Complex!
• All hostel captains must submit final player roster list with blood groups
• Collect official match balls and referee schedule
• Opening match begins Friday morning at 08:00 AM on Main Ground`,
    buttonLabel: 'Load Sports Notice'
  }
];

// Simulated college mailbox items for judges
export const COLLEGE_MAIL_SIMULATED = [
  {
    id: 'mail_1',
    from: 'Dean of Academic Affairs <dean.acad@mit.edu>',
    subject: 'Circular: Mandatory Registration for Odd Semester Make-up Examinations',
    date: 'Oct 31, 2026 • 10:15 AM',
    tag: 'Urgent Circular',
    preview: 'Students with documented medical absences during the midsem exams must apply for the special compensatory evaluation...',
    body: `From: Dean of Academic Affairs <dean.acad@mit.edu>
Date: Today, 10:15 AM
Subject: CIRCULAR: Mandatory Registration for Odd Semester Make-up Examinations
To: All Enrolled Students

Dear Students,

Please find enclosed the statutory guidelines regarding make-up examinations for the Odd Semester 2026-2027.
The make-up examination schedule commences next Monday.

Key Requirements:
1. Submit medical certificate endorsed by the Chief Medical Officer at the Campus Health Center.
2. Pay the compensatory examination fee of ₹500 per paper via the online ERP portal.
3. Obtain written approval from the respective Department Head (HOD) by Nov 3, 2026, 4:00 PM.
4. Venue for submission: Academic Section Counter 3.

Hall tickets for the makeup exams will be issued only upon successful verification of the above action items.

Sd/-
Prof. R. Venkatraman
Dean (Academic Affairs)`
  },
  {
    id: 'mail_2',
    from: 'Career Development Centre (CDC) <placements@mit.edu>',
    subject: 'Campus Placement Drive: MicroTech R&D Shortlist & Online Assessment',
    date: 'Oct 31, 2026 • 08:30 AM',
    tag: 'Placements',
    preview: 'MicroTech R&D has released the shortlist of eligible CSE, ECE, and IT students for the 90-minute online coding round...',
    body: `From: Career Development Centre <placements@mit.edu>
Date: Today, 08:30 AM
Subject: MicroTech R&D Campus Recruitment: Online Coding Round Instructions
To: Shortlisted 2026 Batch Candidates

Dear Candidates,

MicroTech Systems will conduct their National Online Assessment for shortlisted applicants.

Date: Tomorrow (Nov 1, 2026)
Time: 07:00 PM - 08:30 PM (Mandatory login by 06:45 PM)
Venue: Online (Mettl Platform with Webcam & Mic proctoring)

Mandatory Steps:
• Test your webcam, mic, and bandwidth via the Mettl system diagnostic link
• Clear your workspace of headphones and second monitors
• Ensure uninterrupted power supply and internet backup
• Keep your government photo ID card ready for pre-test proctor validation

Failure to log in by 06:50 PM will result in automatic disqualification from the drive.

Best regards,
Placement Cell Coordinator`
  },
  {
    id: 'mail_3',
    from: 'MIT Green Campus Initiative <sustainability@mit.edu>',
    subject: 'Annual Campus Tree Plantation & Cleanliness Drive - Earn Extra Activity Credits',
    date: 'Oct 30, 2026',
    tag: 'Community',
    preview: 'Join the campus sustainability drive this Saturday. Earn 10 National Service Scheme (NSS) activity points...',
    body: `From: MIT Green Campus Initiative <sustainability@mit.edu>
Date: Oct 30, 2026
Subject: Annual Tree Plantation & Cleanliness Drive
To: All Students & Faculty

Dear Campus Community,

Join us this Saturday morning at 07:00 AM at the Lakeview Lawn for our annual tree plantation and plastic collection drive.

Tasks:
• Register your attendance at the Green Club tent
• Wear comfortable shoes and sports attire
• Bring a reusable water bottle
• Collect your Certificate of Participation & 10 NSS activity points from the student coordinator

Breakfast (Idli, Vada, and Tea) will be served to all volunteers at 09:30 AM.

Let's make our campus greener!
Green Campus Committee`
  }
];

// 1-Click sample notices for judges with zero typing
export const SAMPLE_NOTICES = [
  {
    title: 'Lab Exam & Record Submission (CS302)',
    badge: 'Exam (Urgent)',
    text: `*URGENT NOTICE FOR CS BATCH 2026 - CS302 LAB EXAM* 🚨🚨
Forwarded as received from Prof. Sharma:
All students must report to CS Lab 3 tomorrow at 4:30 PM sharp for the Distributed Systems practical examination.
Tasks required before entry:
• Submit physically signed spiral lab record with all 10 experiment outputs
• Bring official college ID card & hall pass
• Be prepared for 5-minute individual viva on Raft Consensus Algorithm
NO ENTRY after 4:40 PM!`
  },
  {
    title: 'Special Sunday Biryani Feast & Meal Rebate Cutoff',
    badge: 'Mess (Urgent)',
    text: `*HOSTEL COUNCIL CIRCULAR: SUNDAY SPECIAL FEAST & REBATE* 🍛🍗
Dear Hostellers,
The grand monthly feast (Dum Biryani / Paneer Butter Masala + Gulab Jamun) is scheduled for Sunday lunch at Central Dining Hall.
Important instructions:
👉 Mark your attendance (Veg / Non-Veg) on the hostel portal before 11:00 PM tonight.
👉 Those going home this weekend must apply for rebate before the cutoff to claim meal refund.
👉 Guest coupons (₹180) can be collected from Warden Office desk till 8 PM.`
  },
  {
    title: 'MIT HackPulse 2026 (₹1.5L Prize Pool)',
    badge: 'Hackathon',
    text: `🚨 *MIT HACKPULSE 2026 - PHASE 1 PITCH DECK DUE* 🚨
Over 180 teams registered! Phase 1 PPT submission closes in 2 days (Nov 2, 2026) at 06:00 PM.
Venue: Dr. APJ Abdul Kalam Auditorium
Key Deliverables:
• Submit 5-slide problem statement and architecture deck
• Share GitHub repository link with initial README
• Confirm all 4 team members on Devfolio dashboard
Grand Cash Prize of ₹1,50,000 + Summer Internship interviews!`
  },
  {
    title: 'Fee Payment & Examination Hall Ticket Clearance',
    badge: 'Admin',
    text: `OFFICE OF THE DEAN (ACADEMIC AFFAIRS)
CIRCULAR REF: MIT/ACAD/2026/NOV-09
Subject: Clearance of Pending Semester Dues for Hall Ticket Generation.
All students are hereby notified that the clearance portal will close on Nov 3, 2026 at 3:00 PM.
Venue: Dean Academic Administration Block (Room 104)
• Clear any pending tuition fees or library fines
• Download provisional clearance receipt from ERP
• Get Faculty Advisor physical signature on clearance slip`
  },
  {
    title: 'Hostel Acoustic Jam & Open Mic Night',
    badge: 'Campus Event',
    text: `🎸✨ *CAMPUS ACOUSTIC NIGHT & FOOD TRUCKS* ✨🎸
Music Club invites everyone for an evening of unplugged indie rock, chai, and food stalls under the stars!
Date: Nov 5, 2026 | 07:30 PM onwards
Venue: Open-Air Campus Amphitheatre
• Register guitar solo or band performance with club secretary
• Collect visitor wristband at amphitheatre north gate
Free Entry for all students with valid ID!`
  }
];

