import useSWR from 'swr';
import { swrKeys } from '@/lib/swr-config';

export interface ExpertDashboardData {
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

export interface UseExpertDashboardOptions {
  refreshInterval?: number;
  revalidateOnFocus?: boolean;
  enabled?: boolean;
}

export function useExpertDashboard(
  expertId: number | null,
  period: string = 'lastWeek',
  options: UseExpertDashboardOptions = {}
) {
  const {
    refreshInterval = 30000, // 30초마다 자동 갱신
    revalidateOnFocus = true,
    enabled = true,
  } = options;

  const shouldFetch = expertId && enabled;
  const key = shouldFetch ? swrKeys.expertDashboard(expertId, period) : null;

  const { data, error, mutate, isValidating } = useSWR(
    key,
    {
      refreshInterval,
      revalidateOnFocus,
      revalidateOnReconnect: true,
      dedupingInterval: 5000, // 5초 내 중복 요청 방지
      onError: (error) => {
        console.error('전문가 대시보드 데이터 로딩 실패:', error);
      },
    }
  );

  return {
    dashboardData: data as ExpertDashboardData | undefined,
    isLoading: !error && !data && shouldFetch,
    isError: error,
    isValidating,
    refresh: mutate,
    
    // 편의 메서드들
    refreshStats: () => mutate(),
    
    // 특정 섹션만 새로고침
    refreshRequests: () => {
      // 실제로는 개별 API 호출이 있다면 해당 키만 무효화
      mutate();
    },
    
    // 에러 상태 체크
    hasError: !!error,
    errorMessage: error?.message || '데이터를 불러오는 중 오류가 발생했습니다.',
  };
}

// 전문가 대시보드 통계만 가져오는 훅
export function useExpertStats(expertId: number | null, period: string = 'lastWeek') {
  const { dashboardData, isLoading, isError, refresh } = useExpertDashboard(expertId, period);
  
  return {
    stats: dashboardData?.stats,
    revenue: dashboardData?.consultations.revenue,
    sessions: dashboardData?.consultations.sessions,
    avgOrder: dashboardData?.consultations.avgOrder,
    isLoading,
    isError,
    refresh,
  };
}

// 전문가 요청 목록만 가져오는 훅
export function useExpertRequests(expertId: number | null) {
  const { dashboardData, isLoading, isError, refresh } = useExpertDashboard(expertId, 'lastWeek', {
    refreshInterval: 10000, // 요청은 더 자주 갱신 (10초)
  });
  
  return {
    requests: dashboardData?.requests || [],
    pendingCount: dashboardData?.stats.pendingRequests || 0,
    urgentCount: dashboardData?.stats.urgentRequests || 0,
    isLoading,
    isError,
    refresh,
  };
}

// 오늘 일정만 가져오는 훅
export function useExpertTodaySchedule(expertId: number | null) {
  const { dashboardData, isLoading, isError, refresh } = useExpertDashboard(expertId);
  
  return {
    todaySchedule: dashboardData?.todaySchedule || [],
    hasSchedule: (dashboardData?.todaySchedule?.length || 0) > 0,
    scheduleCount: dashboardData?.todaySchedule?.length || 0,
    isLoading,
    isError,
    refresh,
  };
}
