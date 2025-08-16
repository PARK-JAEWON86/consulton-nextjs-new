// 더미 카테고리 및 필터 데이터
// TODO: 실제 API 연동 시 이 파일을 삭제하세요

import { ComponentType } from 'react';

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: any; // Lucide React 아이콘 컴포넌트
}

export interface AgeGroup {
  id: string;
  name: string;
  range?: string;
}

export interface Duration {
  id: string;
  name: string;
  minutes?: number;
}

// 상담 카테고리 (기본)
export const dummyCategories: Category[] = [
  { id: "psychology", name: "심리상담", description: "마음의 건강을 위한 전문 상담" },
  { id: "career", name: "진로상담", description: "진로 고민과 취업 준비 상담" },
  { id: "legal", name: "법률상담", description: "법적 문제 해결을 위한 전문 조언" },
  { id: "finance", name: "재무상담", description: "자산 관리와 투자 전략 상담" },
  { id: "business", name: "창업상담", description: "창업과 사업 운영 전략 상담" },
  { id: "health", name: "건강상담", description: "건강 관리와 의료 정보 상담" },
  { id: "education", name: "교육상담", description: "학습과 교육 방법 상담" },
  { id: "relationship", name: "관계상담", description: "인간관계와 소통 문제 상담" },
];

// 홈페이지용 확장 카테고리 (아이콘 포함) - 별도 함수로 제공
export const getExtendedCategories = (icons: any) => [
  {
    id: "career",
    name: "진로상담",
    icon: icons.Target,
    description: "취업, 이직, 진로 탐색",
  },
  {
    id: "psychology",
    name: "심리상담",
    icon: icons.Brain,
    description: "스트레스, 우울, 불안",
  },
  {
    id: "finance",
    name: "재무상담",
    icon: icons.DollarSign,
    description: "투자, 자산관리, 세무",
  },
  {
    id: "legal",
    name: "법률상담",
    icon: icons.Scale,
    description: "계약, 분쟁, 상속",
  },
  {
    id: "education",
    name: "교육상담",
    icon: icons.BookOpen,
    description: "학습법, 입시, 유학",
  },
  {
    id: "health",
    name: "건강상담",
    icon: icons.Heart,
    description: "영양, 운동, 건강관리",
  },
  {
    id: "relationship",
    name: "관계상담",
    icon: icons.Users,
    description: "연애, 결혼, 가족관계",
  },
  {
    id: "business",
    name: "사업상담",
    icon: icons.Briefcase,
    description: "창업, 경영, 마케팅",
  },
  {
    id: "technology",
    name: "기술상담",
    icon: icons.Code,
    description: "프로그래밍, IT, 개발",
  },
  {
    id: "design",
    name: "디자인상담",
    icon: icons.Palette,
    description: "UI/UX, 그래픽, 브랜딩",
  },
  {
    id: "language",
    name: "언어상담",
    icon: icons.Languages,
    description: "외국어, 통역, 번역",
  },
  {
    id: "art",
    name: "예술상담",
    icon: icons.Music,
    description: "음악, 미술, 공연",
  },
  {
    id: "sports",
    name: "스포츠상담",
    icon: icons.Trophy,
    description: "운동, 훈련, 경기",
  },
  {
    id: "travel",
    name: "여행상담",
    icon: icons.Plane,
    description: "여행계획, 가이드, 숙박",
  },
  {
    id: "food",
    name: "요리상담",
    icon: icons.ChefHat,
    description: "요리법, 영양, 식단",
  },
  {
    id: "beauty",
    name: "뷰티상담",
    icon: icons.Scissors,
    description: "헤어, 메이크업, 스타일링",
  },
  {
    id: "pet",
    name: "반려동물상담",
    icon: icons.PawPrint,
    description: "펫케어, 훈련, 건강",
  },
  {
    id: "gardening",
    name: "원예상담",
    icon: icons.Sprout,
    description: "식물키우기, 정원관리",
  },
  {
    id: "investment",
    name: "투자상담",
    icon: icons.TrendingUp,
    description: "주식, 부동산, 암호화폐",
  },
  {
    id: "tax",
    name: "세무상담",
    icon: icons.Receipt,
    description: "세금신고, 절세, 세무계획",
  },
  {
    id: "real-estate",
    name: "부동산상담",
    icon: icons.Building2,
    description: "매매, 임대, 투자",
  },
  {
    id: "parenting",
    name: "육아상담",
    icon: icons.Baby,
    description: "육아법, 교육, 발달",
  },
  {
    id: "study",
    name: "학습상담",
    icon: icons.School,
    description: "공부법, 시험준비, 집중력",
  },
  {
    id: "self-development",
    name: "자기계발상담",
    icon: icons.User,
    description: "목표설정, 습관형성, 동기부여",
  },
  {
    id: "leadership",
    name: "리더십상담",
    icon: icons.UserCheck,
    description: "팀관리, 소통, 조직운영",
  },
];

