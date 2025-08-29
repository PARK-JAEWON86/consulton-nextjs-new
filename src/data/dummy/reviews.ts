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

export interface DummyReview {
  id: string;
  consultationId: string;
  userId: string;
  userName: string;
  userAvatar: string | null;
  expertId: string;
  expertName: string;
  rating: number;
  content: string;
  category: string;
  date: string;
  isVerified: boolean;
  isPublic: boolean;
  expertReply?: {
    message: string;
    createdAt: string;
  };
}

// 커뮤니티 게시글 타입 정의
export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAvatar: string | null;
  createdAt: string;
  updatedAt?: string;
  category: string;
  tags: string[];
  likes: number;
  comments: number;
  views?: number;
  postType: "consultation_request" | "consultation_review" | "expert_intro" | "general";
  isAISummary?: boolean;
  isExpert?: boolean;
  urgency?: "낮음" | "보통" | "높음";
  preferredMethod?: "화상상담" | "채팅상담" | "전화상담";
  profileVisibility?: "public" | "experts" | "private";
  // 상담후기 관련 추가 필드
  consultationTopic?: string;
  rating?: number;
  expertName?: string;
  isVerified?: boolean;
  hasExpertReply?: boolean;
}

// 통일된 더미 리뷰 데이터
export const dummyReviews: DummyReview[] = [
  {
    id: "1",
    consultationId: "cons-001",
    userId: "user-001",
    userName: "김민수",
    userAvatar: null,
    expertId: "expert-001",
    expertName: "김전문",
    rating: 5,
    content: "진로 상담을 받았는데 정말 도움이 많이 되었어요. 전문가님이 체계적으로 분석해주셔서 앞으로의 방향을 명확하게 잡을 수 있었습니다.",
    category: "진로상담",
    date: "2024-12-15T00:00:00.000Z",
    isVerified: true,
    isPublic: true,
    expertReply: {
      message: "김민수님의 진로 상담을 도와드릴 수 있어서 기쁩니다. 체계적인 분석이 도움이 되었다니 다행이에요. 앞으로도 궁금한 점이 있으시면 언제든 연락주세요!",
      createdAt: "2024-12-15T02:00:00.000Z"
    }
  },
  {
    id: "2",
    consultationId: "cons-002",
    userId: "user-002",
    userName: "이지영",
    userAvatar: null,
    expertId: "expert-002",
    expertName: "이상담",
    rating: 5,
    content: "심리 상담을 통해 스트레스 관리 방법을 배웠어요. 전문가님이 공감해주시고 실용적인 조언을 해주셔서 마음이 한결 가벼워졌습니다.",
    category: "심리상담",
    date: "2024-12-14T00:00:00.000Z",
    isVerified: true,
    isPublic: true,
    expertReply: {
      message: "이지영님의 스트레스 관리에 도움이 되었다니 다행이에요. 공감과 실용적인 조언이 중요하다고 생각합니다. 앞으로도 마음이 무거울 때 언제든 찾아주세요.",
      createdAt: "2024-12-14T02:00:00.000Z"
    }
  },
  {
    id: "3",
    consultationId: "cons-003",
    userId: "user-003",
    userName: "박준호",
    userAvatar: null,
    expertId: "expert-003",
    expertName: "박재무",
    rating: 4,
    content: "재무 상담으로 투자 방향을 정했어요. 리스크 관리에 대한 조언이 특히 유용했고, 안전하게 자산을 늘릴 수 있을 것 같습니다.",
    category: "재무상담",
    date: "2024-12-13T00:00:00.000Z",
    isVerified: true,
    isPublic: true,
    expertReply: {
      message: "박준호님의 투자 방향 설정에 도움이 되었다니 기쁩니다. 리스크 관리가 투자의 핵심이에요. 안전하고 지속 가능한 자산 증식이 되길 바랍니다.",
      createdAt: "2024-12-13T02:00:00.000Z"
    }
  },
  {
    id: "4",
    consultationId: "cons-004",
    userId: "user-004",
    userName: "최수진",
    userAvatar: null,
    expertId: "expert-004",
    expertName: "최법률",
    rating: 5,
    content: "법률 상담을 받았는데 복잡한 문제를 쉽게 설명해주셨어요. 전문적인 지식과 친절한 설명으로 걱정이 해소되었습니다.",
    category: "법률상담",
    date: "2024-12-12T00:00:00.000Z",
    isVerified: true,
    isPublic: true,
    expertReply: {
      message: "최수진님의 법률 문제 해결에 도움이 되었다니 다행이에요. 복잡한 법률 문제도 쉽게 이해할 수 있도록 설명하는 것이 제 역할이에요. 앞으로도 궁금한 점이 있으시면 언제든 연락주세요.",
      createdAt: "2024-12-12T02:00:00.000Z"
    }
  },
  {
    id: "5",
    consultationId: "cons-005",
    userId: "user-005",
    userName: "정현우",
    userAvatar: null,
    expertId: "expert-005",
    expertName: "정교육",
    rating: 4,
    content: "교육 상담으로 학습 계획을 세웠어요. 개인 맞춤형 방법을 제시해주셔서 효율적으로 공부할 수 있을 것 같습니다.",
    category: "교육상담",
    date: "2024-12-11T00:00:00.000Z",
    isVerified: true,
    isPublic: true,
    expertReply: {
      message: "정현우님의 학습 계획 수립에 도움이 되었다니 기쁩니다. 개인 맞춤형 방법이 학습 효율성을 높이는 핵심이에요. 계획대로 잘 진행되길 바랍니다!",
      createdAt: "2024-12-11T02:00:00.000Z"
    }
  },
  {
    id: "6",
    consultationId: "cons-006",
    userId: "user-006",
    userName: "한소영",
    userAvatar: null,
    expertId: "expert-001",
    expertName: "김전문",
    rating: 5,
    content: "커리어 상담을 통해 이직 준비를 체계적으로 할 수 있었어요. 전문가님이 현실적인 조언을 해주셔서 자신감이 생겼습니다.",
    category: "진로상담",
    date: "2024-12-10T00:00:00.000Z",
    isVerified: true,
    isPublic: true,
    expertReply: {
      message: "한소영님의 이직 준비를 도와드릴 수 있어서 기쁩니다. 체계적인 준비가 성공적인 이직의 핵심이에요. 앞으로도 궁금한 점이 있으시면 언제든 연락주세요!",
      createdAt: "2024-12-10T02:00:00.000Z"
    }
  },
  {
    id: "7",
    consultationId: "cons-007",
    userId: "user-007",
    userName: "윤태호",
    userAvatar: null,
    expertId: "expert-003",
    expertName: "박재무",
    rating: 4,
    content: "부동산 투자 상담을 받았는데 시장 분석이 정말 정확했어요. 전문가님의 통찰력 있는 조언으로 좋은 결정을 할 수 있었습니다.",
    category: "재무상담",
    date: "2024-12-09T00:00:00.000Z",
    isVerified: true,
    isPublic: true,
    expertReply: {
      message: "윤태호님의 부동산 투자 결정에 도움이 되었다니 기쁩니다. 시장 분석과 통찰력 있는 조언이 투자 성공의 핵심이에요. 좋은 결과가 있길 바랍니다!",
      createdAt: "2024-12-09T02:00:00.000Z"
    }
  },
  {
    id: "8",
    consultationId: "cons-008",
    userId: "user-008",
    userName: "임서연",
    userAvatar: null,
    expertId: "expert-002",
    expertName: "이상담",
    rating: 5,
    content: "가족 관계 상담을 통해 소통 방법을 개선할 수 있었어요. 전문가님이 양쪽의 입장을 모두 고려해주셔서 해결책을 찾을 수 있었습니다.",
    category: "심리상담",
    date: "2024-12-08T00:00:00.000Z",
    isVerified: true,
    isPublic: true,
    expertReply: {
      message: "임서연님의 가족 관계 개선에 도움이 되었다니 다행이에요. 양쪽의 입장을 고려한 소통 방법이 관계 개선의 핵심이에요. 앞으로도 가족 간 소통이 더욱 원활해지길 바랍니다.",
      createdAt: "2024-12-08T02:00:00.000Z"
    }
  },
  {
    id: "9",
    consultationId: "cons-009",
    userId: "user-009",
    userName: "강동현",
    userAvatar: null,
    expertId: "expert-001",
    expertName: "김전문",
    rating: 4,
    content: "창업 상담을 받았는데 사업 계획을 구체화할 수 있었어요. 전문가님이 실무적인 조언을 해주셔서 도움이 많이 되었습니다.",
    category: "진로상담",
    date: "2024-12-07T00:00:00.000Z",
    isVerified: true,
    isPublic: true,
    expertReply: {
      message: "강동현님의 창업 준비에 도움이 되었다니 기쁩니다. 실무적인 조언과 구체적인 사업 계획이 창업 성공의 핵심이에요. 창업이 성공적으로 이루어지길 바랍니다!",
      createdAt: "2024-12-07T02:00:00.000Z"
    }
  },
  {
    id: "10",
    consultationId: "cons-010",
    userId: "user-010",
    userName: "송미라",
    userAvatar: null,
    expertId: "expert-003",
    expertName: "박재무",
    rating: 5,
    content: "세무 상담으로 절세 전략을 세웠어요. 전문가님이 복잡한 세법을 쉽게 설명해주셔서 이해하기 쉬웠습니다.",
    category: "재무상담",
    date: "2024-12-06T00:00:00.000Z",
    isVerified: true,
    isPublic: true,
    expertReply: {
      message: "송미라님의 절세 전략 수립에 도움이 되었다니 기쁩니다. 복잡한 세법도 쉽게 이해할 수 있도록 설명하는 것이 제 역할이에요. 효율적인 절세가 되길 바랍니다!",
      createdAt: "2024-12-06T02:00:00.000Z"
    }
  },
  {
    id: "11",
    consultationId: "cons-011",
    userId: "user-011",
    userName: "조성민",
    userAvatar: null,
    expertId: "expert-005",
    expertName: "정교육",
    rating: 4,
    content: "학습 동기 부여 상담을 받았는데 정말 효과적이었어요. 전문가님이 개인별 특성을 파악해서 맞춤형 방법을 제시해주셨습니다.",
    category: "교육상담",
    date: "2024-12-05T00:00:00.000Z",
    isVerified: true,
    isPublic: true,
    expertReply: {
      message: "조성민님의 학습 동기 부여에 도움이 되었다니 기쁩니다. 개인별 특성을 파악한 맞춤형 방법이 학습 효과를 높이는 핵심이에요. 앞으로도 학습에 대한 동기가 유지되길 바랍니다!",
      createdAt: "2024-12-05T02:00:00.000Z"
    }
  },
  {
    id: "12",
    consultationId: "cons-012",
    userId: "user-012",
    userName: "백지은",
    userAvatar: null,
    expertId: "expert-004",
    expertName: "최법률",
    rating: 5,
    content: "상속 문제 상담을 통해 복잡한 절차를 이해할 수 있었어요. 전문가님이 차근차근 설명해주셔서 마음이 편해졌습니다.",
    category: "법률상담",
    date: "2024-12-04T00:00:00.000Z",
    isVerified: true,
    isPublic: true,
    expertReply: {
      message: "백지은님의 상속 문제 해결에 도움이 되었다니 다행이에요. 복잡한 상속 절차도 차근차근 설명하여 이해하기 쉽게 하는 것이 제 역할이에요. 앞으로도 법률 문제가 있을 때 언제든 연락주세요.",
      createdAt: "2024-12-04T02:00:00.000Z"
    }
  }
];

