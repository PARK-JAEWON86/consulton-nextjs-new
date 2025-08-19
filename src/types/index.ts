export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "user" | "expert" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

// 리뷰 타입
export interface Review {
  id: number;
  userId: string;
  userName: string;
  userAvatar?: string;
  expertId: number;
  rating: number; // 1-5 별점
  comment: string;
  consultationType: ConsultationType;
  consultationTopic: string;
  createdAt: string;
  updatedAt?: string;
  isVerified: boolean; // 실제 상담을 받은 사용자인지 검증
  expertReply?: {
    message: string;
    createdAt: string;
  };
}

// 상담 방식 타입
export type ConsultationType = "video" | "chat" | "voice";

// 요일 타입
export type WeekDay = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

// 주간 예약 가능 시간 타입
export type WeeklyAvailability = Record<WeekDay, string[]>;

// 가용성 설정 타입
export type Availability = Record<WeekDay, { available: boolean; hours: string }>;

// 상담 요약 타입
export interface ConsultationSummary {
  id: string;
  title: string;
  date: Date;
  duration: number;
  expert: {
    name: string;
    title: string;
    avatar: string | null;
  };
  client: {
    name: string;
    company?: string;
  };
  status: 'completed' | 'processing' | 'failed' | 'pending';
  summary: string;
  tags: string[];
  creditsUsed: number;
  rating?: number;
}

// 포트폴리오 파일 타입
export interface PortfolioFile {
  id: number;
  name: string;
  type: string;
  size: number;
  data: string;
}

// 포트폴리오 아이템 타입
export interface PortfolioItem {
  title: string;
  description: string;
  type: string;
}

// 통합된 전문가 프로필 타입
export interface ExpertProfile {
  id: number;
  userId?: string;
  name: string;
  specialty: string;
  experience: number;
  description: string;
  education: string[];
  certifications: string[];
  specialties: string[];
  specialtyAreas: string[];
  consultationTypes: ConsultationType[];
  languages: string[];
  hourlyRate: number;
  pricePerMinute: number;
  totalSessions: number;
  avgRating: number;
  rating: number;
  reviewCount: number;
  completionRate: number;
  repeatClients: number;
  responseTime: string;
  averageSessionDuration: number;
  cancellationPolicy: string;
  availability: Availability;
  weeklyAvailability: WeeklyAvailability;
  holidayPolicy?: string; // 공휴일 휴무 정책 (예: "공휴일 휴무", "공휴일 정상 운영" 등)
  contactInfo: {
    phone: string;
    email: string;
    location: string;
    website: string;
  };
  location: string;
  timeZone: string;
  profileImage: string | null;
  portfolioFiles: PortfolioFile[];
  portfolioItems?: PortfolioItem[];
  tags: string[];
  targetAudience: string[];
  isOnline: boolean;
  isProfileComplete: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// 기존 Expert 인터페이스는 호환성을 위해 유지
export interface Expert {
  id: string;
  userId: string;
  name: string;
  title: string;
  description: string;
  expertise: string[];
  experience: number;
  rating: number;
  hourlyRate: number;
  avatar?: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Consultation {
  id: string;
  userId: string;
  expertId: string;
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";
  scheduledAt: Date;
  duration: number;
  type: "video" | "chat";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  consultationId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: "text" | "image" | "file";
}

// AI 채팅 메시지 타입 (AI 상담 어시스턴트용)
export interface AIChatMessage {
  id: string;
  type: "user" | "ai" | "system";
  content: string;
  timestamp: Date;
}

// 전문가와의 채팅 메시지 타입 (확장된 기능용)
export interface ExtendedChatMessage {
  id: string;
  type: "user" | "expert" | "ai" | "system";
  content: string;
  timestamp: Date;
  expertInfo?: {
    name: string;
    avatar?: string;
    title?: string;
  };
}

export interface Post {
  id: string;
  authorId: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  likes: number;
  comments: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  description: string;
  isPopular?: boolean;
}

// 통계 관련 타입
export interface PlatformStats {
  totalConsultations: number;
  averageMatchingTimeMinutes: number;
  totalExperts: number;
  totalUsers: number;
  lastUpdated: Date;
}

export interface StatsUpdate {
  type: 'consultation_completed' | 'expert_registered' | 'user_registered' | 'matching_time_recorded';
  data?: {
    matchingTimeMinutes?: number;
  };
}

export interface MatchingRecord {
  id: string;
  userId: string;
  expertId: string;
  matchingTimeMinutes: number;
  createdAt: Date;
}

// 정산 시스템 타입 re-export
export * from './settlement';
