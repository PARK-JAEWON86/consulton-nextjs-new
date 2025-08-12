"use client";

import { useState } from "react";
import {
  BarChart3,
  MessageCircle,
  Users,
  Video,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  BookOpen,
  Star,
  FileText,
  CheckCircle,
  TrendingUp,
  DollarSign,
  Award,
  Phone,
  Mail,
  Home,
} from "lucide-react";
import CreditBalance from "./CreditBalance";
import PackCard from "./PackCard";
import UserProfile from "./UserProfile";
import ExpertProfile from "./ExpertProfile";

export default function DashboardContent() {
  const [isExpertMode, setIsExpertMode] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // 사용자 데이터
  const [user, setUser] = useState({
    name: "김철수",
    credits: 150,
    email: "kimcheolsu@example.com",
    phone: "010-1234-5678",
    location: "서울특별시 강남구",
    birthDate: "1990-05-15",
    interests: ["진로상담", "심리상담", "재무상담"],
    bio: "다양한 분야의 전문가들과 상담을 통해 성장하고 있습니다. 특히 진로와 심리 분야에 관심이 많습니다.",
    totalConsultations: 12,
    favoriteExperts: 5,
    completedGoals: 3,
    joinDate: "2024-01-15",
  });

  // 전문가 프로필 데이터
  const [expertProfile, setExpertProfile] = useState({
    name: "김민수",
    specialty: "진로상담",
    rating: 4.1,
    totalConsultations: 8,
    totalSessions: 8,
    avgRating: 4.1,
    creditsPerMinute: 1200,
    totalEarnings: 96000,
    monthlyEarnings: 48000,
    completionRate: 87.5,
    responseRate: 95,
    tags: ["취업준비", "이직", "진로고민"],
    isProfileComplete: true,
    isProfilePublic: false,
    experience: 2,
    description:
      "2년간의 HR 경험과 진로상담 자격증을 바탕으로 취업 준비생과 직장인들의 진로 고민을 함께 해결해나가고 있습니다.",
    education: ["경희대학교 경영학과 학사"],
    certifications: ["진로상담사 2급", "직업상담사 2급"],
    specialties: ["취업 준비", "이직 상담", "진로 탐색", "면접 준비"],
    consultationTypes: ["video", "chat"],
    languages: ["한국어"],
    hourlyRate: "1200",
    contactInfo: {
      phone: "010-9876-5432",
      email: "career.expert@example.com",
      location: "서울특별시 마포구",
      website: "",
    },
    profileImage: null,
    portfolioFiles: [],
  });

  // 예약된 상담 일정 데이터
  const upcomingConsultations = [
    {
      id: 1,
      expertName: "박지영",
      specialty: "심리상담",
      date: "2025-08-05",
      time: "14:00",
      type: "video",
      status: "confirmed",
    },
    {
      id: 2,
      expertName: "이민수",
      specialty: "법률상담",
      date: "2025-08-12",
      time: "10:30",
      type: "chat",
      status: "pending",
    },
    {
      id: 3,
      expertName: "김소연",
      specialty: "재무상담",
      date: "2025-08-18",
      time: "16:00",
      type: "video",
      status: "confirmed",
    },
  ];

  // 전문가의 예약 받은 상담 일정
  const expertConsultations = [
    {
      id: 1,
      clientName: "이*준",
      topic: "취업 준비 상담",
      date: "2025-08-05",
      time: "14:00",
      type: "video",
      status: "confirmed",
      duration: "45분",
    },
    {
      id: 2,
      clientName: "박*영",
      topic: "이직 고민 상담",
      date: "2025-08-08",
      time: "19:00",
      type: "chat",
      status: "pending",
      duration: "30분",
    },
  ];

  // 상담 일지 데이터
  const consultationLogs = [
    {
      id: 1,
      expertName: "박지영",
      specialty: "심리상담",
      date: "2024-12-10",
      duration: "45분",
      rating: 5,
      summary:
        "스트레스 관리 방법에 대해 상담받았습니다. 매우 도움이 되었어요.",
      status: "completed",
    },
    {
      id: 2,
      expertName: "이민수",
      specialty: "법률상담",
      date: "2024-12-08",
      duration: "30분",
      rating: 4,
      summary: "계약서 검토에 대한 조언을 받았습니다.",
      status: "completed",
    },
  ];

  // 전문가의 최근 완료된 상담
  const expertCompletedConsultations = [
    {
      id: 1,
      clientName: "정*우",
      topic: "면접 준비",
      date: "2024-12-15",
      duration: "40분",
      rating: 4,
      earnings: 48000,
      feedback: "면접 준비에 많은 도움이 되었습니다.",
    },
    {
      id: 2,
      clientName: "최*진",
      topic: "진로 고민",
      date: "2024-12-10",
      duration: "50분",
      rating: 4,
      earnings: 60000,
      feedback: "진로 방향을 정하는데 도움이 되었어요.",
    },
  ];

  // 즐겨찾는 전문가 데이터
  const favoriteExperts = [
    {
      id: 1,
      name: "박지영",
      specialty: "심리상담",
      rating: 4.9,
      consultations: 12,
      image: null,
      tags: ["스트레스", "우울증", "불안장애"],
      isOnline: true,
    },
    {
      id: 2,
      name: "김소연",
      specialty: "재무상담",
      rating: 4.8,
      consultations: 8,
      image: null,
      tags: ["투자", "자산관리", "세무"],
      isOnline: false,
    },
  ];

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

  // 전문가 프로필 저장 핸들러
  const handleExpertProfileSave = (profileData: any) => {
    console.log("전문가 프로필 저장:", profileData);
    setExpertProfile((prev) => ({ ...prev, ...profileData }));
  };

  // 사용자 프로필 저장 핸들러
  const handleUserProfileSave = (profileData: any) => {
    console.log("사용자 프로필 저장:", profileData);
    setUser((prev) => ({ ...prev, ...profileData }));
  };

  // 프로필 공개 토글 핸들러
  const handleProfilePublicToggle = () => {
    setExpertProfile((prev) => ({
      ...prev,
      isProfilePublic: !prev.isProfilePublic,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  안녕하세요, {isExpertMode ? expertProfile.name : user.name}{" "}
                  님!
                </h1>
                <p className="text-gray-600 mt-2">
                  {isExpertMode
                    ? "브론즈 레벨 진로상담 전문가로 활동 중입니다. 더 많은 경험을 쌓아보세요!"
                    : "오늘도 전문가와 함께 성장해보세요."}
                </p>
              </div>
            </div>
            <div className="flex-shrink-0 ml-6">
              {/* 모드 토글 버튼 */}
              <div className="flex items-center space-x-3">
                <span
                  className={`text-sm font-medium transition-colors ${
                    !isExpertMode ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  사용자 모드
                </span>
                <button
                  onClick={() => setIsExpertMode(!isExpertMode)}
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  style={{
                    backgroundColor: isExpertMode ? "#3B82F6" : "#E5E7EB",
                  }}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isExpertMode ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span
                  className={`text-sm font-medium transition-colors ${
                    isExpertMode ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  전문가 모드
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 전문가 통계 / 크레딧 잔액 */}
        <div className="mb-8">
          {isExpertMode ? (
            // 전문가 모드 - 통계 카드들
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      총 상담 수
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {expertProfile.totalConsultations}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      이번 달 수익
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.floor(expertProfile.monthlyEarnings / 10)} 크레딧
                    </p>
                    <p className="text-xs text-gray-400">
                      (₩{expertProfile.monthlyEarnings.toLocaleString()})
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Star className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      평균 평점
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {expertProfile.rating}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Award className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">완료율</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {expertProfile.completionRate}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // 사용자 모드 - 크레딧 잔액
            <CreditBalance credits={user.credits} />
          )}
        </div>

        {/* 프로필 섹션 */}
        <div className="mb-8">
          {isExpertMode ? (
            // 전문가 모드 - 전문가 프로필
            <>
              {/* 프로필 공개 설정 */}
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      프로필 공개 설정
                    </h3>
                    <p className="text-sm text-gray-600">
                      프로필을 공개하면 다른 사용자들이 전문가 검색에서 찾을 수
                      있습니다.
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 ml-6">
                    <span
                      className={`text-sm font-medium transition-colors ${
                        !expertProfile.isProfilePublic
                          ? "text-gray-500"
                          : "text-gray-400"
                      }`}
                    >
                      비공개
                    </span>
                    <button
                      onClick={handleProfilePublicToggle}
                      className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      style={{
                        backgroundColor: expertProfile.isProfilePublic
                          ? "#3B82F6"
                          : "#E5E7EB",
                      }}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          expertProfile.isProfilePublic
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                    <span
                      className={`text-sm font-medium transition-colors ${
                        expertProfile.isProfilePublic
                          ? "text-blue-600"
                          : "text-gray-400"
                      }`}
                    >
                      공개
                    </span>
                  </div>
                </div>
                {expertProfile.isProfilePublic && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">
                          프로필이 공개되었습니다!
                        </p>
                        <p className="text-sm text-blue-700 mt-1">
                          이제 다른 사용자들이 전문가 검색에서 회원님의 프로필을
                          찾을 수 있습니다.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <ExpertProfile
                expertData={expertProfile}
                onSave={handleExpertProfileSave}
              />
            </>
          ) : (
            // 사용자 모드 - 사용자 프로필
            <UserProfile />
          )}
        </div>

        {/* 상담 일정 섹션 */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Calendar className="h-5 w-5 text-blue-600 mr-2" />
              {isExpertMode ? "예약 받은 상담 일정" : "다음 예약된 상담 일정"}
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

                {(isExpertMode ? expertConsultations : upcomingConsultations)
                  .length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {isExpertMode
                        ? "예약 받은 상담이 없습니다."
                        : "예약된 상담이 없습니다."}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      {isExpertMode
                        ? "새로운 상담 요청을 기다리고 있습니다."
                        : "전문가를 찾아 새로운 상담을 예약해보세요."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {(isExpertMode
                      ? expertConsultations
                      : selectedDate
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
                                {isExpertMode
                                  ? (consultation as any).clientName
                                  : (consultation as any).expertName}
                              </h5>
                              <p className="text-xs text-gray-500">
                                {isExpertMode
                                  ? (consultation as any).topic
                                  : (consultation as any).specialty}
                              </p>
                              <div className="flex items-center text-xs text-gray-500 mt-1">
                                <Clock className="h-3 w-3 mr-1" />
                                {consultation.date} {consultation.time}
                                {isExpertMode && (
                                  <span className="h-3 w-3 mr-1" />
                                )}
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
                {isExpertMode ? "최근 완료한 상담" : "최근 상담 일지"}
              </h3>
            </div>
            <div className="p-6">
              {(isExpertMode ? expertCompletedConsultations : consultationLogs)
                .length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {isExpertMode
                      ? "아직 완료한 상담이 없습니다."
                      : "아직 완료된 상담이 없습니다."}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {isExpertMode
                      ? "첫 상담을 시작해보세요!"
                      : "첫 상담을 시작해보세요!"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {(isExpertMode
                    ? expertCompletedConsultations
                    : consultationLogs
                  ).map((log) => (
                    <div
                      key={log.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="text-sm font-medium text-gray-900">
                              {isExpertMode
                                ? (log as any).clientName
                                : (log as any).expertName}
                            </h4>
                            <span className="text-xs text-gray-500">
                              {isExpertMode
                                ? (log as any).topic
                                : (log as any).specialty}
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
                            {isExpertMode
                              ? (log as any).feedback
                              : (log as any).summary}
                          </p>
                          <div className="flex items-center text-xs text-gray-500 space-x-4">
                            <span>{log.date}</span>
                            <span>{log.duration}</span>
                            {isExpertMode && (
                              <span className="text-green-600 font-medium">
                                ₩{(log as any).earnings?.toLocaleString()}
                              </span>
                            )}
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
                      {isExpertMode
                        ? "모든 완료한 상담 보기"
                        : "모든 상담 일지 보기"}
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
                {isExpertMode ? "단골 고객" : "즐겨찾는 전문가"}
              </h3>
            </div>
            <div className="p-6">
              {favoriteExperts.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {isExpertMode
                      ? "단골 고객이 없습니다."
                      : "즐겨찾는 전문가가 없습니다."}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {isExpertMode
                      ? "더 많은 상담을 통해 단골 고객을 만들어보세요!"
                      : "전문가를 즐겨찾기에 추가해보세요!"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {favoriteExperts.map((expert) => (
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
                          {isExpertMode ? (
                            <>
                              <button className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded transition-colors flex items-center">
                                <Phone className="h-3 w-3 mr-1" />
                                연락하기
                              </button>
                              <button className="px-3 py-1 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs rounded transition-colors">
                                상담 기록
                              </button>
                            </>
                          ) : (
                            <>
                              <button className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded transition-colors">
                                상담하기
                              </button>
                              <button className="px-3 py-1 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs rounded transition-colors">
                                프로필
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="text-center pt-4">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      {isExpertMode
                        ? "모든 단골 고객 보기"
                        : "모든 즐겨찾는 전문가 보기"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* (이전 위치) 상담 추천 섹션 제거됨 - 전문가 찾기 페이지 상단으로 이동 */}
      </div>
    </div>
  );
}
