/**
 * 전문가 레벨 시스템 유틸리티
 * 레벨 기반 과금 체계 (Lv.1-999)
 * 1크레딧 = 10원 기준
 */

// 레벨별 과금 체계 정의
export const LEVELS = [
  {
    name: "Tier 10 (Lv.999)",
    levelRange: { min: 999, max: 999 },
    creditsPerMinute: 600, // 6,000원/분 = 600크레딧/분 (특별 최고 요금)
    color: "from-red-500 to-pink-600",
    bgColor: "bg-gradient-to-r from-red-100 to-pink-100",
    textColor: "text-red-700",
    borderColor: "border-red-500",
  },
  {
    name: "Tier 10 (Lv.900-998)",
    levelRange: { min: 900, max: 998 },
    creditsPerMinute: 500, // 5,000원/분 = 500크레딧/분 (고정 요금)
    color: "from-purple-500 to-indigo-600",
    bgColor: "bg-gradient-to-r from-purple-100 to-indigo-100",
    textColor: "text-purple-700",
    borderColor: "border-purple-500",
  },
  {
    name: "Tier 9 (Lv.800-899)",
    levelRange: { min: 800, max: 899 },
    creditsPerMinute: 500, // 5,000원/분 = 500크레딧/분
    color: "from-indigo-500 to-blue-600",
    bgColor: "bg-gradient-to-r from-indigo-100 to-blue-100",
    textColor: "text-indigo-700",
    borderColor: "border-indigo-500",
  },
  {
    name: "Tier 8 (Lv.700-799)",
    levelRange: { min: 700, max: 799 },
    creditsPerMinute: 450, // 4,500원/분 = 450크레딧/분
    color: "from-blue-500 to-cyan-600",
    bgColor: "bg-gradient-to-r from-blue-100 to-cyan-100",
    textColor: "text-blue-700",
    borderColor: "border-blue-500",
  },
  {
    name: "Tier 7 (Lv.600-699)",
    levelRange: { min: 600, max: 699 },
    creditsPerMinute: 400, // 4,000원/분 = 400크레딧/분
    color: "from-cyan-500 to-teal-600",
    bgColor: "bg-gradient-to-r from-cyan-100 to-teal-100",
    textColor: "text-cyan-700",
    borderColor: "border-cyan-500",
  },
  {
    name: "Tier 6 (Lv.500-599)",
    levelRange: { min: 500, max: 599 },
    creditsPerMinute: 350, // 3,500원/분 = 350크레딧/분
    color: "from-teal-500 to-green-600",
    bgColor: "bg-gradient-to-r from-teal-100 to-green-100",
    textColor: "text-teal-700",
    borderColor: "border-teal-500",
  },
  {
    name: "Tier 5 (Lv.400-499)",
    levelRange: { min: 400, max: 499 },
    creditsPerMinute: 300, // 3,000원/분 = 300크레딧/분
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-gradient-to-r from-green-100 to-emerald-100",
    textColor: "text-green-700",
    borderColor: "border-green-500",
  },
  {
    name: "Tier 4 (Lv.300-399)",
    levelRange: { min: 300, max: 399 },
    creditsPerMinute: 250, // 2,500원/분 = 250크레딧/분
    color: "from-emerald-500 to-lime-600",
    bgColor: "bg-gradient-to-r from-emerald-100 to-lime-100",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-500",
  },
  {
    name: "Tier 3 (Lv.200-299)",
    levelRange: { min: 200, max: 299 },
    creditsPerMinute: 200, // 2,000원/분 = 200크레딧/분
    color: "from-lime-500 to-yellow-600",
    bgColor: "bg-gradient-to-r from-lime-100 to-yellow-100",
    textColor: "text-lime-700",
    borderColor: "border-lime-500",
  },
  {
    name: "Tier 2 (Lv.100-199)",
    levelRange: { min: 100, max: 199 },
    creditsPerMinute: 150, // 1,500원/분 = 150크레딧/분
    color: "from-yellow-500 to-orange-600",
    bgColor: "bg-gradient-to-r from-yellow-100 to-orange-100",
    textColor: "text-yellow-700",
    borderColor: "border-yellow-500",
  },
  {
    name: "Tier 1 (Lv.1-99)",
    levelRange: { min: 1, max: 99 },
    creditsPerMinute: 100, // 1,000원/분 = 100크레딧/분 (최저 요금)
    color: "from-orange-500 to-red-600",
    bgColor: "bg-gradient-to-r from-orange-100 to-red-100",
    textColor: "text-orange-700",
    borderColor: "border-orange-500",
  },
];

/**
 * 레벨에 따른 과금을 계산합니다.
 * @param {number} level - 전문가 레벨 (1-999)
 * @returns {number} 분당 크레딧 요금
 */
export const calculateCreditsByLevel = (level = 1) => {
  const tier = LEVELS.find(
    (l) => level >= l.levelRange.min && level <= l.levelRange.max
  );
  return tier
    ? tier.creditsPerMinute
    : LEVELS[LEVELS.length - 1].creditsPerMinute;
};

/**
 * 레벨에 따른 티어 정보를 반환합니다.
 * @param {number} level - 전문가 레벨 (1-999)
 * @returns {Object} 티어 정보 객체
 */
export const getTierInfo = (level = 1) => {
  const tier = LEVELS.find(
    (l) => level >= l.levelRange.min && level <= l.levelRange.max
  );
  return tier || LEVELS[LEVELS.length - 1];
};

