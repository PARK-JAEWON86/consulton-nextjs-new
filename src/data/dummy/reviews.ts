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
