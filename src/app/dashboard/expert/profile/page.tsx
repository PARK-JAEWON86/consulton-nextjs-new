"use client";

import { useEffect, useState } from "react";
import { useExpertProfileStore, initializeExpertProfiles } from "@/stores/expertProfileStore";
import { useAppStore } from "@/stores/appStore";
import { expertDataService } from "@/services/ExpertDataService";
import { ExpertProfile as ExpertProfileType } from "@/types";
import ExpertProfile from "@/components/dashboard/ExpertProfile";

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
  certifications: string[];
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
  
  // 현재 로그인한 사용자 정보
  const { user } = useAppStore();
  
  // 프로필이 완성되지 않았으면 편집 모드로 시작
  useEffect(() => {
    if (initialData && !initialData.isProfileComplete) {
      setIsEditing(true);
    }
  }, [initialData]);

  // 전문가 프로필 스토어 사용
  const { 
    getCurrentExpertProfile, 
    addOrUpdateProfile, 
    setCurrentExpertId,
    currentExpertId 
  } = useExpertProfileStore();

  useEffect(() => {
    // 로그인한 전문가가 없으면 리턴
    if (!user || user.role !== 'expert' || !user.expertProfile) {
      return;
    }
    
    // 기존 localStorage 데이터 마이그레이션
    initializeExpertProfiles();
    
    // 로그인한 전문가의 ID 추출
    const expertId = parseInt(user.id?.replace('expert_', '') || '0');
    if (expertId > 0) {
      setCurrentExpertId(expertId);
    }
    
    // 중앙 서비스에서 최신 전문가 프로필 정보 가져오기
    const latestProfile = expertDataService.getExpertProfileById(expertId);
    
    console.log('🔄 전문가 프로필 페이지 - 중앙 서비스 데이터:', {
      expertId,
      latestProfile: latestProfile ? {
        name: latestProfile.name,
        experience: latestProfile.experience,
        totalSessions: latestProfile.totalSessions,
        completionRate: latestProfile.completionRate
      } : null,
      userProfile: user.expertProfile ? {
        name: user.expertProfile.name,
        experience: user.expertProfile.experience,
        totalSessions: user.expertProfile.totalSessions
      } : null
    });

    const expertProfile = latestProfile || user.expertProfile;
    if (!expertProfile) {
      console.error('전문가 프로필을 찾을 수 없습니다:', expertId);
      return;
    }

    const convertedData = {
      name: user.name || expertProfile.name || "",
      specialty: expertProfile.specialty || "",
      experience: expertProfile.experience || 0,
      description: expertProfile.description || "",
      education: expertProfile.education || [""],
      certifications: expertProfile.certifications || [""],
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
      isProfileComplete: expertProfile?.isProfileComplete !== false,
    };
    setInitialData(convertedData);
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
      certifications: updated.certifications,
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
      portfolioItems: [],
      tags: updated.specialties,
      targetAudience: ['일반인', '직장인', '학생'],
      isOnline: true,
      isProfileComplete: updated.isProfileComplete,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 중앙 서비스에 업데이트
    const success = expertDataService.updateExpertProfile(currentExpertId || Date.now(), expertProfile);
    
    if (success) {
      // 스토어에도 업데이트 (기존 호환성)
      addOrUpdateProfile(expertProfile);
      
      // 로컬 상태도 업데이트
      setInitialData(updated);
      
      // 기존 localStorage도 유지 (호환성을 위해)
      try {
        localStorage.setItem("approvedExpertProfile", JSON.stringify(updated));
      } catch {
        // ignore
      }
      
      console.log('✅ 중앙 서비스에 프로필 저장 완료:', currentExpertId);
    } else {
      console.error('❌ 프로필 저장 실패:', currentExpertId);
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

  // 로그인하지 않은 경우
  if (!user || user.role !== 'expert') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white border rounded-lg p-8 text-center max-w-md">
          <h2 className="text-xl font-bold text-gray-900 mb-4">전문가 로그인 필요</h2>
          <p className="text-gray-600 mb-6">
            프로필 페이지는 전문가 계정으로 로그인해야 이용할 수 있습니다.
          </p>
          <a 
            href="/auth/login"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            로그인하러 가기
          </a>
        </div>
      </div>
    );
  }

  if (!initialData) return null;

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
            <div className="text-sm text-gray-600">
              {initialData?.isProfileComplete ? (
                <span className="flex items-center text-green-600">
                  <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  프로필 완성
                </span>
              ) : (
                <span className="flex items-center text-yellow-600">
                  <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  프로필 미완성
                </span>
              )}
            </div>
            {!isEditing && (
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
          expertData={initialData} 
          onSave={handleSave} 
          isEditing={isEditing}
          onEditingChange={setIsEditing}
        />
      </div>
    </div>
  );
}