// 연령대 그룹 (기본)
export const dummyAgeGroups: AgeGroup[] = [
  { id: "teens", name: "10대", range: "13-19세" },
  { id: "twenties", name: "20대", range: "20-29세" },
  { id: "thirties", name: "30대", range: "30-39세" },
  { id: "forties", name: "40대", range: "40-49세" },
  { id: "fifties", name: "50대", range: "50-59세" },
  { id: "seniors", name: "60대 이상", range: "60세 이상" },
];

// 홈페이지용 확장 연령대 그룹 (아이콘 포함)
export const getExtendedAgeGroups = (icons: any) => [
  { id: "children", name: "어린이 (7-12세)", icon: icons.Baby },
  { id: "teen", name: "청소년 (13-18세)", icon: icons.GraduationCap },
  { id: "student", name: "학생 (19-25세)", icon: icons.School },
  { id: "adult", name: "성인 (26-59세)", icon: icons.User },
  { id: "senior", name: "시니어 (60세+)", icon: icons.UserCheck },
];

// 상담 시간 (기본)
export const dummyDurations: Duration[] = [
  { id: "30min", name: "30분", minutes: 30 },
  { id: "45min", name: "45분", minutes: 45 },
  { id: "60min", name: "60분", minutes: 60 },
  { id: "90min", name: "90분", minutes: 90 },
  { id: "120min", name: "120분", minutes: 120 },
];

// 홈페이지용 확장 상담 시간 (설명 포함)
export const getExtendedDurations = () => [
  { id: "30", name: "30분", description: "간단한 상담" },
  { id: "45", name: "45분", description: "표준 상담" },
  { id: "60", name: "60분", description: "심화 상담" },
  { id: "90", name: "90분", description: "종합 상담" },
  { id: "120", name: "120분", description: "전문 상담" },
];

// 인기 카테고리 (홈페이지 표시용)
export const dummyPopularCategories = [
  {
    id: "psychology",
    name: "심리상담",
    description: "전문 심리상담사와 함께하는 마음 치유",
    icon: "🧠",
    consultationCount: 1250,
    averageRating: 4.8,
    expertCount: 45,
  },
  {
    id: "career",
    name: "진로상담",
    description: "취업부터 이직까지 진로 설계 전문가",
    icon: "💼",
    consultationCount: 980,
    averageRating: 4.7,
    expertCount: 32,
  },
  {
    id: "legal",
    name: "법률상담",
    description: "변호사와 함께하는 법적 문제 해결",
    icon: "⚖️",
    consultationCount: 750,
    averageRating: 4.9,
    expertCount: 28,
  },
  {
    id: "finance",
    name: "재무상담",
    description: "투자와 자산관리 전문가 조언",
    icon: "💰",
    consultationCount: 650,
    averageRating: 4.6,
    expertCount: 25,
  },
  {
    id: "business",
    name: "창업상담",
    description: "성공적인 창업을 위한 전략 수립",
    icon: "🚀",
    consultationCount: 420,
    averageRating: 4.5,
    expertCount: 18,
  },
  {
    id: "health",
    name: "건강상담",
    description: "건강한 생활을 위한 의료진 상담",
    icon: "🏥",
    consultationCount: 380,
    averageRating: 4.7,
    expertCount: 22,
  },
];
