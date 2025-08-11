"use client";

import { Info } from "lucide-react";
import { useAIUsageStore } from "../../stores/aiUsageStore";

const QuotaBar = () => {
  const remainingPercent = useAIUsageStore((state) => state.remainingPercent);

  return (
    <div className="flex items-center space-x-3">
      <div className="flex-1">
        <div className="bg-divider h-1 rounded">
          <div
            className="bg-accent h-1 rounded transition-all duration-300"
            style={{ width: `${remainingPercent}%` }}
          />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">{remainingPercent}% 남음</span>
        <div
          className="flex items-center space-x-1"
          title="짧은 질문/응답은 사용량이 적습니다. 장문 또는 정밀 모드 응답은 더 많이 차감돼요."
        >
          <Info className="w-4 h-4 text-gray-400 cursor-help" />
        </div>
      </div>
    </div>
  );
};

export default QuotaBar;
