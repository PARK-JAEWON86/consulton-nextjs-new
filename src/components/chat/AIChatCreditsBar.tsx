"use client";

import React from "react";
import { Info } from "lucide-react";
import { useAIChatCreditsStore } from "../../stores/aiChatCreditsStore";

interface AIChatCreditsBarProps {
  isExtended?: boolean;
}

const AIChatCreditsBar: React.FC<AIChatCreditsBarProps> = ({
  isExtended = false,
}) => {
  const {
    remainingAIChatCredits,
    remainingPercent,
    usedAIChatCredits,
    checkAndResetMonthly,
  } = useAIChatCreditsStore();

  // 컴포넌트 마운트 시 월간 리셋 체크
  React.useEffect(() => {
    checkAndResetMonthly();
  }, [checkAndResetMonthly]);

  // 대화연장 시 50크레딧 추가로 표시
  const displayCredits = isExtended
    ? remainingAIChatCredits + 50
    : remainingAIChatCredits;

  // 대화연장 시 퍼센트도 증가하도록 계산
  // 대화연장 상태일 때는 실제 사용 가능한 크레딧(remainingAIChatCredits + 50)을 기준으로 퍼센트 계산
  const displayPercent = isExtended
    ? Math.min(
        100,
        Math.max(0, Math.round(100 * ((remainingAIChatCredits + 50) / 300)))
      )
    : remainingPercent;

  // 디버깅을 위한 콘솔 로그 (개발 완료 후 제거)
  console.log("AIChatCreditsBar Debug:", {
    isExtended,
    remainingAIChatCredits,
    remainingPercent,
    displayCredits,
    displayPercent,
  });

  return (
    <div className="space-y-3">
      {/* AI 상담 전용 무료 크레딧 정보 */}
      <div className="text-lg font-bold text-gray-800 text-center">
        {displayCredits}
        {isExtended && (
          <div className="text-xs text-green-600 mt-1">
            +50 크레딧 (대화연장)
          </div>
        )}
      </div>

      {/* 크레딧 진행률 바 */}
      <div className="flex items-center space-x-3">
        <div className="flex-1">
          <div className="bg-divider h-1 rounded">
            <div
              className="bg-accent h-1 rounded transition-all duration-300"
              style={{ width: `${displayPercent}%` }}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">{displayPercent}% 남음</span>
          <div
            className="flex items-center space-x-1"
            title="📊 AI 상담 전용 무료 크레딧:

• 매월 300크레딧 제공
• 이월되지 않음 (다음달에 300크레딧으로 리셋)
• AI 상담에서만 사용 가능
• 대화연장 시 +50크레딧 혜택

💡 매월 1일에 자동으로 300크레딧이 리셋됩니다."
          >
            <Info className="w-4 h-4 text-gray-400 cursor-help" />
          </div>
        </div>
      </div>

      {/* 크레딧 사용 정보 */}
      <div className="text-xs text-gray-500 text-center">
        {usedAIChatCredits}/300 크레딧 사용
      </div>
    </div>
  );
};

export default AIChatCreditsBar;
