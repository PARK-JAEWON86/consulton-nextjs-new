"use client";

import { useEffect, useState, useRef } from "react";
import { ExpertProfile as ExpertProfileType } from "@/types";
import ExpertProfile from "@/components/dashboard/ExpertProfile";

interface User {
  id: string;
  email: string;
  name: string;
  credits: number;
  expertLevel: string;
  role?: 'expert' | 'client' | 'admin';
  expertProfile?: any;
}

interface AppState {
  isAuthenticated: boolean;
  user: User | null;
}

type ConsultationType = "video" | "chat" | "voice";

type Availability = Record<
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday",
  { available: boolean; hours: string }
>;

type PortfolioFile = {
  id: number;
  name: string;
  type: string;
  size: number;
  data: string;
};

type ExpertProfileData = {
  isProfileComplete?: boolean;
  name: string;
  specialty: string;
  experience: number | string;
  description: string;
  education: string[];
  certifications: Array<{
    name: string;
    issuer: string;
  }>;
  specialties: string[];
  consultationTypes: ConsultationType[];
  languages: string[];
  hourlyRate: number | string;
  pricePerMinute?: number;
  totalSessions: number;
  avgRating: number;
  level?: string | number; // 전문가 레벨
  completionRate?: number; // 완료율
  repeatClients?: number; // 재방문 고객 수
  responseTime?: string; // 응답 시간
  averageSessionDuration?: number; // 평균 상담 시간
  reviewCount?: number; // 리뷰 수
  cancellationPolicy?: string; // 취소 정책
  availability: Availability;
  holidayPolicy?: string; // 공휴일 정책 추가
  contactInfo: {
    phone: string;
    email: string;
    location: string;
    website: string;
  };
  profileImage: string | null;
  portfolioFiles: PortfolioFile[];
};

