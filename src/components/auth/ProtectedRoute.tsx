"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppStore } from "@/stores/appStore";

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
  const { hasEnteredService, isAuthenticated } = useAppStore();

  useEffect(() => {
    // 서비스 진입하지 않은 경우 홈으로 리다이렉트
    if (!hasEnteredService) {
      router.push("/");
      return;
    }

    // 인증이 필요한 경우에만 인증 상태 확인
    if (requireAuth && !isAuthenticated) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
  }, [hasEnteredService, isAuthenticated, requireAuth, router]);

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
