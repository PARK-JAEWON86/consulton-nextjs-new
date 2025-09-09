"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface MainNavigationProps {}

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
  currentCredits: number;
}

const MainNavigation = ({}: MainNavigationProps) => {
  const router = useRouter();
  const isToggleOn = true; // 항상 ON 상태로 고정
  const [appState, setAppState] = useState<AppState>({
    isAuthenticated: false,
    user: null,
    currentCredits: 0
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  const [isExpert, setIsExpert] = useState(false); // 전문가 여부 상태 추가
  const [viewMode, setViewMode] = useState<"user" | "expert">("user"); // 현재 뷰 모드 상태 추가
  const [consultationRequestCount, setConsultationRequestCount] = useState(0); // 상담 요청 개수 상태

  // 앱 상태 로드
  useEffect(() => {
    const loadAppState = async () => {
      try {
        // 먼저 로컬 스토리지에서 확인
        const storedUser = localStorage.getItem('consulton-user');
        const storedAuth = localStorage.getItem('consulton-auth');
        
        if (storedUser && storedAuth) {
          try {
            const user = JSON.parse(storedUser);
            const isAuth = JSON.parse(storedAuth);
            
            if (isAuth) {
              setAppState({
                isAuthenticated: true,
                user: user,
                currentCredits: user.credits || 0
              });
              // 전문가 여부 확인 (role이 'expert'이거나 expertLevel이 있는 경우)
              setIsExpert(user.role === 'expert' || (user.expertLevel && user.expertLevel !== ''));
              
              // viewMode 로드
              const storedViewMode = localStorage.getItem('consulton-viewMode');
              if (storedViewMode) {
                try {
                  const parsedViewMode = JSON.parse(storedViewMode);
                  setViewMode(parsedViewMode);
                } catch (error) {
                  console.error('viewMode 파싱 오류:', error);
                  setViewMode(user.role === 'expert' ? 'expert' : 'user');
                }
              } else {
                setViewMode(user.role === 'expert' ? 'expert' : 'user');
              }
              
              setIsLoading(false); // 로딩 완료
              return;
            }
          } catch (error) {
            console.error('로컬 스토리지 파싱 오류:', error);
          }
        }
        
        // 서버에서 인증 상태 확인 (JWT 토큰 사용)
        const token = localStorage.getItem('consulton-token');
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.user) {
            // 서버에서 인증된 사용자 정보로 상태 업데이트
            const userData = {
              id: result.user.id.toString(),
              email: result.user.email,
              name: result.user.name,
              credits: result.user.credits || 0,
              expertLevel: result.user.expert ? 'Tier 1 (Lv.1-99)' : '',
              role: result.user.role
            };

            // 로컬 스토리지에도 저장
            localStorage.setItem('consulton-user', JSON.stringify(userData));
            localStorage.setItem('consulton-auth', JSON.stringify(true));

            setAppState({
              isAuthenticated: true,
              user: userData,
              currentCredits: userData.credits
            });
            
            // 전문가 여부 확인
            setIsExpert(userData.role === 'expert' || (userData.expertLevel && userData.expertLevel !== ''));
            
            // viewMode 로드
            const storedViewMode = localStorage.getItem('consulton-viewMode');
            if (storedViewMode) {
              try {
                const parsedViewMode = JSON.parse(storedViewMode);
                setViewMode(parsedViewMode);
              } catch (error) {
                console.error('viewMode 파싱 오류:', error);
                setViewMode(userData.role === 'expert' ? 'expert' : 'user');
              }
            } else {
              setViewMode(userData.role === 'expert' ? 'expert' : 'user');
            }
          } else {
            // 서버에서 인증 실패
            setAppState({
              isAuthenticated: false,
              user: null,
              currentCredits: 0
            });
            setIsExpert(false);
          }
        } else if (response.status === 401) {
          // 인증 실패 - 로컬 스토리지 정리
          localStorage.removeItem('consulton-user');
          localStorage.removeItem('consulton-auth');
          localStorage.removeItem('consulton-token');
          localStorage.removeItem('consulton-viewMode');
          
          setAppState({
            isAuthenticated: false,
            user: null,
            currentCredits: 0
          });
          setIsExpert(false);
        }
      } catch (error) {
        console.error('앱 상태 로드 실패:', error);
        // API 실패 시 기본 상태로 설정
        setAppState({
          isAuthenticated: false,
          user: null,
          currentCredits: 0
        });
      } finally {
        setIsLoading(false); // 로딩 완료
      }
    };

    loadAppState();
    
    // 크레딧 정보 자동 업데이트 (30초마다)
    const creditsInterval = setInterval(updateCredits, 30000);
    
    // 상담 요청 개수 자동 업데이트 (30초마다)
    const consultationRequestInterval = setInterval(updateConsultationRequestCount, 30000);
    
    return () => {
      clearInterval(creditsInterval);
      clearInterval(consultationRequestInterval);
    };
  }, []);

  // 전문가 상태 변경 시 상담 요청 개수 업데이트
  useEffect(() => {
    if (isExpert && appState.isAuthenticated) {
      updateConsultationRequestCount();
    } else {
      setConsultationRequestCount(0);
    }
  }, [isExpert, appState.isAuthenticated]);

  // 크레딧 정보 실시간 업데이트
  const updateCredits = async () => {
    if (appState.isAuthenticated) {
      try {
        const response = await fetch('/api/credit-transactions?limit=1');
        const data = await response.json();
        
        if (data.success && data.data.summary) {
          setAppState(prev => ({
            ...prev,
            currentCredits: data.data.summary.currentBalance
          }));
        }
      } catch (error) {
        console.error('크레딧 정보 업데이트 실패:', error);
      }
    }
  };

  // 상담 요청 개수 업데이트
  const updateConsultationRequestCount = async () => {
    if (appState.isAuthenticated && isExpert && appState.user) {
      try {
        // 전문가 ID를 가져와야 하므로 expert 정보를 먼저 조회
        const expertResponse = await fetch('/api/expert-profiles');
        if (!expertResponse.ok) {
          console.error('전문가 정보 조회 실패');
          return;
        }
        
        const expertData = await expertResponse.json();
        if (!expertData.success || !expertData.data) {
          console.error('전문가 데이터가 없습니다');
          return;
        }
        
        const expertId = expertData.data.id;
        const response = await fetch(`/api/consultation-requests?expertId=${expertId}&status=pending&limit=1`);
        const data = await response.json();
        
        if (data.success && data.data.summary) {
          setConsultationRequestCount(data.data.summary.pendingCount || 0);
        }
      } catch (error) {
        console.error('상담 요청 개수 업데이트 실패:', error);
        setConsultationRequestCount(0);
      }
    } else {
      setConsultationRequestCount(0);
    }
  };

  // localStorage 변경 감지하여 상태 업데이트
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const storedUser = localStorage.getItem('consulton-user');
        const storedAuth = localStorage.getItem('consulton-auth');
        
        if (storedUser && storedAuth) {
          const user = JSON.parse(storedUser);
          const isAuthenticated = JSON.parse(storedAuth);
          
          setAppState(prev => ({
            ...prev,
            isAuthenticated,
            user: isAuthenticated ? user : null,
            currentCredits: isAuthenticated ? (user.credits || 0) : 0
          }));
          // 전문가 여부 확인 및 viewMode 업데이트
          if (isAuthenticated && user) {
            setIsExpert(user.role === 'expert' || (user.expertLevel && user.expertLevel !== ''));
            
            // viewMode 업데이트
            const storedViewMode = localStorage.getItem('consulton-viewMode');
            if (storedViewMode) {
              try {
                const parsedViewMode = JSON.parse(storedViewMode);
                setViewMode(parsedViewMode);
              } catch (error) {
                console.error('viewMode 파싱 오류:', error);
                setViewMode(user.role === 'expert' ? 'expert' : 'user');
              }
            } else {
              setViewMode(user.role === 'expert' ? 'expert' : 'user');
            }
          } else {
            setIsExpert(false);
            setViewMode('user');
          }
        } else {
          setAppState(prev => ({
            ...prev,
            isAuthenticated: false,
            user: null,
            currentCredits: 0
          }));
        }
      } catch (error) {
        console.error('localStorage 변경 감지 시 파싱 오류:', error);
        // 파싱 오류 시 localStorage 정리 (JWT 토큰 포함)
        localStorage.removeItem('consulton-user');
        localStorage.removeItem('consulton-auth');
        localStorage.removeItem('consulton-token');
        setAppState(prev => ({
          ...prev,
          isAuthenticated: false,
          user: null,
          currentCredits: 0
        }));
      }
    };

    // storage 이벤트 리스너 (다른 탭에서의 변경 감지)
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      
      // 커스텀 이벤트 리스너 (같은 탭에서의 변경 감지)
      window.addEventListener('authStateChanged', handleStorageChange);
      
      // viewMode 변경 감지를 위한 별도 리스너
      const handleViewModeChange = () => {
        const storedViewMode = localStorage.getItem('consulton-viewMode');
        if (storedViewMode) {
          try {
            const parsedViewMode = JSON.parse(storedViewMode);
            setViewMode(parsedViewMode);
          } catch (error) {
            console.error('viewMode 파싱 오류:', error);
          }
        }
      };
      
      window.addEventListener('viewModeChanged', handleViewModeChange);
      
      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('authStateChanged', handleStorageChange);
        window.removeEventListener('viewModeChanged', handleViewModeChange);
      };
    }
  }, []);

  // 메뉴 외부 클릭 및 ESC 키로 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.hamburger-menu-container')) {
        setIsMenuOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isMenuOpen]);

  const handleLogout = async () => {
    try {
      // API에 로그아웃 요청
      const response = await fetch('/api/app-state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout', data: {} })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // 로컬 스토리지 정리 (JWT 토큰 포함)
      localStorage.removeItem('consulton-user');
      localStorage.removeItem('consulton-auth');
      localStorage.removeItem('consulton-viewMode');
      localStorage.removeItem('consulton-token');
      
      setAppState({ isAuthenticated: false, user: null, currentCredits: 0 });
      setIsExpert(false); // 전문가 상태 초기화
      
      // 커스텀 이벤트 발생으로 다른 컴포넌트 상태 업데이트
      window.dispatchEvent(new CustomEvent('authStateChanged', { 
        detail: { type: 'logout', name: 'user' } 
      }));
      
      router.push("/"); // 로그아웃 후 홈으로 이동
    } catch (error) {
      console.error('로그아웃 실패:', error);
      // API 실패 시에도 로컬 상태는 정리 (JWT 토큰 포함)
      localStorage.removeItem('consulton-user');
      localStorage.removeItem('consulton-auth');
      localStorage.removeItem('consulton-viewMode');
      localStorage.removeItem('consulton-token');
      
      setAppState({ isAuthenticated: false, user: null, currentCredits: 0 });
      setIsExpert(false); // 전문가 상태 초기화
      router.push("/"); // 로그아웃 후 홈으로 이동
    }
  };

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 로고 및 토글 버튼 */}
          <div className="flex items-center space-x-4">
            {/* Consult 로고와 토글 버튼 */}
            <div className="flex items-center gap-2">
              {/* Consult 텍스트 */}
              <h1
                onClick={() => router.push("/")}
                className="text-2xl font-bold text-blue-600 tracking-tight cursor-pointer hover:text-blue-700 transition-colors"
              >
                Consult
              </h1>

              {/* 토글 버튼 - 항상 ON 상태로 고정 */}
              <div
                className="relative inline-flex shrink-0 rounded-full border-2 border-transparent h-8 w-16 bg-blue-600"
                role="status"
                aria-label="Always ON"
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
              </div>
            </div>
          </div>

                    {/* 중앙 네비게이션 */}
          <nav className="hidden lg:flex space-x-8">
            {isLoading ? (
              <div className="w-12 h-8 bg-gray-200 rounded animate-pulse"></div>
            ) : appState.isAuthenticated ? (
              <button
                onClick={() => router.push("/dashboard")}
                className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                홈
              </button>
            ) : (
              <button
                onClick={() => router.push("/")}
                className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                홈
              </button>
            )}
            <button
              onClick={() => router.push("/experts")}
              className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              전문가 찾기
            </button>
            {isLoading ? (
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
            ) : appState.isAuthenticated && isExpert && viewMode === 'expert' ? (
              <button
                onClick={() => router.push("/experts/rankings")}
                className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                전문가 랭킹
              </button>
            ) : (
              <button
                onClick={() => router.push("/experts/become")}
                className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                전문가 되기
              </button>
            )}
            <button
              onClick={() => router.push("/community")}
              className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              커뮤니티
            </button>
            {/* AI채팅상담 - 로그아웃 상태이거나 사용자 모드일 때 표시 */}
            {!isLoading && (!appState.isAuthenticated || viewMode === 'user') && (
              <button
                onClick={() => {
                  // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
                  if (!appState.isAuthenticated) {
                    router.push("/auth/login?redirect=" + encodeURIComponent("/chat"));
                  } else {
                    router.push("/chat");
                  }
                }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 hover:from-purple-700 hover:via-blue-600 hover:to-cyan-500 px-3 py-2 text-sm font-medium transition-all duration-300 flex items-center gap-1 group"
              >
                <svg
                  className="w-5 h-5 text-purple-500 group-hover:text-blue-500 transition-colors duration-300 animate-pulse"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
                AI채팅상담
              </button>
            )}
            
            {/* 상담 신청 관리 - 전문가 모드일 때만 표시 */}
            {!isLoading && appState.isAuthenticated && isExpert && viewMode === 'expert' && (
              <button
                onClick={() => router.push("/dashboard/expert/consultation-requests")}
                className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-400 hover:from-blue-700 hover:via-indigo-600 hover:to-purple-500 px-3 py-2 text-sm font-medium transition-all duration-300 flex items-center gap-1 group relative"
              >
                <svg
                  className="w-5 h-5 text-blue-500 group-hover:text-indigo-500 transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                상담 신청 관리
                {/* 새로운 상담 요청 알림 배지 */}
                {consultationRequestCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center font-semibold animate-pulse">
                    {consultationRequestCount > 99 ? '99+' : consultationRequestCount}
                  </span>
                )}
              </button>
            )}
          </nav>

          {/* 오른쪽 메뉴 */}
          <div className="flex items-center space-x-4">
            {/* 햄버거 메뉴 - 1024px 미만에서 표시 */}
            <div className="lg:hidden relative hamburger-menu-container">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                title="메뉴"
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 6h16M4 12h16M4 18h16" 
                  />
                </svg>
              </button>

              {/* 드롭다운 메뉴 */}
              {isMenuOpen && (
                <div className="absolute left-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {isLoading ? (
                    <div className="px-4 py-2">
                      <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ) : appState.isAuthenticated ? (
                    <button
                      onClick={() => {
                        router.push("/dashboard");
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                      홈
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        router.push("/");
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                      홈
                    </button>
                  )}
                  <button
                    onClick={() => {
                      router.push("/experts");
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    전문가 찾기
                  </button>
                  {isLoading ? (
                    <div className="px-4 py-2">
                      <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ) : appState.isAuthenticated && isExpert && viewMode === 'expert' ? (
                    <button
                      onClick={() => {
                        router.push("/experts/rankings");
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4 text-orange-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                        />
                      </svg>
                      전문가 랭킹
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        router.push("/experts/become");
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4 text-orange-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                      전문가 되기
                    </button>
                  )}
                  <button
                    onClick={() => {
                      router.push("/community");
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4 text-indigo-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    커뮤니티
                  </button>
                  {/* AI채팅상담 - 로그아웃 상태이거나 사용자 모드일 때 표시 */}
                  {!isLoading && (!appState.isAuthenticated || viewMode === 'user') && (
                    <button
                      onClick={() => {
                        // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
                        if (!appState.isAuthenticated) {
                          router.push("/auth/login?redirect=" + encodeURIComponent("/chat"));
                        } else {
                          router.push("/chat");
                        }
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4 text-purple-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                        />
                      </svg>
                      AI채팅상담
                    </button>
                  )}
                  
                  {/* 상담 신청 관리 - 전문가 모드일 때만 표시 */}
                  {!isLoading && appState.isAuthenticated && isExpert && viewMode === 'expert' && (
                    <button
                      onClick={() => {
                        router.push("/dashboard/expert/consultation-requests");
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2 relative"
                    >
                      <svg
                        className="w-4 h-4 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      상담 신청 관리
                      {/* 새로운 상담 요청 알림 배지 */}
                      {consultationRequestCount > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center font-semibold">
                          {consultationRequestCount > 99 ? '99+' : consultationRequestCount}
                        </span>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>

            {isLoading ? (
              // 로딩 중일 때는 스켈레톤 UI 표시
              <div className="flex items-center space-x-2">
                <div className="w-20 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="w-16 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            ) : appState.isAuthenticated ? (
              <>
                {/* 로그아웃 버튼 - 768px 미만에서는 아이콘만, 768px 이상에서는 텍스트 */}
                <button
                  onClick={handleLogout}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  title="로그아웃"
                >
                  <span className="hidden md:inline">로그아웃</span>
                  <svg 
                    className="md:hidden w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                    />
                  </svg>
                </button>
              </>
            ) : (
              <>
                {/* 로그인 버튼 - 768px 미만에서는 아이콘만, 768px 이상에서는 텍스트 */}
                <button
                  onClick={() => router.push("/auth/login")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  title="로그인"
                >
                  <span className="hidden md:inline">로그인</span>
                  <svg 
                    className="md:hidden w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" 
                    />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default MainNavigation;