// 커뮤니티 게시글 데이터
export const communityPosts: CommunityPost[] = [
  {
    id: "ai-1",
    title: "[AI 상담 요약] 진로 전환에 대한 고민",
    content: "AI 상담을 통해 현재 직장에서의 스트레스와 새로운 분야로의 전환 가능성에 대해 상담했습니다. 개발자로 전향하고 싶지만 나이와 경험 부족이 걱정됩니다.",
    author: "익명사용자",
    authorAvatar: "익",
    createdAt: "2024-01-16",
    category: "진로상담",
    tags: ["AI상담", "진로전환", "개발자"],
    likes: 24,
    comments: 8,
    postType: "consultation_request",
    isAISummary: true,
    urgency: "보통",
    preferredMethod: "화상상담",
    profileVisibility: "private"
  },
  {
    id: "1",
    title: "진로 상담 경험 공유",
    content: "전문가와의 상담을 통해 진로 방향을 찾았습니다. 3개월간의 상담 과정에서 얻은 인사이트를 공유합니다.",
    author: "김철수",
    authorAvatar: "김",
    createdAt: "2024-01-15",
    category: "진로상담",
    tags: ["진로", "상담후기", "경험공유"],
    likes: 12,
    comments: 5,
    postType: "consultation_review",
    profileVisibility: "experts"
  },
  {
    id: "req-1",
    title: "연애 관계 상담 요청드립니다",
    content: "연인과의 소통 문제로 고민이 많습니다. 서로 다른 성격으로 인한 갈등을 해결하고 싶어요.",
    author: "익명사용자",
    authorAvatar: "익",
    createdAt: "2024-01-14",
    category: "관계상담",
    tags: ["연애", "소통", "갈등해결"],
    likes: 8,
    comments: 3,
    postType: "consultation_request",
    urgency: "보통",
    preferredMethod: "화상상담",
    profileVisibility: "private"
  },
  {
    id: "expert-1",
    title: "심리상담 전문가 박상담입니다",
    content: "10년 경력의 심리상담사입니다. 우울, 불안, 트라우마 전문으로 상담하고 있으며, 많은 분들께 도움을 드리고 있습니다.",
    author: "박상담",
    authorAvatar: "박",
    createdAt: "2024-01-14",
    category: "심리상담",
    tags: ["전문가", "심리상담", "경력10년"],
    likes: 45,
    comments: 18,
    postType: "expert_intro",
    isExpert: true,
    profileVisibility: "public"
  },
  {
    id: "2",
    title: "재무 상담 정말 도움됐어요!",
    content: "투자와 저축에 대한 좋은 조언을 받았습니다. 전문가님 덕분에 재정 계획을 체계적으로 세울 수 있었어요.",
    author: "박민수",
    authorAvatar: "박",
    createdAt: "2024-01-13",
    category: "재무상담",
    tags: ["투자", "재무", "상담후기"],
    likes: 15,
    comments: 7,
    postType: "consultation_review",
  },
  {
    id: "ai-2",
    title: "[AI 상담 요약] 투자 초보자를 위한 조언",
    content: "AI와 함께 투자 기초에 대해 상담했습니다. 적금과 주식 투자의 차이점, 초보자가 주의해야 할 점들에 대해 알아봤습니다.",
    author: "익명사용자",
    authorAvatar: "익",
    createdAt: "2024-01-12",
    category: "투자상담",
    tags: ["AI상담", "투자초보", "주식"],
    likes: 31,
    comments: 15,
    postType: "consultation_request",
    isAISummary: true,
    urgency: "낮음",
    preferredMethod: "채팅상담",
  },
  {
    id: "general-1",
    title: "상담 플랫폼 이용 팁 공유",
    content: "처음 상담 플랫폼을 이용하시는 분들을 위해 유용한 팁들을 정리해봤습니다.",
    author: "상담고수",
    authorAvatar: "상",
    createdAt: "2024-01-11",
    category: "기타",
    tags: ["팁", "플랫폼", "가이드"],
    likes: 22,
    comments: 9,
    postType: "general",
  },
  {
    id: "req-2",
    title: "직장 내 스트레스 관리 상담 요청",
    content: "최근 업무 스트레스가 심해져서 일상생활에 지장이 있습니다. 효과적인 스트레스 관리 방법을 배우고 싶어요.",
    author: "직장인A",
    authorAvatar: "직",
    createdAt: "2024-01-10",
    category: "심리상담",
    tags: ["스트레스", "직장", "관리방법"],
    likes: 18,
    comments: 6,
    postType: "consultation_request",
    urgency: "높음",
    preferredMethod: "화상상담",
  },
  {
    id: "expert-2",
    title: "재무설계 전문가 이재무입니다",
    content: "15년 경력의 재무설계사입니다. 개인 맞춤형 재무 계획 수립과 투자 포트폴리오 구성을 도와드립니다.",
    author: "이재무",
    authorAvatar: "이",
    createdAt: "2024-01-09",
    category: "재무상담",
    tags: ["전문가", "재무설계", "투자"],
    likes: 38,
    comments: 12,
    postType: "expert_intro",
    isExpert: true,
  },
  {
    id: "3",
    title: "법률 상담 후기 - 계약서 검토",
    content: "부동산 계약서 검토를 위해 법률 상담을 받았는데, 숨겨진 조항들을 찾아주셔서 큰 손해를 피할 수 있었습니다.",
    author: "김부동산",
    authorAvatar: "김",
    createdAt: "2024-01-08",
    category: "법률상담",
    tags: ["계약서", "부동산", "상담후기"],
    likes: 28,
    comments: 11,
    postType: "consultation_review",
  },
  {
    id: "req-3",
    title: "건강상담 - 다이어트 관련 조언 구합니다",
    content: "건강한 다이어트 방법과 운동 루틴에 대해 전문가의 조언을 구하고 싶습니다.",
    author: "건강지킴이",
    authorAvatar: "건",
    createdAt: "2024-01-07",
    category: "건강상담",
    tags: ["다이어트", "운동", "건강"],
    likes: 16,
    comments: 8,
    postType: "consultation_request",
    urgency: "보통",
    preferredMethod: "화상상담",
  },
  {
    id: "expert-3",
    title: "법무법인 대표변호사 김법률입니다",
    content: "20년 경력의 변호사로 민사, 형사, 가사 전 분야 상담 가능합니다. 복잡한 법적 문제도 쉽게 설명해드립니다.",
    author: "김법률",
    authorAvatar: "김",
    createdAt: "2024-01-06",
    category: "법률상담",
    tags: ["전문가", "변호사", "법률"],
    likes: 52,
    comments: 23,
    postType: "expert_intro",
    isExpert: true,
  },
  {
    id: "4",
    title: "교육상담 후기 - 자녀 진학 상담",
    content: "고등학생 자녀의 대학 진학 상담을 받았는데, 구체적인 로드맵을 제시해주셔서 매우 도움이 되었습니다.",
    author: "학부모A",
    authorAvatar: "학",
    createdAt: "2024-01-05",
    category: "교육상담",
    tags: ["진학", "교육", "자녀"],
    likes: 19,
    comments: 4,
    postType: "consultation_review",
  },
  {
    id: "req-4",
    title: "사업 아이템 검증 상담 요청",
    content: "새로운 사업 아이템에 대한 시장성과 실현 가능성을 검토받고 싶습니다.",
    author: "예비사업가",
    authorAvatar: "예",
    createdAt: "2024-01-04",
    category: "사업상담",
    tags: ["사업", "창업", "아이템"],
    likes: 25,
    comments: 11,
    postType: "consultation_request",
    urgency: "높음",
    preferredMethod: "화상상담",
  },
  {
    id: "5",
    title: "기술상담 후기 - 앱 개발 관련",
    content: "모바일 앱 개발에 대한 기술적 조언을 받았습니다. 개발 방향성을 잡는데 큰 도움이 되었어요.",
    author: "개발초보",
    authorAvatar: "개",
    createdAt: "2024-01-03",
    category: "기술상담",
    tags: ["앱개발", "기술", "모바일"],
    likes: 33,
    comments: 14,
    postType: "consultation_review",
  },
  {
    id: "expert-4",
    title: "디자인 스튜디오 대표 박디자인입니다",
    content: "UI/UX, 브랜딩, 그래픽 디자인 전문가입니다. 12년간 다양한 프로젝트를 진행했습니다.",
    author: "박디자인",
    authorAvatar: "박",
    createdAt: "2024-01-02",
    category: "디자인상담",
    tags: ["전문가", "디자인", "UI/UX"],
    likes: 41,
    comments: 16,
    postType: "expert_intro",
    isExpert: true,
  },
  {
    id: "req-5",
    title: "언어학습 방법 상담 요청",
    content: "영어 회화 실력 향상을 위한 효과적인 학습 방법을 알고 싶습니다.",
    author: "영어초보",
    authorAvatar: "영",
    createdAt: "2024-01-01",
    category: "언어상담",
    tags: ["영어", "회화", "학습법"],
    likes: 14,
    comments: 7,
    postType: "consultation_request",
    urgency: "보통",
    preferredMethod: "채팅상담",
  },
  {
    id: "6",
    title: "예술 활동 상담 후기",
    content: "취미로 시작한 그림 그리기를 전문적으로 배우고 싶어서 상담받았는데, 좋은 방향을 제시해주셨어요.",
    author: "그림러버",
    authorAvatar: "그",
    createdAt: "2023-12-30",
    category: "예술상담",
    tags: ["그림", "예술", "취미"],
    likes: 21,
    comments: 9,
    postType: "consultation_review",
  },
  {
    id: "req-6",
    title: "스포츠 부상 예방 상담",
    content: "축구를 하면서 자주 부상을 당하는데, 예방법과 재활 운동에 대해 상담받고 싶습니다.",
    author: "축구선수",
    authorAvatar: "축",
    createdAt: "2023-12-29",
    category: "스포츠상담",
    tags: ["축구", "부상예방", "재활"],
    likes: 18,
    comments: 6,
    postType: "consultation_request",
    urgency: "높음",
    preferredMethod: "화상상담",
  },
  {
    id: "7",
    title: "여행 계획 상담 정말 유용했어요!",
    content: "유럽 여행 계획을 세우는데 전문가의 조언이 정말 도움되었습니다. 숨겨진 명소들도 많이 알려주셨어요.",
    author: "여행매니아",
    authorAvatar: "여",
    createdAt: "2023-12-28",
    category: "여행상담",
    tags: ["유럽여행", "계획", "명소"],
    likes: 27,
    comments: 13,
    postType: "consultation_review",
  },
];

