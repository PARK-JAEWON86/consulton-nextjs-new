"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type React from "react";
import ServiceLayout from "@/components/layout/ServiceLayout";
import {
  ShieldCheck,
  Award,
  Users,
  FileCheck2,
  Sparkles,
  CheckCircle2,
  Upload,
  Image as ImageIcon,
  Video,
  MessageCircle,
  Phone,
  Calendar,
  Clock,
  Plus,
  X,
} from "lucide-react";

type Step = 1 | 2 | 3 | 4;

type ConsultationType = "video" | "chat" | "voice";

type DayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

type Availability = Record<
  DayKey,
  {
    available: boolean;
    hours: string;
  }
>;

export default function BecomeExpertPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false); // 인증 상태 확인 완료 여부

  // 인증 상태 확인
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 먼저 로컬 스토리지에서 확인
        const storedUser = localStorage.getItem('consulton-user');
        const storedAuth = localStorage.getItem('consulton-auth');
        
        if (storedUser && storedAuth) {
          try {
            const user = JSON.parse(storedUser);
            const isAuth = JSON.parse(storedAuth);
            
            if (isAuth) {
              setIsAuthenticated(true);
              setIsAuthChecked(true);
              return;
            }
          } catch (error) {
            console.error('로컬 스토리지 파싱 오류:', error);
          }
        }
        
        // API에서 앱 상태 로드 (백업)
        const response = await fetch('/api/app-state');
        const result = await response.json();
        if (result.success) {
          setIsAuthenticated(result.data.isAuthenticated);
        }
        
        // 인증 상태 확인 완료
        setIsAuthChecked(true);
      } catch (error) {
        console.error('인증 상태 확인 실패:', error);
        setIsAuthChecked(true);
      }
    };
    checkAuth();
  }, []);

  // localStorage 변경 감지하여 인증 상태 업데이트
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const storedUser = localStorage.getItem('consulton-user');
        const storedAuth = localStorage.getItem('consulton-auth');
        
        if (storedUser && storedAuth) {
          const user = JSON.parse(storedUser);
          const isAuth = JSON.parse(storedAuth);
          
          setIsAuthenticated(isAuth);
        } else {
          setIsAuthenticated(false);
        }
        // 인증 상태 확인 완료
        setIsAuthChecked(true);
      } catch (error) {
        console.error('localStorage 변경 감지 시 파싱 오류:', error);
        setIsAuthenticated(false);
        setIsAuthChecked(true);
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

  // 인증되지 않은 사용자는 인증 상태 확인 완료 후 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (isAuthChecked && !isAuthenticated) {
      router.push('/auth/login?redirect=/experts/become');
    }
  }, [isAuthChecked, isAuthenticated, router]);

  // 1단계: 기본 정보
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // 2단계: 전문 정보
  const [specialty, setSpecialty] = useState("");
  const [experienceYears, setExperienceYears] = useState<number>(0);
  const [bio, setBio] = useState("");
  const [keywords, setKeywords] = useState<string[]>([""]);
  const [consultationTypes, setConsultationTypes] = useState<
    ConsultationType[]
  >([]);

  // 3단계: 일정 및 자격증
  const [availability, setAvailability] = useState<Availability>({
    monday: { available: false, hours: "09:00-18:00" },
    tuesday: { available: false, hours: "09:00-18:00" },
    wednesday: { available: false, hours: "09:00-18:00" },
    thursday: { available: false, hours: "09:00-18:00" },
    friday: { available: false, hours: "09:00-18:00" },
    saturday: { available: false, hours: "09:00-18:00" },
    sunday: { available: false, hours: "09:00-18:00" },
  });
  const [certifications, setCertifications] = useState<
    Array<{ name: string; issuer: string }>
  >([{ name: "", issuer: "" }]);

  // 4단계: 약관 동의
  const [agree, setAgree] = useState(false);

  const canGoNextStep1 =
    fullName.trim() !== "" && email.trim() !== "" && jobTitle.trim() !== "";
  const canGoNextStep2 =
    specialty.trim() !== "" &&
    experienceYears >= 0 &&
    bio.trim().length >= 30 &&
    consultationTypes.length > 0;
  const canGoNextStep3 = true;

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result;
      setProfileImage(typeof result === "string" ? result : null);
    };
    reader.readAsDataURL(file);
  };

  const toggleConsultationType = (type: ConsultationType) => {
    setConsultationTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleAvailabilityChange = (
    day: DayKey,
    field: "available" | "hours",
    value: boolean | string
  ) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value as never,
      },
    }));
  };

  const addKeyword = () => setKeywords((prev) => [...prev, ""]);
  const removeKeyword = (idx: number) =>
    setKeywords((prev) => prev.filter((_, i) => i !== idx));
  const updateKeyword = (idx: number, val: string) =>
    setKeywords((prev) => prev.map((k, i) => (i === idx ? val : k)));

  const addCertification = () =>
    setCertifications((prev) => [...prev, { name: "", issuer: "" }]);
  const removeCertification = (idx: number) =>
    setCertifications((prev) => prev.filter((_, i) => i !== idx));
  const updateCertification = (
    idx: number,
    field: "name" | "issuer",
    val: string
  ) =>
    setCertifications((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, [field]: val } : c))
    );

  const dayLabels: Record<DayKey, string> = {
    monday: "월요일",
    tuesday: "화요일",
    wednesday: "수요일",
    thursday: "목요일",
    friday: "금요일",
    saturday: "토요일",
    sunday: "일요일",
  };

  const handleSubmit = () => {
    if (!agree) {
      alert("약관 동의가 필요합니다.");
      return;
    }

    const expertProfileData = {
      name: fullName,
      specialty: jobTitle || specialty,
      experience: experienceYears,
      description: bio,
      education: [] as string[],
      certifications: certifications
        .filter((c) => c.name.trim())
        .map((c) => (c.issuer.trim() ? `${c.name} (${c.issuer})` : c.name)),
      specialties: keywords.filter((k) => k.trim()),
      consultationTypes: consultationTypes,
      languages: ["한국어"],
      hourlyRate: "",
      totalSessions: 0,
      avgRating: 0,
      availability,
      contactInfo: {
        phone: "",
        email,
        location: "",
        website: "",
      },
      profileImage,
      portfolioFiles: [] as Array<{
        id: number;
        name: string;
        type: string;
        size: number;
        data: string;
      }>,
      isProfileComplete: false,
    };

    // 서버 연동 전까지는 로컬 스토리지에 저장하고 즉시 승인 처리하여 전문가 프로필 페이지로 이동
    try {
      localStorage.setItem(
        "pendingExpertApplication",
        JSON.stringify(expertProfileData)
      );
      localStorage.setItem(
        "approvedExpertProfile",
        JSON.stringify(expertProfileData)
      );
    } catch (e) {
      // noop
    }

    alert("전문가 등록 신청이 접수되었습니다. 프로필 페이지로 이동합니다.");
    router.push("/dashboard/expert");
  };

  // 인증 상태 확인 중이거나 인증되지 않은 사용자는 로딩 화면 표시
  if (!isAuthChecked || !isAuthenticated) {
    return (
      <ServiceLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">
              {!isAuthChecked ? "인증 상태 확인 중..." : "로그인 페이지로 이동 중..."}
            </p>
          </div>
        </div>
      </ServiceLayout>
    );
  }

  return (
    <ServiceLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold border border-blue-100 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            전문가 되기
          </div>
          <h1 className="text-3xl font-bold text-gray-900">전문가 등록</h1>
          <p className="text-gray-600 mt-1">
            경험과 지식을 나누고 수익을 만들어보세요. 4단계로 등록 신청을 완료할 수 있습니다.
          </p>
        </header>

        {/* 혜택 카드 */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="mt-3 font-semibold text-gray-900">고객 연결</h3>
            <p className="mt-1 text-sm text-gray-600">관심 카테고리 고객과 자동 매칭되어 상담 요청을 받아요.</p>
          </div>
          <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
            <Award className="w-5 h-5 text-amber-600" />
            <h3 className="mt-3 font-semibold text-gray-900">레벨 시스템</h3>
            <p className="mt-1 text-sm text-gray-600">실적과 평점에 따라 노출 순위와 수익이 상승합니다.</p>
          </div>
          <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="mt-3 font-semibold text-gray-900">안전한 정산</h3>
            <p className="mt-1 text-sm text-gray-600">플랫폼이 결제/정산을 대신 처리해 드립니다.</p>
          </div>
        </section>

        {/* 단계 네비게이션 */}
        <nav className="mb-6">
          <ol className="flex items-center gap-3 text-sm">
            <li className={`px-3 py-1 rounded-full border ${step >= 1 ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-gray-50 text-gray-500 border-gray-200"}`}>1. 기본 정보</li>
            <li className={`px-3 py-1 rounded-full border ${step >= 2 ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-gray-50 text-gray-500 border-gray-200"}`}>2. 전문 정보</li>
            <li className={`px-3 py-1 rounded-full border ${step >= 3 ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-gray-50 text-gray-500 border-gray-200"}`}>3. 일정/자격증</li>
            <li className={`px-3 py-1 rounded-full border ${step >= 4 ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-gray-50 text-gray-500 border-gray-200"}`}>4. 검수 및 약관</li>
          </ol>
        </nav>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="홍길동"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">직무</label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="예: 임상심리사, 변호사, 재무설계사 등"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">프로필 이미지</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                      {profileImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={profileImage} alt="미리보기" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <input
                        id="profileImage"
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="profileImage"
                        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                      >
                        <Upload className="h-4 w-4 mr-2" /> 이미지 업로드
                      </label>
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG (최대 5MB)</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  disabled={!canGoNextStep1}
                  onClick={() => setStep(2)}
                  className={`px-5 py-2 rounded-lg text-white font-medium ${canGoNextStep1 ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"}`}
                >
                  다음
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">전문 분야</label>
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">선택하세요</option>
                    <option value="심리상담">심리상담</option>
                    <option value="법률상담">법률상담</option>
                    <option value="재무상담">재무상담</option>
                    <option value="건강상담">건강상담</option>
                    <option value="진로상담">진로상담</option>
                    <option value="IT상담">IT상담</option>
                    <option value="교육상담">교육상담</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">경력 (년)</label>
                  <input
                    type="number"
                    min={0}
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(parseInt(e.target.value || "0"))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">자기소개 (최소 30자)</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={5}
                  placeholder="전문 분야와 상담 방식, 강점을 소개해 주세요. 예) 8년간의 임상 경험으로 스트레스/불안 문제 해결을 돕고 있습니다."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* 키워드 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">키워드 (상담 주제)</label>
                <div className="space-y-3">
                  {keywords.map((kw, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={kw}
                        onChange={(e) => updateKeyword(idx, e.target.value)}
                        placeholder="예: 스트레스, 우울, 불안, 계약법"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {keywords.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeKeyword(idx)}
                          className="p-2 rounded-lg text-red-500 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addKeyword}
                  className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  <Plus className="w-4 h-4 mr-1" /> 키워드 추가
                </button>
              </div>

              {/* 상담 유형 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">제공 가능한 상담 유형</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {([
                    { id: "voice", label: "음성 상담", Icon: Phone },
                    { id: "chat", label: "채팅 상담", Icon: MessageCircle },
                    { id: "video", label: "화상 상담", Icon: Video },
                  ] as Array<{ id: ConsultationType; label: string; Icon: typeof Phone }>).map(
                    ({ id, label, Icon }) => {
                      const selected = consultationTypes.includes(id);
                      return (
                        <label
                          key={id}
                          className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selected
                              ? "border-blue-500 bg-blue-50 shadow-sm"
                              : "border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleConsultationType(id)}
                            className="sr-only"
                          />
                          <Icon className={`w-5 h-5 mr-3 ${selected ? "text-blue-600" : "text-gray-400"}`} />
                          <span className="text-sm font-medium text-gray-900">{label}</span>
                        </label>
                      );
                    }
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  이전
                </button>
                <button
                  disabled={!canGoNextStep2}
                  onClick={() => setStep(3)}
                  className={`px-5 py-2 rounded-lg text-white font-medium ${canGoNextStep2 ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"}`}
                >
                  다음
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              {/* 일정 */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center"><Calendar className="w-4 h-4 mr-2" /> 상담 가능한 일정</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(Object.keys(dayLabels) as DayKey[]).map((day) => (
                    <div key={day} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-800">{dayLabels[day]}</span>
                        <label className="inline-flex items-center text-sm text-gray-700">
                          <input
                            type="checkbox"
                            checked={availability[day].available}
                            onChange={(e) =>
                              handleAvailabilityChange(day, "available", e.target.checked)
                            }
                            className="mr-2"
                          />
                          가능
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <input
                          type="text"
                          value={availability[day].hours}
                          onChange={(e) =>
                            handleAvailabilityChange(day, "hours", e.target.value)
                          }
                          placeholder="예: 09:00-18:00"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 자격증 */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-3">자격증 및 발급기관</h3>
                <div className="space-y-3">
                  {certifications.map((cert, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
                      <input
                        type="text"
                        value={cert.name}
                        onChange={(e) => updateCertification(idx, "name", e.target.value)}
                        placeholder="자격증명 (예: 임상심리사 1급)"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={cert.issuer}
                          onChange={(e) => updateCertification(idx, "issuer", e.target.value)}
                          placeholder="발급기관 (예: 한국산업인력공단)"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {certifications.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeCertification(idx)}
                            className="p-2 rounded-lg text-red-500 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addCertification}
                  className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  <Plus className="w-4 h-4 mr-1" /> 자격증 추가
                </button>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  이전
                </button>
                <button
                  disabled={!canGoNextStep3}
                  onClick={() => setStep(4)}
                  className={`px-5 py-2 rounded-lg text-white font-medium ${canGoNextStep3 ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"}`}
                >
                  다음
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                <div className="flex items-start gap-3">
                  <FileCheck2 className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">검수 안내</h4>
                    <p className="mt-1 text-sm text-gray-600">
                      제출하신 정보는 자격/경력 기준에 따라 검수되며, 평균 1~3영업일 소요됩니다. 필요 시 추가 증빙을 요청드릴 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <span>
                    아래 약관 및 운영 정책에 동의합니다
                    <a className="ml-1 text-blue-600 hover:underline" href="#" onClick={(e) => e.preventDefault()}>
                      서비스 약관
                    </a>
                    ,
                    <a className="ml-1 text-blue-600 hover:underline" href="#" onClick={(e) => e.preventDefault()}>
                      개인정보 처리방침
                    </a>
                  </span>
                </label>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(3)}
                  className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  이전
                </button>
                <button
                  onClick={handleSubmit}
                  className={`px-5 py-2 rounded-lg text-white font-medium ${agree ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300"}`}
                >
                  신청 제출
                </button>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CheckCircle2 className="w-4 h-4" /> 제출 후 이메일로 결과를 안내드립니다.
              </div>
            </div>
          )}
        </div>
      </div>
    </ServiceLayout>
  );
}
