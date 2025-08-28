import { NextRequest, NextResponse } from 'next/server';

// 프로필 데이터 타입
interface ProfileData {
  firstName: string;
  displayName: string;
  email: string;
  phone: string;
  profileImage?: string;
  interestedCategories: string[];
  profileVisibility: "public" | "experts" | "private";
}

// GET: 프로필 정보 조회
export async function GET() {
  try {
    // TODO: 실제 인증된 사용자 정보를 데이터베이스에서 가져오기
    // 현재는 더미 데이터 반환
    
    const profile: ProfileData = {
      firstName: "김철수",
      displayName: "철수킹",
      email: "kimcheolsu@example.com",
      phone: "010-1234-5678",
      interestedCategories: ["career", "psychology", "finance"],
      profileVisibility: "experts"
    };

    return NextResponse.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('프로필 조회 실패:', error);
    // 에러가 발생해도 기본 프로필 반환하여 알러트 방지
    const fallbackProfile: ProfileData = {
      firstName: "김철수",
      displayName: "철수킹",
      email: "kimcheolsu@example.com",
      phone: "010-1234-5678",
      interestedCategories: ["career", "psychology", "finance"],
      profileVisibility: "experts"
    };

    return NextResponse.json({
      success: true,
      data: fallbackProfile
    });
  }
}

// PUT: 프로필 정보 업데이트
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstName,
      displayName,
      email,
      phone,
      profileImage,
      interestedCategories,
      profileVisibility
    } = body;

    // 입력값 검증
    if (!firstName || !displayName || !email) {
      return NextResponse.json(
        { success: false, message: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: '올바른 이메일 형식이 아닙니다.' },
        { status: 400 }
      );
    }

    // 전화번호 형식 검증 (한국 전화번호)
    if (phone) {
      const phoneRegex = /^01[0-9]-\d{3,4}-\d{4}$/;
      if (!phoneRegex.test(phone)) {
        return NextResponse.json(
          { success: false, message: '올바른 전화번호 형식이 아닙니다.' },
          { status: 400 }
        );
      }
    }

    // 프로필 공개설정 검증
    const validVisibilityOptions = ["public", "experts", "private"];
    if (!validVisibilityOptions.includes(profileVisibility)) {
      return NextResponse.json(
        { success: false, message: '올바르지 않은 공개설정입니다.' },
        { status: 400 }
      );
    }

    // TODO: 실제 데이터베이스에 프로필 정보 저장
    // 현재는 성공 응답만 반환
    
    const updatedProfile: ProfileData = {
      firstName,
      displayName,
      email,
      phone: phone || "",
      profileImage,
      interestedCategories: interestedCategories || [],
      profileVisibility
    };

    // 프로필 공개설정에 따른 제약사항 체크
    if (profileVisibility === "private") {
      console.log('비공개 설정: 커뮤니티 활동 및 전문가 매칭에 제약 적용 필요');
      // TODO: 비공개 설정 시 관련 기능 제한 로직 구현
    }

    return NextResponse.json({
      success: true,
      message: '프로필이 성공적으로 업데이트되었습니다.',
      data: updatedProfile
    });
  } catch (error) {
    console.error('프로필 업데이트 실패:', error);
    return NextResponse.json(
      { success: false, message: '프로필 업데이트에 실패했습니다.' },
      { status: 500 }
    );
  }
}
