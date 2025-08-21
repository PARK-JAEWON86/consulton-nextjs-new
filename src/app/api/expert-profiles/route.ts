import { NextRequest, NextResponse } from 'next/server';

interface WeeklyAvailability {
  [key: string]: string[];
}

interface ExpertProfile {
  id: number;
  name: string;
  specialty: string;
  experience: number;
  description: string;
  education: string[];
  certifications: string[];
  specialties: string[];
  specialtyAreas: string[];
  consultationTypes: string[];
  languages: string[];
  hourlyRate: number;
  pricePerMinute: number;
  totalSessions: number;
  avgRating: number;
  rating: number;
  reviewCount: number;
  completionRate: number;
  repeatClients: number;
  responseTime: string;
  averageSessionDuration: number;
  cancellationPolicy: string;
  availability: Record<string, { available: boolean; hours: string }>;
  weeklyAvailability: WeeklyAvailability;
  contactInfo: {
    phone: string;
    email: string;
    location: string;
    website: string;
  };
  location: string;
  timeZone: string;
  profileImage: string | null;
  portfolioFiles: string[];
  portfolioItems: any[];
  tags: string[];
  targetAudience: string[];
  isOnline: boolean;
  isProfileComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ExpertProfileStore {
  profiles: Record<number, ExpertProfile>;
  currentExpertId: number | null;
}

// 메모리 기반 상태 저장 (실제 프로덕션에서는 데이터베이스 사용 권장)
let expertProfileStore: ExpertProfileStore = {
  profiles: {},
  currentExpertId: null,
};

// GET: 전문가 프로필 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const query = searchParams.get('query');
    const specialty = searchParams.get('specialty');
    const currentExpert = searchParams.get('currentExpert');
    
    if (id) {
      // 특정 ID의 프로필 조회
      const profile = expertProfileStore.profiles[parseInt(id)];
      if (!profile) {
        return NextResponse.json(
          { success: false, error: '전문가 프로필을 찾을 수 없습니다.' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        data: { profile }
      });
    }
    
    if (currentExpert === 'true') {
      // 현재 로그인한 전문가 프로필 조회
      if (!expertProfileStore.currentExpertId) {
        return NextResponse.json(
          { success: false, error: '현재 로그인한 전문가가 없습니다.' },
          { status: 404 }
        );
      }
      
      const profile = expertProfileStore.profiles[expertProfileStore.currentExpertId];
      if (!profile) {
        return NextResponse.json(
          { success: false, error: '현재 전문가 프로필을 찾을 수 없습니다.' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        data: { profile }
      });
    }
    
    let profiles = Object.values(expertProfileStore.profiles).filter(profile => profile.isProfileComplete);
    
    // 검색 쿼리로 필터링
    if (query && query.trim()) {
      const lowerQuery = query.toLowerCase();
      profiles = profiles.filter(profile => 
        profile.name.toLowerCase().includes(lowerQuery) ||
        profile.specialty.toLowerCase().includes(lowerQuery) ||
        profile.description.toLowerCase().includes(lowerQuery) ||
        profile.specialties.some(s => s.toLowerCase().includes(lowerQuery)) ||
        profile.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    }
    
    // 전문 분야로 필터링
    if (specialty && specialty !== 'all') {
      profiles = profiles.filter(profile => profile.specialty === specialty);
    }
    
    return NextResponse.json({
      success: true,
      data: {
        profiles,
        total: profiles.length,
        currentExpertId: expertProfileStore.currentExpertId
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '전문가 프로필 조회 실패' },
      { status: 500 }
    );
  }
}

// POST: 전문가 프로필 관리 액션
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'addOrUpdateProfile':
        const profile: ExpertProfile = {
          ...data,
          updatedAt: new Date().toISOString(),
          createdAt: data.createdAt || new Date().toISOString(),
        };
        
        expertProfileStore.profiles[profile.id] = profile;
        
        return NextResponse.json({
          success: true,
          data: {
            profile,
            message: '전문가 프로필이 저장되었습니다.'
          }
        });

      case 'setCurrentExpertId':
        const expertId = data.id;
        expertProfileStore.currentExpertId = expertId;
        
        return NextResponse.json({
          success: true,
          data: {
            currentExpertId: expertId,
            message: expertId ? '현재 전문가가 설정되었습니다.' : '현재 전문가가 해제되었습니다.'
          }
        });

      case 'deleteProfile':
        const profileId = data.id;
        if (!expertProfileStore.profiles[profileId]) {
          return NextResponse.json(
            { success: false, error: '삭제할 프로필을 찾을 수 없습니다.' },
            { status: 404 }
          );
        }
        
        delete expertProfileStore.profiles[profileId];
        
        // 현재 전문가가 삭제된 경우 초기화
        if (expertProfileStore.currentExpertId === profileId) {
          expertProfileStore.currentExpertId = null;
        }
        
        return NextResponse.json({
          success: true,
          data: {
            deletedId: profileId,
            currentExpertId: expertProfileStore.currentExpertId,
            message: '전문가 프로필이 삭제되었습니다.'
          }
        });

      case 'searchProfiles':
        const searchQuery = data.query;
        let searchResults = Object.values(expertProfileStore.profiles).filter(profile => profile.isProfileComplete);
        
        if (searchQuery && searchQuery.trim()) {
          const lowerQuery = searchQuery.toLowerCase();
          searchResults = searchResults.filter(profile => 
            profile.name.toLowerCase().includes(lowerQuery) ||
            profile.specialty.toLowerCase().includes(lowerQuery) ||
            profile.description.toLowerCase().includes(lowerQuery) ||
            profile.specialties.some(s => s.toLowerCase().includes(lowerQuery)) ||
            profile.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
          );
        }
        
        return NextResponse.json({
          success: true,
          data: {
            profiles: searchResults,
            total: searchResults.length,
            query: searchQuery
          }
        });

      case 'getProfilesBySpecialty':
        const specialtyFilter = data.specialty;
        const specialtyResults = Object.values(expertProfileStore.profiles).filter(profile => 
          profile.isProfileComplete && profile.specialty === specialtyFilter
        );
        
        return NextResponse.json({
          success: true,
          data: {
            profiles: specialtyResults,
            total: specialtyResults.length,
            specialty: specialtyFilter
          }
        });

      case 'initializeProfiles':
        // 더미 데이터로 초기화
        const dummyProfiles: Record<number, ExpertProfile> = {
          1: {
            id: 1,
            name: "김전문",
            specialty: "비즈니스 컨설팅",
            experience: 10,
            description: "10년 경력의 비즈니스 컨설턴트",
            education: ["서울대학교 경영학과"],
            certifications: ["경영컨설팅사"],
            specialties: ["전략 수립", "조직 개편", "마케팅"],
            specialtyAreas: ["전략 수립", "조직 개편", "마케팅"],
            consultationTypes: ["chat", "video", "voice"],
            languages: ["한국어", "영어"],
            hourlyRate: 100000,
            pricePerMinute: 1667,
            totalSessions: 150,
            avgRating: 4.8,
            rating: 4.8,
            reviewCount: 105,
            completionRate: 95,
            repeatClients: 45,
            responseTime: "2시간 내",
            averageSessionDuration: 60,
            cancellationPolicy: "24시간 전 취소 가능",
            availability: {
              monday: { available: true, hours: "09:00-18:00" },
              tuesday: { available: true, hours: "09:00-18:00" },
              wednesday: { available: true, hours: "09:00-18:00" },
              thursday: { available: true, hours: "09:00-18:00" },
              friday: { available: true, hours: "09:00-18:00" }
            },
            weeklyAvailability: {
              monday: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
              tuesday: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
              wednesday: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
              thursday: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
              friday: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]
            },
            contactInfo: {
              phone: "010-1234-5678",
              email: "kim@expert.com",
              location: "서울, 대한민국",
              website: "https://kim-expert.com"
            },
            location: "서울, 대한민국",
            timeZone: "KST (UTC+9)",
            profileImage: null,
            portfolioFiles: [],
            portfolioItems: [],
            tags: ["비즈니스", "전략", "조직"],
            targetAudience: ["일반인", "직장인", "경영자"],
            isOnline: true,
            isProfileComplete: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        };
        
        expertProfileStore.profiles = dummyProfiles;
        expertProfileStore.currentExpertId = 1;
        
        return NextResponse.json({
          success: true,
          data: {
            profiles: Object.values(dummyProfiles),
            currentExpertId: 1,
            message: '전문가 프로필이 초기화되었습니다.'
          }
        });

      default:
        return NextResponse.json(
          { success: false, error: '알 수 없는 액션' },
          { status: 400 }
        );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '전문가 프로필 관리 실패' },
      { status: 500 }
    );
  }
}

