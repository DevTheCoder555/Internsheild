// ============================================
// SCAN TYPES
// ============================================

export interface ScanInput {
  type: "text" | "image" | "offer_letter" | "screenshot";
  text: string;
  platform?: string;
  imageUrl?: string;
}

export interface RedFlag {
  category:
    | "payment_scam"
    | "fake_recruiter"
    | "psychological_manipulation"
    | "unrealistic_claims"
    | "missing_details";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  evidence: string;
}

export interface ExtractedInfo {
  company_name?: string;
  recruiter_name?: string;
  recruiter_email?: string;
  salary_mentioned?: string;
  payment_requested?: string;
  platform?: string;
}

export interface ScanResult {
  scam_score: number;
  risk_level: "safe" | "low" | "medium" | "high" | "critical";
  red_flags: RedFlag[];
  ai_explanation: string;
  recommendations: string[];
  extracted_info?: ExtractedInfo;
  raw_response?: Record<string, unknown>;
}

export interface ScanReport {
  id: string;
  user_id: string | null;
  scan_type: "text" | "image" | "offer_letter" | "screenshot";
  input_text: string | null;
  input_image_url: string | null;
  scam_score: number;
  risk_level: "safe" | "low" | "medium" | "high" | "critical";
  red_flags: RedFlag[];
  ai_explanation: string;
  recommendations: string[];
  extracted_text: string | null;
  raw_ai_response: Record<string, unknown> | null;
  company_name: string | null;
  recruiter_name: string | null;
  recruiter_email: string | null;
  is_public: boolean;
  created_at: string;
}

// ============================================
// COMMUNITY TYPES
// ============================================

export interface CommunityReport {
  id: string;
  user_id: string | null;
  title: string;
  description: string;
  category:
    | "fake_company"
    | "fake_recruiter"
    | "fake_internship"
    | "payment_scam"
    | "other";
  company_name: string | null;
  recruiter_name: string | null;
  recruiter_contact: string | null;
  evidence_urls: string[];
  status: "pending" | "verified" | "rejected" | "under_review";
  upvotes: number;
  downvotes: number;
  view_count: number;
  is_verified: boolean;
  verified_by: string | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
  user?: {
    full_name: string;
    avatar_url: string | null;
  };
}

export interface ReportedCompany {
  id: string;
  name: string;
  website: string | null;
  description: string | null;
  scam_score: number;
  report_count: number;
  is_verified_scam: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface ReportedRecruiter {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company_id: string | null;
  platform: string | null;
  description: string | null;
  report_count: number;
  is_verified_scammer: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface ReportedAd {
  id: string;
  user_id: string | null;
  company_id: string | null;
  recruiter_id: string | null;
  platform: "whatsapp" | "telegram" | "linkedin" | "email" | "instagram" | "twitter" | "other";
  ad_content: string | null;
  screenshot_url: string | null;
  scam_indicators: string[];
  risk_level: "safe" | "low" | "medium" | "high" | "critical" | null;
  is_verified: boolean;
  created_at: string;
}

// ============================================
// USER TYPES
// ============================================

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: "user" | "admin" | "moderator";
  is_verified: boolean;
  scan_count: number;
  report_count: number;
  created_at: string;
  updated_at: string;
}

// ============================================
// API TYPES
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================
// FORM TYPES
// ============================================

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  fullName: string;
}

export interface CommunityReportForm {
  title: string;
  description: string;
  category: CommunityReport["category"];
  companyName?: string;
  recruiterName?: string;
  recruiterContact?: string;
}

// ============================================
// DASHBOARD TYPES
// ============================================

export interface DashboardStats {
  totalScans: number;
  totalReports: number;
  avgScamScore: number;
  recentScans: ScanReport[];
  topReports: CommunityReport[];
}

export interface ScanChartData {
  date: string;
  count: number;
  avgScore: number;
}
