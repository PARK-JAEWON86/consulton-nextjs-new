import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AIChatCreditsState {
  // AI 상담 전용 무료 크레딧 (매월 리셋, 이월 불가)
  aiChatCredits: number;
  lastResetDate: string; // 마지막 리셋 날짜 (YYYY-MM 형식)

  // AI 상담에서 사용한 크레딧
  usedAIChatCredits: number;

  // 남은 크레딧 계산
  remainingAIChatCredits: number;

  // 퍼센트 계산
  remainingPercent: number;
}

interface AIChatCreditsActions {
  // AI 상담 크레딧 사용
  useAIChatCredits: (credits: number) => void;

  // 월간 리셋 체크 및 실행
  checkAndResetMonthly: () => void;

  // 초기화 (회원가입 시)
  initializeCredits: () => void;

  // 크레딧을 7300으로 강제 설정 (테스트용)
  setCreditsTo7300: () => void;
}

type AIChatCreditsStore = AIChatCreditsState & AIChatCreditsActions;

const MONTHLY_AI_CHAT_CREDITS = 7300;

export const useAIChatCreditsStore = create<AIChatCreditsStore>()(
  persist(
    (set, get) => ({
      // 초기 상태
      aiChatCredits: MONTHLY_AI_CHAT_CREDITS,
      lastResetDate: "",
      usedAIChatCredits: 0,
      remainingAIChatCredits: MONTHLY_AI_CHAT_CREDITS,
      remainingPercent: 100,

      // AI 상담 크레딧 사용
      useAIChatCredits: (credits: number) => {
        const state = get();
        const newUsedCredits = state.usedAIChatCredits + credits;
        const newRemainingCredits = Math.max(
          0,
          state.aiChatCredits - newUsedCredits
        );
        const newRemainingPercent = Math.max(
          0,
          Math.round(100 * (newRemainingCredits / state.aiChatCredits))
        );

        set({
          usedAIChatCredits: newUsedCredits,
          remainingAIChatCredits: newRemainingCredits,
          remainingPercent: newRemainingPercent,
        });
      },

      // 월간 리셋 체크 및 실행
      checkAndResetMonthly: () => {
        const state = get();
        const currentDate = new Date();
        const currentMonth = `${currentDate.getFullYear()}-${String(
          currentDate.getMonth() + 1
        ).padStart(2, "0")}`;

        // 마지막 리셋 날짜가 없거나 현재 월과 다르면 리셋
        if (!state.lastResetDate || state.lastResetDate !== currentMonth) {
          set({
            aiChatCredits: MONTHLY_AI_CHAT_CREDITS,
            lastResetDate: currentMonth,
            usedAIChatCredits: 0,
            remainingAIChatCredits: MONTHLY_AI_CHAT_CREDITS,
            remainingPercent: 100,
          });
        }
      },

      // 초기화 (회원가입 시)
      initializeCredits: () => {
        const currentDate = new Date();
        const currentMonth = `${currentDate.getFullYear()}-${String(
          currentDate.getMonth() + 1
        ).padStart(2, "0")}`;

        set({
          aiChatCredits: MONTHLY_AI_CHAT_CREDITS,
          lastResetDate: currentMonth,
          usedAIChatCredits: 0,
          remainingAIChatCredits: MONTHLY_AI_CHAT_CREDITS,
          remainingPercent: 100,
        });
      },

      // 크레딧을 7300으로 강제 설정 (테스트용)
      setCreditsTo7300: () => {
        set({ aiChatCredits: MONTHLY_AI_CHAT_CREDITS });
      },
    }),
    {
      name: "ai-chat-credits-storage",
    }
  )
);
