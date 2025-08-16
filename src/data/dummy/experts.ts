// 더미 전문가 데이터
// TODO: 실제 API 연동 시 이 파일을 삭제하세요

export interface ExpertItem {
  id: number;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  reviewCount: number;
  totalSessions: number;
  avgRating: number;
  description: string;
  price: string;
  pricePerMinute: number;
  image: string | null;
  isOnline: boolean;
  tags: string[];
  consultationTypes: string[];
  languages: string[];
  availability: string;
  responseTime: string;
  completionRate: number;
  certifications: string[];
  education: string[];
  location: string;
  timeZone: string;
  profileViews: number;
  lastActiveAt: Date;
  joinedAt: Date;
  specialtyAreas: string[];
  consultationStyle: string;
  targetAudience: string[];
  successStories: number;
  repeatClients: number;
  averageSessionDuration: number;
  nextAvailableSlot: string;
  weeklyAvailability: Record<string, string[]>;
  portfolioItems: Array<{
    title: string;
    description: string;
    type: string;
  }>;
  socialProof: {
    linkedIn?: string;
    website?: string;
    publications: string[];
  };
  pricingTiers: Array<{
    duration: number;
    price: number;
    description: string;
  }>;
  cancellationPolicy: string;
  reschedulePolicy: string;
}

