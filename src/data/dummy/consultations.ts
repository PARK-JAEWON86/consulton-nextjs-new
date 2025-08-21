import { ConsultationSummary } from "@/types";

// ConsultationItem 타입 정의
export interface ConsultationItem {
  id: number;
  date: string;
  customer: string;
  topic: string;
  amount: number;
  status: "completed" | "scheduled" | "canceled";
  method: "video" | "chat" | "voice" | "call";
  duration: number;
  summary: string;
  notes: string;
}

// 더미 상담 데이터
export const dummyConsultations: ConsultationItem[] = [
  {
    id: 3000,
    date: "2024-05-09T10:00:00Z",
    customer: "김민수",
    topic: "진로 상담",
    amount: 80,
    status: "completed",
    method: "video",
    duration: 60,
    summary: "IT 업계 전환에 대한 구체적인 로드맵을 제시하고, 필요한 기술 스택과 학습 방법에 대해 상담했습니다.",
    notes: "고객이 매우 적극적이고 의욕적임. 3개월 후 재상담 예정"
  },
  {
    id: 3001,
    date: "2024-05-05T08:00:00Z",
    customer: "박지영",
    topic: "심리 상담",
    amount: 299,
    status: "completed",
    method: "chat",
    duration: 45,
    summary: "직장 내 스트레스 관리와 워라밸 개선 방안에 대해 논의했습니다.",
    notes: "정기 상담을 희망하는 고객"
  },
  {
    id: 3002,
    date: "2024-04-28T12:30:00Z",
    customer: "이서준",
    topic: "재무 상담",
    amount: 150,
    status: "completed",
    method: "video",
    duration: 90,
    summary: "투자 포트폴리오 재구성 및 은퇴 계획 수립에 대한 상담을 진행했습니다.",
    notes: "보수적 투자 성향, 안정성 중시"
  },
  {
    id: 3003,
    date: "2024-04-23T14:00:00Z",
    customer: "최유진",
    topic: "건강 상담",
    amount: 80,
    status: "canceled",
    method: "voice",
    duration: 0,
    summary: "",
    notes: "고객 개인사정으로 취소"
  },
  {
    id: 3004,
    date: "2024-04-18T11:00:00Z",
    customer: "정하늘",
    topic: "법률 상담",
    amount: 115,
    status: "scheduled",
    method: "video",
    duration: 60,
    summary: "",
    notes: "계약서 검토 관련 상담 예정"
  },
  {
    id: 3005,
    date: "2024-04-14T09:00:00Z",
    customer: "한동훈",
    topic: "부동산 상담",
    amount: 299,
    status: "completed",
    method: "video",
    duration: 75,
    summary: "서울 강남 지역 아파트 투자 전략과 시장 전망에 대해 상담했습니다.",
    notes: "투자 경험 풍부, 추가 투자 계획 있음"
  },
  {
    id: 3006,
    date: "2024-04-10T16:00:00Z",
    customer: "이준호",
    topic: "창업 상담",
    amount: 200,
    status: "completed",
    method: "video",
    duration: 120,
    summary: "스타트업 비즈니스 모델 검토 및 초기 자금 조달 방안에 대해 논의했습니다.",
    notes: "아이디어 구체적, 실행력 우수"
  },
  {
    id: 3007,
    date: "2024-04-05T13:30:00Z",
    customer: "강태현",
    topic: "기술 컨설팅",
    amount: 180,
    status: "completed",
    method: "chat",
    duration: 90,
    summary: "AI 기술 도입 전략과 개발팀 구성에 대한 컨설팅을 제공했습니다.",
    notes: "기술 이해도 높음, 후속 프로젝트 가능성"
  },
  {
    id: 3008,
    date: "2024-03-30T10:15:00Z",
    customer: "윤서진",
    topic: "업무 효율성",
    amount: 120,
    status: "completed",
    method: "voice",
    duration: 50,
    summary: "시간 관리 및 업무 프로세스 개선 방안에 대해 상담했습니다.",
    notes: "실행 의지 강함, 1개월 후 성과 점검 예정"
  },
  {
    id: 3009,
    date: "2024-03-25T14:45:00Z",
    customer: "정민우",
    topic: "투자 상담",
    amount: 250,
    status: "completed",
    method: "video",
    duration: 80,
    summary: "주식 투자 포트폴리오 분석 및 리밸런싱 전략에 대해 상담했습니다.",
    notes: "투자 경험 부족, 기초 교육 필요"
  },
  {
    id: 3010,
    date: "2024-03-20T11:30:00Z",
    customer: "한지우",
    topic: "자기계발",
    amount: 100,
    status: "completed",
    method: "chat",
    duration: 60,
    summary: "개인 브랜딩 및 네트워킹 전략에 대한 조언을 제공했습니다.",
    notes: "적극적 성향, 실행력 우수"
  }
];

