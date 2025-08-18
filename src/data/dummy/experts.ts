// 더미 전문가 데이터 - 새로운 ExpertProfile 타입과 연동
import { ExpertProfile, ConsultationType, WeekDay, WeeklyAvailability, Availability } from '@/types';

// 기존 호환성을 위한 ExpertItem 인터페이스 (deprecated)
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

// ExpertItem을 ExpertProfile로 변환하는 헬퍼 함수
export const convertExpertItemToProfile = (item: ExpertItem): ExpertProfile => {
  // consultationTypes를 ConsultationType[]로 변환
  const consultationTypes: ConsultationType[] = item.consultationTypes
    .filter((type): type is ConsultationType => 
      type === 'video' || type === 'chat' || type === 'voice'
    );

  // weeklyAvailability를 WeeklyAvailability로 변환
  const weeklyAvailability: WeeklyAvailability = {};
  const weekDays: WeekDay[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  
  weekDays.forEach(day => {
    weeklyAvailability[day] = item.weeklyAvailability[day] || [];
  });

  // availability 객체 생성
  const availability: Availability = {};
  weekDays.forEach(day => {
    const hasHours = item.weeklyAvailability[day] && item.weeklyAvailability[day].length > 0;
    availability[day] = {
      available: hasHours,
      hours: hasHours ? item.weeklyAvailability[day].join(',') : '09:00-18:00'
    };
  });

  return {
    id: item.id,
    name: item.name,
    specialty: item.specialty,
    experience: item.experience,
    description: item.description,
    education: item.education,
    certifications: item.certifications,
    specialties: item.tags,
    specialtyAreas: item.specialtyAreas,
    consultationTypes,
    languages: item.languages,
    hourlyRate: item.pricePerMinute * 60,
    pricePerMinute: item.pricePerMinute,
    totalSessions: item.totalSessions,
    avgRating: item.avgRating,
    rating: item.rating,
    reviewCount: item.reviewCount,
    completionRate: item.completionRate,
    repeatClients: item.repeatClients,
    responseTime: item.responseTime,
    averageSessionDuration: item.averageSessionDuration,
    cancellationPolicy: item.cancellationPolicy,
    availability,
    weeklyAvailability,
    contactInfo: {
      phone: '',
      email: '',
      location: item.location,
      website: item.socialProof?.website || ''
    },
    location: item.location,
    timeZone: item.timeZone,
    profileImage: item.image,
    portfolioFiles: [],
    portfolioItems: item.portfolioItems,
    tags: item.tags,
    targetAudience: item.targetAudience,
    isOnline: item.isOnline,
    isProfileComplete: true,
    createdAt: item.joinedAt,
    updatedAt: item.lastActiveAt
  };
};

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
  },
  {
    id: 4,
    name: "김진우",
    specialty: "진로상담",
    experience: 6,
    rating: 4.8,
    reviewCount: 156,
    totalSessions: 156,
    avgRating: 4.8,
    description: "HR 전문가 출신으로 취업, 이직, 진로 전환에 대한 실무적인 조언을 제공합니다.",
    price: "₩60,000",
    pricePerMinute: 1000,
    image: null,
    isOnline: true,
    tags: ["취업", "이직", "진로전환", "면접"],
    consultationTypes: ["video", "chat"],
    languages: ["한국어"],
    availability: "평일 10-18시",
    responseTime: "1시간 이내",
    completionRate: 95,
    certifications: ["직업상담사 2급", "진로진학상담사"],
    education: ["한양대학교 경영학과 학사"],
    location: "서울특별시 마포구",
    timeZone: "Asia/Seoul",
    profileViews: 890,
    lastActiveAt: new Date("2024-01-20T15:30:00"),
    joinedAt: new Date("2022-06-01T09:00:00"),
    specialtyAreas: ["취업 전략", "이력서 컨설팅", "면접 코칭"],
    consultationStyle: "실무 중심의 구체적 조언",
    targetAudience: ["대학생", "취준생", "직장인"],
    successStories: 89,
    repeatClients: 45,
    averageSessionDuration: 45,
    nextAvailableSlot: "2024-01-23T11:00:00",
    weeklyAvailability: {
      monday: ["10:00", "11:00", "14:00", "15:00", "16:00"],
      tuesday: ["10:00", "14:00", "15:00", "16:00", "17:00"],
      wednesday: ["10:00", "11:00", "14:00", "15:00"],
      thursday: ["10:00", "11:00", "14:00", "15:00", "16:00"],
      friday: ["10:00", "11:00", "14:00", "15:00"],
    },
    portfolioItems: [
      {
        title: "취업 성공 패키지",
        description: "이력서 작성부터 면접까지 원스톱 서비스",
        type: "package"
      }
    ],
    socialProof: {
      linkedIn: "https://linkedin.com/in/jinwoo-kim",
      publications: ["취업 성공의 비밀", "면접 완전 정복"]
    },
    pricingTiers: [
      { duration: 30, price: 30000, description: "진로 상담" },
      { duration: 60, price: 55000, description: "취업 전략 수립" },
      { duration: 90, price: 80000, description: "종합 컨설팅" }
    ],
    cancellationPolicy: "24시간 전 취소 가능",
    reschedulePolicy: "12시간 전 일정 변경 가능"
  },
  {
    id: 5,
    name: "정수민",
    specialty: "교육상담",
    experience: 9,
    rating: 4.9,
    reviewCount: 203,
    totalSessions: 203,
    avgRating: 4.9,
    description: "교육학 박사로 학습법, 입시 전략, 유학 준비에 대한 전문적인 상담을 제공합니다.",
    price: "₩75,000",
    pricePerMinute: 1250,
    image: null,
    isOnline: true,
    tags: ["학습법", "입시전략", "유학준비", "교육컨설팅"],
    consultationTypes: ["video", "chat"],
    languages: ["한국어", "영어"],
    availability: "평일 9-17시",
    responseTime: "30분 이내",
    completionRate: 97,
    certifications: ["교육학 박사", "진로진학상담교사"],
    education: ["이화여자대학교 교육학과 박사"],
    location: "서울특별시 서대문구",
    timeZone: "Asia/Seoul",
    profileViews: 1120,
    lastActiveAt: new Date("2024-01-20T13:45:00"),
    joinedAt: new Date("2022-02-15T09:00:00"),
    specialtyAreas: ["학습 전략", "대입 컨설팅", "해외 유학"],
    consultationStyle: "체계적이고 개인 맞춤형 접근",
    targetAudience: ["중학생", "고등학생", "학부모"],
    successStories: 145,
    repeatClients: 78,
    averageSessionDuration: 60,
    nextAvailableSlot: "2024-01-24T10:00:00",
    weeklyAvailability: {
      monday: ["09:00", "10:00", "11:00", "14:00", "15:00"],
      tuesday: ["09:00", "10:00", "14:00", "15:00", "16:00"],
      wednesday: ["09:00", "10:00", "11:00", "14:00"],
      thursday: ["09:00", "10:00", "14:00", "15:00", "16:00"],
      friday: ["09:00", "10:00", "11:00"],
    },
    portfolioItems: [
      {
        title: "맞춤형 학습 계획",
        description: "개인별 학습 스타일에 맞는 계획 수립",
        type: "planning"
      }
    ],
    socialProof: {
      publications: ["효과적인 학습법", "대입 전략 가이드"]
    },
    pricingTiers: [
      { duration: 30, price: 37500, description: "학습 상담" },
      { duration: 60, price: 70000, description: "입시 전략" },
      { duration: 90, price: 105000, description: "종합 컨설팅" }
    ],
    cancellationPolicy: "24시간 전 취소 가능",
    reschedulePolicy: "12시간 전 일정 변경 가능"
  },
  {
    id: 6,
    name: "박건호",
    specialty: "사업상담",
    experience: 15,
    rating: 4.7,
    reviewCount: 134,
    totalSessions: 134,
    avgRating: 4.7,
    description: "창업 전문가이자 경영 컨설턴트로 사업 계획부터 운영까지 전반적인 조언을 제공합니다.",
    price: "₩120,000",
    pricePerMinute: 2000,
    image: null,
    isOnline: true,
    tags: ["창업", "사업계획", "마케팅", "경영전략"],
    consultationTypes: ["video", "chat"],
    languages: ["한국어", "영어"],
    availability: "평일 14-20시",
    responseTime: "2시간 이내",
    completionRate: 92,
    certifications: ["경영지도사", "창업보육매니저"],
    education: ["연세대학교 경영학과 MBA"],
    location: "서울특별시 강남구",
    timeZone: "Asia/Seoul",
    profileViews: 675,
    lastActiveAt: new Date("2024-01-20T18:20:00"),
    joinedAt: new Date("2022-08-10T09:00:00"),
    specialtyAreas: ["스타트업", "디지털 마케팅", "비즈니스 모델"],
    consultationStyle: "실무 경험 기반의 전략적 조언",
    targetAudience: ["예비창업자", "소상공인", "스타트업"],
    successStories: 67,
    repeatClients: 34,
    averageSessionDuration: 75,
    nextAvailableSlot: "2024-01-25T15:00:00",
    weeklyAvailability: {
      monday: ["14:00", "15:00", "16:00", "18:00", "19:00"],
      tuesday: ["14:00", "15:00", "17:00", "18:00", "19:00"],
      wednesday: ["14:00", "16:00", "17:00", "18:00"],
      thursday: ["14:00", "15:00", "16:00", "18:00", "19:00"],
      friday: ["14:00", "15:00", "16:00", "17:00"],
    },
    portfolioItems: [
      {
        title: "사업계획서 컨설팅",
        description: "투자 유치를 위한 전문적인 사업계획서 작성",
        type: "consulting"
      }
    ],
    socialProof: {
      website: "https://bizstartup.co.kr",
      publications: ["성공하는 창업의 조건", "디지털 시대의 마케팅"]
    },
    pricingTiers: [
      { duration: 60, price: 110000, description: "창업 상담" },
      { duration: 90, price: 160000, description: "사업 전략" },
      { duration: 120, price: 220000, description: "종합 컨설팅" }
    ],
    cancellationPolicy: "48시간 전 취소 가능",
    reschedulePolicy: "24시간 전 일정 변경 가능"
  },
  {
    id: 7,
    name: "김민정",
    specialty: "심리상담",
    experience: 5,
    rating: 4.8,
    reviewCount: 167,
    totalSessions: 167,
    avgRating: 4.8,
    description: "가족치료 전문가로 부부상담, 가족관계 개선에 특화된 심리상담을 제공합니다.",
    price: "₩75,000",
    pricePerMinute: 1250,
    image: null,
    isOnline: true,
    tags: ["부부상담", "가족치료", "관계개선", "소통"],
    consultationTypes: ["video", "chat"],
    languages: ["한국어"],
    availability: "평일 10-19시",
    responseTime: "1시간 이내",
    completionRate: 96,
    certifications: ["가족상담사 1급", "부부상담사"],
    education: ["서강대학교 심리학과 석사"],
    location: "서울특별시 송파구",
    timeZone: "Asia/Seoul",
    profileViews: 890,
    lastActiveAt: new Date("2024-01-20T17:30:00"),
    joinedAt: new Date("2022-04-10T09:00:00"),
    specialtyAreas: ["가족치료", "부부상담", "청소년 상담"],
    consultationStyle: "따뜻하고 공감적인 접근",
    targetAudience: ["부부", "가족", "청소년"],
    successStories: 89,
    repeatClients: 67,
    averageSessionDuration: 50,
    nextAvailableSlot: "2024-01-23T14:00:00",
    weeklyAvailability: {
      monday: ["10:00", "11:00", "14:00", "15:00", "16:00"],
      tuesday: ["10:00", "14:00", "15:00", "16:00", "17:00"],
      wednesday: ["10:00", "11:00", "14:00", "15:00"],
      thursday: ["10:00", "11:00", "14:00", "15:00", "16:00"],
      friday: ["10:00", "11:00", "14:00", "15:00"],
    },
    portfolioItems: [
      {
        title: "부부 관계 회복 프로그램",
        description: "체계적인 부부상담 프로그램",
        type: "program"
      }
    ],
    socialProof: {
      publications: ["행복한 가족 만들기", "부부 소통의 기술"]
    },
    pricingTiers: [
      { duration: 30, price: 37500, description: "개별 상담" },
      { duration: 60, price: 70000, description: "부부 상담" },
      { duration: 90, price: 100000, description: "가족 상담" }
    ],
    cancellationPolicy: "24시간 전 취소 가능",
    reschedulePolicy: "12시간 전 일정 변경 가능"
  },
  {
    id: 8,
    name: "이상훈",
    specialty: "진로상담",
    experience: 8,
    rating: 4.7,
    reviewCount: 203,
    totalSessions: 203,
    avgRating: 4.7,
    description: "IT업계 출신 진로상담사로 개발자, 디자이너 등 IT 분야 진로 전문 상담을 제공합니다.",
    price: "₩65,000",
    pricePerMinute: 1083,
    image: null,
    isOnline: true,
    tags: ["IT진로", "개발자", "디자이너", "커리어전환"],
    consultationTypes: ["video", "chat"],
    languages: ["한국어", "영어"],
    availability: "평일 13-21시",
    responseTime: "2시간 이내",
    completionRate: 94,
    certifications: ["진로진학상담사 1급", "IT직업상담사"],
    education: ["카이스트 컴퓨터공학과 학사"],
    location: "서울특별시 판교구",
    timeZone: "Asia/Seoul",
    profileViews: 756,
    lastActiveAt: new Date("2024-01-20T19:45:00"),
    joinedAt: new Date("2022-07-15T09:00:00"),
    specialtyAreas: ["IT 커리어", "개발자 진로", "기술 트렌드"],
    consultationStyle: "실무 경험 기반의 현실적 조언",
    targetAudience: ["대학생", "개발자", "디자이너", "직장인"],
    successStories: 134,
    repeatClients: 89,
    averageSessionDuration: 55,
    nextAvailableSlot: "2024-01-24T14:00:00",
    weeklyAvailability: {
      monday: ["13:00", "14:00", "15:00", "18:00", "19:00"],
      tuesday: ["13:00", "14:00", "17:00", "18:00", "19:00"],
      wednesday: ["13:00", "15:00", "16:00", "18:00"],
      thursday: ["13:00", "14:00", "15:00", "18:00", "19:00"],
      friday: ["13:00", "14:00", "15:00", "16:00"],
    },
    portfolioItems: [
      {
        title: "IT 커리어 로드맵",
        description: "개발자/디자이너 커리어 패스 가이드",
        type: "guide"
      }
    ],
    socialProof: {
      website: "https://itcareer.co.kr",
      publications: ["개발자 커리어 가이드", "IT 트렌드와 진로"]
    },
    pricingTiers: [
      { duration: 30, price: 32500, description: "진로 상담" },
      { duration: 60, price: 60000, description: "커리어 플랜" },
      { duration: 90, price: 85000, description: "종합 컨설팅" }
    ],
    cancellationPolicy: "24시간 전 취소 가능",
    reschedulePolicy: "12시간 전 일정 변경 가능"
  },
  {
    id: 9,
    name: "정현아",
    specialty: "법률상담",
    experience: 7,
    rating: 4.6,
    reviewCount: 134,
    totalSessions: 134,
    avgRating: 4.6,
    description: "노동법 전문 변호사로 직장 내 분쟁, 근로계약, 부당해고 등 노동 관련 법률상담을 제공합니다.",
    price: "₩100,000",
    pricePerMinute: 1667,
    image: null,
    isOnline: true,
    tags: ["노동법", "근로계약", "부당해고", "직장분쟁"],
    consultationTypes: ["video", "chat"],
    languages: ["한국어"],
    availability: "평일 9-17시",
    responseTime: "3시간 이내",
    completionRate: 93,
    certifications: ["변호사", "노무사"],
    education: ["서울대학교 법학과 학사", "사법연수원 수료"],
    location: "서울특별시 영등포구",
    timeZone: "Asia/Seoul",
    profileViews: 612,
    lastActiveAt: new Date("2024-01-20T16:20:00"),
    joinedAt: new Date("2022-09-01T09:00:00"),
    specialtyAreas: ["노동법", "고용법", "직장 내 괴롭힘"],
    consultationStyle: "법적 근거에 기반한 명확한 조언",
    targetAudience: ["직장인", "근로자", "사업주"],
    successStories: 98,
    repeatClients: 45,
    averageSessionDuration: 45,
    nextAvailableSlot: "2024-01-25T10:00:00",
    weeklyAvailability: {
      monday: ["09:00", "10:00", "11:00", "14:00", "15:00"],
      tuesday: ["09:00", "10:00", "14:00", "15:00", "16:00"],
      wednesday: ["09:00", "10:00", "11:00", "14:00"],
      thursday: ["09:00", "10:00", "14:00", "15:00", "16:00"],
      friday: ["09:00", "10:00", "11:00"],
    },
    portfolioItems: [
      {
        title: "노동법 가이드",
        description: "근로자 권익 보호를 위한 법률 가이드",
        type: "guide"
      }
    ],
    socialProof: {
      publications: ["근로자를 위한 노동법", "직장 분쟁 해결 가이드"]
    },
    pricingTiers: [
      { duration: 30, price: 50000, description: "법률 상담" },
      { duration: 60, price: 95000, description: "사건 검토" },
      { duration: 90, price: 140000, description: "법적 대응 전략" }
    ],
    cancellationPolicy: "48시간 전 취소 가능",
    reschedulePolicy: "24시간 전 일정 변경 가능"
  },
  {
    id: 10,
    name: "최서연",
    specialty: "심리상담",
    experience: 6,
    rating: 4.7,
    reviewCount: 189,
    totalSessions: 189,
    avgRating: 4.7,
    description: "인지행동치료 전문가로 불안장애, 강박증, 공황장애 치료에 특화된 심리상담을 제공합니다.",
    price: "₩70,000",
    pricePerMinute: 1167,
    image: null,
    isOnline: true,
    tags: ["불안장애", "강박증", "공황장애", "인지행동치료"],
    consultationTypes: ["video", "chat"],
    languages: ["한국어", "영어"],
    availability: "평일 11-20시",
    responseTime: "2시간 이내",
    completionRate: 95,
    certifications: ["임상심리사 2급", "인지행동치료사"],
    education: ["연세대학교 심리학과 석사"],
    location: "서울특별시 관악구",
    timeZone: "Asia/Seoul",
    profileViews: 723,
    lastActiveAt: new Date("2024-01-20T18:15:00"),
    joinedAt: new Date("2022-05-20T09:00:00"),
    specialtyAreas: ["불안장애 치료", "인지행동치료", "스트레스 관리"],
    consultationStyle: "체계적이고 증거기반 접근",
    targetAudience: ["성인", "직장인", "대학생"],
    successStories: 124,
    repeatClients: 78,
    averageSessionDuration: 55,
    nextAvailableSlot: "2024-01-24T12:00:00",
    weeklyAvailability: {
      monday: ["11:00", "12:00", "14:00", "15:00", "18:00"],
      tuesday: ["11:00", "12:00", "15:00", "16:00", "18:00"],
      wednesday: ["11:00", "14:00", "15:00", "18:00", "19:00"],
      thursday: ["11:00", "12:00", "14:00", "15:00", "18:00"],
      friday: ["11:00", "12:00", "14:00", "15:00"],
    },
    portfolioItems: [
      {
        title: "불안장애 극복 프로그램",
        description: "체계적인 불안장애 치료 프로그램",
        type: "program"
      }
    ],
    socialProof: {
      publications: ["불안을 이기는 방법", "인지행동치료 가이드"]
    },
    pricingTiers: [
      { duration: 30, price: 35000, description: "초기 상담" },
      { duration: 60, price: 65000, description: "치료 상담" },
      { duration: 90, price: 95000, description: "집중 치료" }
    ],
    cancellationPolicy: "24시간 전 취소 가능",
    reschedulePolicy: "12시간 전 일정 변경 가능"
  },
  {
    id: 11,
    name: "한도현",
    specialty: "심리상담",
    experience: 10,
    rating: 4.9,
    reviewCount: 298,
    totalSessions: 298,
    avgRating: 4.9,
    description: "트라우마 전문 심리상담사로 PTSD, 트라우마 후유증 치료에 전문성을 갖추고 있습니다.",
    price: "₩85,000",
    pricePerMinute: 1417,
    image: null,
    isOnline: true,
    tags: ["트라우마", "PTSD", "외상후스트레스", "EMDR"],
    consultationTypes: ["video", "chat"],
    languages: ["한국어"],
    availability: "평일 9-17시",
    responseTime: "1시간 이내",
    completionRate: 98,
    certifications: ["임상심리사 1급", "EMDR 치료사"],
    education: ["고려대학교 심리학과 박사"],
    location: "서울특별시 용산구",
    timeZone: "Asia/Seoul",
    profileViews: 1156,
    lastActiveAt: new Date("2024-01-20T15:45:00"),
    joinedAt: new Date("2021-11-15T09:00:00"),
    specialtyAreas: ["트라우마 치료", "EMDR", "복합 PTSD"],
    consultationStyle: "안전하고 단계적인 치료 접근",
    targetAudience: ["성인", "트라우마 경험자", "PTSD 환자"],
    successStories: 189,
    repeatClients: 134,
    averageSessionDuration: 60,
    nextAvailableSlot: "2024-01-25T09:00:00",
    weeklyAvailability: {
      monday: ["09:00", "10:00", "11:00", "14:00", "15:00"],
      tuesday: ["09:00", "10:00", "14:00", "15:00", "16:00"],
      wednesday: ["09:00", "10:00", "11:00", "14:00", "15:00"],
      thursday: ["09:00", "10:00", "14:00", "15:00", "16:00"],
      friday: ["09:00", "10:00", "11:00"],
    },
    portfolioItems: [
      {
        title: "트라우마 회복 프로그램",
        description: "EMDR 기반 트라우마 치료 프로그램",
        type: "program"
      }
    ],
    socialProof: {
      publications: ["트라우마에서 회복하기", "PTSD 극복 가이드"]
    },
    pricingTiers: [
      { duration: 60, price: 80000, description: "트라우마 상담" },
      { duration: 90, price: 115000, description: "EMDR 치료" },
      { duration: 120, price: 150000, description: "집중 치료" }
    ],
    cancellationPolicy: "24시간 전 취소 가능",
    reschedulePolicy: "12시간 전 일정 변경 가능"
  }
];

// 더미 데이터를 스토어에 초기화하는 함수
export const initializeDummyExpertsToStore = () => {
  const { addOrUpdateProfile } = require('@/stores/expertProfileStore').useExpertProfileStore.getState();
  
  // 더미 데이터를 ExpertProfile 형식으로 변환하여 스토어에 추가
  dummyExperts.forEach(expertItem => {
    const profile = convertExpertItemToProfile(expertItem);
    addOrUpdateProfile(profile);
  });
  
  console.log(`${dummyExperts.length}개의 더미 전문가 프로필이 스토어에 초기화되었습니다.`);
};
