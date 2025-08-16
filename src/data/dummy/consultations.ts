// 더미 상담 데이터
// TODO: 실제 API 연동 시 이 파일을 삭제하세요

export interface ConsultationItem {
  id: number | string;
  expertName: string;
  specialty: string;
  date: string;
  time: string;
  type: "video" | "chat" | "voice";
  status: "confirmed" | "pending" | "completed" | "cancelled";
  creditsUsed?: number;
  duration?: number;
  title?: string;
  expert?: {
    name: string;
    title: string;
  };
  hasRecording?: boolean;
  tags?: string[];
}

export interface ConsultationSummary {
  id: string;
  title: string;
  date: Date;
  duration: number;
  expert: {
    name: string;
    title: string;
  };
  status: "completed" | "processing" | "pending";
  creditsUsed: number;
  hasRecording: boolean;
  tags: string[];
}

// 예약된 상담 일정 데이터 (사용자용)
export const dummyUpcomingConsultations: ConsultationItem[] = [
  {
    id: 1,
    expertName: "박지영",
    specialty: "심리상담",
    date: "2025-08-05",
    time: "14:00",
    type: "video",
    status: "confirmed",
  },
  {
    id: 2,
    expertName: "이민수",
    specialty: "법률상담",
    date: "2025-08-12",
    time: "10:30",
    type: "chat",
    status: "pending",
  },
  {
    id: 3,
    expertName: "김소연",
    specialty: "재무상담",
    date: "2025-08-18",
    time: "16:00",
    type: "video",
    status: "confirmed",
  },
];

// 전문가의 예약 받은 상담 일정
export const dummyExpertConsultations: ConsultationItem[] = [
  {
    id: 1,
    expertName: "김철수",
    specialty: "진로상담",
    date: "2025-08-05",
    time: "10:00",
    type: "video",
    status: "confirmed",
  },
  {
    id: 2,
    expertName: "이영희",
    specialty: "재무상담",
    date: "2025-08-07",
    time: "14:30",
    type: "chat",
    status: "pending",
  },
];

// 상담 요약 데이터
export const dummyConsultationSummaries: ConsultationSummary[] = [
  {
    id: "123",
    title: "온라인 쇼핑몰 마케팅 전략 상담",
    date: new Date("2024-01-15T14:30:00"),
    duration: 45,
    expert: {
      name: "이민수",
      title: "디지털 마케팅 전문가",
    },
    status: "completed",
    creditsUsed: 25,
    hasRecording: true,
    tags: ["마케팅", "디지털마케팅", "SNS"],
  },
  {
    id: "124",
    title: "창업 아이템 검증 및 사업계획 수립",
    date: new Date("2024-01-10T10:00:00"),
    duration: 60,
    expert: {
      name: "박영희",
      title: "창업 컨설턴트",
    },
    status: "completed",
    creditsUsed: 30,
    hasRecording: true,
    tags: ["창업", "사업계획", "검증"],
  },
  {
    id: "125",
    title: "개인 브랜딩 및 SNS 전략",
    date: new Date("2024-01-08T16:00:00"),
    duration: 30,
    expert: {
      name: "김지원",
      title: "브랜딩 전문가",
    },
    status: "processing",
    creditsUsed: 20,
    hasRecording: false,
    tags: ["브랜딩", "SNS", "개인마케팅"],
  },
  {
    id: "126",
    title: "투자 유치 전략 및 피칭 준비",
    date: new Date("2024-01-05T11:30:00"),
    duration: 90,
    expert: {
      name: "최동현",
      title: "투자 컨설턴트",
    },
    status: "completed",
    creditsUsed: 40,
    hasRecording: true,
    tags: ["투자", "피칭", "전략"],
  },
];

// 매칭된 전문가 데이터 (홈페이지용)
export const dummyMatchedExperts = [
  {
    id: 1,
    name: "박지영",
    specialty: "심리상담",
    rating: 4.9,
    totalConsultations: 245,
    price: "₩80,000",
    duration: "50분",
    tags: ["우울증", "불안장애", "대인관계"],
    isOnline: true,
    image: null,
    description:
      "임상심리학 박사로 8년간 다양한 심리상담 경험을 보유하고 있습니다.",
  },
  {
    id: 2,
    name: "이민수",
    specialty: "법률상담",
    rating: 4.8,
    totalConsultations: 189,
    price: "₩90,000",
    duration: "60분",
    tags: ["민사소송", "계약서", "부동산"],
    isOnline: false,
    image: null,
    description:
      "변호사 자격을 보유한 법률 전문가로 다양한 분야의 법률 상담을 제공합니다.",
  },
  {
    id: 3,
    name: "이소연",
    specialty: "재무상담",
    rating: 4.7,
    totalConsultations: 89,
    price: "₩70,000",
    duration: "60분",
    tags: ["투자", "자산관리", "세무"],
    isOnline: true,
    image: null,
    description:
      "금융권 15년 경력과 재무설계사 자격을 갖춘 전문가로 개인과 기업의 재무상담을 제공합니다.",
  },
];
