"use client";

import { useEffect, useState } from "react";
import { useExpertProfileStore, initializeExpertProfiles } from "@/stores/expertProfileStore";
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
  totalSessions: number;
  avgRating: number;
  availability: Availability;
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
    // 기존 localStorage 데이터 마이그레이션
    initializeExpertProfiles();
    
    // 더미 데이터 중 법률상담 전문가 (ID: 2)를 현재 전문가로 설정
    setCurrentExpertId(2);
    
    // 현재 전문가 프로필 가져오기
    let currentProfile = getCurrentExpertProfile();
    
    if (currentProfile) {
      // ExpertProfileType을 ExpertProfileData로 변환
      const convertedData = {
        name: currentProfile.name,
        specialty: currentProfile.specialty,
        experience: currentProfile.experience,
        description: currentProfile.description,
        education: currentProfile.education,
        certifications: currentProfile.certifications,
        specialties: currentProfile.specialties,
        consultationTypes: currentProfile.consultationTypes,
        languages: currentProfile.languages,
        hourlyRate: currentProfile.hourlyRate,
        totalSessions: currentProfile.totalSessions,
        avgRating: currentProfile.avgRating,
        availability: currentProfile.availability,
        contactInfo: currentProfile.contactInfo,
        profileImage: currentProfile.profileImage,
        portfolioFiles: currentProfile.portfolioFiles,
        isProfileComplete: currentProfile.isProfileComplete,
      };
      setInitialData(convertedData);
    } else {
      // 새로운 전문가인 경우 기본 데이터 설정
      setInitialData({
        name: "",
        specialty: "",
        experience: 0,
        description: "",
        education: [""],
        certifications: [""],
        specialties: [""],
        consultationTypes: [],
        languages: ["한국어"],
        hourlyRate: "",
        totalSessions: 0,
        avgRating: 0,
        availability: {
          monday: { available: false, hours: "09:00-18:00" },
          tuesday: { available: false, hours: "09:00-18:00" },
          wednesday: { available: false, hours: "09:00-18:00" },
          thursday: { available: false, hours: "09:00-18:00" },
          friday: { available: false, hours: "09:00-18:00" },
          saturday: { available: false, hours: "09:00-18:00" },
          sunday: { available: false, hours: "09:00-18:00" },
        },
        contactInfo: { phone: "", email: "", location: "", website: "" },
        profileImage: null,
        portfolioFiles: [],
        isProfileComplete: false,
      });
    }
  }, [getCurrentExpertProfile, setCurrentExpertId]);

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
      pricePerMinute: Math.ceil(Number(updated.hourlyRate) / 60),
      totalSessions: updated.totalSessions,
      avgRating: updated.avgRating,
      rating: updated.avgRating,
      reviewCount: Math.floor(updated.totalSessions * 0.7),
      completionRate: 95,
      repeatClients: Math.floor(updated.totalSessions * 0.3),
      responseTime: '2시간 내',
      averageSessionDuration: 60,
      cancellationPolicy: '24시간 전 취소 가능',
      availability: updated.availability,
      weeklyAvailability: convertAvailabilityToWeekly(updated.availability),
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

    // 스토어에 업데이트
    addOrUpdateProfile(expertProfile);
    
    // 로컬 상태도 업데이트
    setInitialData(updated);
    
    // 기존 localStorage도 유지 (호환성을 위해)
    try {
      localStorage.setItem("approvedExpertProfile", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };
  
  // availability를 weeklyAvailability로 변환하는 헬퍼 함수
  const convertAvailabilityToWeekly = (availability: Record<string, { available: boolean; hours: string }>) => {
    const weeklyAvailability: Record<string, string[]> = {};
    
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
