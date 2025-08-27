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
  userName: string;
  userAvatar: string | null;
  rating: number;
  content: string;
  category: string;
  date: string;
  expertId?: number;
  isVerified?: boolean;
}

// 더미 데이터는 제거됨 - 실제 프로덕션에서는 API를 사용해야 함
export const reviews: DummyReview[] = [];
export const dummyReviews: DummyReview[] = [];

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

  return {
    totalReviews,
    averageRating: Math.round(averageRating * 10) / 10,
    ratingDistribution,
    replyRate: 0,
    verifiedReviews,
    verificationRate: Math.round(verificationRate)
  };
};
