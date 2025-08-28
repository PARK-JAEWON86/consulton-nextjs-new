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
    id: "1",
    consultationNumber: "CS241219001",
    title: "진로 상담 및 미래 계획 수립",
    date: new Date("2024-12-19T10:00:00"),
    duration: 60,
    expert: {
      name: "김민수",
      title: "진로 상담 전문가",
      avatar: null,
    },
    client: {
      name: "김민수",
      company: "대학생",
    },
    status: "user_confirmed",
    summary: "진로 상담을 통해 학생의 관심사와 능력을 파악하고, 구체적인 미래 계획을 수립했습니다.",
    tags: ["진로상담", "미래계획", "학생상담"],
    creditsUsed: 3,
    rating: 5,
    aiSummary: {
      keyPoints: ["학생의 관심사 파악", "능력 분석", "진로 방향 제시"],
      recommendations: ["관련 전공 탐색", "인턴십 경험 쌓기", "자격증 준비"],
      actionItems: ["진로 관련 서적 읽기", "관심 분야 전문가 인터뷰", "포트폴리오 작성"],
      generatedAt: new Date("2024-12-19T10:30:00"),
      aiModel: "GPT-4",
    },
    expertReview: {
      reviewedAt: new Date("2024-12-19T11:00:00"),
      expertNotes: "AI 요약이 잘 정리되었습니다. 추가로 구체적인 실행 계획을 제시했습니다.",
      additionalRecommendations: ["관련 동아리 활동", "네트워킹 이벤트 참여"],
      suggestedNextSession: {
        date: new Date("2025-01-15T14:00:00"),
        duration: 45,
        topic: "진로 계획 실행 점검 및 조정",
      },
      priority: "high",
    },
    userActions: {
      confirmedAt: new Date("2024-12-19T15:00:00"),
      userNotes: "제안된 계획이 매우 실용적입니다. 다음 상담을 기대합니다.",
      todoList: [
        {
          id: "todo1",
          task: "진로 관련 서적 3권 읽기",
          description: "AI가 추천한 진로 관련 도서들을 읽고 요약하기",
          assignee: "client",
          dueDate: new Date("2025-01-10"),
          status: "pending",
          priority: "high",
          category: "독서",
          createdAt: new Date("2024-12-19T15:00:00"),
        },
        {
          id: "todo2",
          task: "포트폴리오 작성",
          description: "지금까지의 활동과 성과를 정리한 포트폴리오 작성",
          assignee: "client",
          dueDate: new Date("2025-01-12"),
          status: "pending",
          priority: "medium",
          category: "문서작성",
          createdAt: new Date("2024-12-19T15:00:00"),
        },
      ],
      nextSessionBooked: {
        sessionId: "next1",
        date: new Date("2025-01-15T14:00:00"),
        duration: 45,
        status: "confirmed",
      },
      isCompleted: true,
    },
  },
  {
    id: "2",
    consultationNumber: "CS241219002",
    title: "취업 준비 및 이력서 작성",
    date: new Date("2024-12-19T14:00:00"),
    duration: 90,
    expert: {
      name: "박지영",
      title: "취업 컨설턴트",
      avatar: null,
    },
    client: {
      name: "박지영",
      company: "신입 구직자",
    },
    status: "expert_reviewed",
    summary: "취업 준비 과정에서 이력서 작성과 면접 준비에 대한 구체적인 가이드를 제공했습니다.",
    tags: ["취업준비", "이력서작성", "면접준비"],
    creditsUsed: 4,
    aiSummary: {
      keyPoints: ["이력서 작성법", "면접 질문 준비", "자기소개서 작성"],
      recommendations: ["관심 기업 리스트 작성", "네트워킹 강화", "자격증 취득"],
      actionItems: ["이력서 3가지 버전 작성", "면접 질문 답변 준비", "자기소개서 작성"],
      generatedAt: new Date("2024-12-19T14:45:00"),
      aiModel: "GPT-4",
    },
    expertReview: {
      reviewedAt: new Date("2024-12-19T16:00:00"),
      expertNotes: "AI 요약이 취업 준비의 핵심을 잘 정리했습니다. 추가로 구체적인 실행 방법을 제시했습니다.",
      additionalRecommendations: ["관심 기업 인사담당자와의 네트워킹", "모의 면접 연습"],
      suggestedNextSession: {
        date: new Date("2025-01-20T10:00:00"),
        duration: 60,
        topic: "이력서 및 자기소개서 피드백",
      },
      priority: "high",
    },
  },
  {
    id: "3",
    consultationNumber: "CS241218001",
    title: "학업 스트레스 관리 및 학습 방법",
    date: new Date("2024-12-18T16:00:00"),
    duration: 75,
    expert: {
      name: "이재훈",
      title: "학습 상담 전문가",
      avatar: null,
    },
    client: {
      name: "이재훈",
      company: "고등학생",
    },
    status: "ai_generated",
    summary: "학업 스트레스 관리 방법과 효율적인 학습 전략에 대해 상담했습니다.",
    tags: ["학습상담", "스트레스관리", "학습방법"],
    creditsUsed: 3,
    aiSummary: {
      keyPoints: ["스트레스 원인 분석", "학습 효율성 향상", "시간 관리"],
      recommendations: ["규칙적인 운동", "학습 계획 수립", "휴식 시간 확보"],
      actionItems: ["일일 학습 계획표 작성", "운동 루틴 설정", "휴식 시간 확보"],
      generatedAt: new Date("2024-12-18T16:30:00"),
      aiModel: "GPT-4",
    },
  },
  {
    id: "4",
    consultationNumber: "CS241217001",
    title: "창업 아이디어 검증 및 사업 계획",
    date: new Date("2024-12-17T11:00:00"),
    duration: 120,
    expert: {
      name: "최혁신",
      title: "창업 컨설턴트",
      avatar: null,
    },
    client: {
      name: "최혁신",
      company: "예비 창업가",
    },
    status: "user_confirmed",
    summary: "창업 아이디어의 타당성을 검증하고 구체적인 사업 계획을 수립했습니다.",
    tags: ["창업상담", "사업계획", "아이디어검증"],
    creditsUsed: 5,
    rating: 4,
    aiSummary: {
      keyPoints: ["아이디어 타당성 분석", "시장 조사 방법", "사업 모델 설계"],
      recommendations: ["시장 조사 실시", "MVP 개발", "투자자 네트워킹"],
      actionItems: ["시장 조사 보고서 작성", "MVP 프로토타입 개발", "투자자 리스트 작성"],
      generatedAt: new Date("2024-12-17T11:45:00"),
      aiModel: "GPT-4",
    },
    expertReview: {
      reviewedAt: new Date("2024-12-17T13:30:00"),
      expertNotes: "AI 요약이 창업 과정의 핵심을 잘 정리했습니다. 추가로 구체적인 실행 단계를 제시했습니다.",
      additionalRecommendations: ["경쟁사 분석", "재무 계획 수립"],
      suggestedNextSession: {
        date: new Date("2025-01-25T15:00:00"),
        duration: 90,
        topic: "사업 계획 실행 점검 및 투자 유치 준비",
      },
      priority: "high",
    },
    userActions: {
      confirmedAt: new Date("2024-12-17T16:00:00"),
      userNotes: "제안된 계획이 매우 체계적입니다. 단계별로 실행해보겠습니다.",
      todoList: [
        {
          id: "todo3",
          task: "시장 조사 보고서 작성",
          description: "타겟 시장과 경쟁사에 대한 상세한 조사 보고서 작성",
          assignee: "client",
          dueDate: new Date("2025-01-20"),
          status: "pending",
          priority: "high",
          category: "시장조사",
          createdAt: new Date("2024-12-17T16:00:00"),
        },
      ],
      nextSessionBooked: {
        sessionId: "next2",
        date: new Date("2025-01-25T15:00:00"),
        duration: 90,
        status: "confirmed",
      },
      isCompleted: true,
    },
  },
  {
    id: "5",
    consultationNumber: "CS241216001",
    title: "재무 계획 및 투자 전략",
    date: new Date("2024-12-16T09:00:00"),
    duration: 90,
    expert: {
      name: "정투자",
      title: "재무 설계사",
      avatar: null,
    },
    client: {
      name: "정투자",
      company: "직장인",
    },
    status: "expert_reviewed",
    summary: "재무 계획 수립과 투자 포트폴리오 구성에 대한 상담을 진행했습니다.",
    tags: ["재무설계", "투자전략", "포트폴리오"],
    creditsUsed: 4,
    aiSummary: {
      keyPoints: ["현재 재무 상황 분석", "투자 목표 설정", "리스크 관리"],
      recommendations: ["분산 투자", "정기 리밸런싱", "장기 투자 관점"],
      actionItems: ["투자 계획서 작성", "월 투자 금액 설정", "정기 점검 일정"],
      generatedAt: new Date("2024-12-16T09:30:00"),
      aiModel: "GPT-4",
    },
    expertReview: {
      reviewedAt: new Date("2024-12-16T10:30:00"),
      expertNotes: "AI 요약이 재무 계획의 핵심을 잘 정리했습니다.",
      additionalRecommendations: ["세금 절약 전략", "보험 포트폴리오 검토"],
      suggestedNextSession: {
        date: new Date("2025-01-10T10:00:00"),
        duration: 60,
        topic: "투자 성과 점검 및 계획 조정",
      },
      priority: "medium",
    },
  },
  {
    id: "6",
    consultationNumber: "CS241215001",
    title: "건강 관리 및 운동 계획",
    date: new Date("2024-12-15T15:00:00"),
    duration: 60,
    expert: {
      name: "한운동",
      title: "건강 관리사",
      avatar: null,
    },
    client: {
      name: "한운동",
      company: "직장인",
    },
    status: "ai_generated",
    summary: "건강 상태 점검과 개인 맞춤 운동 계획 수립에 대한 상담을 진행했습니다.",
    tags: ["건강관리", "운동계획", "생활습관"],
    creditsUsed: 3,
    aiSummary: {
      keyPoints: ["건강 상태 진단", "운동 목표 설정", "식단 관리"],
      recommendations: ["규칙적인 운동", "균형 잡힌 식단", "충분한 휴식"],
      actionItems: ["주간 운동 계획표 작성", "식단 일지 작성", "건강 체크리스트"],
      generatedAt: new Date("2024-12-15T15:30:00"),
      aiModel: "GPT-4",
    },
  },
  {
    id: "7",
    consultationNumber: "CS241214001",
    title: "언어 학습 및 시험 준비",
    date: new Date("2024-12-14T11:00:00"),
    duration: 75,
    expert: {
      name: "김학습",
      title: "언어 교육 전문가",
      avatar: null,
    },
    client: {
      name: "김학습",
      company: "학생",
    },
    status: "user_confirmed",
    summary: "영어 학습 방법과 토익 시험 준비 전략에 대한 상담을 진행했습니다.",
    tags: ["언어학습", "토익준비", "학습방법"],
    creditsUsed: 3,
    rating: 5,
    aiSummary: {
      keyPoints: ["현재 영어 실력 진단", "학습 목표 설정", "효율적인 학습법"],
      recommendations: ["일일 학습 루틴", "모의고사 활용", "스피킹 연습"],
      actionItems: ["학습 계획표 작성", "주간 목표 설정", "진도 체크리스트"],
      generatedAt: new Date("2024-12-14T11:30:00"),
      aiModel: "GPT-4",
    },
    expertReview: {
      reviewedAt: new Date("2024-12-14T12:30:00"),
      expertNotes: "AI 요약이 언어 학습의 핵심을 잘 정리했습니다.",
      additionalRecommendations: ["원어민과의 대화 연습", "영어 뉴스 청취"],
      suggestedNextSession: {
        date: new Date("2025-01-05T14:00:00"),
        duration: 60,
        topic: "학습 진도 점검 및 계획 조정",
      },
      priority: "high",
    },
    userActions: {
      confirmedAt: new Date("2024-12-14T16:00:00"),
      userNotes: "제안된 학습 방법이 매우 체계적입니다.",
      todoList: [
        {
          id: "todo4",
          task: "일일 영어 학습 루틴 설정",
          description: "매일 30분씩 영어 공부하는 습관 만들기",
          assignee: "client",
          dueDate: new Date("2024-12-20"),
          status: "pending",
          priority: "high",
          category: "학습",
          createdAt: new Date("2024-12-14T16:00:00"),
        },
      ],
      nextSessionBooked: {
        sessionId: "next3",
        date: new Date("2025-01-05T14:00:00"),
        duration: 60,
        status: "confirmed",
      },
      isCompleted: true,
    },
  },
  {
    id: "8",
    consultationNumber: "CS241213001",
    title: "커리어 개발 및 승진 전략",
    date: new Date("2024-12-13T13:00:00"),
    duration: 90,
    expert: {
      name: "박커리어",
      title: "커리어 컨설턴트",
      avatar: null,
    },
    client: {
      name: "박승진",
      company: "직장인",
    },
    status: "expert_reviewed",
    summary: "현재 직장에서의 성과 향상과 승진을 위한 전략을 수립했습니다.",
    tags: ["커리어개발", "승진전략", "성과향상"],
    creditsUsed: 4,
    aiSummary: {
      keyPoints: ["현재 직무 분석", "성과 평가", "승진 요건 파악"],
      recommendations: ["핵심 역량 강화", "네트워킹 확대", "가시적 성과 창출"],
      actionItems: ["개인 성과 계획서 작성", "스킬 향상 계획", "네트워킹 이벤트 참여"],
      generatedAt: new Date("2024-12-13T13:30:00"),
      aiModel: "GPT-4",
    },
    expertReview: {
      reviewedAt: new Date("2024-12-13T14:30:00"),
      expertNotes: "AI 요약이 커리어 개발의 핵심을 잘 정리했습니다.",
      additionalRecommendations: ["멘토링 프로그램 참여", "업계 컨퍼런스 참석"],
      suggestedNextSession: {
        date: new Date("2025-01-08T15:00:00"),
        duration: 60,
        topic: "성과 향상 진도 점검",
      },
      priority: "high",
    },
  },
  {
    id: "9",
    consultationNumber: "CS241212001",
    title: "창업 아이디어 검증 및 사업 계획",
    date: new Date("2024-12-12T10:00:00"),
    duration: 120,
    expert: {
      name: "최창업",
      title: "창업 컨설턴트",
      avatar: null,
    },
    client: {
      name: "최아이디어",
      company: "예비 창업가",
    },
    status: "ai_generated",
    summary: "새로운 창업 아이디어의 타당성을 검증하고 초기 사업 계획을 수립했습니다.",
    tags: ["창업아이디어", "사업계획", "시장분석"],
    creditsUsed: 5,
    aiSummary: {
      keyPoints: ["아이디어 타당성 분석", "시장 조사 방법", "초기 비용 산정"],
      recommendations: ["MVP 개발", "시장 테스트", "초기 투자자 모집"],
      actionItems: ["시장 조사 보고서", "MVP 프로토타입", "투자 제안서"],
      generatedAt: new Date("2024-12-12T10:30:00"),
      aiModel: "GPT-4",
    },
  },
  {
    id: "10",
    consultationNumber: "CS241211001",
    title: "부동산 투자 및 시장 분석",
    date: new Date("2024-12-11T14:00:00"),
    duration: 90,
    expert: {
      name: "이부동산",
      title: "부동산 투자 전문가",
      avatar: null,
    },
    client: {
      name: "이투자",
      company: "투자자",
    },
    status: "user_confirmed",
    summary: "부동산 투자 전략과 시장 분석에 대한 상담을 진행했습니다.",
    tags: ["부동산투자", "시장분석", "투자전략"],
    creditsUsed: 4,
    rating: 4,
    aiSummary: {
      keyPoints: ["시장 동향 분석", "투자 지역 선정", "수익성 분석"],
      recommendations: ["분산 투자", "장기 투자 관점", "리스크 관리"],
      actionItems: ["투자 지역 조사", "수익성 계산서", "투자 계획서"],
      generatedAt: new Date("2024-12-11T14:30:00"),
      aiModel: "GPT-4",
    },
    expertReview: {
      reviewedAt: new Date("2024-12-11T15:30:00"),
      expertNotes: "AI 요약이 부동산 투자의 핵심을 잘 정리했습니다.",
      additionalRecommendations: ["세금 절약 전략", "보험 가입 검토"],
      suggestedNextSession: {
        date: new Date("2025-01-12T10:00:00"),
        duration: 60,
        topic: "투자 성과 점검 및 계획 조정",
      },
      priority: "medium",
    },
    userActions: {
      confirmedAt: new Date("2024-12-11T17:00:00"),
      userNotes: "제안된 투자 전략이 매우 체계적입니다.",
      todoList: [
        {
          id: "todo5",
          task: "투자 지역 상세 조사",
          description: "선택된 지역의 상세한 시장 분석 및 투자 가능성 검토",
          assignee: "client",
          dueDate: new Date("2024-12-25"),
          status: "pending",
          priority: "high",
          category: "시장조사",
          createdAt: new Date("2024-12-11T17:00:00"),
        },
      ],
      nextSessionBooked: {
        sessionId: "next4",
        date: new Date("2025-01-12T10:00:00"),
        duration: 60,
        status: "confirmed",
      },
      isCompleted: true,
    },
  },
];