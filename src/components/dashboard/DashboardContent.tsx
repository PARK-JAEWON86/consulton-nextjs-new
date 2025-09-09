"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BarChart3,
  MessageCircle,
  Users,
  Video,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CalendarDays,
  BookOpen,
  Star,
  FileText,
  CheckCircle,
  RefreshCw,
  Plus,
  History,
} from "lucide-react";
import CreditBalance from "./CreditBalance";
import UserStats from "./UserStats";
import { eventBus, CREDIT_EVENTS, USER_EVENTS } from "@/utils/eventBus";

interface User {
  id: string;
  email: string;
  name: string;
  credits: number;
  expertLevel: string;
  role?: 'expert' | 'client' | 'admin';
}

interface AppState {
  isAuthenticated: boolean;
  user: User | null;
}

export default function DashboardContent() {
  type ConsultationType = "video" | "chat" | "voice";

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [appState, setAppState] = useState<AppState>({
    isAuthenticated: false,
    user: null
  });
  const [aiTokenData, setAiTokenData] = useState<any>(null);
  const [isTokenGuideExpanded, setIsTokenGuideExpanded] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showTokenHistory, setShowTokenHistory] = useState(false);

  // 이벤트 기반 새로고침 함수 (훅 대신 직접 구현)
  const registerRefreshFunction = useCallback((refreshFn: () => void) => {
    // 이벤트 리스너 등록
    const handleEvent = () => refreshFn();
    const unsubscribe = eventBus.subscribe(CREDIT_EVENTS.CREDITS_UPDATED, handleEvent);
    
    // 클린업 함수 반환
    return unsubscribe;
  }, []);

  // 데이터 새로고침 함수
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 병렬로 데이터 로드
      const [appStateResponse, aiTokenResponse] = await Promise.all([
        fetch('/api/app-state'),
        fetch('/api/ai-usage')
      ]);

      const [appStateResult, aiTokenResult] = await Promise.all([
        appStateResponse.json(),
        aiTokenResponse.json()
      ]);

      if (appStateResult.success) {
        setAppState({
          isAuthenticated: appStateResult.data.isAuthenticated,
          user: appStateResult.data.user
        });
      }

      if (aiTokenResult.success) {
        setAiTokenData(aiTokenResult.data);
      }
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 앱 상태 및 AI 토큰 데이터 초기 로드 (한 번만)
  useEffect(() => {
    refreshData();
  }, []); // 의존성 배열을 비워서 마운트 시 한 번만 실행

  // 이벤트 기반 새로고침 등록
  useEffect(() => {
    // 크레딧 관련 이벤트에 새로고침 함수 등록
    registerRefreshFunction(refreshData);
  }, [registerRefreshFunction, refreshData]);

  // 수동 새로고침 핸들러
  const handleManualRefresh = () => {
    refreshData();
  };

  const loggedInUser = appState.user;



  // AI 토큰 구매 모달 표시
  const handleShowPurchaseModal = () => {
    if (!appState.isAuthenticated || !appState.user) {
      alert('로그인이 필요합니다.');
      return;
    }

    // 무료 제공량이 30% 미만일 때만 구매 가능
    if (aiTokenData && aiTokenData.summary?.freeTokensUsagePercent >= 70) {
      setShowPurchaseModal(true);
    } else {
      alert('무료 제공량이 30% 이상 남아있어 구매할 수 없습니다. 무료 제공량을 먼저 사용해주세요.');
    }
  };

  // AI 토큰 구매 실행 함수
  const handleConfirmPurchase = async () => {
    if (isPurchasing) return;

    try {
      setIsPurchasing(true);
      
      // 1단계: 크레딧 차감
      const creditResponse = await fetch('/api/credits/deduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          amount: 100,
          reason: 'AI상담 토큰 구매'
        })
      });

      const creditResult = await creditResponse.json();
      
      if (!creditResult.success) {
        alert(creditResult.error || '크레딧 차감에 실패했습니다.');
        return;
      }

      // 2단계: AI 토큰 추가
      const tokenResponse = await fetch('/api/ai-usage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'addPurchasedCredits',
          data: {
            credits: 100
          }
        })
      });

      const tokenResult = await tokenResponse.json();
      
      if (tokenResult.success) {
        // 이벤트 발행으로 다른 컴포넌트들에게 알림
        eventBus.publish(CREDIT_EVENTS.CREDITS_PURCHASED, {
          creditsUsed: 100,
          tokensAdded: 100000
        });
        
        alert('AI상담 토큰 구매가 완료되었습니다! 100,000토큰이 추가되었습니다.');
        setShowPurchaseModal(false);
      } else {
        alert(tokenResult.error || 'AI 토큰 구매에 실패했습니다.');
        // TODO: 크레딧 차감 롤백 처리
      }
    } catch (error) {
      console.error('AI 토큰 구매 오류:', error);
      alert('AI 토큰 구매 중 오류가 발생했습니다.');
    } finally {
      setIsPurchasing(false);
    }
  };

  // 크레딧 충전 페이지로 이동
  const handleGoToCreditTopup = () => {
    window.location.href = '/credit-packages';
  };

  // 로그인한 사용자 데이터 사용, 없으면 기본값
  const user = loggedInUser ? {
    id: loggedInUser.id || "",
    name: loggedInUser.name || "사용자",
    credits: loggedInUser.credits || 0,
    email: loggedInUser.email || "user@example.com",
    phone: "010-0000-0000", // 기본값
    location: "위치 미설정", // 기본값
    birthDate: "1990-01-01", // 기본값
    interests: ["심리상담", "진로상담"], // 기본값
    bio: "전문가들과의 상담을 통해 성장하고 있습니다.",
    totalConsultations: 0, // 실제로는 상담 기록에서 계산해야 함
    favoriteExperts: 0, // 실제로는 즐겨찾기에서 계산해야 함
    completedGoals: 0, // 기본값
    joinDate: "2024-01-01", // 기본값
  } : {
    id: "",
    name: "게스트",
    credits: 0,
    email: "guest@example.com",
    phone: "010-0000-0000",
    location: "서울특별시",
    birthDate: "1990-01-01",
    interests: ["심리상담"],
    bio: "로그인하여 전문가 상담을 시작해보세요.",
    totalConsultations: 0,
    favoriteExperts: 0,
    completedGoals: 0,
    joinDate: "2024-01-01",
  };



  // 예약된 상담 일정 데이터 (API에서 로드)
  const [upcomingConsultations, setUpcomingConsultations] = useState<any[]>([]);
  const [consultationLogs, setConsultationLogs] = useState<any[]>([]);

  // 상담 데이터 로드
  useEffect(() => {
    const loadConsultationData = async () => {
      try {
        // 예약된 상담 조회
        const consultationsResponse = await fetch('/api/consultations-multi?status=scheduled');
        if (consultationsResponse.ok) {
          const consultationsData = await consultationsResponse.json();
          setUpcomingConsultations(consultationsData.data || []);
        }

        // 완료된 상담 조회 (상담 일지용)
        const completedResponse = await fetch('/api/consultations-multi?status=completed');
        if (completedResponse.ok) {
          const completedData = await completedResponse.json();
          setConsultationLogs(completedData.data || []);
        }
      } catch (error) {
        console.error('상담 데이터 로드 실패:', error);
      }
    };

    if (loggedInUser) {
      loadConsultationData();
    }
  }, [loggedInUser]);






  // 즐겨찾는 전문가 데이터 (API에서 로드)
  const [favoriteExperts, setFavoriteExperts] = useState<any[]>([]);

  // 즐겨찾는 전문가 데이터 로드
  useEffect(() => {
    const loadFavoriteExperts = async () => {
      try {
        const response = await fetch('/api/expert-profiles?favorites=true');
        if (response.ok) {
          const data = await response.json();
          setFavoriteExperts(data.data || []);
        }
      } catch (error) {
        console.error('즐겨찾는 전문가 로드 실패:', error);
      }
    };

    if (loggedInUser) {
      loadFavoriteExperts();
    }
  }, [loggedInUser]);

  // 달력 관련 함수들
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const getConsultationsByDate = (date: Date) => {
    const dateStr = formatDate(date);
    return upcomingConsultations.filter(
      (consultation) => consultation.date === dateStr,
    );
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(null);
  };

  const getConsultationStatusColor = (consultations: any[]) => {
    if (consultations.length === 0) return null;

    const hasConfirmed = consultations.some((c) => c.status === "confirmed");
    const hasPending = consultations.some((c) => c.status === "pending");

    if (hasConfirmed && hasPending) {
      return "mixed";
    } else if (hasConfirmed) {
      return "confirmed";
    } else {
      return "pending";
    }
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days: (Date | null)[] = [];

    // 빈 칸들 (이전 달의 마지막 날들)
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // 현재 달의 날들
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day,
      );
      days.push(date);
    }

    return days;
  };

  const monthNames = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];

  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                안녕하세요, {user.name}님!
              </h1>
              <p className="text-gray-600 mt-1">
                오늘도 전문가와 함께 성장해보세요.
              </p>
            </div>
            
            {/* 새로고침 버튼 */}
            <button
              onClick={handleManualRefresh}
              disabled={isLoading}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isLoading
                  ? 'bg-gray-100 cursor-not-allowed text-gray-400'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-blue-600'
              }`}
              title="데이터 새로고침"
            >
              <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* 사용자 정보 헤더 - 로딩 완료 후에만 표시 */}
        {!isLoading && user && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-xl">
                    {user.name?.charAt(0)}
                  </span>
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-bold text-blue-900">{user.name} (사용자)</h2>
                  <div className="flex items-center mt-2 space-x-4 text-sm">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded flex items-center justify-center min-w-[80px] whitespace-nowrap">
                      사용자
                    </span>
                    <span className="text-blue-600">
                      상담 가능
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-blue-600 mb-2">이메일</div>
                <div className="font-medium text-blue-900">{user.email}</div>
              </div>
            </div>
          </div>
        )}

        {/* 빠른 액션 섹션 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* 크레딧 잔액 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              크레딧 잔액
            </h3>
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {user.credits.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 mb-4">크레딧</div>
                <button
                  onClick={handleGoToCreditTopup}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  크레딧 충전
                </button>
              </div>
            </div>
          </div>

          {/* AI상담 토큰 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              AI상담 토큰
            </h3>
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
                <span className="ml-2 text-gray-600">로딩 중...</span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    {aiTokenData && aiTokenData.summary?.remainingFreeTokens ? (
                      aiTokenData.summary.remainingFreeTokens.toLocaleString()
                    ) : (
                      '0'
                    )}
                  </div>
                  <div className="text-sm text-gray-600 mb-4">토큰 남음</div>
                  
                  {/* 진행률 표시 */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ease-out ${
                        aiTokenData && aiTokenData.summary?.freeTokensUsagePercent > 70 ? 'bg-gradient-to-r from-red-400 to-red-500' :
                        aiTokenData && aiTokenData.summary?.freeTokensUsagePercent > 30 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                        'bg-gradient-to-r from-green-400 to-green-500'
                      }`}
                      style={{ 
                        width: `${aiTokenData && aiTokenData.summary?.freeTokensUsagePercent !== undefined ? 
                          Math.max(1, Math.min(100, 100 - aiTokenData.summary.freeTokensUsagePercent)) : 0}%` 
                      }}
                    ></div>
                  </div>
                  
                  <button 
                    onClick={handleShowPurchaseModal}
                    className="w-full px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                  >
                    토큰 구매
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 알림 요약 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">
                알림
              </h3>
              <button
                onClick={() => {/* 알림 페이지로 이동 */}}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                전체 보기
              </button>
            </div>
            <div className="space-y-2 text-sm">
              {upcomingConsultations.length > 0 && (
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                  <span className="text-blue-700">예약된 상담</span>
                  <span className="font-semibold text-blue-800">
                    {upcomingConsultations.length}건
                  </span>
                </div>
              )}
              {aiTokenData && aiTokenData.summary?.freeTokensUsagePercent > 70 && (
                <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
                  <span className="text-orange-700">토큰 부족</span>
                  <span className="font-semibold text-orange-800">
                    충전 필요
                  </span>
                </div>
              )}
              {upcomingConsultations.length === 0 && (!aiTokenData || aiTokenData.summary?.freeTokensUsagePercent <= 70) && (
                <div className="text-gray-500">새로운 알림이 없습니다.</div>
              )}
            </div>
          </div>
        </div>

        {/* 활동 통계 섹션 */}
        <div className="mb-8">
          <UserStats readOnly={true} />
        </div>

        {/* 상담 일정 섹션 */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Calendar className="h-5 w-5 text-blue-600 mr-2" />
              다음 예약된 상담 일정
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 달력 */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {currentDate.getFullYear()}년{" "}
                    {monthNames[currentDate.getMonth()]}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={goToToday}
                      className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors flex items-center space-x-1"
                    >
                      <CalendarDays className="h-4 w-4" />
                      <span>오늘</span>
                    </button>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => navigateMonth(-1)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <ChevronLeft className="h-5 w-5 text-gray-600" />
                      </button>
                      <button
                        onClick={() => navigateMonth(1)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <ChevronRight className="h-5 w-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 요일 헤더 */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {dayNames.map((day) => (
                    <div
                      key={day}
                      className="text-center text-sm font-medium text-gray-600 py-2"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* 달력 날짜들 */}
                <div className="grid grid-cols-7 gap-1">
                  {generateCalendarDays().map((date, index) => {
                    if (!date) {
                      return <div key={index} className="h-10"></div>;
                    }

                    const consultationsOnDate = getConsultationsByDate(date);
                    const isToday = formatDate(date) === formatDate(new Date());
                    const isSelected =
                      selectedDate &&
                      formatDate(date) === formatDate(selectedDate);
                    const statusColor =
                      getConsultationStatusColor(consultationsOnDate);

                    // 날짜 스타일 결정
                    let dayClasses =
                      "h-10 text-sm rounded-lg flex items-center justify-center relative transition-all duration-200 ";
                    let badgeElement = null;

                    if (isSelected) {
                      dayClasses +=
                        "bg-blue-600 text-white shadow-lg scale-105";
                    } else if (isToday) {
                      dayClasses +=
                        "bg-blue-100 text-blue-800 font-semibold border-2 border-blue-300";
                    } else if (statusColor) {
                      switch (statusColor) {
                        case "confirmed":
                          dayClasses +=
                            "bg-green-100 text-green-800 hover:bg-green-200 font-semibold border border-green-300";
                          badgeElement = (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                              ✓
                            </div>
                          );
                          break;
                        case "pending":
                          dayClasses +=
                            "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 font-semibold border border-yellow-300";
                          badgeElement = (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                              ⏳
                            </div>
                          );
                          break;
                        case "mixed":
                          dayClasses +=
                            "bg-gradient-to-br from-green-100 to-yellow-100 text-gray-800 hover:from-green-200 hover:to-yellow-200 font-semibold border border-orange-300";
                          badgeElement = (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                              {consultationsOnDate.length}
                            </div>
                          );
                          break;
                      }
                    } else {
                      dayClasses += "hover:bg-gray-100 text-gray-700";
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedDate(date)}
                        className={dayClasses}
                        title={
                          consultationsOnDate.length > 0
                            ? `${consultationsOnDate.length}개의 상담 예약`
                            : ""
                        }
                      >
                        {date.getDate()}
                        {badgeElement}
                      </button>
                    );
                  })}
                </div>

                {/* 범례 */}
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <div className="text-xs text-gray-600 mb-2 font-medium">
                    범례
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-100 border-2 border-blue-300 rounded"></div>
                      <span className="text-gray-600">오늘</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-100 border border-green-300 rounded relative">
                        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
                          <span style={{ fontSize: "6px" }}>✓</span>
                        </div>
                      </div>
                      <span className="text-gray-600">확정 상담</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded relative">
                        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-yellow-500 text-white text-xs rounded-full flex items-center justify-center">
                          <span style={{ fontSize: "6px" }}>⏳</span>
                        </div>
                      </div>
                      <span className="text-gray-600">대기 상담</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gradient-to-br from-green-100 to-yellow-100 border border-orange-300 rounded relative">
                        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                          <span style={{ fontSize: "6px" }}>2</span>
                        </div>
                      </div>
                      <span className="text-gray-600">혼합 상담</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 상담 목록 */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  {selectedDate
                    ? `${
                        selectedDate.getMonth() + 1
                      }/${selectedDate.getDate()} 상담 일정`
                    : "전체 예약된 상담"}
                </h4>

                {upcomingConsultations.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      예약된 상담이 없습니다.
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      전문가를 찾아 새로운 상담을 예약해보세요.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {(selectedDate
                      ? getConsultationsByDate(selectedDate)
                      : upcomingConsultations
                    ).map((consultation) => (
                      <div
                        key={consultation.id}
                        className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              {consultation.type === "video" ? (
                                <Video className="h-5 w-5 text-purple-600" />
                              ) : (
                                <MessageCircle className="h-5 w-5 text-blue-600" />
                              )}
                            </div>
                            <div>
                              <h5 className="text-sm font-medium text-gray-900">
                                {(consultation as any).expertName}
                              </h5>
                              <p className="text-xs text-gray-500">
                                {(consultation as any).specialty}
                              </p>
                              <div className="flex items-center text-xs text-gray-500 mt-1">
                                <Clock className="h-3 w-3 mr-1" />
                                {consultation.date} {consultation.time}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-1">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                consultation.status === "confirmed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {consultation.status === "confirmed"
                                ? "확정"
                                : "대기중"}
                            </span>
                            <button className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                              상세보기
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {selectedDate &&
                      getConsultationsByDate(selectedDate).length === 0 && (
                        <div className="text-center py-8">
                          <p className="text-gray-500">
                            해당 날짜에 예약된 상담이 없습니다.
                          </p>
                        </div>
                      )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 하단 섹션들 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 상담 일지 섹션 */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
                최근 상담 일지
              </h3>
            </div>
            <div className="p-6">
              {consultationLogs.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    아직 완료된 상담이 없습니다.
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    첫 상담을 시작해보세요!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {consultationLogs.map((log) => (
                    <div
                      key={log.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="text-sm font-medium text-gray-900">
                              {(log as any).expertName}
                            </h4>
                            <span className="text-xs text-gray-500">
                              {(log as any).specialty}
                            </span>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < log.rating
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {(log as any).summary}
                          </p>
                          <div className="flex items-center text-xs text-gray-500 space-x-4">
                            <span>{log.date}</span>
                            <span>{log.duration}</span>
                            <div className="flex items-center">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                              완료
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="text-center pt-4">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      모든 상담 일지 보기
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 즐겨찾는 전문가 / 단골 고객 섹션 */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Star className="h-5 w-5 text-yellow-500 mr-2" />
                즐겨찾는 전문가
              </h3>
            </div>
            <div className="p-6">
              {!favoriteExperts || !Array.isArray(favoriteExperts) || favoriteExperts.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    즐겨찾는 전문가가 없습니다.
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    전문가를 즐겨찾기에 추가해보세요!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {favoriteExperts && Array.isArray(favoriteExperts) ? favoriteExperts.map((expert) => (
                    <div
                      key={expert.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <Users className="h-5 w-5 text-gray-400" />
                            </div>
                            {expert.isOnline && (
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="text-sm font-medium text-gray-900">
                                {expert.name}
                              </h4>
                              <div className="flex items-center">
                                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                <span className="text-xs text-gray-600 ml-1">
                                  {expert.rating}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 mb-1">
                              {expert.specialty} • {expert.consultations}회 상담
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {expert.tags.slice(0, 2).map((tag, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600"
                                >
                                  {tag}
                                </span>
                              ))}
                              {expert.tags.length > 2 && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                                  +{expert.tags.length - 2}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-1">
                          <button className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded transition-colors">
                            상담하기
                          </button>
                          <button className="px-3 py-1 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs rounded transition-colors">
                            프로필
                          </button>
                        </div>
                      </div>
                    </div>
                  )) : null}
                  <div className="text-center pt-4">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      모든 즐겨찾는 전문가 보기
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* (이전 위치) 상담 추천 섹션 제거됨 - 전문가 찾기 페이지 상단으로 이동 */}
      </div>

      {/* AI 토큰 구매 확인 모달 */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                AI상담 토큰 구매
              </h3>
              <p className="text-gray-600">
                100크레딧을 사용하여 100,000토큰을 구매하시겠습니까?
              </p>
            </div>

            {/* 크레딧 정보 */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">현재 보유 크레딧:</span>
                <span className="font-semibold text-gray-900">{user.credits.toLocaleString()}크레딧</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">사용할 크레딧:</span>
                <span className="font-semibold text-red-600">-100크레딧</span>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">차감 후 크레딧:</span>
                  <span className={`font-semibold ${user.credits >= 100 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.max(0, user.credits - 100).toLocaleString()}크레딧
                  </span>
                </div>
              </div>

            </div>

            {/* 무료 제공량 상태 */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="text-center">
                <h4 className="text-sm font-semibold text-yellow-800 mb-2">무료 제공량 상태</h4>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2 overflow-hidden">
                  <div 
                    className="h-2 rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-green-400 to-yellow-500"
                    style={{ 
                      width: `${aiTokenData && aiTokenData.summary?.freeTokensUsagePercent !== undefined ? 
                        Math.max(1, Math.min(100, 100 - aiTokenData.summary.freeTokensUsagePercent)) : 0}%` 
                    }}
                  ></div>
                </div>
                <p className="text-sm text-yellow-700">
                  무료 제공량 {aiTokenData && aiTokenData.summary?.freeTokensUsagePercent !== undefined ? 
                    (100 - aiTokenData.summary.freeTokensUsagePercent) : '...'}% 남음
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  {aiTokenData ? Math.floor((aiTokenData.summary?.remainingFreeTokens || 0) / 900) : '...'}턴 남음
                </p>
              </div>
            </div>

            {/* 버튼 그룹 */}
            <div className="flex space-x-3">
              {user.credits >= 100 && aiTokenData && aiTokenData.summary?.freeTokensUsagePercent >= 70 ? (
                <button
                  onClick={handleConfirmPurchase}
                  disabled={isPurchasing}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isPurchasing
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isPurchasing ? '구매 중...' : '확인'}
                </button>
              ) : user.credits < 100 ? (
                <button
                  onClick={handleGoToCreditTopup}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  크레딧 충전하기
                </button>
              ) : (
                <button
                  disabled
                  className="flex-1 px-4 py-2 bg-gray-400 cursor-not-allowed text-white rounded-lg text-sm font-medium"
                >
                  무료 제공량 30% 이상 남음
                </button>
              )}
              <button
                onClick={() => setShowPurchaseModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
