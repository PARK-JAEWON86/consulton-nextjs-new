"use client";

import React, { useState, useEffect } from "react";
import { Info, AlertCircle, CreditCard } from "lucide-react";

interface AITokenUsageBarProps {
  userId: string;
  isExtended?: boolean;
}

interface TokenUsageData {
  // 토큰 정보
  freeTokens: number;
  paidTokens: number;
  usedTokens: number;
  remainingTokens: number;
  
  // 턴 정보
  freeTurns: number;
  paidTurns: number;
  usedTurns: number;
  remainingTurns: number;
  
  remainingPercent: number;
  lastResetDate: string;
  monthlyFreeTokens: number;
  monthlyFreeTurns: number;
  tokensPerTurn: number;
  
  // 대화연장 정보
  extensionTokensFor50Credits: number;
  extensionTurnsFor50Credits: number;
}

const AITokenUsageBar: React.FC<AITokenUsageBarProps> = ({
  userId,
  isExtended = false,
}) => {
  const [tokenData, setTokenData] = useState<TokenUsageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 토큰 사용량 조회
  const fetchTokenUsage = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/ai-chat/tokens?userId=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setTokenData(data.data);
      } else {
        setError(data.error || '토큰 사용량 조회에 실패했습니다.');
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 토큰 사용량 조회
  useEffect(() => {
    if (userId) {
      fetchTokenUsage();
    }
  }, [userId]);

  // 턴 상태 업데이트 useEffect 제거 - 더 이상 사용하지 않음

  // 5분마다 토큰 사용량 갱신
  useEffect(() => {
    const interval = setInterval(fetchTokenUsage, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [userId]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="text-lg font-bold text-gray-800 text-center">
          <div className="animate-pulse bg-gray-200 h-8 w-24 mx-auto rounded"></div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <div className="bg-gray-200 h-1 rounded animate-pulse"></div>
          </div>
          <div className="text-sm text-gray-400">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-3">
        <div className="text-center text-red-600">
          <AlertCircle className="w-6 h-6 mx-auto mb-2" />
          <p className="text-sm">{error}</p>
          <button
            onClick={fetchTokenUsage}
            className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  if (!tokenData) {
    return null;
  }

  // 대화연장 시 실제 구매 가능한 턴 추가로 표시
  const displayTurns = isExtended
    ? tokenData.remainingTurns + (tokenData.extensionTurnsFor50Credits || 0)
    : tokenData.remainingTurns;

  // 대화연장 시 퍼센트도 증가하도록 계산
  const displayPercent = isExtended
    ? Math.min(
        100,
        Math.max(0, Math.round(100 * ((tokenData.remainingTurns + (tokenData.extensionTurnsFor50Credits || 0)) / tokenData.monthlyFreeTurns)))
      )
    : tokenData.remainingPercent;

  // 토큰을 턴으로 변환 (대략적인 계산)
  const estimatedTurns = Math.floor(tokenData.remainingTokens / 300); // 1턴 = 약 300토큰

  return (
    <div className="space-y-2">
      {/* AI 상담 전용 무료 턴 정보 - 게이지와 더 가깝게 */}
      <div className="text-center mb-1">
        <div className="text-3xl font-bold text-gray-800">
          {displayTurns}
        </div>
        {isExtended && (
          <div className="text-xs text-green-600 mt-1">
            +{tokenData.extensionTurnsFor50Credits}턴 (대화연장)
          </div>
        )}
        <div className="text-xs text-gray-500 mt-1">
          턴 사용 가능
        </div>
      </div>

      {/* 턴 진행률 게이지바 */}
      <div className="flex items-center space-x-3">
        <div className="flex-1">
          <div className="bg-gray-200 h-2 rounded-full">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${displayPercent}%` }}
            />
          </div>
        </div>
        <div className="flex items-center space-x-1 relative group">
          <Info className="w-4 h-4 text-gray-400 cursor-help" />
          
          {/* 커스텀 툴팁 */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            📊 AI 상담 전용 무료 턴:
            <br />
            • 매월 100턴(질문+응답) 제공
            <br />
            • 이월되지 않음 (다음달에 100턴으로 리셋)
            <br />
            • AI 상담에서만 사용 가능
            <br />
            • 대화연장 시 +50크레딧(약 100턴) 혜택
            <br />
            <br />
            💡 매월 1일에 자동으로 100턴이 리셋됩니다.
            <br />
            <br />
            🔄 질문별 턴 사용량:
            <br />
            • 짧은 질문: 약 0.3턴
            <br />
            • 일반 질문: 약 1턴
            <br />
            • 상세 질문: 약 1.5턴
            
            {/* 툴팁 화살표 */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      </div>

      {/* 턴 사용 정보 */}
      <div className="text-xs text-gray-500 text-center space-y-1">
        <div>{tokenData.usedTurns}/{tokenData.monthlyFreeTurns} 턴 사용</div>
        {tokenData.paidTurns > 0 && (
          <div className="text-blue-600">
            +{tokenData.paidTurns} 유료 턴 보유
          </div>
        )}
      </div>

      {/* 턴 부족 시 경고 */}
      {tokenData.remainingTurns < 5 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex items-center space-x-2 text-amber-800">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">무료 턴이 부족합니다</span>
          </div>
          <p className="text-xs text-amber-700 mt-1">
            크레딧을 구매하여 추가 턴을 받거나, 다음 달을 기다려주세요.
          </p>
          <button
            onClick={() => window.location.href = '/credit-packages'}
            className="mt-2 w-full bg-amber-600 text-white text-xs py-2 px-3 rounded hover:bg-amber-700 transition-colors flex items-center justify-center space-x-1"
          >
            <CreditCard className="w-3 h-3" />
            <span>크레딧 구매하기</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default AITokenUsageBar;