/**
 * 레벨명으로 티어 정보를 가져옵니다.
 * @param {string} tierName - 티어명
 * @returns {Object} 티어 정보 객체
 */
export const getTierInfoByName = (tierName) => {
  return LEVELS.find((l) => l.name === tierName) || LEVELS[LEVELS.length - 1];
};

/**
 * 다음 티어까지의 진행률을 계산합니다.
 * @param {number} level - 현재 레벨
 * @returns {Object} 진행률 정보
 */
export const getNextTierProgress = (level = 1) => {
  const currentTier = getTierInfo(level);
  const currentTierIndex = LEVELS.findIndex((l) => l.name === currentTier.name);

  // 이미 최고 티어인 경우
  if (currentTierIndex === 0) {
    return {
      isMaxTier: true,
      progress: 100,
      nextTier: null,
      levelsNeeded: 0,
    };
  }

  const nextTier = LEVELS[currentTierIndex - 1];
  const currentTierMaxLevel = currentTier.levelRange.max;
  const nextTierMinLevel = nextTier.levelRange.min;

  const progress = Math.min(
    100,
    ((level - currentTier.levelRange.min) /
      (currentTierMaxLevel - currentTier.levelRange.min)) *
      100
  );

  return {
    isMaxTier: false,
    progress: Math.round(progress),
    nextTier,
    levelsNeeded: Math.max(0, nextTierMinLevel - level),
    currentTierMaxLevel,
    nextTierMinLevel,
  };
};

/**
 * 티어 배지 컴포넌트에 필요한 스타일 정보를 반환합니다.
 * @param {number} level - 레벨
 * @returns {Object} 스타일 정보
 */
export const getTierBadgeStyles = (level) => {
  const tier = getTierInfo(level);
  return {
    gradient: tier.color,
    background: tier.bgColor,
    textColor: tier.textColor,
    borderColor: tier.borderColor,
  };
};

/**
 * 레벨별 요금 정보를 반환합니다.
 * @param {number} level - 레벨
 * @returns {Object} 요금 정보
 */
export const getLevelPricing = (level) => {
  const tier = getTierInfo(level);
  return {
    creditsPerMinute: tier.creditsPerMinute,
    creditsPerHour: tier.creditsPerMinute * 60,
    tierName: tier.name,
  };
};

/**
 * 전문가 레벨 시스템의 전체 통계를 계산합니다.
 * @param {Array} experts - 전문가 목록
 * @returns {Object} 티어별 통계
 */
export const calculateTierStatistics = (experts = []) => {
  const stats = LEVELS.reduce((acc, tier) => {
    acc[tier.name] = { count: 0, percentage: 0 };
    return acc;
  }, {});

  experts.forEach((expert) => {
    const tier = getTierInfo(expert.level || 1);
    stats[tier.name].count++;
  });

  const total = experts.length;
  if (total > 0) {
    Object.keys(stats).forEach((tierName) => {
      stats[tierName].percentage = Math.round(
        (stats[tierName].count / total) * 100
      );
    });
  }

  return stats;
};

/**
 * 한국어 티어명을 반환합니다.
 * @param {string} tierName - 영문 티어명
 * @returns {string} 한국어 티어명
 */
export const getKoreanTierName = (tierName) => {
  const tierMap = {
    "Tier 10 (Lv.999)": "티어 10 (Lv.999)",
    "Tier 10 (Lv.900-998)": "티어 10 (Lv.900-998)",
    "Tier 9 (Lv.800-899)": "티어 9 (Lv.800-899)",
    "Tier 8 (Lv.700-799)": "티어 8 (Lv.700-799)",
    "Tier 7 (Lv.600-699)": "티어 7 (Lv.600-699)",
    "Tier 6 (Lv.500-599)": "티어 6 (Lv.500-599)",
    "Tier 5 (Lv.400-499)": "티어 5 (Lv.400-499)",
    "Tier 4 (Lv.300-399)": "티어 4 (Lv.300-399)",
    "Tier 3 (Lv.200-299)": "티어 3 (Lv.200-299)",
    "Tier 2 (Lv.100-199)": "티어 2 (Lv.100-199)",
    "Tier 1 (Lv.1-99)": "티어 1 (Lv.1-99)",
  };
  return tierMap[tierName] || tierName;
};

// 기존 함수명과의 호환성을 위한 별칭
export const calculateExpertLevel = (totalSessions = 0, avgRating = 0) => {
  // 레벨 계산 로직 (세션 수와 평점을 기반으로 레벨 계산)
  const level = Math.min(
    999,
    Math.max(1, Math.floor(totalSessions / 10) + Math.floor(avgRating * 10))
  );
  return getTierInfo(level);
};

export const getLevelInfo = (levelName) => {
  return getTierInfoByName(levelName);
};

export const calculateCreditsPerMinute = (expert) => {
  const level = expert.level || 1;
  return calculateCreditsByLevel(level);
};

export const getNextLevelProgress = (totalSessions = 0, avgRating = 0) => {
  const level = Math.min(
    999,
    Math.max(1, Math.floor(totalSessions / 10) + Math.floor(avgRating * 10))
  );
  return getNextTierProgress(level);
};

export const getLevelBadgeStyles = (levelName) => {
  const tier = getTierInfoByName(levelName);
  return {
    gradient: tier.color,
    background: tier.bgColor,
    textColor: tier.textColor,
    borderColor: tier.borderColor,
  };
};

export const calculateLevelStatistics = (experts = []) => {
  return calculateTierStatistics(experts);
};

export const getKoreanLevelName = (levelName) => {
  return getKoreanTierName(levelName);
};
