"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Mail, Lock, Eye, EyeOff } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectPath?: string;
}

export default function LoginModal({ isOpen, onClose, redirectPath }: LoginModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // 로그인 API 호출
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.success) {
        // 로그인 성공 시 로컬 스토리지에 사용자 정보 저장
        localStorage.setItem("consulton-user", JSON.stringify(result.data.user));
        localStorage.setItem("consulton-auth", JSON.stringify(true));

        // 모달 닫기
        onClose();

        // 리다이렉트 경로가 있으면 해당 경로로, 없으면 대시보드로
        if (redirectPath) {
          router.push(redirectPath);
        } else {
          router.push("/dashboard");
        }
      } else {
        setError(result.message || "로그인에 실패했습니다.");
      }
    } catch (error) {
      setError("로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterClick = () => {
    onClose();
    router.push("/auth/register");
  };

  const handleSocialLogin = async (provider: string) => {
    try {
      // 소셜 로그인 API 호출 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      console.log(`${provider} 로그인 시작`);
      
      // 실제로는 각 소셜 로그인 SDK를 사용하여 로그인 처리
      // 예: window.location.href = `/auth/${provider}`;
      
      // 임시로 성공 메시지 표시
      alert(`${provider} 로그인 기능은 준비 중입니다.`);
      
    } catch (error) {
      console.error(`${provider} 로그인 실패:`, error);
      alert(`${provider} 로그인에 실패했습니다. 다시 시도해주세요.`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* 배경 오버레이 */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* 모달 */}
        <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">로그인</h2>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* 로그인 폼 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 이메일 입력 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="이메일을 입력하세요"
                  required
                />
              </div>
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="비밀번호를 입력하세요"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </button>
          </form>

          {/* 추가 옵션 */}
          <div className="mt-6 space-y-4">
            {/* 회원가입 링크 */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                계정이 없으신가요?{" "}
                <button
                  type="button"
                  onClick={handleRegisterClick}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  회원가입
                </button>
              </p>
            </div>

            {/* 소셜 로그인 */}
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">또는</span>
                </div>
              </div>
              
              {/* Google 로그인 */}
              <button
                type="button"
                onClick={() => handleSocialLogin('Google')}
                className="w-full bg-white text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center border border-gray-300"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google로 로그인
              </button>

              {/* Kakao 로그인 */}
              <button
                type="button"
                onClick={() => handleSocialLogin('Kakao')}
                className="w-full bg-yellow-400 text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-500 transition-colors flex items-center justify-center border border-yellow-400"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3C6.48 3 2 6.48 2 10.8c0 2.76 1.8 5.2 4.52 6.66l-.93 3.44c-.05.18.15.32.29.21l4.05-2.68c.69.09 1.4.13 2.07.13 5.52 0 10-3.48 10-7.8C22 6.48 17.52 3 12 3z" />
                </svg>
                Kakao로 로그인
              </button>

              {/* Naver 로그인 */}
              <button
                type="button"
                onClick={() => handleSocialLogin('Naver')}
                className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center border border-green-500"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z" />
                </svg>
                Naver로 로그인
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
