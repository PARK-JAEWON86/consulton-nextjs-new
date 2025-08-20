import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ExpertProfile, WeeklyAvailability } from '@/types';

interface ExpertProfileStore {
  // 전문가 프로필 목록 (ID를 키로 하는 맵)
  profiles: Record<number, ExpertProfile>;
  
  // 현재 로그인한 전문가의 프로필 ID (전문가 모드용)
  currentExpertId: number | null;
  
  // 액션들
  addOrUpdateProfile: (profile: ExpertProfile) => void;
  getProfile: (id: number) => ExpertProfile | null;
  getAllProfiles: () => ExpertProfile[];
  setCurrentExpertId: (id: number | null) => void;
  getCurrentExpertProfile: () => ExpertProfile | null;
  deleteProfile: (id: number) => void;
  
  // 프로필 검색 및 필터링
  searchProfiles: (query: string) => ExpertProfile[];
  getProfilesBySpecialty: (specialty: string) => ExpertProfile[];
}

export const useExpertProfileStore = create<ExpertProfileStore>()(
  persist(
    (set, get) => ({
      profiles: {},
      currentExpertId: null,
      
      addOrUpdateProfile: (profile) => {
        set((state) => ({
          profiles: {
            ...state.profiles,
            [profile.id]: {
              ...profile,
              updatedAt: new Date(),
            },
          },
        }));
      },
      
      getProfile: (id) => {
        const state = get();
        return state.profiles[id] || null;
      },
      
      getAllProfiles: () => {
        const state = get();
        return Object.values(state.profiles).filter(profile => profile.isProfileComplete);
      },
      
      setCurrentExpertId: (id) => {
        set({ currentExpertId: id });
      },
      
      getCurrentExpertProfile: () => {
        const state = get();
        if (!state.currentExpertId) return null;
        return state.profiles[state.currentExpertId] || null;
      },
      
      deleteProfile: (id) => {
        set((state) => {
          const newProfiles = { ...state.profiles };
          delete newProfiles[id];
          return {
            profiles: newProfiles,
            currentExpertId: state.currentExpertId === id ? null : state.currentExpertId,
          };
        });
      },
      
      searchProfiles: (query) => {
        const state = get();
        const profiles = Object.values(state.profiles).filter(profile => profile.isProfileComplete);
        
        if (!query.trim()) return profiles;
        
        const lowerQuery = query.toLowerCase();
        return profiles.filter(profile => 
          profile.name.toLowerCase().includes(lowerQuery) ||
          profile.specialty.toLowerCase().includes(lowerQuery) ||
          profile.description.toLowerCase().includes(lowerQuery) ||
          profile.specialties.some(s => s.toLowerCase().includes(lowerQuery)) ||
          profile.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
      },
      
      getProfilesBySpecialty: (specialty) => {
        const state = get();
        return Object.values(state.profiles).filter(profile => 
          profile.isProfileComplete && profile.specialty === specialty
        );
      },
    }),
    {
      name: 'expert-profiles-storage',
      // 민감한 정보는 제외하고 저장
      partialize: (state) => ({
        profiles: state.profiles,
        currentExpertId: state.currentExpertId,
      }),
    }
  )
);

// 전문가 프로필 초기화 함수 (더미 데이터 마이그레이션용)
export const initializeExpertProfiles = () => {
  const store = useExpertProfileStore.getState();
  
  // 기존 localStorage의 개별 전문가 프로필을 새 스토어로 마이그레이션
  try {
    const storedProfile = localStorage.getItem('approvedExpertProfile');
    if (storedProfile) {
      const profile = JSON.parse(storedProfile);
      
      // 기존 데이터를 새 형식으로 변환
      const convertedProfile: ExpertProfile = {
        id: 1, // 임시 ID, 실제 환경에서는 고유 ID 생성
        name: profile.name || '',
        specialty: profile.specialty || '',
        experience: Number(profile.experience) || 0,
        description: profile.description || '',
        education: profile.education || [],
        certifications: profile.certifications || [],
        specialties: profile.specialties || [],
        specialtyAreas: profile.specialties || [], // specialties와 동일하게 설정
        consultationTypes: profile.consultationTypes || [],
        languages: profile.languages || ['한국어'],
        hourlyRate: Number(profile.hourlyRate) || 0,
        pricePerMinute: Math.ceil((Number(profile.hourlyRate) || 0) / 60), // 시간당 요금을 분당으로 변환
        totalSessions: profile.totalSessions || 0,
        avgRating: profile.avgRating || 0,
        rating: profile.avgRating || 0,
        reviewCount: Math.floor((profile.totalSessions || 0) * 0.7), // 임시 계산
        completionRate: 95, // 기본값
        repeatClients: Math.floor((profile.totalSessions || 0) * 0.3), // 임시 계산
        responseTime: '2시간 내',
        averageSessionDuration: 60,
        cancellationPolicy: '24시간 전 취소 가능',
        availability: profile.availability || {},
        weeklyAvailability: convertAvailabilityToWeekly(profile.availability || {}) as WeeklyAvailability,
        contactInfo: profile.contactInfo || {
          phone: '',
          email: '',
          location: '',
          website: '',
        },
        location: profile.contactInfo?.location || '서울, 대한민국',
        timeZone: 'KST (UTC+9)',
        profileImage: profile.profileImage || null,
        portfolioFiles: profile.portfolioFiles || [],
        portfolioItems: [], // 기본값
        tags: profile.specialties || [],
        targetAudience: ['일반인', '직장인', '학생'],
        isOnline: true,
        isProfileComplete: profile.isProfileComplete || false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      store.addOrUpdateProfile(convertedProfile);
      store.setCurrentExpertId(1);
    }
  } catch (error) {
    console.error('Failed to migrate expert profile:', error);
  }
};

// availability를 weeklyAvailability로 변환하는 헬퍼 함수
function convertAvailabilityToWeekly(availability: Record<string, { available: boolean; hours: string }>): Record<string, string[]> {
  const weeklyAvailability: Record<string, string[]> = {};
  
  Object.entries(availability).forEach(([day, config]) => {
    if (config.available && config.hours) {
      // "09:00-18:00" 형태를 시간 배열로 변환
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
}
