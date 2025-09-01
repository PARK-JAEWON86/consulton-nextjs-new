import { useState, useEffect, useCallback } from 'react';
import { ConsultationItem } from '@/app/api/consultations/route';

interface ConsultationsResponse {
  consultations: ConsultationItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    status?: string;
    period?: string;
    method?: string;
  };
}

interface UseConsultationsParams {
  expertId?: number;
  clientId?: string;
  status?: string;
  method?: string;
  period?: string;
  page?: number;
  limit?: number;
}

interface UseConsultationsOptions {
  refreshInterval?: number;
  enabled?: boolean;
}

export function useConsultations(
  params: UseConsultationsParams = {},
  options: UseConsultationsOptions = {}
) {
  const {
    refreshInterval = 30000, // 30초마다 갱신
    enabled = true,
  } = options;

  const [data, setData] = useState<ConsultationsResponse | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const shouldFetch = (params.expertId || params.clientId) && enabled;

  // 데이터 로드 함수
  const loadData = useCallback(async () => {
    if (!shouldFetch) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const searchParams = new URLSearchParams();
      if (params.expertId) searchParams.append('expertId', params.expertId.toString());
      if (params.clientId) searchParams.append('clientId', params.clientId);
      if (params.status) searchParams.append('status', params.status);
      if (params.method) searchParams.append('method', params.method);
      if (params.period) searchParams.append('period', params.period);
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.limit) searchParams.append('limit', params.limit.toString());

      const response = await fetch(`/api/consultations?${searchParams.toString()}`);
      const result = await response.json();

      if (result.success) {
        const consultationsData: ConsultationsResponse = {
          consultations: result.data?.items || [],
          pagination: {
            page: 1,
            limit: 10,
            total: result.data?.total || 0,
            totalPages: Math.ceil((result.data?.total || 0) / 10),
          },
          filters: {
            status: params.status,
            period: params.period,
            method: params.method,
          },
        };
        setData(consultationsData);
      } else {
        throw new Error(result.error || '데이터 로드 실패');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('알 수 없는 오류'));
      console.error('상담 내역 데이터 로딩 실패:', err);
    } finally {
      setIsLoading(false);
    }
  }, [shouldFetch, params]);

  // 초기 로드
  useEffect(() => {
    loadData();
  }, [loadData]);

  // 주기적 갱신
  useEffect(() => {
    if (!shouldFetch || refreshInterval <= 0) return;

    const interval = setInterval(() => {
      setIsValidating(true);
      loadData().finally(() => setIsValidating(false));
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [shouldFetch, refreshInterval, loadData]);

  // 새 상담 생성 함수
  const createConsultation = async (consultationData: {
    expertId: number;
    clientId: string;
    topic: string;
    method: 'chat' | 'video' | 'voice' | 'call';
    duration?: number;
    amount: number;
    scheduledDate?: string;
    notes?: string;
  }) => {
    try {
      const response = await fetch('/api/consultations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(consultationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create consultation');
      }

      const result = await response.json();
      
      // 데이터 새로고침
      await loadData();
      
      return result.data;
    } catch (error) {
      console.error('상담 생성 실패:', error);
      throw error;
    }
  };

  // 상담 업데이트 함수
  const updateConsultation = async (consultationId: string, updates: Partial<ConsultationItem>) => {
    try {
      const response = await fetch('/api/consultations', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          consultationId,
          updates,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update consultation');
      }

      const result = await response.json();
      
      // 데이터 새로고침
      await loadData();
      
      return result.data;
    } catch (error) {
      console.error('상담 업데이트 실패:', error);
      throw error;
    }
  };

  // 상담 완료 처리
  const completeConsultation = async (consultationId: string, completionData: {
    duration?: number;
    summary?: string;
    notes?: string;
    rating?: number;
  }) => {
    return updateConsultation(consultationId, {
      status: 'completed',
      ...completionData,
    });
  };

  // 상담 취소 처리
  const cancelConsultation = async (consultationId: string, reason?: string) => {
    return updateConsultation(consultationId, {
      status: 'canceled',
      notes: reason ? `취소 사유: ${reason}` : '상담이 취소되었습니다.',
    });
  };

  return {
    consultationsData: data,
    consultations: data?.consultations || [],
    pagination: data?.pagination,
    filters: data?.filters,
    
    isLoading,
    isError: !!error,
    isValidating,
    refresh: loadData,
    
    // 액션 함수들
    createConsultation,
    updateConsultation,
    completeConsultation,
    cancelConsultation,
    
    // 편의 속성들
    totalCount: data?.pagination.total || 0,
    hasMore: data ? data.pagination.page < data.pagination.totalPages : false,
    currentPage: data?.pagination.page || 1,
    totalPages: data?.pagination.totalPages || 0,
    
    // 상태별 필터링된 데이터
    completedConsultations: data?.consultations.filter((c: ConsultationItem) => c.status === 'completed') || [],
    scheduledConsultations: data?.consultations.filter((c: ConsultationItem) => c.status === 'scheduled') || [],
    canceledConsultations: data?.consultations.filter((c: ConsultationItem) => c.status === 'canceled') || [],
    
    // 통계
    totalRevenue: data?.consultations.reduce((sum: number, c: ConsultationItem) => sum + (c.amount || 0), 0) || 0,
    avgRating: (() => {
      const ratingsData = data?.consultations.filter((c: ConsultationItem) => c.rating) || [];
      if (ratingsData.length === 0) return 0;
      return ratingsData.reduce((sum: number, c: ConsultationItem) => sum + (c.rating || 0), 0) / ratingsData.length;
    })(),
    
    // 에러 상태
    hasError: !!error,
    errorMessage: error?.message || '상담 내역을 불러오는 중 오류가 발생했습니다.',
  };
}

// 전문가용 상담 내역 훅 (간소화)
export function useExpertConsultations(
  expertId: number | null,
  options: {
    status?: string;
    period?: string;
    page?: number;
    limit?: number;
  } = {}
) {
  const params = expertId ? { expertId, ...options } : {};
  
  return useConsultations(params, {
    enabled: !!expertId,
    refreshInterval: 30000,
  });
}

// 클라이언트용 상담 내역 훅 (간소화)
export function useClientConsultations(
  clientId: string | null,
  options: {
    status?: string;
    period?: string;
    page?: number;
    limit?: number;
  } = {}
) {
  const params = clientId ? { clientId, ...options } : {};
  
  return useConsultations(params, {
    enabled: !!clientId,
    refreshInterval: 60000, // 클라이언트는 덜 자주 갱신
  });
}

// 오늘 예정된 상담만 가져오는 훅
export function useTodayConsultations(expertId: number | null) {
  return useConsultations(
    expertId ? {
      expertId,
      status: 'scheduled',
      period: 'today',
      limit: 50,
    } : {},
    {
      enabled: !!expertId,
      refreshInterval: 10000, // 10초마다 갱신 (실시간성 중요)
    }
  );
}
