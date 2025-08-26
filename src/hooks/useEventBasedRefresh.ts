import { useEffect, useCallback, useRef } from 'react';
import { eventBus, CREDIT_EVENTS, USER_EVENTS, CHAT_EVENTS } from '@/utils/eventBus';

// 이벤트 기반 새로고침을 위한 커스텀 훅
export function useEventBasedRefresh() {
  const refreshFunctions = useRef<Map<string, () => Promise<void>>>(new Map());

  // 새로고침 함수 등록
  const registerRefreshFunction = useCallback((event: string, refreshFn: () => Promise<void>) => {
    refreshFunctions.current.set(event, refreshFn);
  }, []);

  // 특정 이벤트에 대한 새로고침 함수 등록 해제
  const unregisterRefreshFunction = useCallback((event: string) => {
    refreshFunctions.current.delete(event);
  }, []);

  // 모든 새로고침 함수 등록 해제
  const unregisterAllRefreshFunctions = useCallback(() => {
    refreshFunctions.current.clear();
  }, []);

  // 이벤트 리스너 설정
  useEffect(() => {
    const eventHandlers: Array<{ event: string; handler: () => void }> = [];

    // 크레딧 관련 이벤트
    Object.values(CREDIT_EVENTS).forEach(event => {
      const handler = async () => {
        const refreshFn = refreshFunctions.current.get(event);
        if (refreshFn) {
          try {
            await refreshFn();
          } catch (error) {
            console.error(`${event} 이벤트 처리 중 오류:`, error);
          }
        }
      };
      
      eventBus.subscribe(event, handler);
      eventHandlers.push({ event, handler });
    });

    // 사용자 관련 이벤트
    Object.values(USER_EVENTS).forEach(event => {
      const handler = async () => {
        const refreshFn = refreshFunctions.current.get(event);
        if (refreshFn) {
          try {
            await refreshFn();
          } catch (error) {
            console.error(`${event} 이벤트 처리 중 오류:`, error);
          }
        }
      };
      
      eventBus.subscribe(event, handler);
      eventHandlers.push({ event, handler });
    });

    // 채팅 관련 이벤트
    Object.values(CHAT_EVENTS).forEach(event => {
      const handler = async () => {
        const refreshFn = refreshFunctions.current.get(event);
        if (refreshFn) {
          try {
            await refreshFn();
          } catch (error) {
            console.error(`${event} 이벤트 처리 중 오류:`, error);
          }
        }
      };
      
      eventBus.subscribe(event, handler);
      eventHandlers.push({ event, handler });
    });

    // 클린업: 이벤트 구독 해제
    return () => {
      eventHandlers.forEach(({ event, handler }) => {
        eventBus.unsubscribe(event, handler);
      });
    };
  }, []);

  // 컴포넌트 언마운트 시 모든 새로고침 함수 정리
  useEffect(() => {
    return () => {
      unregisterAllRefreshFunctions();
    };
  }, [unregisterAllRefreshFunctions]);

  return {
    registerRefreshFunction,
    unregisterRefreshFunction,
    unregisterAllRefreshFunctions
  };
}

// 특정 이벤트에 대한 새로고침 훅
export function useSpecificEventRefresh(event: string) {
  const refreshFunctions = useRef<Map<string, () => Promise<void>>>(new Map());

  const registerRefreshFunction = useCallback((refreshFn: () => Promise<void>) => {
    refreshFunctions.current.set(event, refreshFn);
  }, [event]);

  const unregisterRefreshFunction = useCallback(() => {
    refreshFunctions.current.delete(event);
  }, [event]);

  useEffect(() => {
    const handler = async () => {
      const refreshFn = refreshFunctions.current.get(event);
      if (refreshFn) {
        try {
          await refreshFn();
        } catch (error) {
          console.error(`${event} 이벤트 처리 중 오류:`, error);
        }
      }
    };

    eventBus.subscribe(event, handler);

    return () => {
      eventBus.unsubscribe(event, handler);
      unregisterRefreshFunction();
    };
  }, [event, unregisterRefreshFunction]);

  return {
    registerRefreshFunction,
    unregisterRefreshFunction
  };
}
