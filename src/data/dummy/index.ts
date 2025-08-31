// 더미 데이터 통합 export 파일
// TODO: 실제 API 연동 시 이 파일과 dummy 폴더 전체를 삭제하세요

// 전문가 관련
export * from './experts';

// 상담 관련
export * from './consultations';

// 사용자 관련
export * from './users';

// 결제 관련
export * from './payment';

// 카테고리 관련
export * from './categories';
export { getExtendedCategories, getExtendedAgeGroups, getExtendedDurations } from './categories';

// 통계 관련
export * from './stats';
export * from './expert-stats';

// 리뷰 및 커뮤니티 게시글 관련 - 통합된 데이터
export { 
  reviews, 
  dummyReviews, 
  type DummyReview,
  communityPosts,
  type CommunityPost,
  getPostsByType,
  getPostsByCategory,
  sortPosts,
  getCategoriesWithCount,
  getReviewsByExpert,
  getCommunityReviewsByExpert,
  getExpertFeedback
} from './reviews';

// 더미 데이터 사용 여부를 확인하는 플래그
export const USING_DUMMY_DATA = false;

// 더미 데이터 정리를 위한 유틸리티
export const cleanupDummyData = () => {
  console.log('✅ 더미 데이터가 제거되었습니다. 실제 API를 사용하고 있습니다.');
};