// PATCH: 전문가 프로필 부분 업데이트
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, updates } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: '전문가 ID가 필요합니다.' },
        { status: 400 }
      );
    }
    
    if (!expertProfileStore.profiles[id]) {
      return NextResponse.json(
        { success: false, error: '업데이트할 프로필을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    expertProfileStore.profiles[id] = {
      ...expertProfileStore.profiles[id],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    const updatedProfile = expertProfileStore.profiles[id];
    
    return NextResponse.json({
      success: true,
      data: {
        profile: updatedProfile,
        message: '전문가 프로필이 업데이트되었습니다.'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '전문가 프로필 업데이트 실패' },
      { status: 500 }
    );
  }
}

// DELETE: 전문가 프로필 삭제
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
      // 특정 전문가 프로필 삭제
      const profileId = parseInt(id);
      if (!expertProfileStore.profiles[profileId]) {
        return NextResponse.json(
          { success: false, error: '삭제할 프로필을 찾을 수 없습니다.' },
          { status: 404 }
        );
      }
      
      delete expertProfileStore.profiles[profileId];
      
      // 현재 전문가가 삭제된 경우 초기화
      if (expertProfileStore.currentExpertId === profileId) {
        expertProfileStore.currentExpertId = null;
      }
      
      return NextResponse.json({
        success: true,
        data: {
          deletedId: profileId,
          currentExpertId: expertProfileStore.currentExpertId,
          message: '전문가 프로필이 삭제되었습니다.'
        }
      });
    } else {
      // 모든 전문가 프로필 삭제
      expertProfileStore = {
        profiles: {},
        currentExpertId: null,
      };
      
      return NextResponse.json({
        success: true,
        data: {
          message: '모든 전문가 프로필이 삭제되었습니다.'
        }
      });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '전문가 프로필 삭제 실패' },
      { status: 500 }
    );
  }
}
