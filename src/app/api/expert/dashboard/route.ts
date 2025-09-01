import { NextRequest, NextResponse } from 'next/server';
import { getRequestsByExpert, getRequestStats } from '@/data/dummy/consultationRequests';
import { expertDataService } from '@/services/ExpertDataService';
import { getConsultationsByExpert } from '@/data/dummy/consultationHistory';

// 기간 타입 정의
type PeriodKey = "today" | "last7" | "last30" | "thisMonth" | "lastWeek";

interface ExpertDashboardData {
  profile: {
    id: number;
    name: string;
    specialty: string;
    level: number;
    pricePerMinute: number;
    totalSessions: number;
    avgRating: number;
    email?: string;
  };
  stats: {
    totalRequests: number;
    pendingRequests: number;
    acceptedRequests: number;
    completedRequests: number;
    rejectedRequests: number;
    urgentRequests: number;
    totalBudget: number;
    avgBudget: number;
    acceptanceRate: number;
  };
  consultations: {
    items: any[];
    revenue: {
      current: number;
      previous: number;
      change: number;
    };
    sessions: {
      current: number;
      previous: number;
      change: number;
    };
    avgOrder: {
      current: number;
      previous: number;
      change: number;
    };
  };
  requests: any[];
  todaySchedule: any[];
  recentActivities: any[];
  topTopics: Array<[string, { revenue: number; count: number }]>;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const expertIdParam = searchParams.get('expertId');
    const period = (searchParams.get('period') || 'lastWeek') as PeriodKey;

    if (!expertIdParam) {
      return NextResponse.json(
        { error: 'expertId parameter is required' },
        { status: 400 }
      );
    }

    const expertId = parseInt(expertIdParam);
    if (isNaN(expertId)) {
      return NextResponse.json(
        { error: 'Invalid expertId' },
        { status: 400 }
      );
    }

    // 전문가 프로필 정보 조회
    const expertProfile = expertDataService.getExpertProfileById(expertId);
    if (!expertProfile) {
      return NextResponse.json(
        { error: 'Expert not found' },
        { status: 404 }
      );
    }

    // 상담 요청 통계
    const requestStats = getRequestStats(expertId);
    const pendingRequests = getRequestsByExpert(expertId).filter(req => req.status === 'pending');

    // 상담 내역 조회
    const consultationHistory = getConsultationsByExpert(expertId);
    
    // 기간별 수익 계산
    const { currentRevenue, previousRevenue, currentSessions, previousSessions } = calculatePeriodStats(
      consultationHistory,
      period
    );

    // 오늘 일정
    const today = new Date();
    const todaySchedule = consultationHistory.filter(item => {
      const itemDate = new Date(item.createdAt);
      return item.status === 'completed' && 
             itemDate.toDateString() === today.toDateString();
    }).slice(0, 3);

