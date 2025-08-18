import { ConsultationItem } from "@/stores/consultationsStore";

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