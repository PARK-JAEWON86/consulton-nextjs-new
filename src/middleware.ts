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

// 공개 라우트 목록 (인증 없이 접근 가능)
const publicRoutes = [
  "/",
  "/auth/login",
  "/auth/register",
  "/how-it-works",
  "/terms",
  "/experts/become",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 공개 라우트는 항상 접근 가능
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // 보호된 라우트에 접근하려는 경우
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    // 쿠키에서 인증 토큰 확인
    const authToken = request.cookies.get("auth-token")?.value;
    const userData = request.cookies.get("user-data")?.value;

    // 인증 토큰과 사용자 데이터가 모두 있는지 확인
    if (!authToken || !userData) {
      // 인증되지 않은 경우 홈페이지로 리다이렉트
      return NextResponse.redirect(new URL("/", request.url));
    }

    // 사용자 데이터 파싱 시도
    try {
      JSON.parse(userData);
    } catch {
      // 사용자 데이터가 유효하지 않은 경우 홈페이지로 리다이렉트
      return NextResponse.redirect(new URL("/", request.url));
    }

    // 인증된 사용자인 경우 접근 허용
    return NextResponse.next();
  }

  // 기타 라우트는 접근 허용
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
