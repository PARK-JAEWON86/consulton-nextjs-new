/**
 * 전문가 레벨 관련 유틸리티 함수들
 */

/**
 * 레벨별 분당 크레딧 계산 함수
 * @param level 전문가 레벨 (1-999)
 * @returns 분당 크레딧 수
 */
export const calculateCreditsByLevel = (level: number = 1): number => {
  // 레벨 범위 제한
  const clampedLevel = Math.max(1, Math.min(999, level));
  
  // 기본 크레딧: 50 크레딧/분
  const baseCredits = 50;
  
  // 레벨당 추가 크레딧: 레벨 * 25
  const levelBonus = clampedLevel * 25;
  
  return baseCredits + levelBonus;
};

/**
 * 전문가 레벨 계산 함수
 * @param totalSessions 총 상담 세션 수
 * @param avgRating 평균 평점
 * @param reviewCount 리뷰 수
 * @returns 계산된 레벨 (1-999)
 */
export const calculateExpertLevel = (
  totalSessions: number = 0,
  avgRating: number = 0,
  reviewCount: number = 0
): number => {
  // 세션 점수: 세션당 10점
  const sessionScore = totalSessions * 10;
  
  // 평점 점수: 평점 * 20
  const ratingScore = avgRating * 20;
  
  // 리뷰 점수: 리뷰당 0.5점
  const reviewScore = reviewCount * 0.5;
  
  // 총 점수를 레벨로 변환
  const totalScore = sessionScore + ratingScore + reviewScore;
  const calculatedLevel = Math.floor(totalScore / 10);
  
  // 레벨 범위 제한 (1-999)
  return Math.max(1, Math.min(999, calculatedLevel));
};

/**
 * 레벨별 티어 정보 반환
 * @param level 전문가 레벨
 * @returns 티어 정보
 */
export const getTierInfo = (level: number) => {
  if (level >= 800) {
    return {
      tier: "Master",
      name: "마스터",
      color: "purple",
      description: "최고 수준의 전문가"
    };
  } else if (level >= 600) {
    return {
      tier: "Expert",
      name: "전문가",
      color: "red",
      description: "높은 수준의 전문가"
    };
  } else if (level >= 400) {
    return {
      tier: "Senior",
      name: "시니어",
      color: "orange",
      description: "경험 많은 전문가"
    };
  } else if (level >= 200) {
    return {
      tier: "Intermediate",
      name: "중급",
      color: "yellow",
      description: "중간 수준의 전문가"
    };
  } else if (level >= 100) {
    return {
      tier: "Junior",
      name: "주니어",
      color: "green",
      description: "초급 전문가"
    };
  } else {
    return {
      tier: "Beginner",
      name: "신입",
      color: "blue",
      description: "신규 전문가"
    };
  }
};

/**
 * 레벨별 색상 클래스 반환
 * @param level 전문가 레벨
 * @returns Tailwind CSS 색상 클래스
 */
export const getLevelColorClass = (level: number): string => {
  if (level >= 800) return "bg-purple-500";
  if (level >= 600) return "bg-red-500";
  if (level >= 400) return "bg-orange-500";
  if (level >= 200) return "bg-yellow-500";
  if (level >= 100) return "bg-green-500";
  return "bg-blue-500";
};

/**
 * 레벨별 티어 이름 반환
 * @param level 전문가 레벨
 * @returns 티어 이름
 */
export const getTierName = (level: number): string => {
  if (level >= 800) return "Tier 6 (Lv.800-999)";
  if (level >= 600) return "Tier 5 (Lv.600-799)";
  if (level >= 400) return "Tier 4 (Lv.400-599)";
  if (level >= 200) return "Tier 3 (Lv.200-399)";
  if (level >= 100) return "Tier 2 (Lv.100-199)";
  return "Tier 1 (Lv.1-99)";
};
