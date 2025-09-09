"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  id: string;
  email: string;
  name: string;
  credits: number;
  expertLevel: string;
  role?: 'expert' | 'client' | 'admin';
}

interface AppState {
  hasEnteredService: boolean;
  isAuthenticated: boolean;
  user: User | null;
}

interface ExpertProtectedRouteProps {
  children: React.ReactNode;
}

export default function ExpertProtectedRoute({
  children,
}: ExpertProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [appState, setAppState] = useState<AppState>({
    hasEnteredService: false,
    isAuthenticated: false,
    user: null
  });
  const [isLoading, setIsLoading] = useState(true);

  // 앱 상태 로드
  useEffect(() => {
    const loadAppState = async () => {
      try {
        setIsLoading(true);
        
        // 로컬 스토리지에서 먼저 인증 상태 확인
        const storedUser = localStorage.getItem('consulton-user');
        const storedAuth = localStorage.getItem('consulton-auth');
        
        if (storedUser && storedAuth) {
          const user = JSON.parse(storedUser);
          const isAuthenticated = JSON.parse(storedAuth);
          
          // 로컬 스토리지에 인증 정보가 있으면 API 상태와 동기화
          if (isAuthenticated) {
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
            } catch (error) {
              console.error('API 상태 동기화 실패:', error);
            }
          }
          
          setAppState({
            hasEnteredService: true,
            isAuthenticated,
            user
          });
        } else {
          // 로컬 스토리지에 없으면 API에서 로드
          try {
            const response = await fetch('/api/app-state');
            const result = await response.json();
            if (result.success) {
              setAppState({
                hasEnteredService: result.data.hasEnteredService,
                isAuthenticated: result.data.isAuthenticated,
                user: result.data.user
              });
            }
          } catch (error) {
            console.error('API 상태 로드 실패:', error);
          }
        }
      } catch (error) {
        console.error('앱 상태 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAppState();
  }, []);

  const { hasEnteredService, isAuthenticated, user } = appState;

  useEffect(() => {
    // 대시보드에 접근할 때 자동으로 서비스 진입 상태로 설정
    if (pathname.startsWith('/dashboard')) {
      if (!hasEnteredService) {
        // 서비스 진입 상태로 설정
        fetch('/api/app-state', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'enterService', data: {} })
        }).then(() => {
          setAppState(prev => ({ ...prev, hasEnteredService: true }));
        }).catch(console.error);
      }
    } else if (!hasEnteredService) {
      // 서비스 진입하지 않은 경우 홈으로 리다이렉트
      router.push("/");
      return;
    }

    // 인증되지 않은 경우 로그인 페이지로 이동
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // 전문가 역할이 아닌 경우 권한 오류 페이지로 이동
    if (user && user.role !== 'expert') {
      // 전문가 권한이 필요하다는 페이지를 보여주기 위해 리다이렉트하지 않고 상태만 설정
      return;
    }
  }, [hasEnteredService, isAuthenticated, user, router, pathname]);

  // 로딩 중인 경우
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">페이지를 로딩 중입니다...</p>
        </div>
      </div>
    );
  }

  // 서비스 진입하지 않은 경우
  if (!hasEnteredService) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">서비스에 진입하는 중입니다...</p>
        </div>
      </div>
    );
  }

  // 인증되지 않은 경우
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로그인 확인 중입니다...</p>
        </div>
      </div>
    );
  }

  // 전문가 역할이 아닌 경우
  if (user && user.role !== 'expert') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-orange-600 mb-4">
            <svg className="h-16 w-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">전문가 권한이 필요합니다</h2>
          <p className="text-gray-600 mb-4">이 페이지는 전문가 계정으로만 접근할 수 있습니다.</p>
          <div className="space-x-4">
            <button 
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              대시보드로 이동
            </button>
            <button 
              onClick={() => router.push('/experts/become')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              전문가 신청하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