export default function ExpertProfilePage() {
  const [initialData, setInitialData] = useState<
    Partial<ExpertProfileData> & { isProfileComplete?: boolean }
  >();
  const [isEditing, setIsEditing] = useState(false);
  const [appState, setAppState] = useState<AppState>({
    isAuthenticated: false,
    user: null
  });
  const [currentExpertId, setCurrentExpertId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const expertProfileRef = useRef<any>(null);
  
  // 앱 상태 로드
  useEffect(() => {
    const loadAppState = async () => {
      try {
        const response = await fetch('/api/app-state');
        const result = await response.json();
        if (result.success) {
          setAppState({
            isAuthenticated: result.data.isAuthenticated,
            user: result.data.user
          });
        }
      } catch (error) {
        console.error('앱 상태 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAppState();
  }, []);

  const { user } = appState;
  
  // 프로필이 완성되지 않은 경우 편집 모드로 시작
  useEffect(() => {
    if (initialData && !initialData.isProfileComplete) {
      setIsEditing(true);
    }
  }, [initialData]);

  // TODO: 전문가 프로필 스토어 사용 고려

  useEffect(() => {
    // 로그인한 사용자가 없으면 리턴
    if (!user) {
      return;
    }
    
    // TODO: localStorage 데이터 마이그레이션 고려
    
    // 로그인한 전문가의 ID 추출
    const expertId = user.id && typeof user.id === 'string' 
      ? parseInt(user.id.replace('expert_', '')) 
      : 0;
    if (expertId > 0) {
      setCurrentExpertId(expertId);
    }
    
    // 현재는 기존 로직을 사용하여 프로필 데이터 처리
    const expertProfile = user.expertProfile;
    
    // 전문가 프로필이 없으면 기본 프로필 생성
    if (!expertProfile) {
      console.log('전문가 프로필이 없어서 기본 프로필을 생성합니다:', expertId);
      
      // 기본 프로필 데이터 생성
      const defaultProfile = {
        name: user.name || "",
        specialty: "",
        experience: 0,
        description: "",
        education: [""],
        certifications: [{ name: "", issuer: "" }],
        specialties: [""],
        consultationTypes: [],
        languages: ["한국어"],
        hourlyRate: 0,
        pricePerMinute: 0,
        totalSessions: 0,
        avgRating: 0,
        level: user.expertLevel || "Tier 1 (Lv.1-99)",
        completionRate: 95,
        repeatClients: 0,
        responseTime: '2시간 내',
        averageSessionDuration: 60,
        reviewCount: 0,
        cancellationPolicy: '24시간 전 취소 가능',
        availability: {
          monday: { available: false, hours: "09:00-18:00" },
          tuesday: { available: false, hours: "09:00-18:00" },
          wednesday: { available: false, hours: "09:00-18:00" },
          thursday: { available: false, hours: "09:00-18:00" },
          friday: { available: false, hours: "09:00-18:00" },
          saturday: { available: false, hours: "09:00-18:00" },
          sunday: { available: false, hours: "09:00-18:00" },
        },
        holidayPolicy: "",
        contactInfo: { 
          phone: "", 
          email: user.email || "", 
          location: "", 
          website: "" 
        },
        profileImage: null,
        portfolioFiles: [],
        socialProof: {
          linkedIn: "",
          website: "",
          publications: [""],
        },
        portfolioItems: [],
        consultationStyle: "",
        successStories: 0,
        nextAvailableSlot: "",
        profileViews: 0,
        lastActiveAt: new Date(),
        joinedAt: new Date(),
        reschedulePolicy: "12시간 전 일정 변경 가능",
        pricingTiers: [
          { duration: 30, price: 25000, description: "기본 상담" },
          { duration: 60, price: 45000, description: "상세 상담" },
          { duration: 90, price: 65000, description: "종합 상담" }
        ],
        targetAudience: ["성인", "직장인", "학생"],
        isProfileComplete: false,
      };
      
      setInitialData(defaultProfile);
      return;
    }

    const convertedData = {
      name: user.name || expertProfile.name || "",
      specialty: expertProfile.specialty || "",
      experience: expertProfile.experience || 0,
      description: expertProfile.description || "",
      education: expertProfile.education || [""],
      certifications: expertProfile.certifications || [{ name: "", issuer: "" }],
      specialties: expertProfile.specialties || [expertProfile.specialty || ""],
      consultationTypes: expertProfile.consultationTypes || [],
      languages: expertProfile.languages || ["한국어"],
      hourlyRate: expertProfile.hourlyRate || (expertProfile.pricePerMinute ? expertProfile.pricePerMinute * 60 : ""),
      pricePerMinute: expertProfile.pricePerMinute || 0,
      totalSessions: expertProfile.totalSessions || 0,
      avgRating: expertProfile.avgRating || expertProfile.rating || 0,
      level: expertProfile.level || user.expertLevel || "",
      completionRate: expertProfile.completionRate || 95,
      repeatClients: expertProfile.repeatClients || Math.floor((expertProfile.totalSessions || 0) * 0.3),
      responseTime: expertProfile.responseTime || '2시간 내',
      averageSessionDuration: expertProfile.averageSessionDuration || 60,
      reviewCount: expertProfile.reviewCount || Math.floor((expertProfile.totalSessions || 0) * 0.7),
      cancellationPolicy: expertProfile.cancellationPolicy || '24시간 전 취소 가능',
      availability: expertProfile.availability || {
        monday: { available: false, hours: "09:00-18:00" },
        tuesday: { available: false, hours: "09:00-18:00" },
        wednesday: { available: false, hours: "09:00-18:00" },
        thursday: { available: false, hours: "09:00-18:00" },
        friday: { available: false, hours: "09:00-18:00" },
        saturday: { available: false, hours: "09:00-18:00" },
        sunday: { available: false, hours: "09:00-18:00" },
      },
      holidayPolicy: expertProfile.holidayPolicy || "",
      contactInfo: expertProfile.contactInfo || { 
        phone: "", 
        email: user.email || "", 
        location: expertProfile.location || "", 
        website: "" 
      },
      profileImage: expertProfile.profileImage || null,
      portfolioFiles: expertProfile.portfolioFiles || [],
      // 소셜 증명 필드 추가
      socialProof: expertProfile.socialProof || {
        linkedIn: "",
        website: "",
        publications: [""],
      },
      // 포트폴리오 아이템 필드 추가
      portfolioItems: expertProfile.portfolioItems || [],
      // 상담 관련 세부 정보 필드 추가
      consultationStyle: expertProfile.consultationStyle || "",
      successStories: expertProfile.successStories || 0,
      nextAvailableSlot: expertProfile.nextAvailableSlot || "",
      profileViews: expertProfile.profileViews || 0,
      lastActiveAt: expertProfile.lastActiveAt || new Date(),
      joinedAt: expertProfile.joinedAt || new Date(),
      reschedulePolicy: expertProfile.reschedulePolicy || "12시간 전 일정 변경 가능",
      pricingTiers: expertProfile.pricingTiers || [
        { duration: 30, price: 25000, description: "기본 상담" },
        { duration: 60, price: 45000, description: "상세 상담" },
        { duration: 90, price: 65000, description: "종합 상담" }
      ],
      targetAudience: expertProfile.targetAudience || ["성인", "직장인", "학생"],
      isProfileComplete: expertProfile?.isProfileComplete === true,
    };
    setInitialData(convertedData);
    setIsLoading(false); // 데이터 로딩 완료
  }, [user]);

  const handleSave = (
    updated: ExpertProfileData & { isProfileComplete: boolean }
  ) => {
    // ExpertProfileData를 ExpertProfileType으로 변환하여 스토어에 저장
    const expertProfile: ExpertProfileType = {
      id: currentExpertId || Date.now(),
      name: updated.name,
      specialty: updated.specialty,
      experience: Number(updated.experience),
      description: updated.description,
      education: updated.education,
      certifications: updated.certifications.map(cert => cert.name), // 객체를 문자열로 변환
      specialties: updated.specialties,
      specialtyAreas: updated.specialties, // 동일하게 설정
      consultationTypes: updated.consultationTypes,
      languages: updated.languages,
      hourlyRate: Number(updated.hourlyRate),
      pricePerMinute: updated.pricePerMinute || Math.ceil(Number(updated.hourlyRate) / 60),
      totalSessions: updated.totalSessions,
      avgRating: updated.avgRating,
      rating: updated.avgRating,
      reviewCount: updated.reviewCount || Math.floor(updated.totalSessions * 0.7),
      completionRate: updated.completionRate || 95,
      repeatClients: updated.repeatClients || Math.floor(updated.totalSessions * 0.3),
      responseTime: updated.responseTime || '2시간 내',
      averageSessionDuration: updated.averageSessionDuration || 60,
      cancellationPolicy: updated.cancellationPolicy || '24시간 전 취소 가능',
      availability: updated.availability,
      weeklyAvailability: convertAvailabilityToWeekly(updated.availability),
      holidayPolicy: updated.holidayPolicy, // 공휴일 정책 추가
      contactInfo: updated.contactInfo,
      location: updated.contactInfo.location || '서울, 대한민국',
      timeZone: 'KST (UTC+9)',
      profileImage: updated.profileImage,
      portfolioFiles: updated.portfolioFiles,
      portfolioItems: (updated as any).portfolioItems || [],
      socialProof: (updated as any).socialProof,
      // 상담 관련 세부 정보 필드들
      consultationStyle: (updated as any).consultationStyle,
      successStories: (updated as any).successStories || 0,
      nextAvailableSlot: (updated as any).nextAvailableSlot,
      profileViews: (updated as any).profileViews || 0,
      lastActiveAt: (updated as any).lastActiveAt || new Date(),
      joinedAt: (updated as any).joinedAt || new Date(),
      reschedulePolicy: (updated as any).reschedulePolicy || "12시간 전 일정 변경 가능",
      pricingTiers: (updated as any).pricingTiers || [
        { duration: 30, price: 25000, description: "기본 상담" },
        { duration: 60, price: 45000, description: "상세 상담" },
        { duration: 90, price: 65000, description: "종합 상담" }
      ],
      tags: updated.specialties,
      targetAudience: (updated as any).targetAudience || ['성인', '직장인', '학생'],
      isOnline: true,
      isProfileComplete: updated.isProfileComplete,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 현재는 localStorage에 저장 (추후 API 연동 예정)
    try {
      // 로컬 상태 업데이트
      setInitialData(updated);
      
      // localStorage에 저장
      localStorage.setItem("approvedExpertProfile", JSON.stringify(updated));
      
      // 저장 성공 후 편집 모드 종료
      setIsEditing(false);
      
      console.log('✅ 프로필 저장 완료:', currentExpertId);
    } catch (error) {
      console.error('❌ 프로필 저장 실패:', error);
      alert("프로필 저장에 실패했습니다.");
    }
  };
  
  // availability를 weeklyAvailability로 변환하는 헬퍼 함수
  const convertAvailabilityToWeekly = (availability: Record<string, { available: boolean; hours: string }>) => {
    const weeklyAvailability: any = {};
    
    Object.entries(availability).forEach(([day, config]) => {
      if (config.available && config.hours) {
        const timeRanges = config.hours.split(',').map(range => range.trim());
        const hourSlots: string[] = [];
        
        timeRanges.forEach(range => {
          const [start, end] = range.split('-');
          if (start && end) {
            const startHour = parseInt(start.split(':')[0]);
            const endHour = parseInt(end.split(':')[0]);
            
            for (let hour = startHour; hour < endHour; hour++) {
              hourSlots.push(`${hour.toString().padStart(2, '0')}:00`);
            }
          }
        });
        
        weeklyAvailability[day] = hourSlots;
      } else {
        weeklyAvailability[day] = [];
      }
    });
    
    return weeklyAvailability;
  };



  // 인증되지 않은 사용자 처리
  if (!appState.isAuthenticated || !appState.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="h-16 w-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">로그인이 필요합니다</h2>
          <p className="text-gray-600 mb-4">전문가 프로필을 보려면 먼저 로그인해주세요.</p>
          <button 
            onClick={() => window.location.href = '/auth/login'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            로그인하기
          </button>
        </div>
      </div>
    );
  }

  // 전문가 역할 확인
  if (appState.user.role !== 'expert') {
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
              onClick={() => window.location.href = '/dashboard'}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              대시보드로 이동
            </button>
            <button 
              onClick={() => window.location.href = '/experts/become'}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              전문가 신청하기
            </button>
          </div>
        </div>
      </div>
    );
  }



  // 스켈레톤 UI 컴포넌트
  const SkeletonLoader = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 메인 컨텐츠 스켈레톤 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 기본 정보 카드 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start space-x-6">
                <div className="w-36 h-48 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="flex-1 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                </div>
              </div>
            </div>
            
            {/* 상세 정보 카드들 */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
          
          {/* 사이드바 스켈레톤 */}
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // 로딩 중일 때 스켈레톤 표시
  if (isLoading) {
    return <SkeletonLoader />;
  }

  // 인증되지 않은 사용자는 리다이렉트 (로그인 필요 메시지 제거)
  if (!appState.isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">인증 정보를 확인 중입니다...</p>
        </div>
      </div>
    );
  }

  // 프로필 데이터 로딩 중일 때 스켈레톤 표시
  if (!initialData) {
    return <SkeletonLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">전문가 프로필</h1>
            <p className="text-gray-600 mt-1">
              검수/등록 후 프로필을 완성해주세요.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {isEditing ? (
              <button
                onClick={() => {
                  // ExpertProfile 컴포넌트의 저장 함수 호출
                  if (expertProfileRef.current && expertProfileRef.current.handleSave) {
                    expertProfileRef.current.handleSave();
                  }
                }}
                className="flex items-center px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
              >
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                저장하기
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                프로필 편집
              </button>
            )}
          </div>
        </div>
        <ExpertProfile 
          ref={expertProfileRef}
          expertData={initialData} 
          onSave={handleSave} 
          isEditing={isEditing}
          onEditingChange={setIsEditing}
        />
      </div>
    </div>
  );
}