// 기존 reviews 배열은 dummyReviews와 동일하게 설정
export const reviews: DummyReview[] = [...dummyReviews];

// 리뷰 검증 함수 (더미 구현)
export const verifyReviewEligibility = (
  userId: string, 
  expertId: number, 
  consultations: ConsultationItem[]
): boolean => {
  // 실제 서비스에서는 이런 로직이 서버에서 실행됩니다
  return false;
};

// 동적으로 리뷰 검증 상태를 업데이트하는 함수
export const updateReviewVerification = (
  reviews: DummyReview[], 
  consultations: ConsultationItem[]
): DummyReview[] => {
  return reviews.map(review => ({
    ...review,
    isVerified: false
  }));
};

// 새 리뷰 생성 시 자동 검증하는 함수
export const createVerifiedReview = (
  reviewData: Omit<DummyReview, 'id' | 'isVerified' | 'date'>,
  consultations: ConsultationItem[]
): DummyReview => {
  return {
    ...reviewData,
    id: Date.now().toString(),
    isVerified: false,
    date: new Date().toISOString()
  };
};

// 리뷰 통계 계산 함수
export const getReviewStats = (reviews: DummyReview[]) => {
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
    : 0;
  
  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };
  
  const verifiedReviews = reviews.filter(r => r.isVerified).length;
  const verificationRate = totalReviews > 0 ? (verifiedReviews / totalReviews) * 100 : 0;
  
  const repliedReviews = reviews.filter(r => r.expertReply).length;
  const replyRate = totalReviews > 0 ? (repliedReviews / totalReviews) * 100 : 0;

  return {
    totalReviews,
    averageRating: Math.round(averageRating * 10) / 10,
    ratingDistribution,
    replyRate: Math.round(replyRate),
    verifiedReviews,
    verificationRate: Math.round(verificationRate)
  };
};

