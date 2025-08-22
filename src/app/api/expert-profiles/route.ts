import { NextRequest, NextResponse } from 'next/server';
import { dummyExperts, convertExpertItemToProfile } from '@/data/dummy/experts';

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
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

// 메모리 기반 저장 (실제 프로덕션에서는 데이터베이스 사용)
let expertProfiles: ExpertProfile[] = [];

// 더미 데이터를 ExpertProfile 형태로 변환하여 초기화
const initializeDummyData = () => {
  if (expertProfiles.length === 0) {
    expertProfiles = dummyExperts.map(expert => {
      const converted = convertExpertItemToProfile(expert);
      return {
        id: converted.id.toString(),
        email: `expert${expert.id}@example.com`,
        fullName: converted.name,
        jobTitle: converted.specialty,
        specialty: converted.specialty,
        experienceYears: converted.experience,
        bio: converted.description,
        keywords: converted.specialties || [],
        consultationTypes: converted.consultationTypes || [],
        availability: converted.availability || {},
        certifications: converted.certifications?.map(cert => ({
          name: cert,
          issuer: '공인기관'
        })) || [],
        profileImage: converted.profileImage || undefined,
        status: 'approved' as const,
        rejectionReason: undefined,
        createdAt: converted.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: converted.updatedAt?.toISOString() || new Date().toISOString()
      };
    });
  }
};

// GET: 모든 전문가 프로필 조회 (관리자용)
export async function GET(request: NextRequest) {
  try {
    // 더미 데이터 초기화
    initializeDummyData();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const email = searchParams.get('email');

    let filteredProfiles = expertProfiles;

    // 상태별 필터링
    if (status) {
      filteredProfiles = filteredProfiles.filter(profile => profile.status === status);
    }

    // 이메일별 필터링
    if (email) {
      filteredProfiles = filteredProfiles.filter(profile => profile.email === email);
    }

    return NextResponse.json({
      success: true,
      data: {
        profiles: filteredProfiles,
        total: filteredProfiles.length
      }
    });
  } catch (error) {
    console.error('전문가 프로필 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '전문가 프로필 조회 실패' },
      { status: 500 }
    );
  }
}

// POST: 새로운 전문가 프로필 생성 또는 초기화
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 초기화 요청인 경우
    if (body.action === 'initializeProfiles') {
      initializeDummyData();
      return NextResponse.json({
        success: true,
        message: '더미 데이터가 초기화되었습니다.',
        count: expertProfiles.length
      });
    }
    
    const newProfile: ExpertProfile = {
      id: `expert_${Date.now()}`,
      ...body,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // 중복 이메일 체크
    const existingProfile = expertProfiles.find(profile => profile.email === body.email);
    if (existingProfile) {
      return NextResponse.json(
        { success: false, error: '이미 등록된 이메일입니다.' },
        { status: 400 }
      );
    }

    expertProfiles.push(newProfile);

    return NextResponse.json({
      success: true,
      data: newProfile,
      message: '전문가 프로필이 성공적으로 등록되었습니다.'
    });
  } catch (error) {
    console.error('전문가 프로필 생성 오류:', error);
    return NextResponse.json(
      { success: false, error: '전문가 프로필 생성 실패' },
      { status: 500 }
    );
  }
}

// PATCH: 전문가 프로필 상태 업데이트 (승인/거절)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, rejectionReason } = body;

    const profileIndex = expertProfiles.findIndex(profile => profile.id === id);
    if (profileIndex === -1) {
      return NextResponse.json(
        { success: false, error: '전문가 프로필을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    expertProfiles[profileIndex] = {
      ...expertProfiles[profileIndex],
      status,
      rejectionReason,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: expertProfiles[profileIndex],
      message: `전문가 프로필이 ${status === 'approved' ? '승인' : '거절'}되었습니다.`
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '전문가 프로필 업데이트 실패' },
      { status: 500 }
    );
  }
}