export const dummyExperts: ExpertItem[] = [
  {
    id: 1,
    name: "박지영",
    specialty: "심리상담",
    experience: 8,
    rating: 4.9,
    reviewCount: 245,
    totalSessions: 245,
    avgRating: 4.9,
    description: "임상심리학 박사로 8년간 다양한 심리상담 경험을 보유하고 있습니다.",
    price: "₩80,000",
    pricePerMinute: 1333,
    image: null,
    isOnline: true,
    tags: ["우울증", "불안장애", "대인관계", "자존감"],
    consultationTypes: ["video", "chat", "voice"],
    languages: ["한국어", "영어"],
    availability: "평일 9-18시",
    responseTime: "30분 이내",
    completionRate: 98,
    certifications: ["임상심리사 1급", "상담심리사 1급"],
    education: ["서울대학교 심리학과 박사"],
    location: "서울특별시 강남구",
    timeZone: "Asia/Seoul",
    profileViews: 1250,
    lastActiveAt: new Date("2024-01-20T10:30:00"),
    joinedAt: new Date("2022-03-15T09:00:00"),
    specialtyAreas: ["인지행동치료", "정신분석", "게슈탈트 치료"],
    consultationStyle: "공감적이고 체계적인 접근",
    targetAudience: ["성인", "청소년", "직장인"],
    successStories: 89,
    repeatClients: 67,
    averageSessionDuration: 50,
    nextAvailableSlot: "2024-01-22T14:00:00",
    weeklyAvailability: {
      monday: ["09:00", "10:00", "14:00", "15:00"],
      tuesday: ["09:00", "10:00", "11:00", "16:00"],
      wednesday: ["14:00", "15:00", "16:00"],
      thursday: ["09:00", "10:00", "14:00", "15:00"],
      friday: ["09:00", "11:00", "14:00"],
    },
    portfolioItems: [
      {
        title: "우울증 극복 프로그램",
        description: "8주 단위 인지행동치료 프로그램",
        type: "program"
      },
      {
        title: "직장 스트레스 관리",
        description: "직장인 대상 스트레스 관리 워크숍",
        type: "workshop"
      }
    ],
    socialProof: {
      linkedIn: "https://linkedin.com/in/jiyoung-park",
      website: "https://mindcare.co.kr",
      publications: ["현대인의 마음 건강", "스트레스 없는 직장생활"]
    },
    pricingTiers: [
      { duration: 30, price: 40000, description: "단회 상담" },
      { duration: 50, price: 65000, description: "정규 상담" },
      { duration: 80, price: 100000, description: "심층 상담" }
    ],
    cancellationPolicy: "24시간 전 취소 가능",
    reschedulePolicy: "12시간 전 일정 변경 가능"
  },
  {
    id: 2,
    name: "이민수",
    specialty: "법률상담",
    experience: 12,
    rating: 4.8,
    reviewCount: 189,
    totalSessions: 189,
    avgRating: 4.8,
    description: "변호사 자격을 보유한 법률 전문가로 다양한 분야의 법률 상담을 제공합니다.",
    price: "₩90,000",
    pricePerMinute: 1500,
    image: null,
    isOnline: true,
    tags: ["민사소송", "계약서", "부동산", "가족법"],
    consultationTypes: ["video", "chat"],
    languages: ["한국어"],
    availability: "평일 10-19시",
    responseTime: "1시간 이내",
    completionRate: 96,
    certifications: ["변호사", "법무사"],
    education: ["고려대학교 법학과 학사", "사법연수원 수료"],
    location: "서울특별시 서초구",
    timeZone: "Asia/Seoul",
    profileViews: 980,
    lastActiveAt: new Date("2024-01-20T16:45:00"),
    joinedAt: new Date("2022-01-10T09:00:00"),
    specialtyAreas: ["민사법", "상법", "부동산법"],
    consultationStyle: "명확하고 실용적인 조언",
    targetAudience: ["개인", "소상공인", "중소기업"],
    successStories: 156,
    repeatClients: 89,
    averageSessionDuration: 60,
    nextAvailableSlot: "2024-01-23T10:00:00",
    weeklyAvailability: {
      monday: ["10:00", "11:00", "14:00", "15:00", "16:00"],
      tuesday: ["10:00", "11:00", "15:00", "16:00"],
      wednesday: ["10:00", "14:00", "15:00", "16:00"],
      thursday: ["10:00", "11:00", "14:00", "15:00"],
      friday: ["10:00", "11:00", "14:00"],
    },
    portfolioItems: [
      {
        title: "계약서 검토 서비스",
        description: "각종 계약서 검토 및 수정 조언",
        type: "service"
      },
      {
        title: "부동산 거래 가이드",
        description: "부동산 매매/임대 법적 체크포인트",
        type: "guide"
      }
    ],
    socialProof: {
      linkedIn: "https://linkedin.com/in/minsu-lee",
      publications: ["실무 계약서 작성법", "부동산 거래의 법적 이해"]
    },
    pricingTiers: [
      { duration: 30, price: 45000, description: "간단 상담" },
      { duration: 60, price: 85000, description: "상세 상담" },
      { duration: 90, price: 120000, description: "종합 상담" }
    ],
    cancellationPolicy: "48시간 전 취소 가능",
    reschedulePolicy: "24시간 전 일정 변경 가능"
  },
  {
    id: 3,
    name: "이소연",
    specialty: "재무상담",
    experience: 10,
    rating: 4.7,
    reviewCount: 89,
    totalSessions: 89,
    avgRating: 4.7,
    description: "금융권 15년 경력과 재무설계사 자격을 갖춘 전문가로 개인과 기업의 재무상담을 제공합니다.",
    price: "₩70,000",
    pricePerMinute: 1167,
    image: null,
    isOnline: true,
    tags: ["투자", "자산관리", "세무"],
    consultationTypes: ["video", "chat"],
    languages: ["한국어", "영어"],
    availability: "평일 9-17시",
    responseTime: "2시간 이내",
    completionRate: 94,
    certifications: ["재무설계사", "투자상담사", "세무사"],
    education: ["연세대학교 경영학과 학사", "CFA 자격증"],
    location: "서울특별시 중구",
    timeZone: "Asia/Seoul",
    profileViews: 756,
    lastActiveAt: new Date("2024-01-20T14:20:00"),
    joinedAt: new Date("2022-05-20T09:00:00"),
    specialtyAreas: ["자산배분", "세금 최적화", "은퇴 계획"],
    consultationStyle: "데이터 기반의 체계적 접근",
    targetAudience: ["직장인", "자영업자", "은퇴 준비자"],
    successStories: 67,
    repeatClients: 45,
    averageSessionDuration: 55,
    nextAvailableSlot: "2024-01-24T09:00:00",
    weeklyAvailability: {
      monday: ["09:00", "10:00", "11:00", "14:00", "15:00"],
      tuesday: ["09:00", "10:00", "14:00", "15:00"],
      wednesday: ["09:00", "10:00", "11:00", "14:00"],
      thursday: ["09:00", "10:00", "14:00", "15:00", "16:00"],
      friday: ["09:00", "10:00", "11:00"],
    },
    portfolioItems: [
      {
        title: "개인 자산 포트폴리오 설계",
        description: "위험도별 맞춤형 투자 포트폴리오",
        type: "service"
      },
      {
        title: "은퇴 자금 계획",
        description: "생애주기별 은퇴 자금 준비 전략",
        type: "planning"
      }
    ],
    socialProof: {
      linkedIn: "https://linkedin.com/in/soyeon-lee",
      website: "https://wealthplan.co.kr",
      publications: ["똑똑한 투자 가이드", "은퇴 후 재정 관리"]
    },
    pricingTiers: [
      { duration: 30, price: 35000, description: "기본 상담" },
      { duration: 60, price: 65000, description: "포트폴리오 리뷰" },
      { duration: 90, price: 95000, description: "종합 재무 설계" }
    ],
    cancellationPolicy: "24시간 전 취소 가능",
    reschedulePolicy: "12시간 전 일정 변경 가능"
  }
];