// ===== 커뮤니티 게시글 관련 함수들 =====

// 게시글 타입별 필터링 함수
export const getPostsByType = (type: CommunityPost['postType'] | 'all'): CommunityPost[] => {
  if (type === 'all') return communityPosts;
  return communityPosts.filter(post => post.postType === type);
};

// 카테고리별 필터링 함수
export const getPostsByCategory = (categoryId: string): CommunityPost[] => {
  if (categoryId === 'all') return communityPosts;
  
  // 카테고리 ID를 실제 카테고리 이름으로 매핑
  const categoryMap: Record<string, string> = {
    'career': '진로상담',
    'psychology': '심리상담', 
    'finance': '재무상담',
    'legal': '법률상담',
    'education': '교육상담',
    'health': '건강상담',
    'relationship': '관계상담',
    'business': '사업상담',
    'technology': '기술상담',
    'design': '디자인상담',
    'language': '언어상담',
    'art': '예술상담',
    'sports': '스포츠상담',
    'travel': '여행상담',
    'food': '요리상담',
    'fashion': '패션상담',
    'pet': '반려동물상담',
    'gardening': '정원상담',
    'investment': '투자상담',
    'tax': '세무상담',
    'insurance': '보험상담',
    'admission': '진학상담',
    'other': '기타'
  };

  const categoryName = categoryMap[categoryId];
  if (!categoryName) return [];
  
  return communityPosts.filter(post => post.category === categoryName);
};

