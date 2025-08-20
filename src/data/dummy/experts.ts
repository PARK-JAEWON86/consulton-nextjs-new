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
  const weekDays: WeekDay[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const weeklyAvailability: WeeklyAvailability = {} as WeeklyAvailability;
  
  weekDays.forEach(day => {
    weeklyAvailability[day] = item.weeklyAvailability[day] || [];
  });

  // availability 객체 생성
  const availability: Availability = {} as Availability;
  weekDays.forEach(day => {
    const hasHours = item.weeklyAvailability[day] && item.weeklyAvailability[day].length > 0;
    availability[day] = {
      available: hasHours,
      hours: hasHours ? item.weeklyAvailability[day].join(',') : '09:00-18:00'
    };
  });

  // totalSessions 기반으로 레벨 계산 (간단한 공식 사용)
  const calculateLevel = (sessions: number): number => {
    if (sessions >= 700) return Math.min(999, 700 + Math.floor((sessions - 700) / 10));
    if (sessions >= 500) return 600 + Math.floor((sessions - 500) / 5);
    if (sessions >= 300) return 400 + Math.floor((sessions - 300) / 2);
    if (sessions >= 200) return 300 + Math.floor((sessions - 200) / 2);
    if (sessions >= 100) return 200 + Math.floor((sessions - 100) / 1);
    return Math.max(1, 100 + Math.floor(sessions / 2));
  };

  const level = calculateLevel(item.totalSessions);

  // 일부 전문가에게 공휴일 휴무 정책 추가 (ID 기반으로 랜덤하게)
  const holidayPolicies = [
    "공휴일 휴무",
    "공휴일 정상 운영", 
    "공휴일 오전만 운영",
    undefined // 정책 없음
  ];
  const holidayPolicy = item.id % 4 === 0 ? holidayPolicies[0] : 
                       item.id % 4 === 1 ? holidayPolicies[1] :
                       item.id % 4 === 2 ? holidayPolicies[2] : 
                       holidayPolicies[3];

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
    holidayPolicy, // 공휴일 정책 추가
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
    totalSessions: 245, // 레벨 300대 - 중급
    avgRating: 4.9,
    description: "임상심리학 박사로 8년간 다양한 심리상담 경험을 보유하고 있습니다.",
    price: "₩75,000",
    pricePerMinute: 1250, // 레벨 300대 - 중급 요금
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
    totalSessions: 189, // 레벨 200대 - 중급
    avgRating: 4.8,
    description: "변호사 자격을 보유한 법률 전문가로 다양한 분야의 법률 상담을 제공합니다.",
    price: "₩60,000",
    pricePerMinute: 1000, // 레벨 200대 - 중급 요금
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
    totalSessions: 89, // 레벨 100대 - 초급
    avgRating: 4.7,
    description: "금융권 15년 경력과 재무설계사 자격을 갖춘 전문가로 개인과 기업의 재무상담을 제공합니다.",
    price: "₩45,000",
    pricePerMinute: 750, // 레벨 100대 - 초급 요금
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
    totalSessions: 156, // 레벨 200대 - 중급
    avgRating: 4.8,
    description: "HR 전문가 출신으로 취업, 이직, 진로 전환에 대한 실무적인 조언을 제공합니다.",
    price: "₩50,000",
    pricePerMinute: 833, // 레벨 200대 - 중급 요금
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
    totalSessions: 203, // 레벨 200대 - 중급
    avgRating: 4.9,
    description: "교육학 박사로 학습법, 입시 전략, 유학 준비에 대한 전문적인 상담을 제공합니다.",
    price: "₩60,000",
    pricePerMinute: 1000, // 레벨 200대 - 중급 요금
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
    totalSessions: 134, // 레벨 100대 - 초급
    avgRating: 4.7,
    description: "창업 전문가이자 경영 컨설턴트로 사업 계획부터 운영까지 전반적인 조언을 제공합니다.",
    price: "₩45,000",
    pricePerMinute: 750, // 레벨 100대 - 초급 요금
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
    totalSessions: 167, // 레벨 200대 - 중급
    avgRating: 4.8,
    description: "가족치료 전문가로 부부상담, 가족관계 개선에 특화된 심리상담을 제공합니다.",
    price: "₩60,000",
    pricePerMinute: 1000, // 레벨 200대 - 중급 요금
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
    totalSessions: 203, // 레벨 200대 - 중급
    avgRating: 4.7,
    description: "IT업계 출신 진로상담사로 개발자, 디자이너 등 IT 분야 진로 전문 상담을 제공합니다.",
    price: "₩50,000",
    pricePerMinute: 833, // 레벨 200대 - 중급 요금
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
    totalSessions: 134, // 레벨 100대 - 초급
    avgRating: 4.6,
    description: "노동법 전문 변호사로 직장 내 분쟁, 근로계약, 부당해고 등 노동 관련 법률상담을 제공합니다.",
    price: "₩45,000",
    pricePerMinute: 750, // 레벨 100대 - 초급 요금
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
    totalSessions: 189, // 레벨 200대 - 중급
    avgRating: 4.7,
    description: "인지행동치료 전문가로 불안장애, 강박증, 공황장애 치료에 특화된 심리상담을 제공합니다.",
    price: "₩50,000",
    pricePerMinute: 833, // 레벨 200대 - 중급 요금
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
    totalSessions: 298, // 레벨 300대 - 중급
    avgRating: 4.9,
    description: "트라우마 전문 심리상담사로 PTSD, 트라우마 후유증 치료에 전문성을 갖추고 있습니다.",
    price: "₩75,000",
    pricePerMinute: 1250, // 레벨 300대 - 중급 요금
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
  },
  // 새로운 전문가들 - 다양한 레벨과 분야
  {
    id: 12,
    name: "김태수",
    specialty: "IT상담",
    experience: 15,
    rating: 4.9,
    reviewCount: 456,
    totalSessions: 456, // 높은 세션 수로 레벨 999 달성
    avgRating: 4.9,
    description: "구글 출신 시니어 엔지니어로 AI/ML, 클라우드, 시스템 아키텍처 전문 컨설팅을 제공합니다.",
    price: "₩300,000",
    pricePerMinute: 6000, // 레벨 999 - 최고 요금
    image: null,
    isOnline: true,
    tags: ["AI/ML", "클라우드", "시스템아키텍처", "빅테크"],
    consultationTypes: ["video", "chat"],
    languages: ["한국어", "영어"],
    availability: "평일 20-24시",
    responseTime: "30분 이내",
    completionRate: 99,
    certifications: ["AWS Solutions Architect", "Google Cloud Professional", "Kubernetes Certified"],
    education: ["스탠포드 대학교 컴퓨터과학 박사", "KAIST 전산학과 학사"],
    location: "캘리포니아 실리콘밸리",
    timeZone: "America/Los_Angeles",
    profileViews: 2340,
    lastActiveAt: new Date("2024-01-20T23:30:00"),
    joinedAt: new Date("2021-06-01T09:00:00"),
    specialtyAreas: ["머신러닝", "분산시스템", "클라우드 네이티브"],
    consultationStyle: "실리콘밸리 경험 기반 글로벌 관점",
    targetAudience: ["시니어 개발자", "스타트업 CTO", "테크 리드"],
    successStories: 234,
    repeatClients: 189,
    averageSessionDuration: 90,
    nextAvailableSlot: "2024-01-26T20:00:00",
    weeklyAvailability: {
      monday: ["20:00", "21:00", "22:00", "23:00"],
      tuesday: ["20:00", "21:00", "22:00", "23:00"],
      wednesday: ["20:00", "21:00", "22:00"],
      thursday: ["20:00", "21:00", "22:00", "23:00"],
      friday: ["20:00", "21:00"],
    },
    portfolioItems: [
      {
        title: "AI 시스템 설계 컨설팅",
        description: "대규모 AI 시스템 아키텍처 설계 및 최적화",
        type: "consulting"
      }
    ],
    socialProof: {
      website: "https://ai-architect.com",
      publications: ["Building Scalable AI Systems", "Cloud Native Architecture"]
    },
    pricingTiers: [
      { duration: 60, price: 300000, description: "기술 컨설팅" },
      { duration: 120, price: 550000, description: "아키텍처 리뷰" },
      { duration: 180, price: 800000, description: "시스템 설계" }
    ],
    cancellationPolicy: "72시간 전 취소 가능",
    reschedulePolicy: "48시간 전 일정 변경 가능"
  },
  {
    id: 13,
    name: "박영희",
    specialty: "유튜브상담",
    experience: 4,
    rating: 4.6,
    reviewCount: 89,
    totalSessions: 89, // 낮은 세션 수로 초급 레벨
    avgRating: 4.6,
    description: "구독자 100만 유튜버 출신으로 콘텐츠 기획, 촬영, 편집, 수익화까지 전 과정을 가르칩니다.",
    price: "₩45,000",
    pricePerMinute: 750, // 레벨 100대 - 초급 요금
    image: null,
    isOnline: true,
    tags: ["유튜브", "콘텐츠제작", "영상편집", "수익화"],
    consultationTypes: ["video", "chat"],
    languages: ["한국어"],
    availability: "평일 14-22시",
    responseTime: "2시간 이내",
    completionRate: 92,
    certifications: ["유튜브 크리에이터 인증", "Adobe Premiere Pro 자격증"],
    education: ["홍익대학교 영상디자인과 학사"],
    location: "서울특별시 홍대",
    timeZone: "Asia/Seoul",
    profileViews: 567,
    lastActiveAt: new Date("2024-01-20T20:15:00"),
    joinedAt: new Date("2023-03-10T09:00:00"),
    specialtyAreas: ["콘텐츠 기획", "영상 편집", "유튜브 알고리즘"],
    consultationStyle: "실전 경험 기반 친근한 멘토링",
    targetAudience: ["예비 유튜버", "초보 크리에이터", "개인 브랜더"],
    successStories: 67,
    repeatClients: 34,
    averageSessionDuration: 60,
    nextAvailableSlot: "2024-01-23T15:00:00",
    weeklyAvailability: {
      monday: ["14:00", "15:00", "19:00", "20:00", "21:00"],
      tuesday: ["14:00", "15:00", "16:00", "20:00", "21:00"],
      wednesday: ["14:00", "19:00", "20:00", "21:00"],
      thursday: ["14:00", "15:00", "19:00", "20:00"],
      friday: ["14:00", "15:00", "16:00"],
    },
    portfolioItems: [
      {
        title: "유튜브 채널 런칭 가이드",
        description: "0구독자부터 10만 구독자까지 성장 전략",
        type: "guide"
      }
    ],
    socialProof: {
      website: "https://youtube.com/c/youngheepark",
      publications: ["유튜브로 월 1000만원 버는 법"]
    },
    pricingTiers: [
      { duration: 30, price: 22500, description: "기본 상담" },
      { duration: 60, price: 42000, description: "채널 분석" },
      { duration: 90, price: 60000, description: "성장 전략 수립" }
    ],
    cancellationPolicy: "12시간 전 취소 가능",
    reschedulePolicy: "6시간 전 일정 변경 가능"
  },
  {
    id: 14,
    name: "이강민",
    specialty: "투자상담",
    experience: 20,
    rating: 4.8,
    reviewCount: 678,
    totalSessions: 678, // 높은 세션으로 고급 레벨
    avgRating: 4.8,
    description: "전 골드만삭스 애널리스트 출신으로 주식, 부동산, 대체투자까지 포트폴리오 전략을 제공합니다.",
    price: "₩200,000",
    pricePerMinute: 4000, // 레벨 700대 - 고급 요금
    image: null,
    isOnline: true,
    tags: ["주식투자", "부동산", "대체투자", "포트폴리오"],
    consultationTypes: ["video", "chat"],
    languages: ["한국어", "영어"],
    availability: "평일 9-18시",
    responseTime: "1시간 이내",
    completionRate: 96,
    certifications: ["CFA", "FRM", "투자상담사"],
    education: ["와튼스쿨 MBA", "서울대학교 경제학과"],
    location: "서울특별시 중구",
    timeZone: "Asia/Seoul",
    profileViews: 1890,
    lastActiveAt: new Date("2024-01-20T17:30:00"),
    joinedAt: new Date("2021-09-15T09:00:00"),
    specialtyAreas: ["글로벌 투자", "리스크 관리", "자산 배분"],
    consultationStyle: "데이터 기반 정량적 분석",
    targetAudience: ["고액자산가", "기관투자자", "펀드매니저"],
    successStories: 456,
    repeatClients: 234,
    averageSessionDuration: 90,
    nextAvailableSlot: "2024-01-24T10:00:00",
    weeklyAvailability: {
      monday: ["09:00", "10:00", "11:00", "14:00", "15:00"],
      tuesday: ["09:00", "10:00", "14:00", "15:00", "16:00"],
      wednesday: ["09:00", "10:00", "11:00", "14:00", "15:00"],
      thursday: ["09:00", "10:00", "14:00", "15:00", "16:00"],
      friday: ["09:00", "10:00", "11:00"],
    },
    portfolioItems: [
      {
        title: "글로벌 포트폴리오 설계",
        description: "위험 분산을 통한 최적 자산 배분 전략",
        type: "service"
      }
    ],
    socialProof: {
      website: "https://globalinvest.co.kr",
      publications: ["똑똑한 글로벌 투자", "부의 법칙"]
    },
    pricingTiers: [
      { duration: 60, price: 180000, description: "투자 상담" },
      { duration: 90, price: 260000, description: "포트폴리오 리뷰" },
      { duration: 120, price: 340000, description: "종합 자산 관리" }
    ],
    cancellationPolicy: "48시간 전 취소 가능",
    reschedulePolicy: "24시간 전 일정 변경 가능"
  },
  {
    id: 15,
    name: "최지은",
    specialty: "디자인상담",
    experience: 7,
    rating: 4.7,
    reviewCount: 234,
    totalSessions: 234, // 중급 레벨
    avgRating: 4.7,
    description: "삼성전자 디자인팀 출신으로 UX/UI, 브랜딩, 제품 디자인 전반에 대한 컨설팅을 제공합니다.",
    price: "₩80,000",
    pricePerMinute: 1333, // 레벨 300대 - 중급 요금
    image: null,
    isOnline: true,
    tags: ["UX/UI", "브랜딩", "제품디자인", "디자인시스템"],
    consultationTypes: ["video", "chat"],
    languages: ["한국어", "영어"],
    availability: "평일 10-19시",
    responseTime: "3시간 이내",
    completionRate: 94,
    certifications: ["Adobe Certified Expert", "Google UX Design Certificate"],
    education: ["홍익대학교 산업디자인과 석사"],
    location: "서울특별시 강남구",
    timeZone: "Asia/Seoul",
    profileViews: 892,
    lastActiveAt: new Date("2024-01-20T18:45:00"),
    joinedAt: new Date("2022-01-20T09:00:00"),
    specialtyAreas: ["사용자 경험", "인터페이스 디자인", "디자인 전략"],
    consultationStyle: "사용자 중심의 체계적 접근",
    targetAudience: ["디자이너", "PM", "스타트업"],
    successStories: 156,
    repeatClients: 89,
    averageSessionDuration: 75,
    nextAvailableSlot: "2024-01-24T11:00:00",
    weeklyAvailability: {
      monday: ["10:00", "11:00", "14:00", "15:00", "16:00"],
      tuesday: ["10:00", "11:00", "15:00", "16:00", "17:00"],
      wednesday: ["10:00", "14:00", "15:00", "16:00"],
      thursday: ["10:00", "11:00", "14:00", "15:00", "16:00"],
      friday: ["10:00", "11:00", "14:00"],
    },
    portfolioItems: [
      {
        title: "모바일 앱 UX 리뷰",
        description: "사용성 개선을 위한 전문적인 UX 분석",
        type: "review"
      }
    ],
    socialProof: {
      website: "https://uxdesign.co.kr",
      publications: ["사용자를 사로잡는 UX", "디자인 씽킹 실무"]
    },
    pricingTiers: [
      { duration: 30, price: 40000, description: "디자인 리뷰" },
      { duration: 60, price: 75000, description: "UX 컨설팅" },
      { duration: 90, price: 110000, description: "디자인 전략" }
    ],
    cancellationPolicy: "24시간 전 취소 가능",
    reschedulePolicy: "12시간 전 일정 변경 가능"
  },
  {
    id: 16,
    name: "송민호",
    specialty: "마케팅상담",
    experience: 12,
    rating: 4.8,
    reviewCount: 345,
    totalSessions: 345, // 중고급 레벨
    avgRating: 4.8,
    description: "네이버 마케팅팀 출신으로 디지털 마케팅, 퍼포먼스 마케팅, 브랜드 전략을 전문으로 합니다.",
    price: "₩90,000",
    pricePerMinute: 1500, // 레벨 400대 - 중고급 요금
    image: null,
    isOnline: true,
    tags: ["디지털마케팅", "퍼포먼스마케팅", "브랜드전략", "성장해킹"],
    consultationTypes: ["video", "chat"],
    languages: ["한국어"],
    availability: "평일 13-21시",
    responseTime: "2시간 이내",
    completionRate: 95,
    certifications: ["Google Ads 인증", "Facebook Blueprint", "네이버 마케팅 전문가"],
    education: ["연세대학교 경영학과 MBA"],
    location: "서울특별시 분당구",
    timeZone: "Asia/Seoul",
    profileViews: 1234,
    lastActiveAt: new Date("2024-01-20T20:30:00"),
    joinedAt: new Date("2022-02-15T09:00:00"),
    specialtyAreas: ["퍼포먼스 마케팅", "데이터 분석", "성장 전략"],
    consultationStyle: "데이터 기반 실무 중심 조언",
    targetAudience: ["마케터", "스타트업", "이커머스"],
    successStories: 234,
    repeatClients: 134,
    averageSessionDuration: 60,
    nextAvailableSlot: "2024-01-24T14:00:00",
    weeklyAvailability: {
      monday: ["13:00", "14:00", "15:00", "19:00", "20:00"],
      tuesday: ["13:00", "14:00", "18:00", "19:00", "20:00"],
      wednesday: ["13:00", "14:00", "15:00", "19:00"],
      thursday: ["13:00", "14:00", "18:00", "19:00", "20:00"],
      friday: ["13:00", "14:00", "15:00"],
    },
    portfolioItems: [
      {
        title: "퍼포먼스 마케팅 전략",
        description: "ROI 극대화를 위한 광고 최적화 전략",
        type: "strategy"
      }
    ],
    socialProof: {
      website: "https://growth-marketing.co.kr",
      publications: ["성장하는 마케팅", "데이터로 말하는 광고"]
    },
    pricingTiers: [
      { duration: 30, price: 45000, description: "마케팅 상담" },
      { duration: 60, price: 85000, description: "전략 수립" },
      { duration: 90, price: 120000, description: "종합 컨설팅" }
    ],
    cancellationPolicy: "24시간 전 취소 가능",
    reschedulePolicy: "12시간 전 일정 변경 가능"
  },
  {
    id: 17,
    name: "임수진",
    specialty: "언어상담",
    experience: 8,
    rating: 4.9,
    reviewCount: 567,
    totalSessions: 567, // 고급 레벨
    avgRating: 4.9,
    description: "하버드 언어학 박사 출신으로 영어, 중국어, 일본어 학습법과 비즈니스 커뮤니케이션을 가르칩니다.",
    price: "₩70,000",
    pricePerMinute: 1167, // 레벨 600대 - 고급 요금
    image: null,
    isOnline: true,
    tags: ["영어", "중국어", "일본어", "비즈니스커뮤니케이션"],
    consultationTypes: ["video", "chat"],
    languages: ["한국어", "영어", "중국어", "일본어"],
    availability: "매일 8-22시",
    responseTime: "30분 이내",
    completionRate: 98,
    certifications: ["TESOL", "HSK 6급", "JLPT N1"],
    education: ["하버드 대학교 언어학 박사", "서울대학교 언어학과 석사"],
    location: "서울특별시 서초구",
    timeZone: "Asia/Seoul",
    profileViews: 1567,
    lastActiveAt: new Date("2024-01-20T21:15:00"),
    joinedAt: new Date("2021-12-01T09:00:00"),
    specialtyAreas: ["언어 습득", "비즈니스 영어", "다국어 학습"],
    consultationStyle: "학습자 맞춤형 체계적 접근",
    targetAudience: ["직장인", "학생", "해외 진출 기업"],
    successStories: 389,
    repeatClients: 234,
    averageSessionDuration: 50,
    nextAvailableSlot: "2024-01-23T09:00:00",
    weeklyAvailability: {
      monday: ["08:00", "09:00", "19:00", "20:00", "21:00"],
      tuesday: ["08:00", "09:00", "10:00", "20:00", "21:00"],
      wednesday: ["08:00", "19:00", "20:00", "21:00"],
      thursday: ["08:00", "09:00", "19:00", "20:00"],
      friday: ["08:00", "09:00", "10:00"],
      saturday: ["09:00", "10:00", "11:00"],
      sunday: ["09:00", "10:00"],
    },
    portfolioItems: [
      {
        title: "비즈니스 영어 마스터 과정",
        description: "글로벌 비즈니스 환경에서의 효과적 소통법",
        type: "course"
      }
    ],
    socialProof: {
      website: "https://multilingual.co.kr",
      publications: ["효과적인 언어 학습법", "비즈니스 영어 완전 정복"]
    },
    pricingTiers: [
      { duration: 30, price: 35000, description: "언어 상담" },
      { duration: 60, price: 65000, description: "학습 계획" },
      { duration: 90, price: 95000, description: "집중 코칭" }
    ],
    cancellationPolicy: "12시간 전 취소 가능",
    reschedulePolicy: "6시간 전 일정 변경 가능"
  },
  {
    id: 18,
    name: "강태현",
    specialty: "쇼핑몰상담",
    experience: 6,
    rating: 4.5,
    reviewCount: 123,
    totalSessions: 123, // 중급 레벨
    avgRating: 4.5,
    description: "쿠팡, 11번가 출신으로 온라인 쇼핑몰 창업부터 운영, 마케팅까지 전 과정을 컨설팅합니다.",
    price: "₩55,000",
    pricePerMinute: 917, // 레벨 200대 - 중급 요금
    image: null,
    isOnline: true,
    tags: ["쇼핑몰창업", "이커머스", "온라인마케팅", "상품기획"],
    consultationTypes: ["video", "chat"],
    languages: ["한국어"],
    availability: "평일 14-20시",
    responseTime: "4시간 이내",
    completionRate: 91,
    certifications: ["전자상거래관리사", "온라인마케팅 전문가"],
    education: ["한양대학교 경영학과 학사"],
    location: "서울특별시 강서구",
    timeZone: "Asia/Seoul",
    profileViews: 445,
    lastActiveAt: new Date("2024-01-20T19:20:00"),
    joinedAt: new Date("2023-01-15T09:00:00"),
    specialtyAreas: ["쇼핑몰 운영", "상품 소싱", "고객 서비스"],
    consultationStyle: "실무 경험 기반 현실적 조언",
    targetAudience: ["예비 창업자", "소상공인", "온라인 셀러"],
    successStories: 78,
    repeatClients: 45,
    averageSessionDuration: 55,
    nextAvailableSlot: "2024-01-24T15:00:00",
    weeklyAvailability: {
      monday: ["14:00", "15:00", "18:00", "19:00"],
      tuesday: ["14:00", "15:00", "16:00", "19:00"],
      wednesday: ["14:00", "18:00", "19:00"],
      thursday: ["14:00", "15:00", "18:00", "19:00"],
      friday: ["14:00", "15:00", "16:00"],
    },
    portfolioItems: [
      {
        title: "쇼핑몰 창업 가이드",
        description: "0원부터 시작하는 온라인 쇼핑몰 창업",
        type: "guide"
      }
    ],
    socialProof: {
      publications: ["성공하는 온라인 쇼핑몰", "이커머스 마케팅 실전"]
    },
    pricingTiers: [
      { duration: 30, price: 27500, description: "기본 상담" },
      { duration: 60, price: 50000, description: "창업 컨설팅" },
      { duration: 90, price: 72500, description: "종합 전략" }
    ],
    cancellationPolicy: "24시간 전 취소 가능",
    reschedulePolicy: "12시간 전 일정 변경 가능"
  },
  {
    id: 19,
    name: "윤서현",
    specialty: "건강상담",
    experience: 11,
    rating: 4.8,
    reviewCount: 389,
    totalSessions: 389, // 중고급 레벨
    avgRating: 4.8,
    description: "서울대병원 출신 가정의학과 전문의로 건강 관리, 질병 예방, 생활습관 개선을 전문으로 합니다.",
    price: "₩95,000",
    pricePerMinute: 1583, // 레벨 400대 - 중고급 요금
    image: null,
    isOnline: true,
    tags: ["건강관리", "질병예방", "생활습관", "영양상담"],
    consultationTypes: ["video", "chat"],
    languages: ["한국어", "영어"],
    availability: "평일 18-22시, 주말 10-16시",
    responseTime: "2시간 이내",
    completionRate: 97,
    certifications: ["가정의학과 전문의", "영양상담사", "건강관리사"],
    education: ["서울대학교 의과대학 학사", "존스홉킨스 공중보건학 석사"],
    location: "서울특별시 강남구",
    timeZone: "Asia/Seoul",
    profileViews: 1123,
    lastActiveAt: new Date("2024-01-20T21:45:00"),
    joinedAt: new Date("2022-03-01T09:00:00"),
    specialtyAreas: ["예방의학", "만성질환 관리", "건강 라이프스타일"],
    consultationStyle: "의학적 근거 기반 맞춤형 조언",
    targetAudience: ["성인", "만성질환자", "건강 관심층"],
    successStories: 267,
    repeatClients: 156,
    averageSessionDuration: 45,
    nextAvailableSlot: "2024-01-24T18:00:00",
    weeklyAvailability: {
      monday: ["18:00", "19:00", "20:00", "21:00"],
      tuesday: ["18:00", "19:00", "20:00", "21:00"],
      wednesday: ["18:00", "19:00", "20:00"],
      thursday: ["18:00", "19:00", "20:00", "21:00"],
      friday: ["18:00", "19:00"],
      saturday: ["10:00", "11:00", "14:00", "15:00"],
      sunday: ["10:00", "11:00", "14:00"],
    },
    portfolioItems: [
      {
        title: "맞춤형 건강 관리 플랜",
        description: "개인별 건강 상태에 맞는 종합 관리 계획",
        type: "plan"
      }
    ],
    socialProof: {
      website: "https://healthylife.co.kr",
      publications: ["평생 건강 가이드", "질병 없는 삶의 비결"]
    },
    pricingTiers: [
      { duration: 30, price: 47500, description: "건강 상담" },
      { duration: 60, price: 90000, description: "종합 건강 체크" },
      { duration: 90, price: 130000, description: "맞춤 건강 플랜" }
    ],
    cancellationPolicy: "24시간 전 취소 가능",
    reschedulePolicy: "12시간 전 일정 변경 가능"
  },
  {
    id: 20,
    name: "조현우",
    specialty: "부동산상담",
    experience: 18,
    rating: 4.7,
    reviewCount: 723,
    totalSessions: 723, // 최고급 레벨
    avgRating: 4.7,
    description: "부동산 전문가 18년 경력으로 투자, 매매, 임대차, 세무까지 부동산 전반을 아우르는 컨설팅을 제공합니다.",
    price: "₩120,000",
    pricePerMinute: 2400, // 레벨 800대 - 최고급 요금
    image: null,
    isOnline: true,
    tags: ["부동산투자", "매매", "임대차", "부동산세무"],
    consultationTypes: ["video", "chat"],
    languages: ["한국어"],
    availability: "평일 9-18시",
    responseTime: "1시간 이내",
    completionRate: 95,
    certifications: ["공인중개사", "부동산투자상담사", "감정평가사"],
    education: ["건국대학교 부동산학과 석사"],
    location: "서울특별시 강남구",
    timeZone: "Asia/Seoul",
    profileViews: 2145,
    lastActiveAt: new Date("2024-01-20T17:50:00"),
    joinedAt: new Date("2021-08-01T09:00:00"),
    specialtyAreas: ["부동산 투자 전략", "시장 분석", "세금 최적화"],
    consultationStyle: "시장 데이터 기반 전문적 분석",
    targetAudience: ["투자자", "실수요자", "부동산 업계 종사자"],
    successStories: 456,
    repeatClients: 289,
    averageSessionDuration: 75,
    nextAvailableSlot: "2024-01-24T10:00:00",
    weeklyAvailability: {
      monday: ["09:00", "10:00", "11:00", "14:00", "15:00"],
      tuesday: ["09:00", "10:00", "14:00", "15:00", "16:00"],
      wednesday: ["09:00", "10:00", "11:00", "14:00", "15:00"],
      thursday: ["09:00", "10:00", "14:00", "15:00", "16:00"],
      friday: ["09:00", "10:00", "11:00"],
    },
    portfolioItems: [
      {
        title: "부동산 투자 포트폴리오",
        description: "수익형 부동산 투자 전략 및 포트폴리오 구성",
        type: "portfolio"
      }
    ],
    socialProof: {
      website: "https://realestate-pro.co.kr",
      publications: ["부동산 투자의 정석", "똑똑한 부동산 투자법"]
    },
    pricingTiers: [
      { duration: 60, price: 110000, description: "투자 상담" },
      { duration: 90, price: 160000, description: "시장 분석" },
      { duration: 120, price: 210000, description: "종합 컨설팅" }
    ],
    cancellationPolicy: "48시간 전 취소 가능",
    reschedulePolicy: "24시간 전 일정 변경 가능"
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
