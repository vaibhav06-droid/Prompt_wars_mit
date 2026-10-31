export type CategoryType =
  | 'college_event'
  | 'workshop'
  | 'seminar'
  | 'assignment'
  | 'examination'
  | 'registration_deadline'
  | 'cultural_festival'
  | 'sports_event'
  | 'announcement'
  | 'personal_task'
  | 'other';

export type PriorityLevel = 'high' | 'medium' | 'low';

export type ItemStatus = 'pending' | 'in_progress' | 'completed' | 'overdue' | 'archived';

export type DeadlineColor = 'GREEN' | 'YELLOW' | 'RED' | 'GREY';

export type SourceType = 'whatsapp' | 'gmail' | 'poster' | 'pdf' | 'manual';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

export interface CampusItem {
  id: string;
  title: string;
  description: string;
  date: string; // ISO date YYYY-MM-DD
  time?: string; // e.g. "10:00 AM" or "23:59"
  venue?: string;
  category: CategoryType;
  priority: PriorityLevel;
  status: ItemStatus;
  source: SourceType;
  sourceRawText?: string;
  sourceSnippet?: string;
  sourceSender?: string;
  sourceDate?: string;
  createdAt: string;
  updatedAt: string;
  
  // Specific event & deadline attributes
  isEvent: boolean;
  isTask: boolean;
  attendance?: 'compulsory' | 'optional' | 'recommended' | 'unspecified';
  registrationDeadline?: string;
  submissionDeadline?: string;
  instructions?: string[];
  benefits?: string[]; // e.g. "Certificate", "Refreshments", "2 Activity Points"
  actionRequired?: string;
  subtasks?: SubTask[];
  completedAt?: string;
  snoozedUntil?: string;
}

export interface ExtractedAIItem {
  title: string;
  description: string;
  date: string; // ISO date string
  time?: string;
  venue?: string;
  category: CategoryType;
  priority: PriorityLevel;
  attendance?: 'compulsory' | 'optional' | 'recommended' | 'unspecified';
  registrationDeadline?: string;
  submissionDeadline?: string;
  instructions?: string[];
  benefits?: string[];
  actionRequired?: string;
  confidence: number;
  unspecifiedFields: string[];
  isTask: boolean;
  isEvent: boolean;
  sourceSnippet: string;
}

export interface AIAnalysisResult {
  items: ExtractedAIItem[];
  rawText: string;
  sourceType: SourceType;
  detectedLanguage: 'en' | 'hinglish' | 'mixed';
  overallSummary: string;
  possibleDuplicates?: {
    extractedIndex: number;
    existingItemId: string;
    existingItemTitle: string;
    similarityReason: string;
  }[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'deadline' | 'event' | 'assignment' | 'exam' | 'announcement';
  priority: PriorityLevel;
  targetId?: string;
  timestamp: string;
  isRead: boolean;
  isAcknowledged: boolean;
  snoozedUntil?: string;
}

export interface WeeklyDigest {
  id: string;
  generatedAt: string;
  title: string;
  overviewSummary: string;
  eventsThisWeek: CampusItem[];
  assignmentsThisWeek: CampusItem[];
  examsThisWeek: CampusItem[];
  deadlinesThisWeek: CampusItem[];
  pendingTasksCount: number;
  urgentAlerts: string[];
  recommendedPriorities: string[];
}

export interface UserProfile {
  name: string;
  email: string;
  rollNumber: string;
  branch: string;
  semester: string;
  collegeName: string;
  avatarUrl?: string;
  settings: {
    yellowWarningDays: number; // default 3 days
    redWarningHours: number; // default 24 hours
    enableBrowserNotifications: boolean;
    enableEmailDigest: boolean;
    geminiApiKey?: string;
    theme: 'dark' | 'light' | 'system';
  };
}

export interface MockEmail {
  id: string;
  fromName: string;
  fromEmail: string;
  subject: string;
  snippet: string;
  body: string;
  date: string;
  read: boolean;
  category: CategoryType;
  extractedItemId?: string;
}

export interface MockWhatsAppMessage {
  id: string;
  sender: string;
  timestamp: string;
  content: string;
  extractedItemId?: string;
}