// 게시글 검색 함수
export const searchPosts = (query: string): CommunityPost[] => {
  const lowercaseQuery = query.toLowerCase();
  return communityPosts.filter(post => 
    post.title.toLowerCase().includes(lowercaseQuery) ||
    post.content.toLowerCase().includes(lowercaseQuery) ||
    post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

// 게시글 정렬 함수
export const sortPosts = (posts: CommunityPost[], sortBy: 'latest' | 'popular' | 'comments' | 'views'): CommunityPost[] => {
  const sortedPosts = [...posts];
  
  switch (sortBy) {
    case 'latest':
      return sortedPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'popular':
      return sortedPosts.sort((a, b) => b.likes - a.likes);
    case 'comments':
      return sortedPosts.sort((a, b) => b.comments - a.comments);
    case 'views':
      // 뷰수 데이터가 없으므로 좋아요 + 댓글 수로 대체
      return sortedPosts.sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments));
    default:
      return sortedPosts;
  }
};

// 카테고리별 게시글 개수 계산 함수
export const getCategoryCount = (categoryId: string): number => {
  if (categoryId === 'all') return communityPosts.length;
  
  // 카테고리 ID를 실제 카테고리 이름으로 매핑
  const categoryMap: Record<string, string> = {
    'career': '진로상담',
    'psychology': '심리상담', 
    'finance': '재무상담',
    'legal': '법률상담',
    'education': '교육상담',
    'health': '건강상담',
    'relationship': '관계상담',
    'business': '사업상담',
    'technology': '기술상담',
    'design': '디자인상담',
    'language': '언어상담',
    'art': '예술상담',
    'sports': '스포츠상담',
    'travel': '여행상담',
    'food': '요리상담',
    'fashion': '패션상담',
    'pet': '반려동물상담',
    'gardening': '정원상담',
    'investment': '투자상담',
    'tax': '세무상담',
    'insurance': '보험상담',
    'admission': '진학상담',
    'other': '기타'
  };

  const categoryName = categoryMap[categoryId];
  if (!categoryName) return 0;
  
  return communityPosts.filter(post => post.category === categoryName).length;
};

