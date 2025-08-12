"use client";

import { useState } from "react";
import {
  Menu,
  User,
  Settings,
  LogOut,
  Users,
  MessageCircle,
  CreditCard,
} from "lucide-react";
import { useAIChatCreditsStore } from "@/stores/aiChatCreditsStore";
import React from "react"; // Added missing import

interface NavbarProps {
  onBackToLanding?: () => void;
  onNavigate?: (route: string) => void;
}

const Navbar = ({ onBackToLanding, onNavigate }: NavbarProps = {}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isToggleOn, setIsToggleOn] = useState(true);
  const [showNavMenu, setShowNavMenu] = useState(false);

  // AI 채팅 크레딧 스토어에서 크레딧 정보 가져오기
  const { remainingAIChatCredits, checkAndResetMonthly, setCreditsTo7300 } =
    useAIChatCreditsStore();

  // 컴포넌트 마운트 시 월간 리셋 체크 및 크레딧을 7300으로 설정
  React.useEffect(() => {
    checkAndResetMonthly();
    setCreditsTo7300(); // 크레딧을 7300으로 설정
  }, [checkAndResetMonthly, setCreditsTo7300]);

  const handleLogout = () => {
    // 로그아웃 로직
    console.log("Logout");
    window.location.href = "/auth/login";
  };

  const handleToggleClick = () => {
    if (isToggleOn) {
      setIsToggleOn(false);
      // OFF로 바뀔 때 랜딩페이지로 이동
      setTimeout(() => {
        if (onBackToLanding) {
          onBackToLanding();
        } else {
          window.location.href = "/";
        }
      }, 500); // 애니메이션 효과를 위한 짧은 딜레이
    } else {
      setIsToggleOn(true);
    }
  };

  const handleNavigate = (route: string) => {
    // 네비게이션 처리 로직
    console.log("Navigate to:", route);
    if (onNavigate) {
      onNavigate(route);
    } else {
      // 기본 네비게이션 로직
      switch (route) {
        case "expertSearch":
          window.location.href = "/experts";
          break;
        case "community":
          window.location.href = "/community";
          break;
        case "creditPackages":
          window.location.href = "/credit-packages";
          break;
        default:
          break;
      }
    }
  };

  // 크레딧 잔액에 따른 색상 결정
  const getCreditColor = (credits: number) => {
    if (credits > 200) return "text-green-600";
    if (credits > 100) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200 py-4 h-16 z-40">
        <div className="flex items-center justify-between px-14">
          {/* 좌측: 로고+토글 */}
          <div className="flex items-center gap-4">
            {/* Consult 로고와 토글 버튼 */}
            <div className="flex items-center gap-2">
              {/* Consult 텍스트 */}
              <h1 className="text-2xl font-bold text-blue-600 tracking-tight">
                Consult
              </h1>

              {/* 토글 버튼 */}
              <button
                onClick={handleToggleClick}
                className={`relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent h-8 w-16 focus:outline-none transition-all duration-500 ${
                  isToggleOn ? "bg-blue-600" : "bg-gray-400"
                }`}
                role="switch"
                aria-checked={isToggleOn}
              >
                {/* ON/OFF 텍스트 */}
                <span
                  className={`absolute top-0 bottom-0 flex items-center font-black text-white text-xs z-20 transition-all duration-500 ${
                    isToggleOn ? "left-2.5" : "right-2.5"
                  }`}
                  style={{
                    textShadow:
                      "0 1px 0 rgba(255,255,255,0.3), 0 -1px 0 rgba(0,0,0,0.7)",
                  }}
                >
                  {isToggleOn ? "ON" : "OFF"}
                </span>

                {/* 토글 슬라이더 */}
                <span
                  className={`pointer-events-none inline-block transform rounded-full bg-white shadow ring-0 h-5 w-5 relative z-10 transition-transform duration-500 ${
                    isToggleOn ? "translate-x-9" : "translate-x-1"
                  }`}
                  style={{ marginTop: "4px" }}
                />
              </button>
            </div>
          </div>

          {/* 중앙: 네비게이션 링크들 */}
          <div className="hidden lg:flex items-center space-x-8">
            <button
              onClick={() => handleNavigate("expertSearch")}
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              전문가찾기
            </button>
            <button
              onClick={() => handleNavigate("community")}
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              커뮤니티
            </button>
          </div>

          {/* 우측: 크레딧 + 프로필 */}
          <div className="flex items-center space-x-6">
            {/* 크레딧 잔액 표시 - 데스크탑에서만 표시 */}
            <div className="hidden lg:flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                <CreditCard className="h-4 w-4 text-blue-600" />
                <span
                  className={`text-sm font-medium ${getCreditColor(remainingAIChatCredits)}`}
                >
                  {remainingAIChatCredits} 크레딧
                </span>
              </div>
              <button
                onClick={() => handleNavigate("creditPackages")}
                className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                충전
              </button>
            </div>

            {/* 모바일에서 햄버거 버튼과 프로필을 함께 배치 - 오른쪽 정렬 */}
            <div className="flex items-center justify-end lg:hidden">
              {/* 네비게이션 햄버거 버튼 - 모바일에서만 표시 */}
              <div className="relative mr-2">
                <button
                  onClick={() => setShowNavMenu(!showNavMenu)}
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  <Menu className="h-5 w-5" />
                </button>

                {/* 모바일 네비게이션 드롭다운 메뉴 */}
                {showNavMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="py-2">
                      <button
                        onClick={() => {
                          handleNavigate("expertSearch");
                          setShowNavMenu(false);
                        }}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        <Users className="h-4 w-4" />
                        <span>전문가찾기</span>
                      </button>
                      <button
                        onClick={() => {
                          handleNavigate("community");
                          setShowNavMenu(false);
                        }}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>커뮤니티</span>
                      </button>

                      {/* 모바일에서 크레딧 정보 표시 */}
                      <div className="px-4 py-2 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-700">
                            크레딧 잔액
                          </span>
                          <span
                            className={`text-sm font-medium ${getCreditColor(remainingAIChatCredits)}`}
                          >
                            {remainingAIChatCredits} 크레딧
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            handleNavigate("creditPackages");
                            setShowNavMenu(false);
                          }}
                          className="w-full bg-blue-600 text-white text-sm font-medium py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          크레딧 충전
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 프로필 */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">김</span>
                  </div>
                  <span className="text-sm text-gray-700 font-medium hidden lg:block">
                    김철수님
                  </span>
                </button>

                {/* 사용자 드롭다운 메뉴 */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        김철수님
                      </p>
                      <p className="text-sm text-gray-500">user@example.com</p>
                    </div>

                    <div className="py-2">
                      <a
                        href="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <User className="h-4 w-4" />
                        <span>프로필</span>
                      </a>

                      <a
                        href="/settings"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="h-4 w-4" />
                        <span>설정</span>
                      </a>
                    </div>

                    <div className="py-2 border-t border-gray-200">
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>로그아웃</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 데스크탑에서 프로필 */}
            <div className="relative hidden lg:block">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">김</span>
                </div>
                <span className="text-sm text-gray-700 font-medium">
                  김철수님
                </span>
              </button>

              {/* 사용자 드롭다운 메뉴 */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">
                      김철수님
                    </p>
                    <p className="text-sm text-gray-500">user@example.com</p>
                  </div>

                  <div className="py-2">
                    <a
                      href="/profile"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="h-4 w-4" />
                      <span>프로필</span>
                    </a>

                    <a
                      href="/settings"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="h-4 w-4" />
                      <span>설정</span>
                    </a>
                  </div>

                  <div className="py-2 border-t border-gray-200">
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>로그아웃</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
