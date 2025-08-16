// 더미 데이터 통합 export 파일
// TODO: 실제 API 연동 시 이 파일과 dummy 폴더 전체를 삭제하세요

// 전문가 관련
export * from './experts';

// 상담 관련
export * from './consultations';

// 사용자 관련
export * from './users';

// 카테고리 관련
export * from './categories';
export { getExtendedCategories, getExtendedAgeGroups, getExtendedDurations } from './categories';

// 통계 관련
export * from './stats';

// 더미 데이터 사용 여부를 확인하는 플래그
export const USING_DUMMY_DATA = true;

// 더미 데이터 정리를 위한 유틸리티
export const cleanupDummyData = () => {
  console.warn('⚠️ 더미 데이터를 사용 중입니다. 실제 API 연동 후 /src/data/dummy 폴더를 삭제해주세요.');
};