// 모든 카테고리의 개수를 포함한 카테고리 목록 생성
export const getCategoriesWithCount = () => {
  const categories = [
    { id: "all", name: "전체" },
    { id: "career", name: "진로상담" },
    { id: "psychology", name: "심리상담" },
    { id: "finance", name: "재무상담" },
    { id: "legal", name: "법률상담" },
    { id: "education", name: "교육상담" },
    { id: "health", name: "건강상담" },
    { id: "relationship", name: "관계상담" },
    { id: "business", name: "사업상담" },
    { id: "technology", name: "기술상담" },
    { id: "design", name: "디자인상담" },
    { id: "language", name: "언어상담" },
    { id: "art", name: "예술상담" },
    { id: "sports", name: "스포츠상담" },
    { id: "travel", name: "여행상담" },
    { id: "food", name: "요리상담" },
    { id: "fashion", name: "패션상담" },
    { id: "pet", name: "반려동물상담" },
    { id: "gardening", name: "정원상담" },
    { id: "investment", name: "투자상담" },
    { id: "tax", name: "세무상담" },
    { id: "insurance", name: "보험상담" },
    { id: "admission", name: "진학상담" },
    { id: "other", name: "그외 기타" },
  ];

  return categories.map(category => ({
    ...category,
    count: getCategoryCount(category.id)
  }));
};

// ===== 통합된 리뷰 및 게시글 관리 함수들 =====

// 전문가별 리뷰 조회 함수
export const getReviewsByExpert = (expertId: string): DummyReview[] => {
  return dummyReviews.filter(review => review.expertId === expertId);
};

// 전문가별 커뮤니티 상담후기 조회 함수
export const getCommunityReviewsByExpert = (expertName: string): CommunityPost[] => {
  return communityPosts.filter(post => 
    post.postType === "consultation_review" && 
    post.expertName === expertName
  );
};

// 통합된 전문가 피드백 조회 함수 (리뷰 + 커뮤니티 후기)
export const getExpertFeedback = (expertId: string, expertName: string) => {
  const reviews = getReviewsByExpert(expertId);
  const communityReviews = getCommunityReviewsByExpert(expertName);
  
  return {
    reviews,
    communityReviews,
    totalFeedback: reviews.length + communityReviews.length,
    averageRating: reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0
  };
};
