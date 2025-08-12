"use client";

import { useState } from "react";
import { CreditCard, Plus, History, TrendingUp } from "lucide-react";

interface CreditBalanceProps {
  credits: number;
}

interface CreditHistoryItem {
  id: number;
  type: "used" | "purchased" | "bonus";
  amount: number;
  description: string;
  date: Date;
  expertName?: string;
  transactionId?: string;
}

const CreditBalance = ({ credits }: CreditBalanceProps) => {
  const [showHistory, setShowHistory] = useState(false);

  // 더미 크레딧 히스토리 데이터
  const creditHistory: CreditHistoryItem[] = [
    {
      id: 1,
      type: "used",
      amount: -25,
      description: "마케팅 전략 상담",
      date: new Date("2024-01-15T14:30:00"),
      expertName: "이민수 전문가",
    },
    {
      id: 2,
      type: "purchased",
      amount: +100,
      description: "기본 패키지 구매",
      date: new Date("2024-01-10T10:15:00"),
      transactionId: "TXN-001",
    },
    {
      id: 3,
      type: "used",
      amount: -30,
      description: "비즈니스 전략 상담",
      date: new Date("2024-01-08T16:45:00"),
      expertName: "박비즈니스 전문가",
    },
    {
      id: 4,
      type: "bonus",
      amount: +50,
      description: "신규 가입 보너스",
      date: new Date("2024-01-01T00:00:00"),
      transactionId: "BONUS-001",
    },
  ];

  const handlePurchaseCredits = () => {
    // 크레딧 구매 페이지로 이동
    console.log("Navigate to credit purchase page");
  };

  const getBalanceColor = (credits: number) => {
    if (credits > 100) return "text-green-600";
    if (credits > 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getBalanceIcon = (credits: number) => {
    if (credits > 100) return "🟢";
    if (credits > 50) return "🟡";
    return "🔴";
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <CreditCard className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">크레딧 잔액</h2>
            <p className="text-sm text-gray-600">
              상담 서비스 이용 가능 크레딧
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowHistory(!showHistory)}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <History className="h-5 w-5" />
        </button>
      </div>

      {/* 크레딧 잔액 표시 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getBalanceIcon(credits)}</span>
          <div>
            <div className={`text-3xl font-bold ${getBalanceColor(credits)}`}>
              {credits.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">사용 가능 크레딧</div>
          </div>
        </div>

        <button
          onClick={handlePurchaseCredits}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>충전하기</span>
        </button>
      </div>

      {/* 크레딧 사용량 예측 */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            이번 달 예상 사용량
          </span>
          <TrendingUp className="h-4 w-4 text-gray-400" />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">
            ~75 크레딧
          </span>
          <span className="text-sm text-gray-500">
            {Math.ceil(credits / 75)}개월 사용 가능
          </span>
        </div>
        <div className="mt-2 bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${Math.min((75 / credits) * 100, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* 크레딧 히스토리 */}
      {showHistory && (
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">최근 내역</h3>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {creditHistory.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-2"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-sm font-medium ${
                        item.type === "used"
                          ? "text-red-600"
                          : item.type === "purchased"
                            ? "text-blue-600"
                            : "text-green-600"
                      }`}
                    >
                      {item.type === "used"
                        ? "사용"
                        : item.type === "purchased"
                          ? "구매"
                          : "보너스"}
                    </span>
                    <span className="text-sm text-gray-600">
                      {item.description}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {item.date.toLocaleDateString("ko-KR")}{" "}
                    {item.date.toLocaleTimeString("ko-KR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {item.expertName && (
                      <span className="ml-2">• {item.expertName}</span>
                    )}
                  </div>
                </div>
                <div
                  className={`font-semibold ${
                    item.amount > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {item.amount > 0 ? "+" : ""}
                  {item.amount}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t">
            <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
              전체 내역 보기
            </button>
          </div>
        </div>
      )}

      {/* 경고 메시지 */}
      {credits < 30 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-800">
                크레딧이 부족합니다
              </p>
              <p className="text-sm text-yellow-700">
                원활한 서비스 이용을 위해 크레딧을 충전해 주세요.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditBalance;
