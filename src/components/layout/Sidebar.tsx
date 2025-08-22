"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { expertDataService } from "@/services/ExpertDataService";
import { getChatHistory, ChatHistoryItem } from "@/data/dummy";
import {
  Home,
  MessageCircle,
  Users,
  FileText,
  Settings,
  User,
  Bell,
  Star,
  CreditCard,
  PanelLeft,
  ChevronRight,
  LogOut,
  Sun,
  Shield,
  HelpCircle,
  ArrowLeftRight,
  Calendar,
} from "lucide-react";

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
  viewMode: "user" | "expert";
}

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

interface ContextMenu {
  show: boolean;
  x: number;
  y: number;
  item: string;
}

interface EditingItem {
  id: string;
  title: string;
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
  const [contextMenu, setContextMenu] = useState<ContextMenu>({
    show: false,
    x: 0,
    y: 0,
    item: ""
  });
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    const stored = localStorage.getItem("consulton-theme");
    return stored === "dark" ? "dark" : "light";
  });

  const [appState, setAppState] = useState<AppState>({
    isAuthenticated: false,
    user: null,
    viewMode: "user"
  });

  // 앱 상태 로드 (로컬 스토리지 우선, API 백업)
  useEffect(() => {
    const loadAppState = async () => {
      try {
        // 로컬 스토리지에서 사용자 정보 복원
        const storedUser = localStorage.getItem('consulton-user');
        const storedAuth = localStorage.getItem('consulton-auth');
        const storedViewMode = localStorage.getItem('consulton-viewMode');
        
        if (storedUser && storedAuth) {
          const user = JSON.parse(storedUser);
          const isAuthenticated = JSON.parse(storedAuth);
          const viewMode = storedViewMode ? JSON.parse(storedViewMode) : 'user';
          
          setAppState({
            isAuthenticated,
            user,
            viewMode
          });
          
          // API 상태도 동기화
          try {
            await fetch('/api/app-state', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'setAuthenticated', data: { isAuthenticated } })
            });
            await fetch('/api/app-state', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'setUser', data: { user } })
            });
            await fetch('/api/app-state', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'setViewMode', data: { viewMode } })
            });
          } catch (error) {
            console.error('API 상태 동기화 실패:', error);
          }
        } else {
          // 로컬 스토리지에 없으면 API에서 로드
          const response = await fetch('/api/app-state');
          const result = await response.json();
          if (result.success) {
            setAppState({
              isAuthenticated: result.data.isAuthenticated,
              user: result.data.user,
              viewMode: result.data.viewMode
            });
          }
        }
      } catch (error) {
        console.error('앱 상태 로드 실패:', error);
      }
    };

    loadAppState();
  }, []);

  // 뷰 모드 변경 함수
  const setViewMode = async (mode: "user" | "expert") => {
    try {
      // 로컬 스토리지에 저장
      localStorage.setItem('consulton-viewMode', JSON.stringify(mode));
      
      await fetch('/api/app-state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'setViewMode', data: { viewMode: mode } })
      });
      setAppState(prev => ({ ...prev, viewMode: mode }));
    } catch (error) {
      console.error('뷰 모드 변경 실패:', error);
    }
  };

  // 유저 역할/저장된 뷰 모드 기반으로 variant 결정
  const { user, viewMode, isAuthenticated } = appState;
  
  // 하이드레이션 완료 상태 체크
  const [isHydrated, setIsHydrated] = useState(false);
  const effectiveVariant: "user" | "expert" = useMemo(() => {
    // 하이드레이션이 완료되지 않았으면 URL 기반으로 먼저 판단
    if (!isHydrated) {
      if (pathname.startsWith("/dashboard/expert")) return "expert";
      return "user";
    }
    
    // 1. 명시적으로 전달된 variant가 있으면 우선
    if (variant) return variant;
    
    // 2. 사용자가 설정한 viewMode가 있으면 그것을 사용
    if (viewMode) return viewMode;
    
    // 3. 사용자 role에 따라 결정 (로그인 직후 자동 결정)
    if (user?.role === 'expert') return "expert";
    if (user?.role === 'client' || user?.role === 'admin') return "user";
    
    // 4. URL 경로 기반 추론
    if (pathname.startsWith("/dashboard/expert")) return "expert";
    
    // 5. 기본값
    return "user";
  }, [variant, viewMode, user, pathname, isHydrated]);



  // 하이드레이션 완료 체크
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // 채팅 기록 초기화
  useEffect(() => {
    if (isAuthenticated) {
      setChatHistory(getChatHistory(20));
    }
  }, [isAuthenticated]);

  // 컨텍스트 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu(prev => ({ ...prev, show: false }));
    };

    if (contextMenu.show) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu.show]);

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
        {
          id: "reviews",
          name: "리뷰 관리",
          icon: Star,
          path: "/dashboard/expert/reviews",
        },
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
          path: "/dashboard/expert/settings",
        },
      ];
    }

    // 사용자 모드 메뉴 - 로그인 상태에 따라 다르게 표시
    const userMenu = [
      { id: "home", name: "홈", icon: Home, path: "/dashboard" },
      { id: "experts", name: "전문가 찾기", icon: Users, path: "/experts" },
      { id: "expert-consultation", name: "전문가 상담", icon: Calendar, path: "/expert-consultation" },
      { id: "chat", name: "AI 상담", icon: MessageCircle, path: "/chat" },
    ];

    // 로그인된 사용자에게만 상담 요약 메뉴 표시
    if (user && isAuthenticated) {
      userMenu.push({ id: "summary", name: "상담 요약", icon: FileText, path: "/summary" });
    }

    userMenu.push(
      {
        id: "billing",
        name: "결제 및 크레딧",
        icon: CreditCard,
        path: "/credit-packages",
      },
      {
        id: "settings",
        name: "설정",
        icon: Settings,
        path: "/dashboard/settings",
      }
    );

    return userMenu;
  }, [effectiveVariant, user, isAuthenticated]);



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
    // 로그아웃 상태에서 설정 페이지 접근 시 로그인 페이지로 이동
    if (item.id === "settings" && !isAuthenticated) {
      router.push("/auth/login?redirect=/dashboard/settings");
      if (onClose) onClose();
      return;
    }
    
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
      {/* 컨텍스트 메뉴 */}
      {contextMenu.show && (
        <div 
          className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-32"
          style={{ 
            left: contextMenu.x, 
            top: contextMenu.y,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <button
            onClick={() => {
              // 공유하기 기능
              if (navigator.share) {
                navigator.share({
                  title: contextMenu.item,
                  text: `AI 상담 기록: ${contextMenu.item}`
                });
              } else {
                // 클립보드에 복사
                navigator.clipboard.writeText(`AI 상담 기록: ${contextMenu.item}`);
              }
              setContextMenu(prev => ({ ...prev, show: false }));
            }}
            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            공유하기
          </button>
          <button
            onClick={() => {
              // 이름 바꾸기 기능 - 인라인 편집 모드 활성화
              const chatItem = chatHistory.find(item => item.title === contextMenu.item);
              if (chatItem) {
                setEditingItem({ id: chatItem.id, title: chatItem.title });
              }
              setContextMenu(prev => ({ ...prev, show: false }));
            }}
            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            이름 바꾸기
          </button>
          <button
            onClick={() => {
              // 삭제 기능
              if (confirm(`"${contextMenu.item}"을(를) 삭제하시겠습니까?`)) {
                // 여기서 실제로는 상태를 업데이트해야 함
                console.log(`삭제: ${contextMenu.item}`);
              }
              setContextMenu(prev => ({ ...prev, show: false }));
            }}
            className="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50 text-left flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            삭제
          </button>
        </div>
      )}

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
          {/* 네비게이션 바 높이만큼 상단 여백 */}
          <div className="h-16 flex-shrink-0" />

          {/* 메인 컨텐츠 영역 */}
          <div className="flex-1 flex flex-col min-h-0 px-3 py-4">
            {/* 고정 메뉴 영역 */}
            <nav className="space-y-1 flex-shrink-0 mb-4">
              {!isHydrated ? (
                // 로딩 상태의 메뉴 스켈레톤
                Array.from({ length: effectiveVariant === "expert" ? 7 : 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="w-full flex items-center gap-3 rounded-md px-3 py-2"
                  >
                    <div className="h-5 w-5 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded animate-pulse flex-1 max-w-24"></div>
                  </div>
                ))
              ) : (
                // 실제 메뉴
                primaryMenu.map((item) => {
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
                })
              )}
            </nav>

            {/* 스크롤 가능한 채팅 기록 영역 - AI 상담 메뉴 선택 시에만 표시 */}
            {isAuthenticated && isActivePath("/chat") && (
              <div className="mt-16 flex-1 overflow-y-auto min-h-0">
                <p className="px-3 text-xs font-semibold text-gray-400 mb-3">
                  AI 채팅 상담
                </p>
                <ul className="space-y-1">
                  {chatHistory.map((chatItem) => (
                    <li
                      key={chatItem.id}
                      className="px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50 cursor-pointer relative group"
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setContextMenu({ show: true, x: e.clientX, y: e.clientY, item: chatItem.title });
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          {editingItem?.id === chatItem.id ? (
                            <input
                              type="text"
                              value={editingItem.title}
                              onChange={(e) => setEditingItem(prev => prev ? { ...prev, title: e.target.value } : null)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  // 저장
                                  setChatHistory(prev => 
                                    prev.map(item => 
                                      item.id === chatItem.id 
                                        ? { ...item, title: editingItem.title }
                                        : item
                                    )
                                  );
                                  setEditingItem(null);
                                } else if (e.key === 'Escape') {
                                  // 취소
                                  setEditingItem(null);
                                }
                              }}
                              onBlur={() => {
                                // 저장
                                setChatHistory(prev => 
                                  prev.map(item => 
                                    item.id === chatItem.id 
                                      ? { ...item, title: editingItem.title }
                                      : item
                                  )
                                );
                                setEditingItem(null);
                              }}
                              className="w-full bg-white border border-blue-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              autoFocus
                            />
                          ) : (
                            <span className="truncate block">{chatItem.title}</span>
                          )}
                        </div>
                        <button 
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded flex-shrink-0 ml-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            setContextMenu({ show: true, x: e.clientX, y: e.clientY, item: chatItem.title });
                          }}
                        >
                          <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* 프로필 섹션 - 하단 고정 */}
          <div className="border-t border-gray-200 p-3 flex-shrink-0">
            <div className="relative">
              {!isHydrated ? (
                // 로딩 상태
                <div className="w-full flex items-center gap-3 rounded-md px-2 py-2">
                  <div className="relative w-9 h-9 rounded-full overflow-hidden bg-gray-300 animate-pulse" style={{minWidth: '36px', minHeight: '36px'}}>
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="h-4 bg-gray-300 rounded animate-pulse w-16"></div>
                    </div>
                    <div className="mt-1">
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-2">
                    <div className="h-4 w-4 bg-gray-300 rounded animate-pulse"></div>
                  </div>
                </div>
              ) : (
                // 실제 프로필
                <button
                  onClick={() => setShowProfileMenu((v) => !v)}
                  className="w-full flex items-center gap-3 rounded-md px-2 py-2 hover:bg-gray-50"
                >
                  <div className="relative w-9 h-9 rounded-full overflow-hidden bg-blue-600" style={{minWidth: '36px', minHeight: '36px'}}>
                    <div className="w-full h-full flex items-center justify-center text-white text-sm font-medium">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "G"}
                    </div>
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {user?.name || "게스트"}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {user?.email || "guest@example.com"}
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-2">
                    <ChevronRight
                      className={`h-4 w-4 text-gray-500 transition-transform ${showProfileMenu ? "rotate-90" : ""}`}
                    />
                  </div>
                </button>
              )}

              {showProfileMenu && (
                <div className="absolute bottom-12 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-40 overflow-hidden">
                  <div className="py-1">
                    {/* 전문가 계정이면 모드 전환, 일반 사용자면 전문가 지원 */}
                    {user?.role === 'expert' ? (
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
                    ) : (
                      <button
                        onClick={() => {
                          router.push("/experts/become");
                          setShowProfileMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <ArrowLeftRight className="h-4 w-4 text-gray-600" />
                        <span>전문가 지원하기</span>
                      </button>
                    )}

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

                    <div className="my-1 border-t border-gray-200" />

                    {/* 인증 상태에 따라 다른 메뉴 표시 */}
                    {isAuthenticated ? (
                      <button
                        onClick={async () => {
                          try {
                            // 로컬 스토리지 정리
                            localStorage.removeItem('consulton-user');
                            localStorage.removeItem('consulton-auth');
                            localStorage.removeItem('consulton-viewMode');
                            
                            await fetch('/api/app-state', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ action: 'logout', data: {} })
                            });
                            setAppState(prev => ({ ...prev, isAuthenticated: false, user: null }));
                            router.push("/auth/login");
                            setShowProfileMenu(false);
                          } catch (error) {
                            console.error('로그아웃 실패:', error);
                          }
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>로그아웃</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          router.push("/auth/login");
                          setShowProfileMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-blue-600 hover:bg-gray-50"
                      >
                        <LogOut className="h-4 w-4 rotate-180" />
                        <span>로그인</span>
                      </button>
                    )}
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
