import { NextRequest, NextResponse } from 'next/server';
import { Expert, ExpertProfile as ExpertProfileModel, User } from '@/lib/db/models';
import { initializeDatabase } from '@/lib/db/init';
import { getAuthenticatedUser } from '@/lib/auth';
import { 
  searchExpertProfiles, 
  calculatePagination,
  logQueryPerformance 
} from '@/lib/db/queryOptimizations';
// import { dummyExperts, convertExpertItemToProfile } from '@/data/dummy/experts'; // 더미 데이터 제거

interface ExpertProfile {
  id: string;
  email: string;
  fullName: string;
  jobTitle: string;
  specialty: string;
  experienceYears: number;
  bio: string;
  keywords: string[];
  consultationTypes: string[];
  availability: Record<string, { available: boolean; hours: string }>;
  certifications: Array<{ name: string; issuer: string }>;
  profileImage?: string;
  status: 'pending' | 'approved' | 'rejected' | 'deleted';
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  // 추가 필드들
  rating?: number;
  reviewCount?: number;
  totalSessions?: number;
  repeatClients?: number;
  responseTime?: string;
  languages?: string[];
  location?: string;
  timeZone?: string;
}

// 더미 데이터 관련 코드 제거 - 실제 데이터베이스 사용

// GET: 전문가 프로필 조회
export async function GET(request: NextRequest) {
  try {
    console.log('Expert-profiles API 호출됨:', request.url);
    await initializeDatabase();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const query = searchParams.get('query');
    const specialty = searchParams.get('specialty');
    const currentExpert = searchParams.get('currentExpert') === 'true';

    // 특정 ID로 조회
    if (id) {
      const expert = await Expert.findByPk(parseInt(id), {
        include: [
          {
            model: ExpertProfileModel,
            as: 'profile',
            required: false
          },
          {
            model: User,
            as: 'user',
            required: false
          }
        ]
      });

      if (!expert) {
        return NextResponse.json(
          { success: false, message: '전문가를 찾을 수 없습니다.' },
          { status: 404 }
        );
      }

      const profileData = {
        id: expert.id.toString(),
        email: expert.user?.email || '',
        fullName: expert.profile?.fullName || expert.user?.name || '',
        jobTitle: expert.profile?.jobTitle || expert.specialty,
        specialty: expert.specialty,
        experienceYears: expert.experience,
        bio: expert.profile?.bio || '',
        keywords: expert.profile?.specialties ? JSON.parse(expert.profile.specialties) : [],
        consultationTypes: expert.consultationTypes ? JSON.parse(expert.consultationTypes) : [],
        availability: {}, // TODO: ExpertAvailability 테이블과 연동
        certifications: expert.profile?.certifications ? JSON.parse(expert.profile.certifications) : [],
        profileImage: expert.profile?.profileImage,
        status: 'approved', // TODO: 상태 관리 로직 추가
        createdAt: expert.createdAt.toISOString(),
        updatedAt: expert.updatedAt.toISOString(),
        rating: expert.rating,
        reviewCount: expert.reviewCount,
        totalSessions: expert.totalSessions,
        repeatClients: expert.profile?.repeatClients || 0,
        responseTime: expert.responseTime,
        languages: expert.languages ? JSON.parse(expert.languages) : ['한국어'],
        location: expert.location,
        timeZone: expert.timeZone
      };

      return NextResponse.json({
        success: true,
        data: {
          profiles: [profileData],
          total: 1
        }
      });
    }

    // 현재 로그인한 전문가 프로필 조회 (임시로 비활성화)
    if (currentExpert) {
      console.log('현재 전문가 조회 요청 - 임시로 빈 응답 반환');
      return NextResponse.json({
        success: true,
        data: {
          profiles: [],
          total: 0
        }
      });
      // const authUser = await getAuthenticatedUser(request);
      // if (!authUser || authUser.role !== 'expert') {
      //   return NextResponse.json(
      //     { success: false, message: '전문가 권한이 필요합니다.' },
      //     { status: 403 }
      //   );
      // }

      const expert = await Expert.findOne({
        where: { userId: authUser.id },
        include: [
          {
            model: ExpertProfileModel,
            as: 'profile',
            required: false
          },
          {
            model: User,
            as: 'user',
            required: false
          }
        ]
      });

      if (!expert) {
        return NextResponse.json(
          { success: false, message: '전문가 프로필을 찾을 수 없습니다.' },
          { status: 404 }
        );
      }

      const profileData = {
        id: expert.id.toString(),
        email: expert.user?.email || '',
        fullName: expert.profile?.fullName || expert.user?.name || '',
        jobTitle: expert.profile?.jobTitle || expert.specialty,
        specialty: expert.specialty,
        experienceYears: expert.experience,
        bio: expert.profile?.bio || '',
        keywords: expert.profile?.specialties ? JSON.parse(expert.profile.specialties) : [],
        consultationTypes: expert.consultationTypes ? JSON.parse(expert.consultationTypes) : [],
        availability: {},
        certifications: expert.profile?.certifications ? JSON.parse(expert.profile.certifications) : [],
        profileImage: expert.profile?.profileImage,
        status: 'approved',
        createdAt: expert.createdAt.toISOString(),
        updatedAt: expert.updatedAt.toISOString(),
        rating: expert.rating,
        reviewCount: expert.reviewCount,
        totalSessions: expert.totalSessions,
        repeatClients: expert.profile?.repeatClients || 0,
        responseTime: expert.responseTime,
        languages: expert.languages ? JSON.parse(expert.languages) : ['한국어'],
        location: expert.location,
        timeZone: expert.timeZone
      };

      return NextResponse.json({
        success: true,
        data: {
          profiles: [profileData],
          total: 1,
          currentExpertId: expert.id
        }
      });
    }

    // 전체 전문가 프로필 목록 조회
    let whereClause: any = {
      isProfilePublic: true
    };

    // 전문 분야별 필터링
    if (specialty) {
      whereClause.specialty = specialty;
    }

    console.log('데이터베이스 조회 조건:', whereClause);
    const experts = await Expert.findAll({
      where: whereClause,
      include: [
        {
          model: ExpertProfileModel,
          as: 'profile',
          required: false
        },
        {
          model: User,
          as: 'user',
          required: false
        }
      ],
      limit: 50 // 성능을 위해 제한
    });
    console.log('조회된 전문가 수:', experts.length);

    const profiles = experts.map(expert => ({
      id: expert.id.toString(),
      email: expert.user?.email || '',
      fullName: expert.profile?.fullName || expert.user?.name || '',
      jobTitle: expert.profile?.jobTitle || expert.specialty,
      specialty: expert.specialty,
      experienceYears: expert.experience,
      bio: expert.profile?.bio || '',
      keywords: expert.profile?.specialties ? JSON.parse(expert.profile.specialties) : [],
      consultationTypes: expert.consultationTypes ? JSON.parse(expert.consultationTypes) : [],
      availability: {},
      certifications: expert.profile?.certifications ? JSON.parse(expert.profile.certifications) : [],
      profileImage: expert.profile?.profileImage,
      status: 'approved',
      createdAt: expert.createdAt.toISOString(),
      updatedAt: expert.updatedAt.toISOString(),
      rating: expert.rating,
      reviewCount: expert.reviewCount,
      totalSessions: expert.totalSessions,
      repeatClients: expert.profile?.repeatClients || 0,
      responseTime: expert.responseTime,
      languages: expert.languages ? JSON.parse(expert.languages) : ['한국어'],
      location: expert.location,
      timeZone: expert.timeZone
    }));

    // 검색 쿼리가 있는 경우 필터링
    let filteredProfiles = profiles;
    if (query) {
      const searchQuery = query.toLowerCase();
      filteredProfiles = profiles.filter(profile => 
        profile.fullName.toLowerCase().includes(searchQuery) ||
        profile.specialty.toLowerCase().includes(searchQuery) ||
        profile.bio.toLowerCase().includes(searchQuery)
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        profiles: filteredProfiles,
        total: filteredProfiles.length
      }
    });
  } catch (error) {
    console.error('전문가 프로필 조회 실패:', error);
    console.error('에러 스택:', error.stack);
    return NextResponse.json(
      { success: false, error: '전문가 프로필 조회에 실패했습니다.', details: error.message },
      { status: 500 }
    );
  }
}

