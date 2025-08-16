// 더미 통계 데이터
// TODO: 실제 API 연동 시 이 파일을 삭제하세요

import { PlatformStats } from "@/types";

// 초기 플랫폼 통계 데이터
export const dummyInitialStats: PlatformStats = {
  totalConsultations: 6000,
  averageMatchingTimeMinutes: 10,
  totalExperts: 300,
  totalUsers: 10000,
  lastUpdated: new Date(),
};

// 추가 통계 데이터 (필요시 사용)
export const dummyExtendedStats = {
  // 카테고리별 통계
  categoryStats: [
    { category: "심리상담", consultations: 1250, experts: 45, avgRating: 4.8 },
    { category: "진로상담", consultations: 980, experts: 32, avgRating: 4.7 },
    { category: "법률상담", consultations: 750, experts: 28, avgRating: 4.9 },
    { category: "재무상담", consultations: 650, experts: 25, avgRating: 4.6 },
    { category: "창업상담", consultations: 420, experts: 18, avgRating: 4.5 },
    { category: "건강상담", consultations: 380, experts: 22, avgRating: 4.7 },
  ],
  
  // 월별 성장 데이터
  monthlyGrowth: [
    { month: "2024-01", users: 8500, consultations: 4200, experts: 250 },
    { month: "2024-02", users: 9100, consultations: 4800, experts: 265 },
    { month: "2024-03", users: 9600, consultations: 5200, experts: 280 },
    { month: "2024-04", users: 10000, consultations: 6000, experts: 300 },
  ],
  
  // 시간대별 활동 통계
  hourlyActivity: [
    { hour: 9, consultations: 120 },
    { hour: 10, consultations: 180 },
    { hour: 11, consultations: 220 },
    { hour: 14, consultations: 250 },
    { hour: 15, consultations: 280 },
    { hour: 16, consultations: 240 },
    { hour: 19, consultations: 200 },
    { hour: 20, consultations: 160 },
  ],
  
  // 사용자 만족도 통계
  satisfactionStats: {
    averageRating: 4.7,
    responseRate: 96.5,
    completionRate: 94.2,
    repeatUserRate: 78.3,
  },
};
