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
}

const MainNavigation = ({}: MainNavigationProps) => {
  const router = useRouter();
  const isToggleOn = true; // 항상 ON 상태로 고정
  const [appState, setAppState] = useState<AppState>({
    isAuthenticated: false,
    user: null
  });

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
                user: user
              });
              return;
            }
          } catch (error) {
            console.error('로컬 스토리지 파싱 오류:', error);
          }
        }
        
        // API에서 앱 상태 로드 (백업)
        const response = await fetch('/api/app-state');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success) {
          setAppState({
            isAuthenticated: result.data.isAuthenticated,
            user: result.data.user
          });
        }
      } catch (error) {
        console.error('앱 상태 로드 실패:', error);
        // API 실패 시 기본 상태로 설정
        setAppState({
          isAuthenticated: false,
          user: null
        });
      }
    };

    loadAppState();
  }, []);

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
            user: isAuthenticated ? user : null
          }));
        } else {
          setAppState(prev => ({
            ...prev,
            isAuthenticated: false,
            user: null
          }));
        }
      } catch (error) {
        console.error('localStorage 변경 감지 시 파싱 오류:', error);
        // 파싱 오류 시 localStorage 정리
        localStorage.removeItem('consulton-user');
        localStorage.removeItem('consulton-auth');
        setAppState(prev => ({
          ...prev,
          isAuthenticated: false,
          user: null
        }));
      }
    };

    // storage 이벤트 리스너 (다른 탭에서의 변경 감지)
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      
      // 커스텀 이벤트 리스너 (같은 탭에서의 변경 감지)
      window.addEventListener('authStateChanged', handleStorageChange);
      
      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('authStateChanged', handleStorageChange);
      };
    }
  }, []);

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
      
      // 로컬 스토리지 정리
      localStorage.removeItem('consulton-user');
      localStorage.removeItem('consulton-auth');
      localStorage.removeItem('consulton-viewMode');
      
      setAppState({ isAuthenticated: false, user: null });
      
      // 커스텀 이벤트 발생으로 다른 컴포넌트 상태 업데이트
      window.dispatchEvent(new CustomEvent('authStateChanged', { 
        detail: { type: 'logout', name: 'user' } 
      }));
      
      router.push("/auth/login");
    } catch (error) {
      console.error('로그아웃 실패:', error);
      // API 실패 시에도 로컬 상태는 정리
      localStorage.removeItem('consulton-user');
      localStorage.removeItem('consulton-auth');
      localStorage.removeItem('consulton-viewMode');
      
      setAppState({ isAuthenticated: false, user: null });
      router.push("/auth/login");
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
          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => router.push("/experts")}
              className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              전문가 찾기
            </button>
            <button
              onClick={() => router.push("/experts/become")}
              className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              전문가 되기
            </button>
            <button
              onClick={() => router.push("/community")}
              className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              커뮤니티
            </button>
            <button
              onClick={() => router.push("/chat")}
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
          </nav>

          {/* 오른쪽 메뉴 */}
          <div className="flex items-center space-x-4">
            {appState.isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold">
                  <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">C</span>
                  </div>
                  <span>크레딧: {appState.user?.credits ?? 0}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push("/auth/login")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  로그인
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