// POST: 전문가 프로필 생성 또는 업데이트
export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    
    const authUser = await getAuthenticatedUser(request);
    if (!authUser || authUser.role !== 'expert') {
      return NextResponse.json(
        { success: false, message: '전문가 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      fullName,
      jobTitle,
      bio,
      description,
      education,
      certifications,
      specialties,
      specialtyAreas,
      consultationStyle,
      targetAudience,
      profileImage,
      tags
    } = body;

    // 입력값 검증
    if (!fullName || !jobTitle) {
      return NextResponse.json(
        { success: false, message: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 기존 전문가 정보 조회
    let expert = await Expert.findOne({
      where: { userId: authUser.id },
      include: [
        {
          model: ExpertProfileModel,
          as: 'profile',
          required: false
        }
      ]
    });

    if (!expert) {
      return NextResponse.json(
        { success: false, message: '전문가 정보를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // ExpertProfile 생성 또는 업데이트
    let expertProfile;
    if (expert.profile) {
      // 기존 프로필 업데이트
      await expert.profile.update({
        fullName,
        jobTitle,
        bio: bio || '',
        description: description || '',
        education: education ? JSON.stringify(education) : '[]',
        certifications: certifications ? JSON.stringify(certifications) : '[]',
        specialties: specialties ? JSON.stringify(specialties) : '[]',
        specialtyAreas: specialtyAreas ? JSON.stringify(specialtyAreas) : '[]',
        consultationStyle: consultationStyle || '',
        targetAudience: targetAudience ? JSON.stringify(targetAudience) : '[]',
        profileImage: profileImage || null,
        tags: tags ? JSON.stringify(tags) : '[]'
      });
      expertProfile = expert.profile;
    } else {
      // 새 프로필 생성
      expertProfile = await ExpertProfileModel.create({
        expertId: expert.id,
        fullName,
        jobTitle,
        bio: bio || '',
        description: description || '',
        education: education ? JSON.stringify(education) : '[]',
        certifications: certifications ? JSON.stringify(certifications) : '[]',
        specialties: specialties ? JSON.stringify(specialties) : '[]',
        specialtyAreas: specialtyAreas ? JSON.stringify(specialtyAreas) : '[]',
        consultationStyle: consultationStyle || '',
        targetAudience: targetAudience ? JSON.stringify(targetAudience) : '[]',
        profileImage: profileImage || null,
        tags: tags ? JSON.stringify(tags) : '[]'
      });
    }

    // Expert 테이블의 프로필 완성도 업데이트
    await expert.update({
      isProfileComplete: true
    });

    // 업데이트된 프로필 정보 조회
    const updatedExpert = await Expert.findByPk(expert.id, {
      include: [
        {
          model: ExpertProfileModel,
          as: 'profile',
          required: false
        },
        {
          model: User,
          as: 'user',
          required: false
        }
      ]
    });

    const profileData = {
      id: updatedExpert!.id.toString(),
      email: updatedExpert!.user?.email || '',
      fullName: expertProfile.fullName,
      jobTitle: expertProfile.jobTitle,
      specialty: updatedExpert!.specialty,
      experienceYears: updatedExpert!.experience,
      bio: expertProfile.bio,
      keywords: expertProfile.specialties ? JSON.parse(expertProfile.specialties) : [],
      consultationTypes: updatedExpert!.consultationTypes ? JSON.parse(updatedExpert!.consultationTypes) : [],
      availability: {},
      certifications: expertProfile.certifications ? JSON.parse(expertProfile.certifications) : [],
      profileImage: expertProfile.profileImage,
      status: 'approved',
      createdAt: updatedExpert!.createdAt.toISOString(),
      updatedAt: updatedExpert!.updatedAt.toISOString(),
      rating: updatedExpert!.rating,
      reviewCount: updatedExpert!.reviewCount,
      totalSessions: updatedExpert!.totalSessions,
      repeatClients: expertProfile.repeatClients || 0,
      responseTime: updatedExpert!.responseTime,
      languages: updatedExpert!.languages ? JSON.parse(updatedExpert!.languages) : ['한국어'],
      location: updatedExpert!.location,
      timeZone: updatedExpert!.timeZone
    };

    return NextResponse.json({
      success: true,
      data: profileData,
      message: '전문가 프로필이 성공적으로 저장되었습니다.'
    });
  } catch (error) {
    console.error('전문가 프로필 생성/업데이트 실패:', error);
    return NextResponse.json(
      { success: false, message: '전문가 프로필 저장에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// PATCH: 전문가 프로필 상태 업데이트 (승인/거절) - 관리자용
export async function PATCH(request: NextRequest) {
  try {
    await initializeDatabase();
    
    const authUser = await getAuthenticatedUser(request);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, status, rejectionReason } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    const expert = await Expert.findByPk(parseInt(id), {
      include: [
        {
          model: ExpertProfileModel,
          as: 'profile',
          required: false
        },
        {
          model: User,
          as: 'user',
          required: false
        }
      ]
    });

    if (!expert) {
      return NextResponse.json(
        { success: false, message: '전문가 프로필을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 상태 업데이트 (현재는 Expert 테이블에 상태 필드가 없으므로 프로필 공개 여부로 대체)
    if (status === 'approved') {
      await expert.update({
        isProfilePublic: true,
        isProfileComplete: true
      });
    } else if (status === 'rejected') {
      await expert.update({
        isProfilePublic: false
      });
    }

    const profileData = {
      id: expert.id.toString(),
      email: expert.user?.email || '',
      fullName: expert.profile?.fullName || expert.user?.name || '',
      jobTitle: expert.profile?.jobTitle || expert.specialty,
      specialty: expert.specialty,
      experienceYears: expert.experience,
      bio: expert.profile?.bio || '',
      keywords: expert.profile?.specialties ? JSON.parse(expert.profile.specialties) : [],
      consultationTypes: expert.consultationTypes ? JSON.parse(expert.consultationTypes) : [],
      availability: {},
      certifications: expert.profile?.certifications ? JSON.parse(expert.profile.certifications) : [],
      profileImage: expert.profile?.profileImage,
      status: status,
      rejectionReason: rejectionReason || undefined,
      createdAt: expert.createdAt.toISOString(),
      updatedAt: expert.updatedAt.toISOString(),
      rating: expert.rating,
      reviewCount: expert.reviewCount,
      totalSessions: expert.totalSessions,
      repeatClients: expert.profile?.repeatClients || 0,
      responseTime: expert.responseTime,
      languages: expert.languages ? JSON.parse(expert.languages) : ['한국어'],
      location: expert.location,
      timeZone: expert.timeZone
    };

    return NextResponse.json({
      success: true,
      data: profileData,
      message: `전문가 프로필이 ${status === 'approved' ? '승인' : '거절'}되었습니다.`
    });
  } catch (error) {
    console.error('전문가 프로필 상태 업데이트 실패:', error);
    return NextResponse.json(
      { success: false, message: '전문가 프로필 상태 업데이트에 실패했습니다.' },
      { status: 500 }
    );
  }
}