// 상담 통계 계산 함수
export const getConsultationStats = (consultations: ConsultationItem[]) => {
  const totalConsultations = consultations.length;
  const completedConsultations = consultations.filter(c => c.status === "completed");
  const scheduledConsultations = consultations.filter(c => c.status === "scheduled");
  const canceledConsultations = consultations.filter(c => c.status === "canceled");
  
  const totalRevenue = completedConsultations.reduce((sum, c) => sum + c.amount, 0);
  const averageRevenue = completedConsultations.length > 0 
    ? totalRevenue / completedConsultations.length 
    : 0;
  
  const totalDuration = completedConsultations.reduce((sum, c) => sum + (c.duration || 0), 0);
  const averageDuration = completedConsultations.length > 0 
    ? totalDuration / completedConsultations.length 
    : 0;

  const methodDistribution = {
    video: consultations.filter(c => c.method === "video").length,
    chat: consultations.filter(c => c.method === "chat").length,
    voice: consultations.filter(c => c.method === "voice").length,
    call: consultations.filter(c => c.method === "call").length,
  };

  return {
    totalConsultations,
    completedConsultations: completedConsultations.length,
    scheduledConsultations: scheduledConsultations.length,
    canceledConsultations: canceledConsultations.length,
    completionRate: totalConsultations > 0 
      ? Math.round((completedConsultations.length / totalConsultations) * 100) 
      : 0,
    totalRevenue,
    averageRevenue: Math.round(averageRevenue),
    totalDuration,
    averageDuration: Math.round(averageDuration),
    methodDistribution
  };
};

// 날짜별 상담 데이터 그룹화
export const groupConsultationsByDate = (consultations: ConsultationItem[]) => {
  const grouped = consultations.reduce((acc, consultation) => {
    const date = new Date(consultation.date).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(consultation);
    return acc;
  }, {} as Record<string, ConsultationItem[]>);

  return grouped;
};

