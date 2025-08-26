import { Review } from "@/types";

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

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  content: string;
  category: string;
  date: string;
}

export const reviews: Review[] = [
  {
    id: "1",
    userName: "김민수",
    userAvatar: "/avatars/user1.jpg",
    rating: 5,
    content: "전문가 상담을 통해 비즈니스 아이디어를 구체화할 수 있었어요. 정말 도움이 많이 되었습니다!",
    category: "비즈니스",
    date: "2024-01-15"
  },
  {
    id: "2",
    userName: "이지영",
    userAvatar: "/avatars/user2.jpg",
    rating: 5,
    content: "법률 상담이 필요했는데, 전문가님이 친절하게 설명해주셔서 이해하기 쉬웠어요.",
    category: "법률",
    date: "2024-01-14"
  },
  {
    id: "3",
    userName: "박준호",
    userAvatar: "/avatars/user3.jpg",
    rating: 4,
    content: "투자 상담을 받았는데, 전문적인 조언을 얻을 수 있어서 만족스러웠습니다.",
    category: "투자",
    date: "2024-01-13"
  },
  {
    id: "4",
    userName: "최수진",
    userAvatar: "/avatars/user4.jpg",
    rating: 5,
    content: "건강 상담을 통해 올바른 운동 방법을 알 수 있었어요. 체계적으로 관리할 수 있게 되었습니다.",
    category: "건강",
    date: "2024-01-12"
  },
  {
    id: "5",
    userName: "정현우",
    userAvatar: "/avatars/user5.jpg",
    rating: 4,
    content: "교육 상담을 받았는데, 아이의 학습 방향을 잡는 데 큰 도움이 되었어요.",
    category: "교육",
    date: "2024-01-11"
  },
  {
    id: "6",
    userName: "한소영",
    userAvatar: "/avatars/user6.jpg",
    rating: 5,
    content: "심리 상담을 통해 마음의 안정을 찾을 수 있었습니다. 전문가님의 따뜻한 조언이 인상적이었어요.",
    category: "심리",
    date: "2024-01-10"
  },
  {
    id: "7",
    userName: "강동훈",
    userAvatar: "/avatars/user7.jpg",
    rating: 4,
    content: "부동산 상담을 받았는데, 시장 동향과 투자 전략에 대해 자세히 설명해주셔서 좋았습니다.",
    category: "부동산",
    date: "2024-01-09"
  },
  {
    id: "8",
    userName: "윤미라",
    userAvatar: "/avatars/user8.jpg",
    rating: 5,
    content: "창업 상담을 통해 구체적인 실행 계획을 세울 수 있었어요. 전문가님의 경험이 정말 귀중했습니다.",
    category: "창업",
    date: "2024-01-08"
  },
  {
    id: "9",
    userName: "임태현",
    userAvatar: "/avatars/user9.jpg",
    rating: 4,
    content: "재무 상담을 받았는데, 개인 재무 관리에 대한 새로운 관점을 얻을 수 있었습니다.",
    category: "재무",
    date: "2024-01-07"
  },
  {
    id: "10",
    userName: "송은지",
    userAvatar: "/avatars/user10.jpg",
    rating: 5,
    content: "커리어 상담을 통해 직장에서의 성장 방향을 명확하게 설정할 수 있었어요.",
    category: "커리어",
    date: "2024-01-06"
  },
  {
    id: "11",
    userName: "오승준",
    userAvatar: "/avatars/user11.jpg",
    rating: 4,
    content: "마케팅 상담을 받았는데, 브랜드 전략에 대한 인사이트를 얻을 수 있어서 유익했습니다.",
    category: "마케팅",
    date: "2024-01-05"
  },
  {
    id: "12",
    userName: "류하은",
    userAvatar: "/avatars/user12.jpg",
    rating: 5,
    content: "디자인 상담을 통해 프로젝트의 방향성을 잡을 수 있었어요. 창의적인 아이디어가 많이 나왔습니다.",
    category: "디자인",
    date: "2024-01-04"
  }
];

