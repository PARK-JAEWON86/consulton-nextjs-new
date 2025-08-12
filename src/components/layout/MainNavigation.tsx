"use client";

import { useRouter } from "next/navigation";

interface MainNavigationProps {}

const MainNavigation = ({}: MainNavigationProps) => {
  const router = useRouter();
  const isToggleOn = true; // 항상 ON 상태로 고정

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
              상담 찾기
            </button>
            <button
              onClick={() => router.push("/experts")}
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
            <button
              onClick={() => router.push("/experts")}
              className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              전문가 등록
            </button>
            <button
              onClick={() => router.push("/auth/login")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              로그인
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MainNavigation;
