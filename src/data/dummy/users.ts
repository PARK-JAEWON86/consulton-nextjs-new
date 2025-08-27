// 더미 사용자 데이터
// TODO: 실제 API 연동 시 이 파일을 삭제하세요

export interface UserProfile {
  name: string;
  nickname?: string;
  credits: number;
  email: string;
  phone: string;
  location: string;
  birthDate: string;
  interests: string[];
  bio: string;
  totalConsultations: number;
  favoriteExperts: number;
  completedGoals?: number;
  joinDate: string;
}

export interface ExpertProfileData {
  name: string;
  specialty: string;
  rating: number;
  totalConsultations: number;
  totalSessions: number;
  avgRating: number;
  creditsPerMinute: number;
  totalEarnings: number;
  monthlyEarnings: number;
  completionRate: number;
  responseRate: number;
  tags: string[];
  isProfileComplete: boolean;
  isProfilePublic: boolean;
  experience: number;
  description: string;
  education: string[];
  certifications: string[];
  specialties: string[];
  consultationTypes: string[];
  languages: string[];
  hourlyRate: string;
  contactInfo: {
    phone: string;
    email: string;
    location: string;
    website: string;
  };
  profileImage: string | null;
  portfolioFiles: any[];
}

// 사용자 프로필 더미 데이터
export const dummyUserProfile: UserProfile = {
  name: "김철수",
  nickname: "철수킹",
  credits: 8850, // credit-transactions API와 동일한 최신 잔액
  email: "kimcheolsu@example.com",
  phone: "010-1234-5678",
  location: "서울특별시 강남구",
  birthDate: "1990-05-15",
  interests: ["진로상담", "심리상담", "재무상담"],
  bio: "다양한 분야의 전문가들과 상담을 통해 성장하고 있습니다. 특히 진로와 심리 분야에 관심이 많습니다.",
  totalConsultations: 12,
  favoriteExperts: 5,
  completedGoals: 3,
  joinDate: "2024-01-15",
};

// 전문가 프로필 더미 데이터
export const dummyExpertProfile: ExpertProfileData = {
  name: "김민수",
  specialty: "진로상담",
  rating: 4.1,
  totalConsultations: 8,
  totalSessions: 8,
  avgRating: 4.1,
  creditsPerMinute: 1200,
  totalEarnings: 96000,
  monthlyEarnings: 48000,
  completionRate: 87.5,
  responseRate: 95,
  tags: ["취업준비", "이직", "진로고민"],
  isProfileComplete: true,
  isProfilePublic: false,
  experience: 2,
  description:
    "2년간의 HR 경험과 진로상담 자격증을 바탕으로 취업 준비생과 직장인들의 진로 고민을 함께 해결해나가고 있습니다.",
  education: ["경희대학교 경영학과 학사"],
  certifications: ["진로상담사 2급", "직업상담사 2급"],
  specialties: ["취업 준비", "이직 상담", "진로 탐색", "면접 준비"],
  consultationTypes: ["video", "chat"],
  languages: ["한국어"],
  hourlyRate: "1200",
  contactInfo: {
    phone: "010-9876-5432",
    email: "career.expert@example.com",
    location: "서울특별시 마포구",
    website: "",
  },
  profileImage: null,
  portfolioFiles: [],
};
