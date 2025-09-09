"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  MessageCircle,
  Clock,
} from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string;
  credits: number;
  expertLevel: string;
  role?: 'expert' | 'client' | 'admin';
  createdAt?: string;
}

interface AppState {
  isAuthenticated: boolean;
  user: User | null;
}

interface UserStatsProps {
  readOnly?: boolean;
}

const UserStats = ({ readOnly = true }: UserStatsProps) => {
  const [appState, setAppState] = useState<AppState>({
    isAuthenticated: false,
    user: null
  });
  const [userStats, setUserStats] = useState({
    thisMonthConsultations: 0,
    nextAppointment: null,
    totalConsultationTime: 0,
    mostFrequentCategory: ""
  });
  const [isLoading, setIsLoading] = useState(true);

  // 앱 상태 로드
  useEffect(() => {
    const loadAppState = async () => {
      try {
        const response = await fetch('/api/app-state');
        const result = await response.json();
        if (result.success) {
          setAppState({
            isAuthenticated: result.data.isAuthenticated,
            user: result.data.user
          });
        }
      } catch (error) {
        console.error('앱 상태 로드 실패:', error);
      }
    };

    loadAppState();
  }, []);

  // 사용자 통계 데이터 로드
  useEffect(() => {
    const loadUserStats = async () => {
      if (appState.isAuthenticated && appState.user) {
        try {
          setIsLoading(true);
          
          // 사용자 통계 정보 가져오기
          const statsResponse = await fetch('/api/user-stats');
          let stats = {
            thisMonthConsultations: 0,
            nextAppointment: null,
            totalConsultationTime: 0,
            mostFrequentCategory: ""
          };
          
          if (statsResponse.ok) {
            const statsResult = await statsResponse.json();
            if (statsResult.success) {
              stats = {
                thisMonthConsultations: statsResult.data.thisMonthConsultations || 0,
                nextAppointment: statsResult.data.nextAppointment || null,
                totalConsultationTime: statsResult.data.totalConsultationTime || 0,
                mostFrequentCategory: statsResult.data.mostFrequentCategory || ""
              };
            }
          }
          
          setUserStats(stats);
        } catch (error) {
          console.error('사용자 통계 로드 실패:', error);
          setUserStats({
            thisMonthConsultations: 0,
            nextAppointment: null,
            totalConsultationTime: 0,
            mostFrequentCategory: ""
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadUserStats();
  }, [appState.isAuthenticated, appState.user]);

  const calculateMembershipDuration = () => {
    if (!userStats.joinDate) return "-";
    const joinDate = new Date(userStats.joinDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - joinDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays}일`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months}개월`;
    } else {
      const years = Math.floor(diffDays / 365);
      const months = Math.floor((diffDays % 365) / 30);
      return months > 0 ? `${years}년 ${months}개월` : `${years}년`;
    }
  };

  // 로딩 중이거나 인증되지 않은 경우
  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-500">통계를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  if (!appState.isAuthenticated || !appState.user) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-12">
          <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">로그인이 필요합니다.</p>
        </div>
      </div>
    );
  }

  const formatNextAppointment = (appointment: any) => {
    if (!appointment) return "예약 없음";
    const date = new Date(appointment);
    return `${date.getMonth() + 1}월 ${date.getDate()}일 ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const formatConsultationTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}분`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}시간 ${remainingMinutes}분` : `${hours}시간`;
  };


  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
          나의 상담 현황
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          맞춤형 상담 통계와 추천을 확인하세요.
        </p>
      </div>

      <div className="p-6">
        {/* 상담 현황 통계 */}
        <div className="mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
              <div className="flex items-center">
                <MessageCircle className="h-6 w-6 md:h-8 md:w-8 text-blue-500 mr-2 md:mr-3" />
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600">상담 회수</p>
                  <p className="text-lg md:text-2xl font-bold text-gray-900">{userStats.thisMonthConsultations}회</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
              <div className="flex items-center">
                <Clock className="h-6 w-6 md:h-8 md:w-8 text-green-500 mr-2 md:mr-3" />
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600">다음 예약</p>
                  <p className="text-lg md:text-2xl font-bold text-gray-900">
                    {userStats.nextAppointment ? formatNextAppointment(userStats.nextAppointment) : '예약 없음'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
              <div className="flex items-center">
                <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-purple-500 mr-2 md:mr-3" />
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600">총 상담 시간</p>
                  <p className="text-lg md:text-2xl font-bold text-gray-900">
                    {formatConsultationTime(userStats.totalConsultationTime)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
              <div className="flex items-center">
                <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-orange-500 mr-2 md:mr-3" />
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600">주로 이용하는 상담분야</p>
                  <p className="text-lg md:text-2xl font-bold text-gray-900">
                    {userStats.mostFrequentCategory || "진로상담"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStats;
