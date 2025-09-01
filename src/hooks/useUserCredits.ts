import useSWR from 'swr';
import { swrKeys, invalidateCache } from '@/lib/swr-config';
import { useSWRConfig } from 'swr';

export interface UserCreditsData {
  totalCredits: number;
  aiChatCredits: {
    total: number;
    used: number;
    remaining: number;
    remainingPercent: number;
    lastResetDate: string;
  };
  purchasedCredits: {
    total: number;
    used: number;
    remaining: number;
    remainingPercent: number;
  };
  monthlyUsage: {
    currentMonth: string;
    totalUsed: number;
    breakdown: {
      aiChat: number;
      expertConsultation: number;
      other: number;
    };
  };
}

export interface UseUserCreditsOptions {
  refreshInterval?: number;
  enabled?: boolean;
}

export function useUserCredits(
  userId: string | null,
  options: UseUserCreditsOptions = {}
) {
  const {
    refreshInterval = 60000, // 1분마다 갱신
    enabled = true,
  } = options;

  const { mutate: globalMutate } = useSWRConfig();
  const shouldFetch = userId && enabled;
  const key = shouldFetch ? swrKeys.userCredits(userId) : null;

  const { data, error, mutate, isValidating } = useSWR(
    key,
    {
      refreshInterval,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      onError: (error) => {
        console.error('사용자 크레딧 데이터 로딩 실패:', error);
      },
    }
  );

  // 크레딧 사용 함수
  const useAICredits = async (amount: number) => {
    if (!userId) throw new Error('User ID is required');

    try {
      const response = await fetch('/api/user/credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          action: 'use_ai_credits',
          amount,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to use AI credits');
      }

      const result = await response.json();
      
      // 캐시 무효화하여 최신 데이터 가져오기
      invalidateCache.userCredits(globalMutate, userId);
      
      return result.data;
    } catch (error) {
      console.error('AI 크레딧 사용 실패:', error);
      throw error;
    }
  };

  // 구매 크레딧 추가 함수
  const addPurchasedCredits = async (amount: number) => {
    if (!userId) throw new Error('User ID is required');

    try {
      const response = await fetch('/api/user/credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          action: 'add_purchased_credits',
          amount,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add purchased credits');
      }

      const result = await response.json();
      
      // 캐시 무효화
      invalidateCache.userCredits(globalMutate, userId);
      
      return result.data;
    } catch (error) {
      console.error('구매 크레딧 추가 실패:', error);
      throw error;
    }
  };

  // 월간 크레딧 리셋 함수
  const resetMonthlyCredits = async () => {
    if (!userId) throw new Error('User ID is required');

    try {
      const response = await fetch('/api/user/credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          action: 'reset_monthly',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reset monthly credits');
      }

      const result = await response.json();
      
      // 캐시 무효화
      invalidateCache.userCredits(globalMutate, userId);
      
      return result.data;
    } catch (error) {
      console.error('월간 크레딧 리셋 실패:', error);
      throw error;
    }
  };

  return {
    creditsData: data as UserCreditsData | undefined,
    isLoading: !error && !data && shouldFetch,
    isError: error,
    isValidating,
    refresh: mutate,
    
    // 액션 함수들
    useAICredits,
    addPurchasedCredits,
    resetMonthlyCredits,
    
    // 편의 속성들
    totalCredits: data?.totalCredits || 0,
    aiChatCredits: data?.aiChatCredits || {
      total: 0,
      used: 0,
      remaining: 0,
      remainingPercent: 0,
      lastResetDate: '',
    },
    purchasedCredits: data?.purchasedCredits || {
      total: 0,
      used: 0,
      remaining: 0,
      remainingPercent: 0,
    },
    
    // 상태 체크
    hasError: !!error,
    errorMessage: error?.message || '크레딧 정보를 불러오는 중 오류가 발생했습니다.',
    
    // 크레딧 부족 여부 체크
    isAICreditsSufficient: (requiredAmount: number) => {
      return (data?.aiChatCredits.remaining || 0) >= requiredAmount;
    },
    
    isPurchasedCreditsSufficient: (requiredAmount: number) => {
      return (data?.purchasedCredits.remaining || 0) >= requiredAmount;
    },
  };
}

// AI 채팅 크레딧만 관리하는 간단한 훅
export function useAIChatCredits(userId: string | null) {
  const { creditsData, isLoading, isError, useAICredits, refresh } = useUserCredits(userId);
  
  return {
    aiChatCredits: creditsData?.aiChatCredits,
    remaining: creditsData?.aiChatCredits.remaining || 0,
    remainingPercent: creditsData?.aiChatCredits.remainingPercent || 0,
    isLoading,
    isError,
    useCredits: useAICredits,
    refresh,
    
    // 사용 가능 여부 체크
    canUse: (amount: number) => (creditsData?.aiChatCredits.remaining || 0) >= amount,
    
    // 월간 리셋 필요 여부 체크
    needsMonthlyReset: () => {
      if (!creditsData?.aiChatCredits.lastResetDate) return true;
      
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
      return creditsData.aiChatCredits.lastResetDate !== currentMonth;
    },
  };
}
