"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { PlatformStats, StatsUpdate, MatchingRecord } from "@/types";
import { dummyInitialStats } from "@/data/dummy";

interface StatsStore {
  // 상태
  stats: PlatformStats;
  matchingRecords: MatchingRecord[];
  isLoading: boolean;
  error: string | null;

  // 액션
  updateStats: (update: StatsUpdate) => void;
  recordMatching: (userId: string, expertId: string, matchingTimeMinutes: number) => void;
  completeConsultation: () => void;
  registerExpert: () => void;
  registerUser: () => void;
  calculateAverageMatchingTime: () => void;
  resetStats: () => void;
  loadStats: () => Promise<void>;
  saveStats: () => Promise<void>;
}

const initialStats: PlatformStats = dummyInitialStats;

export const useStatsStore = create<StatsStore>()(
  persist(
    (set, get) => ({
      // 초기 상태
      stats: initialStats,
      matchingRecords: [],
      isLoading: false,
      error: null,

      // 통계 업데이트
      updateStats: (update: StatsUpdate) => {
        set((state) => {
          const newStats = { ...state.stats };

          switch (update.type) {
            case 'consultation_completed':
              newStats.totalConsultations += 1;
              break;
            case 'expert_registered':
              newStats.totalExperts += 1;
              break;
            case 'user_registered':
              newStats.totalUsers += 1;
              break;
            case 'matching_time_recorded':
              if (update.data?.matchingTimeMinutes) {
                // 평균 매칭 시간 재계산은 별도 함수에서 처리
              }
              break;
          }

          newStats.lastUpdated = new Date();

          return {
            ...state,
            stats: newStats,
          };
        });
      },

      // 매칭 기록 저장
      recordMatching: (userId: string, expertId: string, matchingTimeMinutes: number) => {
        const newRecord: MatchingRecord = {
          id: `matching_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId,
          expertId,
          matchingTimeMinutes,
          createdAt: new Date(),
        };

        set((state) => ({
          ...state,
          matchingRecords: [...state.matchingRecords, newRecord],
        }));

        // 평균 매칭 시간 재계산
        get().calculateAverageMatchingTime();
      },

      // 상담 완료
      completeConsultation: () => {
        get().updateStats({ type: 'consultation_completed' });
      },

      // 전문가 등록
      registerExpert: () => {
        get().updateStats({ type: 'expert_registered' });
      },

      // 사용자 등록
      registerUser: () => {
        get().updateStats({ type: 'user_registered' });
      },

      // 평균 매칭 시간 계산
      calculateAverageMatchingTime: () => {
        set((state) => {
          if (state.matchingRecords.length === 0) {
            return state;
          }

          const totalTime = state.matchingRecords.reduce(
            (sum, record) => sum + record.matchingTimeMinutes,
            0
          );
          const averageTime = Math.round(totalTime / state.matchingRecords.length);

          return {
            ...state,
            stats: {
              ...state.stats,
              averageMatchingTimeMinutes: averageTime,
              lastUpdated: new Date(),
            },
          };
        });
      },

      // 통계 초기화
      resetStats: () => {
        set({
          stats: initialStats,
          matchingRecords: [],
          isLoading: false,
          error: null,
        });
      },

      // 통계 로드 (API에서)
      loadStats: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: 실제 API 호출로 대체
          // const response = await fetch('/api/stats');
          // const data = await response.json();
          
          // 현재는 로컬 스토리지에서 로드
          set({ isLoading: false });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : '통계 로드 실패' 
          });
        }
      },

      // 통계 저장 (API로)
      saveStats: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const { stats } = get();
          
          // TODO: 실제 API 호출로 대체
          // await fetch('/api/stats', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify(stats),
          // });
          
          console.log('통계 저장됨:', stats);
          set({ isLoading: false });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : '통계 저장 실패' 
          });
        }
      },
    }),
    {
      name: 'platform-stats',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        stats: state.stats,
        matchingRecords: state.matchingRecords,
      }),
    }
  )
);

// 통계 업데이트를 위한 유틸리티 함수들
export const statsUtils = {
  // 상담 완료 시 호출
  onConsultationCompleted: () => {
    useStatsStore.getState().completeConsultation();
  },

  // 전문가 등록 시 호출
  onExpertRegistered: () => {
    useStatsStore.getState().registerExpert();
  },

  // 사용자 등록 시 호출
  onUserRegistered: () => {
    useStatsStore.getState().registerUser();
  },

  // 매칭 완료 시 호출
  onMatchingCompleted: (userId: string, expertId: string, matchingTimeMinutes: number) => {
    useStatsStore.getState().recordMatching(userId, expertId, matchingTimeMinutes);
  },

  // 현재 통계 가져오기
  getCurrentStats: (): PlatformStats => {
    return useStatsStore.getState().stats;
  },
};
