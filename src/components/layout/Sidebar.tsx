"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAIChatCreditsStore } from "../../stores/aiChatCreditsStore";
import { useAppStore } from "../../stores/appStore";
import {
  Home,
  MessageCircle,
  Users,
  FileText,
  Settings,
  User,
  Bell,
  BarChart3,
  CreditCard,
  LifeBuoy,
  Megaphone,
  PanelLeft,
  ChevronRight,
  LogOut,
  Sun,
  Shield,
  HelpCircle,
  ArrowLeftRight,
} from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onToggle?: () => void;
  variant?: "user" | "expert"; // 명시적으로 강제 가능
}

interface MenuItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen = false,
  onClose,
  onToggle,
  variant,
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const [showExitWarning, setShowExitWarning] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<MenuItem | null>(
    null
  );
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    const stored = localStorage.getItem("consulton-theme");
    return stored === "dark" ? "dark" : "light";
  });

  // 크레딧 정보
  const { remainingAIChatCredits, checkAndResetMonthly, setCreditsTo7300 } =
    useAIChatCreditsStore();

  // 유저 역할/저장된 뷰 모드 기반으로 variant 결정
  const { user, viewMode, setViewMode } = useAppStore();
  const effectiveVariant: "user" | "expert" = useMemo(() => {
    if (variant) return variant;
    if (viewMode) return viewMode;
    if (pathname.startsWith("/dashboard/expert")) return "expert";
    if (user?.expertLevel) return "expert";
    return "user";
  }, [variant, viewMode, pathname, user]);

  useEffect(() => {
    checkAndResetMonthly();
    setCreditsTo7300();
  }, [checkAndResetMonthly, setCreditsTo7300]);

  useEffect(() => {
    // 간단한 테마 토글 (class 전략)
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("consulton-theme", theme);
    }
  }, [theme]);

  // 메뉴 정의: 심플 스타일
  const primaryMenu: MenuItem[] = useMemo(() => {
    if (effectiveVariant === "expert") {
      return [
        { id: "home", name: "대시보드", icon: Home, path: "/dashboard/expert" },
        {
          id: "expert-profile",
          name: "전문가 프로필",
          icon: User,
          path: "/dashboard/expert/profile",
        },
        { id: "analytics", name: "분석", icon: BarChart3, path: "/analytics" },
        {
          id: "payouts",
          name: "정산/출금",
          icon: CreditCard,
          path: "/dashboard/expert/payouts",
        },
        {
          id: "consultations",
          name: "상담내역",
          icon: FileText,
          path: "/dashboard/expert/consultations",
        },
        {
          id: "notifications",
          name: "알림",
          icon: Bell,
          path: "/dashboard/notifications",
        },
        {
          id: "settings",
          name: "설정",
          icon: Settings,
          path: "/dashboard/settings",
        },
      ];
    }

    return [
      { id: "home", name: "홈", icon: Home, path: "/dashboard" },
      { id: "experts", name: "전문가 찾기", icon: Users, path: "/experts" },
      { id: "chat", name: "AI 상담", icon: MessageCircle, path: "/chat" },
      { id: "summary", name: "상담 요약", icon: FileText, path: "/summary" },
      {
        id: "billing",
        name: "크레딧",
        icon: CreditCard,
        path: "/credit-packages",
      },
      {
        id: "settings",
        name: "설정",
        icon: Settings,
        path: "/dashboard/settings",
      },
    ];
  }, [effectiveVariant]);

  const secondaryMenu: MenuItem[] = useMemo(
    () => [
      { id: "support", name: "지원", icon: LifeBuoy, path: "/community" },
      { id: "changelog", name: "변경 로그", icon: Megaphone, path: "/" },
    ],
    []
  );

  const isActivePath = (itemPath: string) => {
    if (itemPath === "/") return pathname === "/";
    if (itemPath === "/summary") {
      return pathname === "/summary" || pathname.startsWith("/summary/");
    }
    // 전문가 대시보드 루트는 정확히 일치할 때만 활성화
    if (itemPath === "/dashboard/expert") {
      return pathname === "/dashboard/expert";
    }
    // 사용자 대시보드 루트도 동일
    if (itemPath === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname === itemPath || pathname.startsWith(`${itemPath}/`);
  };

  const handleNavigate = (item: MenuItem) => {
    if (item.id === "chat" && pathname === "/chat") {
      sessionStorage.setItem("showQuickChatModal", "true");
      window.location.reload();
      return;
    }
    if (pathname === "/chat" && item.id !== "chat") {
      setPendingNavigation(item);
      setShowExitWarning(true);
      return;
    }
    router.push(item.path);
    if (onClose) onClose();
  };

  return (
    <>
      {showExitWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 text-center">
                현재 AI 상담이 저장되지 않고 종료됩니다. 계속하시겠어요?
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowExitWarning(false);
                    setPendingNavigation(null);
                  }}
                  className="flex-1 h-10 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200"
                >
                  취소
                </button>
                <button
                  onClick={() => {
                    if (pendingNavigation) router.push(pendingNavigation.path);
                    setShowExitWarning(false);
                    setPendingNavigation(null);
                  }}
                  className="flex-1 h-10 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  계속하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={onToggle}
        className="fixed top-20 left-4 z-50 lg:hidden p-2 bg-white rounded-md shadow border border-gray-200"
      >
        <PanelLeft className="h-5 w-5 text-gray-600" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-30 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0 w-64 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="h-16" />

          <div className="flex-1 overflow-y-auto px-3 py-4">
            <nav className="space-y-1">
              {primaryMenu.map((item) => {
                const Icon = item.icon;
                const active = isActivePath(item.path);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item)}
                    className={`w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${active ? "text-gray-900" : "text-gray-500"}`}
                    />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-6">
              <p className="px-3 text-xs font-semibold text-gray-400">
                다가오는 일정
              </p>
              <ul className="mt-2 space-y-1">
                {["팀 코칭", "이직 상담", "프로필 검수", "세션 리뷰"].map(
                  (label, i) => (
                    <li
                      key={i}
                      className="px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                    >
                      {label}
                    </li>
                  )
                )}
              </ul>
            </div>

            <div className="mt-6">
              <nav className="space-y-1">
                {secondaryMenu.map((item) => {
                  const Icon = item.icon;
                  const active = isActivePath(item.path);
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item)}
                      className={`w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        active
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${active ? "text-gray-900" : "text-gray-500"}`}
                      />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          <div className="border-t border-gray-200 p-3">
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu((v) => !v)}
                className="w-full flex items-center gap-3 rounded-md px-3 py-2 hover:bg-gray-50"
              >
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                  {(user?.name || "사용자").charAt(0)}
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-gray-900">
                    {user?.name || "게스트"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {user?.email || "guest@example.com"}
                  </div>
                </div>
                <ChevronRight
                  className={`h-4 w-4 text-gray-400 transition-transform ${showProfileMenu ? "rotate-90" : ""}`}
                />
              </button>

              {showProfileMenu && (
                <div className="absolute bottom-12 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-40 overflow-hidden">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        router.push("/credit-packages");
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <CreditCard className="h-4 w-4 text-gray-600" />
                      <span>결제 및 크레딧</span>
                    </button>

                    <button
                      onClick={() =>
                        setTheme((t) => (t === "light" ? "dark" : "light"))
                      }
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Sun className="h-4 w-4 text-gray-600" />
                      <span>테마</span>
                    </button>

                    <button
                      onClick={() => {
                        router.push("/dashboard/settings");
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Shield className="h-4 w-4 text-gray-600" />
                      <span>개인정보 처리방침</span>
                    </button>

                    <button
                      onClick={() => {
                        router.push("/community");
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <HelpCircle className="h-4 w-4 text-gray-600" />
                      <span>도움말 및 지원</span>
                    </button>

                    <button
                      onClick={() => {
                        const nextMode =
                          effectiveVariant === "expert" ? "user" : "expert";
                        setViewMode(nextMode);
                        const target =
                          nextMode === "expert"
                            ? "/dashboard/expert"
                            : "/dashboard";
                        router.push(target);
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <ArrowLeftRight className="h-4 w-4 text-gray-600" />
                      <span>
                        {effectiveVariant === "expert"
                          ? "사용자 모드로 전환"
                          : "전문가 모드로 전환"}
                      </span>
                    </button>

                    <div className="my-1 border-t border-gray-200" />

                    <button
                      onClick={() => {
                        try {
                          useAppStore.getState().logout();
                        } catch {}
                        router.push("/auth/login");
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
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
      </aside>
    </>
  );
};

export default Sidebar;
