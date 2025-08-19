"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useAppStore } from "@/stores/appStore";
import { useConsultationsStore } from "@/stores/consultationsStore";
import { useRouter, useSearchParams } from "next/navigation";
import { expertDataService } from "@/services/ExpertDataService";
import { userDataService } from "@/services/UserDataService";
import Link from "next/link";

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuthenticated, setUser, enterService, setViewMode } = useAppStore();
  const { loadExpertConsultations } = useConsultationsStore();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});


  useEffect(() => {
    // 개발 환경에서 계정 정보 출력
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        expertDataService.printLoginCredentials();
        userDataService.printDummyUsers();
      }, 1000);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // 중앙 데이터 서비스를 통한 전문가 계정 검증
      const account = expertDataService.validateLogin(formData.email, formData.password);
      
      if (account) {
        // 전문가 로그인 처리
        // 로그인 시뮬레이션 딜레이
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // 중앙 서비스에서 완전한 사용자 데이터 생성
        const userData = expertDataService.createUserFromExpert(account.id);

        if (userData) {
          // 로그인 성공 처리: 전역 스토어 업데이트 및 리다이렉트
          setAuthenticated(true);
          setUser(userData);
          
          // 전문가로 로그인하면 viewMode를 expert로 설정
          setViewMode('expert');
          
          enterService();
          
          // 전문가 상담 내역 로드
          loadExpertConsultations(account.id);
          
          // redirect 파라미터가 있으면 해당 URL로, 없으면 전문가 대시보드로 이동
          const redirectUrl = searchParams.get('redirect') || "/dashboard/expert";
          router.push(redirectUrl);
        } else {
          setErrors({ general: "전문가 데이터를 불러올 수 없습니다." });
          return;
        }
      } else {
        // 일반 사용자 로그인 처리 (더미 데이터 또는 자동 생성)
        if (formData.email && formData.password.length >= 4) {
          await new Promise((resolve) => setTimeout(resolve, 1500));
          
          // 기존 더미 사용자 찾기 또는 새로 생성
          let userData = userDataService.getUserByEmail(formData.email);
          if (!userData) {
            userData = userDataService.createRandomUser(formData.email);
            console.log('🆕 새로운 사용자 생성:', userData);
          } else {
            console.log('✅ 기존 더미 사용자 로그인:', userData);
          }
          
          setAuthenticated(true);
          setUser({
            id: userData.id,
            email: userData.email,
            name: userData.name,
            credits: userData.credits,
            expertLevel: null,
            role: 'client',
            expertProfile: null
          });
          
          // 일반 사용자로 로그인하면 viewMode를 user로 설정
          setViewMode('user');
          
          enterService();
          
          // redirect 파라미터가 있으면 해당 URL로, 없으면 일반 사용자 대시보드로 이동
          const redirectUrl = searchParams.get('redirect') || "/dashboard";
          router.push(redirectUrl);
        } else {
          setErrors({
            general: "이메일 또는 비밀번호가 올바르지 않습니다.",
          });
          return;
        }
      }
    } catch (error) {
      setErrors({
        general: "로그인 처리 중 오류가 발생했습니다. 다시 시도해주세요.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-sm text-red-600">{errors.general}</div>
          </div>
        )}

      {/* 이메일 입력 */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
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
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
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
            autoComplete="current-password"
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

      {/* 로그인 유지 & 비밀번호 찾기 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="rememberMe"
            type="checkbox"
            checked={formData.rememberMe}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="remember-me"
            className="ml-2 block text-sm text-gray-900"
          >
            로그인 상태 유지
          </label>
        </div>

        <div className="text-sm">
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
            비밀번호를 잊으셨나요?
          </a>
        </div>
      </div>

      {/* 로그인 버튼 */}
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
              로그인 중...
            </div>
          ) : (
            "로그인"
          )}
        </button>
      </div>

      {/* 회원가입 링크 */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          아직 계정이 없으신가요?{" "}
          <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
            회원가입하기
          </Link>
        </p>
      </div>
      </form>
    </div>
  );
};

export default LoginForm;