// 고객별 상담 히스토리
export const getCustomerHistory = (consultations: ConsultationItem[], customerName: string) => {
  return consultations
    .filter(c => c.customer === customerName)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// 더미 상담 요약 데이터
export const dummyConsultationSummaries: ConsultationSummary[] = [
  {
    id: "summary_001",
    title: "진로 상담 - IT 업계 전환",
    date: new Date("2024-05-09T10:00:00Z"),
    duration: 60,
    expert: {
      name: "김진우",
      title: "진로 상담 전문가",
      avatar: null
    },
    client: {
      name: "김민수",
      company: "현재 제조업 종사"
    },
    status: "completed",
    summary: "IT 업계 전환에 대한 구체적인 로드맵을 제시하고, 필요한 기술 스택과 학습 방법에 대해 상담했습니다. 프로그래밍 기초부터 시작하여 웹 개발 분야로의 전환을 권장했습니다.",
    tags: ["진로전환", "IT", "웹개발", "프로그래밍"],
    creditsUsed: 80,
    rating: 5
  },
  {
    id: "summary_002",
    title: "심리 상담 - 직장 스트레스 관리",
    date: new Date("2024-05-05T08:00:00Z"),
    duration: 45,
    expert: {
      name: "박지영",
      title: "심리상담 전문가",
      avatar: null
    },
    client: {
      name: "박지영",
      company: "대기업 사무직"
    },
    status: "completed",
    summary: "직장 내 스트레스 관리와 워라밸 개선 방안에 대해 논의했습니다. 마음챙김 기법과 시간 관리 전략을 제안했습니다.",
    tags: ["스트레스관리", "워라밸", "마음챙김", "시간관리"],
    creditsUsed: 299,
    rating: 4
  },
  {
    id: "summary_003",
    title: "재무 상담 - 투자 포트폴리오 재구성",
    date: new Date("2024-04-28T12:30:00Z"),
    duration: 90,
    expert: {
      name: "이소연",
      title: "재무 상담 전문가",
      avatar: null
    },
    client: {
      name: "이서준",
      company: "중소기업 대표"
    },
    status: "completed",
    summary: "투자 포트폴리오 재구성 및 은퇴 계획 수립에 대한 상담을 진행했습니다. 안정적인 자산 배분과 위험 관리 전략을 수립했습니다.",
    tags: ["투자", "포트폴리오", "은퇴계획", "자산배분"],
    creditsUsed: 150,
    rating: 5
  },
  {
    id: "summary_004",
    title: "법률 상담 - 계약서 검토",
    date: new Date("2024-04-18T11:00:00Z"),
    duration: 60,
    expert: {
      name: "이민수",
      title: "법률 상담 전문가",
      avatar: null
    },
    client: {
      name: "정하늘",
      company: "스타트업 창업자"
    },
    status: "processing",
    summary: "프랜차이즈 계약서 검토 및 주요 조항 설명을 진행했습니다. 불리한 조항들을 지적하고 개선 방안을 제시했습니다.",
    tags: ["계약서", "법률검토", "프랜차이즈", "창업"],
    creditsUsed: 115,
    rating: 4
  },
  {
    id: "summary_005",
    title: "부동산 상담 - 강남 아파트 투자",
    date: new Date("2024-04-14T09:00:00Z"),
    duration: 75,
    expert: {
      name: "조현우",
      title: "부동산 투자 전문가",
      avatar: null
    },
    client: {
      name: "한동훈",
      company: "개인투자자"
    },
    status: "completed",
    summary: "서울 강남 지역 아파트 투자 전략과 시장 전망에 대해 상담했습니다. 현재 시장 상황과 향후 전망을 분석하여 투자 타이밍을 제안했습니다.",
    tags: ["부동산", "아파트투자", "강남", "시장분석"],
    creditsUsed: 299,
    rating: 5
  },
  {
    id: "summary_006",
    title: "창업 상담 - 스타트업 비즈니스 모델",
    date: new Date("2024-04-10T16:00:00Z"),
    duration: 120,
    expert: {
      name: "김진우",
      title: "창업 컨설턴트",
      avatar: null
    },
    client: {
      name: "이준호",
      company: "예비창업자"
    },
    status: "completed",
    summary: "스타트업 비즈니스 모델 검토 및 초기 자금 조달 방안에 대해 논의했습니다. MVP 개발 전략과 시장 진입 방안을 수립했습니다.",
    tags: ["창업", "비즈니스모델", "자금조달", "MVP"],
    creditsUsed: 200,
    rating: 4
  },
  {
    id: "summary_007",
    title: "기술 컨설팅 - AI 기술 도입",
    date: new Date("2024-04-05T13:30:00Z"),
    duration: 90,
    expert: {
      name: "김태수",
      title: "IT 컨설턴트",
      avatar: null
    },
    client: {
      name: "강태현",
      company: "제조업체 CTO"
    },
    status: "completed",
    summary: "AI 기술 도입 전략과 개발팀 구성에 대한 컨설팅을 제공했습니다. 단계별 도입 계획과 필요 인력 구성을 제안했습니다.",
    tags: ["AI", "기술도입", "개발팀", "디지털전환"],
    creditsUsed: 180,
    rating: 5
  },
  {
    id: "summary_008",
    title: "업무 효율성 - 시간 관리 개선",
    date: new Date("2024-03-30T10:15:00Z"),
    duration: 50,
    expert: {
      name: "김진우",
      title: "생산성 컨설턴트",
      avatar: null
    },
    client: {
      name: "윤서진",
      company: "마케팅팀 팀장"
    },
    status: "completed",
    summary: "시간 관리 및 업무 프로세스 개선 방안에 대해 상담했습니다. GTD 방법론과 디지털 도구 활용법을 제안했습니다.",
    tags: ["시간관리", "업무효율성", "GTD", "프로세스개선"],
    creditsUsed: 120,
    rating: 4
  },
  {
    id: "summary_009",
    title: "투자 상담 - 주식 포트폴리오 분석",
    date: new Date("2024-03-25T14:45:00Z"),
    duration: 80,
    expert: {
      name: "이강민",
      title: "투자 전문가",
      avatar: null
    },
    client: {
      name: "정민우",
      company: "투자 초보자"
    },
    status: "failed",
    summary: "주식 투자 포트폴리오 분석 및 리밸런싱 전략에 대해 상담했습니다. 기초 투자 원칙과 위험 관리 방법을 교육했습니다.",
    tags: ["주식투자", "포트폴리오", "리밸런싱", "투자교육"],
    creditsUsed: 250
  },
  {
    id: "summary_010",
    title: "자기계발 - 개인 브랜딩 전략",
    date: new Date("2024-03-20T11:30:00Z"),
    duration: 60,
    expert: {
      name: "최지은",
      title: "브랜딩 전문가",
      avatar: null
    },
    client: {
      name: "한지우",
      company: "프리랜서"
    },
    status: "completed",
    summary: "개인 브랜딩 및 네트워킹 전략에 대한 조언을 제공했습니다. SNS 활용법과 개인 브랜드 구축 방안을 제시했습니다.",
    tags: ["개인브랜딩", "네트워킹", "SNS마케팅", "프리랜서"],
    creditsUsed: 100,
    rating: 5
  }
];