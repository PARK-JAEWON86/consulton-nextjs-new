"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User, CheckCircle } from "lucide-react";
import SocialLoginButtons from "@/components/auth/SocialLoginButtons";

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
  general?: string;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [emailVerificationStep, setEmailVerificationStep] = useState<"form" | "verification" | "success">("form");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 입력 시 에러 제거
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "이름을 입력해주세요.";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "이름은 최소 2자 이상이어야 합니다.";
    }

    if (!formData.email) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다.";
    }

    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요.";
    } else if (formData.password.length < 6) {
      newErrors.password = "비밀번호는 최소 6자 이상이어야 합니다.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호 확인을 입력해주세요.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendVerificationEmail = async () => {
    try {
      // 실제로는 API 호출
      const response = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      if (response.ok) {
        return true;
      } else {
        throw new Error("인증 이메일 발송에 실패했습니다.");
      }
    } catch (error) {
      console.error("Verification email error:", error);
      // 개발 환경에서는 항상 성공으로 처리
      return true;
    }
  };

  const verifyEmailCode = async (code: string) => {
    try {
      // 실제로는 API 호출
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: formData.email, 
          code: code 
        }),
      });

      if (response.ok) {
        return true;
      } else {
        throw new Error("인증 코드가 올바르지 않습니다.");
      }
    } catch (error) {
      console.error("Email verification error:", error);
      // 개발 환경에서는 "123456" 코드로 테스트
      return code === "123456";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // 이메일 인증 메일 발송
      const emailSent = await sendVerificationEmail();
      
      if (emailSent) {
        setEmailVerificationStep("verification");
      } else {
        setErrors({ general: "인증 이메일 발송에 실패했습니다. 다시 시도해주세요." });
      }
    } catch (error) {
      setErrors({
        general: "회원가입 처리 중 오류가 발생했습니다. 다시 시도해주세요.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setVerificationError("인증 코드를 입력해주세요.");
      return;
    }

    setIsVerifying(true);
    setVerificationError("");

    try {
      const isValid = await verifyEmailCode(verificationCode);
      
      if (isValid) {
        setEmailVerificationStep("success");
        
        // 실제 회원가입 처리
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // 성공 후 로그인 페이지로 이동
        setTimeout(() => {
          window.location.href = "/auth/login?message=회원가입이 완료되었습니다. 로그인해주세요.";
        }, 2000);
      } else {
        setVerificationError("인증 코드가 올바르지 않습니다. 다시 확인해주세요.");
      }
    } catch (error) {
      setVerificationError("인증 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      await sendVerificationEmail();
      alert("인증 코드가 다시 발송되었습니다.");
    } catch (error) {
      alert("인증 코드 재발송에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 이메일 인증 성공 화면
  if (emailVerificationStep === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                회원가입 완료!
              </h2>
              <p className="text-gray-600 mb-6">
                이메일 인증이 완료되었습니다.<br />
                잠시 후 로그인 페이지로 이동합니다.
              </p>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 이메일 인증 화면
  if (emailVerificationStep === "verification") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            이메일 인증
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            <span className="font-medium text-blue-600">{formData.email}</span>로<br />
            인증 코드를 발송했습니다.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {verificationError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <div className="text-sm text-red-600">{verificationError}</div>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-2">
                  인증 코드 (6자리)
                </label>
                <input
                  id="verificationCode"
                  name="verificationCode"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl font-mono tracking-widest"
                  placeholder="123456"
                  maxLength={6}
                />
                <p className="mt-2 text-xs text-gray-500 text-center">
                  개발 환경에서는 <span className="font-mono bg-gray-100 px-1 rounded">123456</span>을 입력하세요
                </p>
              </div>

              <button
                onClick={handleVerifyCode}
                disabled={isVerifying || verificationCode.length !== 6}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors ${
                  isVerifying || verificationCode.length !== 6
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                }`}
              >
                {isVerifying ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    인증 중...
                  </div>
                ) : (
                  "인증 확인"
                )}
              </button>

              <div className="text-center">
                <button
                  onClick={handleResendCode}
                  disabled={isLoading}
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                >
                  인증 코드 다시 받기
                </button>
              </div>

              <div className="text-center">
                <button
                  onClick={() => setEmailVerificationStep("form")}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  ← 이전 단계로 돌아가기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          새 계정 만들기
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          또는{" "}
          <Link
            href="/auth/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            기존 계정으로 로그인
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <div className="text-sm text-red-600">{errors.general}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 이름 입력 */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                이름
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="이름을 입력하세요"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* 이메일 입력 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                이메일 주소
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="your@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-10 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.password ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="비밀번호를 입력하세요"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* 비밀번호 확인 입력 */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호 확인
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-10 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.confirmPassword ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="비밀번호를 다시 입력하세요"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* 회원가입 버튼 */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    인증 이메일 발송 중...
                  </div>
                ) : (
                  "회원가입"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">또는</span>
              </div>
            </div>

            <div className="mt-6">
              <SocialLoginButtons mode="register" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