// 더미 리뷰 데이터
export const dummyReviews: Review[] = [
  {
    id: 1,
    userId: "user1",
    userName: "김민수",
    userAvatar: undefined,
    expertId: 1,
    rating: 5,
    comment: "정말 도움이 많이 되었습니다. 전문가님의 조언 덕분에 이직에 성공했어요! 구체적이고 실용적인 조언을 해주셔서 감사합니다.",
    consultationType: "video",
    consultationTopic: "이직 상담",
    createdAt: "2024-01-15T10:30:00Z",
    isVerified: true,
    expertReply: {
      message: "좋은 결과가 있어서 정말 기쁩니다! 앞으로도 성공적인 커리어를 응원하겠습니다.",
      createdAt: "2024-01-16T09:15:00Z"
    }
  },
  {
    id: 2,
    userId: "user2",
    userName: "박지영",
    userAvatar: undefined,
    expertId: 1,
    rating: 4,
    comment: "친절하고 자세한 설명 감사합니다. 다만 시간이 조금 부족했던 것 같아요.",
    consultationType: "chat",
    consultationTopic: "커리어 전환",
    createdAt: "2024-01-10T14:20:00Z",
    isVerified: true,
    expertReply: {
      message: "소중한 피드백 감사합니다. 다음에는 더 충분한 시간을 갖고 상담해드리겠습니다.",
      createdAt: "2024-01-11T08:30:00Z"
    }
  },
  {
    id: 3,
    userId: "user3",
    userName: "이준호",
    userAvatar: undefined,
    expertId: 1,
    rating: 5,
    comment: "업계 인사이트가 정말 뛰어나시네요. 구체적인 로드맵을 제시해주셔서 방향성을 잡을 수 있었습니다.",
    consultationType: "video",
    consultationTopic: "스타트업 창업",
    createdAt: "2024-01-08T16:45:00Z",
    isVerified: true
  },
  {
    id: 4,
    userId: "user4",
    userName: "최수연",
    userAvatar: undefined,
    expertId: 1,
    rating: 3,
    comment: "조언은 좋았지만 예상보다 일반적인 내용이었어요. 좀 더 구체적인 케이스 스터디가 있었으면 좋겠습니다.",
    consultationType: "voice",
    consultationTopic: "마케팅 전략",
    createdAt: "2024-01-05T11:15:00Z",
    isVerified: true,
    expertReply: {
      message: "피드백 감사합니다. 다음에는 더 구체적인 사례를 준비해서 도움을 드리겠습니다.",
      createdAt: "2024-01-06T13:20:00Z"
    }
  },
  {
    id: 5,
    userId: "user5",
    userName: "강태현",
    userAvatar: undefined,
    expertId: 1,
    rating: 5,
    comment: "전문성이 정말 뛰어나시고 설명도 이해하기 쉽게 해주셨어요. 강력 추천합니다!",
    consultationType: "video",
    consultationTopic: "기술 컨설팅",
    createdAt: "2024-01-03T09:30:00Z",
    isVerified: true
  },
  {
    id: 6,
    userId: "user6",
    userName: "윤서진",
    userAvatar: undefined,
    expertId: 1,
    rating: 4,
    comment: "유익한 상담이었습니다. 시간 관리에 대한 조언이 특히 도움이 되었어요.",
    consultationType: "chat",
    consultationTopic: "업무 효율성",
    createdAt: "2024-01-01T15:45:00Z",
    isVerified: true
  },
  {
    id: 7,
    userId: "user7",
    userName: "정민우",
    userAvatar: undefined,
    expertId: 1,
    rating: 2,
    comment: "기대했던 것보다 아쉬웠습니다. 좀 더 준비를 하고 상담을 진행해주셨으면 좋겠어요.",
    consultationType: "video",
    consultationTopic: "투자 상담",
    createdAt: "2023-12-28T13:20:00Z",
    isVerified: true
  },
  {
    id: 8,
    userId: "user8",
    userName: "한지우",
    userAvatar: undefined,
    expertId: 1,
    rating: 5,
    comment: "정말 만족스러운 상담이었습니다. 전문가님 덕분에 많은 것을 배웠어요!",
    consultationType: "voice",
    consultationTopic: "자기계발",
    createdAt: "2023-12-25T10:10:00Z",
    isVerified: true,
    expertReply: {
      message: "좋은 평가 감사합니다. 계속해서 성장하는 모습 응원하겠습니다!",
      createdAt: "2023-12-26T14:30:00Z"
    }
  }
];

// 실제 상담 기록을 기반으로 리뷰 검증하는 함수 (더미 구현)
export const verifyReviewEligibility = (
  userId: string, 
  expertId: number, 
  consultations: ConsultationItem[]
): boolean => {
  // 실제 서비스에서는 이런 로직이 서버에서 실행됩니다
  
  // 1. 해당 사용자가 이 전문가와 완료된 상담이 있는지 확인
  const userConsultations = consultations.filter(consultation => {
    // 더미 데이터에서는 customer 이름으로 매칭 (실제로는 userId로 매칭)
    return consultation.status === 'completed' && 
           consultation.amount > 0; // 결제가 완료된 상담만
  });
  
  // 2. 완료된 상담이 하나라도 있으면 검증됨
  return userConsultations.length > 0;
};

// 동적으로 리뷰 검증 상태를 업데이트하는 함수
export const updateReviewVerification = (
  reviews: Review[], 
  consultations: ConsultationItem[]
): Review[] => {
  return reviews.map(review => ({
    ...review,
    isVerified: verifyReviewEligibility(review.userId, review.expertId, consultations)
  }));
};

// 새 리뷰 생성 시 자동 검증하는 함수
export const createVerifiedReview = (
  reviewData: Omit<Review, 'id' | 'isVerified' | 'createdAt'>,
  consultations: ConsultationItem[]
): Review => {
  const isVerified = verifyReviewEligibility(
    reviewData.userId, 
    reviewData.expertId, 
    consultations
  );
  
  return {
    ...reviewData,
    id: Date.now(), // 실제로는 서버에서 생성
    isVerified,
    createdAt: new Date().toISOString()
  };
};

// 리뷰 통계 계산 함수
export const getReviewStats = (reviews: Review[]) => {
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

  const repliedReviews = reviews.filter(r => r.expertReply).length;
  const replyRate = totalReviews > 0 ? (repliedReviews / totalReviews) * 100 : 0;
  
  // 검증된 리뷰 통계 추가
  const verifiedReviews = reviews.filter(r => r.isVerified).length;
  const verificationRate = totalReviews > 0 ? (verifiedReviews / totalReviews) * 100 : 0;

  return {
    totalReviews,
    averageRating: Math.round(averageRating * 10) / 10,
    ratingDistribution,
    replyRate: Math.round(replyRate),
    verifiedReviews,
    verificationRate: Math.round(verificationRate)
  };
};