    // 최근 활동
    const recentActivities = consultationHistory
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8)
      .map(item => ({
        ts: new Date(item.createdAt).getTime(),
        label: `상담 완료 · ${item.clientName} · ${item.topic}`,
      }));

    // 주제별 성과
    const topicMap = new Map<string, { revenue: number; count: number }>();
    consultationHistory.forEach((item) => {
      const key = (item.topic || "기타").split(" ")[0];
      const entry = topicMap.get(key) || { revenue: 0, count: 0 };
      entry.revenue += item.expertGrossKrw || 0;
      entry.count += 1;
      topicMap.set(key, entry);
    });
    const topTopics = Array.from(topicMap.entries())
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .slice(0, 3);

    const dashboardData: ExpertDashboardData = {
      profile: {
        id: expertProfile.id,
        name: expertProfile.name,
        specialty: expertProfile.specialty,
        level: expertProfile.level,
        pricePerMinute: expertProfile.pricePerMinute,
        totalSessions: expertProfile.totalSessions,
        avgRating: expertProfile.avgRating,
        email: expertProfile.contactInfo?.email,
      },
      stats: {
        totalRequests: requestStats.totalRequests,
        pendingRequests: requestStats.pendingRequests,
        acceptedRequests: requestStats.acceptedRequests,
        completedRequests: requestStats.completedRequests,
        rejectedRequests: requestStats.rejectedRequests,
        urgentRequests: requestStats.urgentRequests,
        totalBudget: requestStats.totalBudget,
        avgBudget: requestStats.avgBudget,
        acceptanceRate: requestStats.acceptanceRate,
      },
      consultations: {
        items: consultationHistory,
        revenue: {
          current: currentRevenue,
          previous: previousRevenue,
          change: calculatePercentChange(currentRevenue, previousRevenue),
        },
        sessions: {
          current: currentSessions,
          previous: previousSessions,
          change: calculatePercentChange(currentSessions, previousSessions),
        },
        avgOrder: {
          current: currentSessions > 0 ? Math.round(currentRevenue / currentSessions) : 0,
          previous: previousSessions > 0 ? Math.round(previousRevenue / previousSessions) : 0,
          change: 0, // 계산됨
        },
      },
      requests: pendingRequests.slice(0, 5),
      todaySchedule,
      recentActivities,
      topTopics,
    };

    // avgOrder change 계산
    dashboardData.consultations.avgOrder.change = calculatePercentChange(
      dashboardData.consultations.avgOrder.current,
      dashboardData.consultations.avgOrder.previous
    );

    return NextResponse.json({
      success: true,
      data: dashboardData,
      period,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Expert dashboard API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 기간별 통계 계산 헬퍼 함수
function calculatePeriodStats(consultations: any[], period: PeriodKey) {
  const now = new Date();
  const { start: currentStart, end: currentEnd } = getDateRange(period, now);
  
  const windowDays = Math.max(
    1,
    Math.round((currentEnd.getTime() - currentStart.getTime()) / (24 * 60 * 60 * 1000)) + 1
  );
  
  const prevStart = new Date(currentStart);
  const prevEnd = new Date(currentStart);
  prevStart.setDate(currentStart.getDate() - windowDays);
  prevEnd.setDate(currentStart.getDate() - 1);

  const currentPeriodItems = consultations.filter(item => 
    item.status === 'completed' && inDateRange(item.createdAt, currentStart, currentEnd)
  );
  
  const previousPeriodItems = consultations.filter(item => 
    item.status === 'completed' && inDateRange(item.createdAt, prevStart, prevEnd)
  );

  return {
    currentRevenue: currentPeriodItems.reduce((sum, item) => sum + (item.expertGrossKrw || 0), 0),
    previousRevenue: previousPeriodItems.reduce((sum, item) => sum + (item.expertGrossKrw || 0), 0),
    currentSessions: currentPeriodItems.length,
    previousSessions: previousPeriodItems.length,
  };
}

// 날짜 범위 계산
function getDateRange(period: PeriodKey, now: Date): { start: Date; end: Date } {
  switch (period) {
    case "today":
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return { start: today, end: now };
    
    case "last7":
      const last7Start = new Date(now);
      last7Start.setDate(now.getDate() - 6);
      return { start: last7Start, end: now };
    
    case "last30":
      const last30Start = new Date(now);
      last30Start.setDate(now.getDate() - 29);
      return { start: last30Start, end: now };
    
    case "thisMonth":
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return { start: monthStart, end: monthEnd };
    
    case "lastWeek":
    default:
      const weekEnd = new Date(now);
      weekEnd.setDate(now.getDate() - 1);
      const weekStart = new Date(weekEnd);
      weekStart.setDate(weekEnd.getDate() - 6);
      return { start: weekStart, end: weekEnd };
  }
}

// 날짜 범위 체크
function inDateRange(dateString: string, start: Date, end: Date): boolean {
  const date = new Date(dateString);
  return date >= start && date <= end;
}

// 퍼센트 변화 계산
function calculatePercentChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}
