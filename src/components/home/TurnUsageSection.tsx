"use client";

import React, { useState, useEffect } from "react";
import { Info, AlertCircle, CreditCard, Zap, Clock, RefreshCw, DollarSign } from "lucide-react";

interface TurnUsageSectionProps {
  userId?: string;
}

interface TokenUsageData {
  usedCredits: number;
  purchasedCredits: number;
  remainingPercent: number;
  monthlyResetDate: string;
  totalTurns: number;
  totalTokens: number;
  averageTokensPerTurn: number;
  summary: {
    totalCredits: number;
    freeCredits: number;
    usedFreeCredits: number;
    usedPurchasedCredits: number;
    remainingFreeCredits: number;
    remainingPurchasedCredits: number;
    nextResetDate: string;
  };
}

const TurnUsageSection: React.FC<TurnUsageSectionProps> = ({ userId }) => {
  const [tokenData, setTokenData] = useState<TokenUsageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('TurnUsageSection 렌더링:', { userId, tokenData, isLoading, error });

  // 토큰 사용량 조회
  const fetchTokenUsage = async () => {
    try {
      console.log('fetchTokenUsage 시작');
      setIsLoading(true);
      setError(null);
      
      // ai-usage API 호출
      const response = await fetch('/api/ai-usage');
      const data = await response.json();
      
      console.log('API 응답:', data);
      
      if (data.success) {
        setTokenData(data.data);
      } else {
        setError(data.error || 'AI 사용량 조회에 실패했습니다.');
      }
      
    } catch (err) {
      console.error('AI 사용량 조회 오류:', err);
      setError('API 연결에 실패했습니다. 네트워크 상태를 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 AI 사용량 조회
  useEffect(() => {
    fetchTokenUsage();
  }, []);

  // 턴 리셋 테스트 (개발용)
  const handleResetTest = async () => {
    try {
      const response = await fetch('/api/ai-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'resetMonthly'
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setTokenData(data.data);
        alert('월간 사용량이 리셋되었습니다!');
      }
    } catch (error) {
      console.error('리셋 테스트 오류:', error);
      alert('리셋 테스트에 실패했습니다.');
    }
  };

  // 테스트 턴 사용량 추가 (개발용)
  const handleAddTestUsage = async () => {
    try {
      const response = await fetch('/api/ai-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'addTurnUsage',
          data: {
            totalTokens: 600,
            preciseMode: false
          }
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setTokenData(data.data.newState);
        alert(`테스트 턴이 추가되었습니다. 소모된 크레딧: ${data.data.spentCredits}`);
      }
    } catch (error) {
      console.error('테스트 턴 추가 오류:', error);
      alert('테스트 턴 추가에 실패했습니다.');
    }
  };

  // 크레딧 추가 테스트 (개발용)
  const handleAddTestCredits = async () => {
    try {
      const response = await fetch('/api/ai-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'addPurchasedCredits',
          data: {
            credits: 50
          }
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setTokenData(data.data.newState);
        alert('50 크레딧이 추가되었습니다!');
      }
    } catch (error) {
      console.error('크레딧 추가 오류:', error);
      alert('크레딧 추가에 실패했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse bg-gray-200 h-8 w-32 mx-auto rounded mb-4"></div>
            <div className="animate-pulse bg-gray-200 h-4 w-48 mx-auto rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-600">
            <AlertCircle className="w-8 h-8 mx-auto mb-4" />
            <p className="text-lg">{error}</p>
            <button
              onClick={fetchTokenUsage}
              className="mt-4 text-blue-600 hover:text-blue-800 underline"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!tokenData) {
    return null;
  }

  // 다음 리셋까지 남은 시간 계산
  const getNextResetTime = () => {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const diff = nextMonth.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return { days, hours };
  };

  const { days, hours } = getNextResetTime();

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            AI 상담 크레딧 관리
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            AI 무료상담 남은 양을 확인하고, 필요시 추가 크레딧을 구매하여 더 많은 상담을 받아보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* AI 무료상담 정보 (왼쪽) */}
          <div className="space-y-6">
            {/* AI 무료상담 남은 양 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {tokenData.summary.remainingFreeCredits}
                </div>
                <div className="text-lg text-gray-600 mb-4">AI 무료상담 남은 양</div>
                
                {/* 진행률 게이지 */}
                <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden mb-4">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${
                      (tokenData.summary.remainingFreeCredits / 100) * 100 > 70 ? 'bg-gradient-to-r from-green-400 to-green-500' :
                      (tokenData.summary.remainingFreeCredits / 100) * 100 > 30 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                      'bg-gradient-to-r from-red-400 to-red-500'
                    }`}
                    style={{ width: `${(tokenData.summary.remainingFreeCredits / 100) * 100}%` }}
                  />
                </div>
                
                <div className="text-sm text-gray-500">
                  {Math.round((tokenData.summary.remainingFreeCredits / 100) * 100)}% 남음
                </div>
              </div>
            </div>

            {/* 언제 재충전되는지 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <RefreshCw className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {getNextResetTime().days}
                </div>
                <div className="text-sm text-gray-600 mb-1">일 후</div>
                <div className="text-xl font-bold text-gray-900 mb-1">
                  {getNextResetTime().hours}
                </div>
                <div className="text-sm text-gray-600 mb-3">시간 후</div>
                
                <div className="text-xs text-gray-500">
                  AI 무료상담 재충전까지
                </div>
              </div>
            </div>
          </div>

          {/* 크레딧 구매 및 관리 (오른쪽) */}
          <div className="space-y-6">
            {/* AI상담 턴 구매 버튼 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg border border-blue-200">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">AI상담 턴 구매</h3>
                <p className="text-sm text-blue-700">
                  사용자의 크레딧을 이용해서 AI상담 턴을 구매하세요
                </p>
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={() => window.location.href = '/credit-packages'}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  크레딧 패키지 보기
                </button>
                
                <button
                  onClick={() => window.location.href = '/chat'}
                  className="w-full bg-white text-blue-600 py-3 px-6 rounded-xl font-semibold border-2 border-blue-200 hover:bg-blue-50 transition-all duration-200"
                >
                  AI 채팅 시작하기
                </button>
              </div>
            </div>

            {/* 현재 크레딧 상태 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">현재 크레딧 상태</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">무료 크레딧</span>
                  <span className="font-semibold text-blue-600">{tokenData.summary.remainingFreeCredits}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">유료 크레딧</span>
                  <span className="font-semibold text-green-600">{tokenData.summary.remainingPurchasedCredits}</span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">총 크레딧</span>
                  <span className="font-semibold text-gray-800">{tokenData.summary.totalCredits}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 턴 부족 시 경고 및 구매 유도 */}
        {tokenData.remainingPercent < 30 && (
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-amber-50 to-red-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <AlertCircle className="w-6 h-6 text-amber-600" />
                <span className="text-lg font-semibold text-amber-800">
                  크레딧이 부족합니다
                </span>
              </div>
              <p className="text-center text-amber-700 mb-6">
                크레딧을 구매하여 추가 AI 상담을 받거나, 다음 달을 기다려주세요.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => window.location.href = '/chat'}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  AI 채팅 시작하기
                </button>
                <button
                  onClick={() => window.location.href = '/credit-packages'}
                  className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors font-medium"
                >
                  크레딧 구매하기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 도움말 */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 text-gray-500 hover:text-gray-700 cursor-help group">
            <Info className="w-5 h-5" />
            <span className="text-sm">터널 사용량 안내</span>
            
            {/* 툴팁 */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 max-w-xs">
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
              
              {/* 툴팁 화살표 */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
          
          {/* 개발용 테스트 버튼들 */}
          {userId && process.env.NODE_ENV === 'development' && (
            <div className="mt-6 flex justify-center space-x-4">
              <button
                onClick={handleAddTestUsage}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                테스트 턴 추가
              </button>
              <button
                onClick={handleAddTestCredits}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                테스트 크레딧 추가
              </button>
              <button
                onClick={handleResetTest}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm"
              >
                월간 리셋 테스트
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TurnUsageSection;
