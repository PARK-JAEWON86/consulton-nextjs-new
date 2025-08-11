import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 보호된 라우트 목록
const protectedRoutes = [
  "/dashboard",
  "/experts",
  "/community",
  "/chat",
  "/video",
  "/summary",
  "/settings",
  "/analytics",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 보호된 라우트에 접근하려는 경우
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    // 서비스 진입 상태는 클라이언트 사이드에서 관리
    // 여기서는 기본적인 접근 제어만 수행
    // 실제 인증은 각 페이지 컴포넌트에서 처리

    // 개발 환경에서는 모든 접근 허용
    if (process.env.NODE_ENV === "development") {
      return NextResponse.next();
    }

    // 프로덕션에서는 쿠키 기반 인증 확인
    const hasEnteredService =
      request.cookies.get("hasEnteredService")?.value === "true";
    if (!hasEnteredService) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
