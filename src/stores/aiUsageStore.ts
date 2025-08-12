import { create } from "zustand";
import {
  estimateCreditsForTurn,
  calcRemainingPercent,
  BASE_CREDIT_PER_TURN,
} from "../constants/aiQuota";

interface AIUsageState {
  usedCredits: number;
  purchasedCredits: number;
  remainingPercent: number;
}

interface AIUsageActions {
  addTurnUsage: (totalTokens: number, preciseMode?: boolean) => number;
  addPurchasedCredits: (n: number) => void;
  grantTurns: (turns: number) => void;
  resetMonthly: () => void;
}

type AIUsageStore = AIUsageState & AIUsageActions;

export const useAIUsageStore = create<AIUsageStore>((set, get) => ({
  // 초기 상태
  usedCredits: 0,
  purchasedCredits: 0,
  remainingPercent: 100,

  // 턴 사용량 추가 및 소모된 크레딧 반환
  addTurnUsage: (totalTokens: number, preciseMode?: boolean) => {
    const spentCredits = estimateCreditsForTurn(totalTokens, preciseMode);

    set((state) => {
      const newUsedCredits = state.usedCredits + spentCredits;
      const newRemainingPercent = calcRemainingPercent(
        newUsedCredits,
        state.purchasedCredits,
      );

      return {
        usedCredits: newUsedCredits,
        remainingPercent: newRemainingPercent,
      };
    });

    return spentCredits;
  },

  // 구매한 크레딧 추가
  addPurchasedCredits: (n: number) => {
    set((state) => {
      const newPurchasedCredits = state.purchasedCredits + n;
      const newRemainingPercent = calcRemainingPercent(
        state.usedCredits,
        newPurchasedCredits,
      );

      return {
        purchasedCredits: newPurchasedCredits,
        remainingPercent: newRemainingPercent,
      };
    });
  },

  // 턴 수만큼 크레딧 부여
  grantTurns: (turns: number) => {
    const credits = turns * BASE_CREDIT_PER_TURN;
    get().addPurchasedCredits(credits);
  },

  // 월간 리셋 (무료 크레딧만 리셋)
  resetMonthly: () => {
    set((state) => {
      const newRemainingPercent = calcRemainingPercent(
        state.usedCredits,
        state.purchasedCredits,
      );

      return {
        usedCredits: 0, // 무료 크레딧 사용량만 리셋
        remainingPercent: newRemainingPercent,
      };
    });
  },
}));
