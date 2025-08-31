// 전문가 통계 더미 데이터
// TODO: 실제 API 연동 시 이 파일을 삭제하세요

import { dummyExperts } from './experts';

export interface ExpertStatsData {
  expertId: string;
  totalSessions: number;
  waitingClients: number;
  repeatClients: number;
  avgRating: number;
  reviewCount: number;
  likeCount: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  specialty: string;
  lastUpdated: string;
  // API에서 계산되는 필드들 (초기값은 0)
  rankingScore?: number;
  ranking?: number;
  totalExperts?: number;
  level?: number;
  tierInfo?: any;
  // 분야별 랭킹 필드
  specialtyRanking?: number;
  specialtyTotalExperts?: number;
}

// 기존 전문가 데이터에서 통계 정보 추출
export const dummyExpertStats: ExpertStatsData[] = dummyExperts.map(expert => {
  // 별점 분포 계산 (현실적인 분포)
  const totalReviews = expert.reviewCount;
  const rating5 = Math.floor(totalReviews * 0.75); // 75%가 5점
  const rating4 = Math.floor(totalReviews * 0.2);  // 20%가 4점
  const rating3 = Math.floor(totalReviews * 0.04); // 4%가 3점
  const rating2 = Math.floor(totalReviews * 0.01); // 1%가 2점
  const rating1 = 0; // 1점은 없음

  // 좋아요 수 계산 (리뷰의 80%가 좋아요)
  const likeCount = Math.floor(totalReviews * 0.8);

  // 대기 고객 수 (랜덤하게 1-5명)
  const waitingClients = Math.floor(Math.random() * 5) + 1;

  return {
    expertId: expert.id.toString(),
    totalSessions: expert.totalSessions,
    waitingClients,
    repeatClients: expert.repeatClients,
    avgRating: expert.avgRating,
    reviewCount: expert.reviewCount,
    likeCount,
    specialty: expert.specialty,
    ratingDistribution: {
      5: rating5,
      4: rating4,
      3: rating3,
      2: rating2,
      1: rating1
    },
    lastUpdated: new Date().toISOString(),
    // API에서 계산되는 값들은 초기값 설정
    rankingScore: 0,
    ranking: 0,
    level: 1 // 기본값 1, API에서 재계산됨
  };
});

// 분야별 전문가 통계
export const getStatsBySpecialty = (specialty: string) => {
  return dummyExpertStats.filter(stats => stats.specialty === specialty);
};

// 전체 통계 요약
export const getOverallStats = () => {
  const totalExperts = dummyExpertStats.length;
  const totalSessions = dummyExpertStats.reduce((sum, stats) => sum + stats.totalSessions, 0);
  const avgRating = dummyExpertStats.reduce((sum, stats) => sum + stats.avgRating, 0) / totalExperts;
  const totalReviews = dummyExpertStats.reduce((sum, stats) => sum + stats.reviewCount, 0);
  const totalLikes = dummyExpertStats.reduce((sum, stats) => sum + stats.likeCount, 0);

  return {
    totalExperts,
    totalSessions,
    averageRating: Math.round(avgRating * 10) / 10,
    totalReviews,
    totalLikes,
    lastUpdated: new Date().toISOString()
  };
};

// 전문가 ID로 통계 조회
export const getStatsByExpertId = (expertId: string) => {
  return dummyExpertStats.find(stats => stats.expertId === expertId);
};

// 랭킹 점수로 정렬된 통계 (API에서 계산된 값 사용)
export const getSortedStatsByRanking = () => {
  return [...dummyExpertStats].sort((a, b) => (b.rankingScore || 0) - (a.rankingScore || 0));
};

// 분야별 랭킹 (API에서 계산된 값 사용)
export const getSpecialtyRankings = (specialty: string) => {
  const specialtyStats = getStatsBySpecialty(specialty);
  return specialtyStats
    .sort((a, b) => (b.rankingScore || 0) - (a.rankingScore || 0))
    .map((stats, index) => ({
      ...stats,
      specialtyRanking: index + 1,
      specialtyTotalExperts: specialtyStats.length
    }));
};

// 랭킹 점수 계산 함수 (더 낮은 점수로 조정)
export const calculateRankingScore = (stats: ExpertStatsData): number => {
  // 1. 상담 횟수 (40% 가중치) - 점수 낮춤
  const sessionScore = Math.floor(stats.totalSessions * 0.3);
  
  // 2. 평점 (30% 가중치) - 점수 낮춤
  const ratingScore = Math.floor(stats.avgRating * 15);
  
  // 3. 리뷰 수 (15% 가중치) - 점수 낮춤
  const reviewScore = Math.floor(stats.reviewCount * 0.15);
  
  // 4. 재방문 고객 수 (10% 가중치) - 점수 낮춤
  const repeatScore = Math.floor(stats.repeatClients * 0.1);
  
  // 5. 좋아요 수 (5% 가중치) - 점수 낮춤
  const likeScore = Math.floor(stats.likeCount * 0.05);
  
  return Math.round((sessionScore + ratingScore + reviewScore + repeatScore + likeScore) * 100) / 100;
};

// 모든 전문가의 랭킹 점수 계산 및 업데이트 (레벨은 API에서 계산)
export const updateAllRankingScores = () => {
  return dummyExpertStats.map(stats => {
    const rankingScore = calculateRankingScore(stats);
    
    return {
      ...stats,
      rankingScore
      // level은 API에서 계산되어 제공됨
    };
  });
};
