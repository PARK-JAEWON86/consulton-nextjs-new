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

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export default function ProtectedRoute({
  children,
  requireAuth = false, // 기본값을 false로 변경
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [appState, setAppState] = useState<AppState>({
    hasEnteredService: false,
    isAuthenticated: false,
    user: null
  });

  // 앱 상태 로드
  useEffect(() => {
    const loadAppState = async () => {
      try {
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
            hasEnteredService: true, // 대시보드에 접근했으므로 서비스 진입 상태
            isAuthenticated,
            user
          });
        } else {
          // 로컬 스토리지에 없으면 서버에서 인증 상태 확인
          try {
            // JWT 토큰을 헤더에 포함하여 인증 상태 확인
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
                  hasEnteredService: true,
                  isAuthenticated: true,
                  user: userData
                });
              } else {
                // 서버에서 인증 실패 - 로컬 스토리지 정리
                localStorage.removeItem('consulton-user');
                localStorage.removeItem('consulton-auth');
                localStorage.removeItem('consulton-token');
                localStorage.removeItem('consulton-viewMode');
                
                setAppState({
                  hasEnteredService: false,
                  isAuthenticated: false,
                  user: null
                });
              }
            } else if (response.status === 401) {
              // 인증 실패 - 로컬 스토리지 정리
              localStorage.removeItem('consulton-user');
              localStorage.removeItem('consulton-auth');
              localStorage.removeItem('consulton-token');
              localStorage.removeItem('consulton-viewMode');
              
              setAppState({
                hasEnteredService: false,
                isAuthenticated: false,
                user: null
              });
            } else {
              // 기타 오류 - 기본 상태로 설정
              setAppState({
                hasEnteredService: false,
                isAuthenticated: false,
                user: null
              });
            }
          } catch (error) {
            console.error('인증 상태 확인 실패:', error);
            // API 실패 시 로컬 스토리지 정리
            localStorage.removeItem('consulton-user');
            localStorage.removeItem('consulton-auth');
            localStorage.removeItem('consulton-token');
            localStorage.removeItem('consulton-viewMode');
            
            setAppState({
              hasEnteredService: false,
              isAuthenticated: false,
              user: null
            });
          }
        }
      } catch (error) {
        console.error('앱 상태 로드 실패:', error);
      }
    };

    loadAppState();
  }, []);

  const { hasEnteredService, isAuthenticated } = appState;

  useEffect(() => {
    // 대시보드나 설정 페이지에 접근할 때 자동으로 서비스 진입 상태로 설정
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/chat') || pathname.startsWith('/summary')) {
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
    } else if (!hasEnteredService && pathname !== '/') {
      // 서비스 진입하지 않은 경우 홈으로 리다이렉트 (홈 페이지 제외)
      router.push("/");
      return;
    }

    // 인증이 필요한 경우에만 인증 상태 확인 (로컬 스토리지도 확인)
    if (requireAuth && !isAuthenticated) {
      // 로컬 스토리지에서 한 번 더 확인
      const storedUser = localStorage.getItem('consulton-user');
      const storedAuth = localStorage.getItem('consulton-auth');
      
      if (storedUser && storedAuth) {
        const user = JSON.parse(storedUser);
        const isStoredAuthenticated = JSON.parse(storedAuth);
        
        if (isStoredAuthenticated) {
          // 로컬 스토리지에 인증 정보가 있으면 상태 업데이트
          setAppState(prev => ({
            ...prev,
            isAuthenticated: true,
            user
          }));
          return; // 리다이렉트하지 않음
        }
      }
      
      // 인증 정보가 없으면 로그인 페이지로 이동
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
  }, [hasEnteredService, isAuthenticated, requireAuth, router, pathname]);

  // 로딩 중이거나 리다이렉트 중인 경우
  if (!hasEnteredService || (requireAuth && !isAuthenticated)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">페이지를 로딩 중입니다...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
