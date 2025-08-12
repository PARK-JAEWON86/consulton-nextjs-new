"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  MessageCircle,
  Users,
  Video,
  FileText,
  Settings,
  User,
  X,
  ChevronRight,
  BarChart3,
  CreditCard,
  Bell,
  Sparkles,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onToggle?: () => void;
}

interface MenuItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  description: string;
  badge?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen = false,
  onClose,
  onToggle,
}) => {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<MenuItem | null>(
    null
  );
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = useMemo<MenuItem[]>(
    () => [
      {
        id: "chat",
        name: "Quick AI 상담",
        icon: Sparkles,
        path: "/chat",
        description: "AI와 상담하기",
      },
      {
        id: "experts",
        name: "전문가 찾기",
        icon: Users,
        path: "/experts",
        description: "전문가 검색 및 매칭",
      },
      {
        id: "video",
        name: "상담 시작",
        icon: Video,
        path: "/video",
        description: "전문가와 상담 시작",
      },
      {
        id: "summary",
        name: "상담 요약",
        icon: FileText,
        path: "/summary",
        description: "상담 기록 보기",
      },
      {
        id: "analytics",
        name: "분석 리포트",
        icon: BarChart3,
        path: "/analytics",
        description: "상담 통계",
      },
    ],
    []
  );

  const settingsItems = useMemo<MenuItem[]>(
    () => [
      {
        id: "dashboard",
        name: "대시보드",
        icon: Home,
        path: "/dashboard",
        description: "전체 현황 보기",
      },
      {
        id: "notifications",
        name: "알림 설정",
        icon: Bell,
        path: "/dashboard/notifications",
        description: "알림 관리",
      },
      {
        id: "billing",
        name: "결제 및 크레딧",
        icon: CreditCard,
        path: "/credit-packages",
        description: "크레딧 관리",
      },
      {
        id: "settings",
        name: "설정",
        icon: Settings,
        path: "/dashboard/settings",
        description: "일반 설정",
      },
    ],
    []
  );

  // 현재 경로에 따라 활성 아이템 설정
  useEffect(() => {
    const currentPath = pathname;

    // 메인 메뉴에서 일치하는 항목 찾기
    const mainMenuItem = menuItems.find((item) => {
      if (item.id === "summary") {
        // 상담 요약의 경우 /summary 경로와 /summary/[id] 경로 모두 처리
        return (
          currentPath === "/summary" || currentPath.startsWith("/summary/")
        );
      }
      if (item.id === "experts") {
        // 전문가 찾기의 경우 /experts 경로 처리
        return currentPath === "/experts";
      }
      return currentPath === item.path;
    });

    if (mainMenuItem) {
      setActiveItem(mainMenuItem.id);
      return;
    }

    // 설정 메뉴에서 일치하는 항목 찾기
    const settingMenuItem = settingsItems.find(
      (item) => currentPath === item.path
    );
    if (settingMenuItem) {
      setActiveItem(settingMenuItem.id);
      return;
    }

    // 대시보드 하위 경로들 처리
    if (currentPath.startsWith("/dashboard/")) {
      const dashboardSubPath = currentPath.replace("/dashboard/", "");
      const subMenuItem = settingsItems.find(
        (item) => item.path === `/dashboard/${dashboardSubPath}`
      );
      if (subMenuItem) {
        setActiveItem(subMenuItem.id);
      }
    }
  }, [pathname, menuItems, settingsItems]);

  const handleItemClick = (item: MenuItem) => {
    setActiveItem(item.id);

    // Quick AI 상담 버튼 클릭 시 현재 페이지가 /chat이면 모달을 표시하도록 sessionStorage 플래그 설정
    if (item.id === "chat" && pathname === "/chat") {
      sessionStorage.setItem("showQuickChatModal", "true");
      // 현재 페이지를 다시 로드하여 모달 표시
      window.location.reload();
    } else if (pathname === "/chat" && item.id !== "chat") {
      // AI 상담 화면에서 다른 메뉴 클릭 시 경고 모달 표시
      setPendingNavigation(item);
      setShowExitWarning(true);
    } else {
      // 일반적인 네비게이션 처리
      router.push(item.path);
    }

    // 모바일에서 사이드바 닫기
    if (onClose) {
      onClose();
    }
  };

  const handleConfirmNavigation = () => {
    if (pendingNavigation) {
      router.push(pendingNavigation.path);
      setShowExitWarning(false);
      setPendingNavigation(null);
    }
  };

  const handleCancelNavigation = () => {
    setShowExitWarning(false);
    setPendingNavigation(null);
  };

  return (
    <>
      {/* 상담 종료 경고 모달 */}
      {showExitWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  상담이 저장되지 않습니다
                </h2>
                <p className="text-gray-600">
                  현재 진행 중인 AI 상담이 저장되지 않고 종료됩니다.
                  계속하시겠습니까?
                </p>
              </div>

              {/* 버튼들 */}
              <div className="flex space-x-3">
                <button
                  onClick={handleCancelNavigation}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleConfirmNavigation}
                  className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 text-white py-3 px-4 rounded-lg font-medium hover:from-red-600 hover:to-pink-700 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  계속하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 사이드바 토글 버튼 - 네비게이션바 아래 */}
      <button
        onClick={onToggle}
        className="fixed top-20 left-4 z-50 lg:hidden p-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        <PanelLeft className="h-5 w-5 text-gray-600" />
      </button>

      {/* 모바일 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* 사이드바 */}
      <div
        className={`fixed top-0 left-0 bottom-0 z-30 bg-white border-r border-gray-200 transform transition-all duration-300 ease-in-out lg:translate-x-0 w-64 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* 네비게이션 바 공간 확보 */}
          <div className="h-16"></div>

          {/* 모바일용 헤더 - 닫기 버튼 제거 */}
          <div className="flex items-center justify-center p-4 border-b border-gray-200 lg:hidden">
            <span className="text-sm text-gray-600 font-medium">메뉴</span>
          </div>

          {/* 메뉴 섹션 */}
          <div className="flex-1 overflow-y-auto py-2">
            {/* 메인 메뉴 */}
            <div className="px-4 mb-4">
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = activeItem === item.id;
                  const isQuickAI = item.id === "chat";

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      className={`w-full group relative overflow-hidden rounded-xl transition-all duration-300 ${
                        isQuickAI ? "p-4" : "p-3"
                      } ${
                        isQuickAI
                          ? "bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
                          : isActive
                          ? "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 shadow-lg transform scale-105"
                          : "bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 text-gray-700 hover:shadow-md hover:transform hover:scale-102 border border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`p-2 rounded-lg transition-all duration-300 ${
                              isQuickAI
                                ? "bg-white bg-opacity-20"
                                : isActive
                                ? "bg-gray-100"
                                : "bg-gray-100 group-hover:bg-blue-100"
                            }`}
                          >
                            <IconComponent
                              className={`h-5 w-5 ${
                                isQuickAI
                                  ? "text-white"
                                  : isActive
                                  ? "text-gray-700"
                                  : "text-gray-600 group-hover:text-blue-600"
                              } ${item.id === "chat" ? "animate-pulse" : ""}`}
                            />
                          </div>
                          <div className="text-left">
                            <div
                              className={`${
                                isQuickAI
                                  ? "font-bold text-base"
                                  : "font-semibold text-sm"
                              } ${
                                isQuickAI
                                  ? "text-white"
                                  : isActive
                                  ? "text-gray-800"
                                  : "text-gray-900"
                              }`}
                            >
                              {item.name}
                            </div>
                            <div
                              className={`text-xs ${
                                isQuickAI
                                  ? "text-blue-100"
                                  : isActive
                                  ? "text-gray-600"
                                  : "text-gray-500"
                              }`}
                            >
                              {item.description}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {item.badge && (
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                                isQuickAI
                                  ? "bg-white bg-opacity-20 text-white"
                                  : isActive
                                  ? "bg-white bg-opacity-20 text-white"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                          <ChevronRight
                            className={`h-4 w-4 transition-transform duration-300 ${
                              isQuickAI
                                ? "text-white"
                                : isActive
                                ? "text-gray-600"
                                : "text-gray-400 group-hover:text-blue-600"
                            } ${
                              isQuickAI || isActive
                                ? "transform translate-x-1"
                                : ""
                            }`}
                          />
                        </div>
                      </div>

                      {/* Quick AI 상담 버튼의 특별한 글로우 효과 */}
                      {isQuickAI && (
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-300 via-blue-400 to-indigo-500 opacity-30 rounded-xl group-hover:opacity-50 transition-opacity duration-300"></div>
                      )}

                      {/* 활성 상태일 때의 글로우 효과 */}
                      {isActive && !isQuickAI && (
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-400 opacity-20 rounded-xl"></div>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* 구분선 */}
            <div className="px-4 mb-4">
              <div className="border-t border-gray-200"></div>
            </div>

            {/* 설정 메뉴 */}
            <div className="px-4">
              <nav className="space-y-2">
                {settingsItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = activeItem === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      className={`w-full group relative overflow-hidden rounded-xl transition-all duration-300 p-3 ${
                        isActive
                          ? "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 shadow-lg transform scale-105"
                          : "bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 text-gray-700 hover:shadow-md hover:transform hover:scale-102 border border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`p-2 rounded-lg transition-all duration-300 ${
                              isActive
                                ? "bg-gray-100"
                                : "bg-gray-100 group-hover:bg-gray-200"
                            }`}
                          >
                            <IconComponent
                              className={`h-5 w-5 ${
                                isActive
                                  ? "text-gray-700"
                                  : "text-gray-600 group-hover:text-gray-700"
                              }`}
                            />
                          </div>
                          <div className="text-left">
                            <div
                              className={`font-semibold text-sm ${
                                isActive ? "text-gray-800" : "text-gray-900"
                              }`}
                            >
                              {item.name}
                            </div>
                            <div
                              className={`text-xs ${
                                isActive ? "text-gray-600" : "text-gray-500"
                              }`}
                            >
                              {item.description}
                            </div>
                          </div>
                        </div>

                        <ChevronRight
                          className={`h-4 w-4 transition-transform duration-300 ${
                            isActive
                              ? "text-gray-600"
                              : "text-gray-400 group-hover:text-gray-600"
                          } ${isActive ? "transform translate-x-1" : ""}`}
                        />
                      </div>

                      {/* 활성 상태일 때의 글로우 효과 */}
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-400 opacity-20 rounded-xl"></div>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* 사이드바 하단 */}
          <div className="p-3 border-t border-gray-200">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-blue-900">
                    크레딧 잔액
                  </div>
                  <div className="text-xs text-blue-700">150 크레딧 보유</div>
                </div>
              </div>
              <button
                onClick={() => router.push("/credit-packages")}
                className="w-full bg-blue-600 text-white text-sm font-medium py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                크레딧 충전
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
