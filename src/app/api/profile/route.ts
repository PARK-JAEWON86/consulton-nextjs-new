import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/lib/db/models';
import { initializeDatabase } from '@/lib/db/init';
import { getAuthenticatedUser } from '@/lib/auth';

// GET: 사용자 프로필 조회
export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();
    
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    // 사용자 정보 조회
    const user = await User.findByPk(authUser.id, {
      attributes: [
        'id', 'name', 'email', 'phone', 'profileImage', 
        'interestedCategories', 'profileVisibility', 'displayName',
        'location', 'birthDate', 'bio', 'createdAt', 'updatedAt'
      ]
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: '사용자 정보를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 프로필 데이터 변환
    const profileData = {
      id: user.id,
      firstName: user.name || '',
      displayName: user.displayName || user.name || '', // displayName 사용, 없으면 name으로 폴백
      email: user.email || '',
      phone: user.phone || '',
      location: user.location || '',
      birthDate: user.birthDate || '',
      bio: user.bio || '',
      profileImage: user.profileImage,
      interestedCategories: user.interestedCategories ? 
        (typeof user.interestedCategories === 'string' ? 
          JSON.parse(user.interestedCategories) : user.interestedCategories) : [],
      profileVisibility: user.profileVisibility || 'experts'
    };

    return NextResponse.json({
      success: true,
      data: profileData
    });

  } catch (error) {
    console.error('프로필 조회 실패:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: '프로필 조회에 실패했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      },
      { status: 500 }
    );
  }
}

// PUT: 사용자 프로필 업데이트
export async function PUT(request: NextRequest) {
  try {
    await initializeDatabase();
    
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      displayName,
      phone,
      location,
      birthDate,
      bio,
      interestedCategories,
      profileVisibility,
      profileImage
    } = body;

    // 입력값 검증
    if (profileVisibility && !['public', 'experts', 'private'].includes(profileVisibility)) {
      return NextResponse.json(
        { success: false, message: '잘못된 공개설정 값입니다.' },
        { status: 400 }
      );
    }

    // 사용자 정보 조회
    const user = await User.findByPk(authUser.id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: '사용자 정보를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 업데이트할 데이터 준비
    const updateData: any = {};
    
    if (displayName !== undefined) {
      updateData.displayName = displayName; // displayName 컬럼에 직접 저장
    }
    
    if (phone !== undefined) {
      updateData.phone = phone;
    }
    
    if (location !== undefined) {
      updateData.location = location;
    }
    
    if (birthDate !== undefined) {
      updateData.birthDate = birthDate;
    }
    
    if (bio !== undefined) {
      updateData.bio = bio;
    }
    
    if (interestedCategories !== undefined) {
      updateData.interestedCategories = JSON.stringify(interestedCategories);
    }
    
    if (profileVisibility !== undefined) {
      updateData.profileVisibility = profileVisibility;
    }
    
    if (profileImage !== undefined) {
      updateData.profileImage = profileImage;
    }

    // 업데이트 시간 설정
    updateData.updatedAt = new Date();

    // 사용자 정보 업데이트
    await user.update(updateData);

    // 업데이트된 정보 조회
    await user.reload();

    // 응답 데이터 준비
    const responseData = {
      id: user.id,
      firstName: user.name || '',
      displayName: user.displayName || user.name || '', // displayName 사용, 없으면 name으로 폴백
      email: user.email || '',
      phone: user.phone || '',
      location: user.location || '',
      birthDate: user.birthDate || '',
      bio: user.bio || '',
      profileImage: user.profileImage,
      interestedCategories: user.interestedCategories ? 
        (typeof user.interestedCategories === 'string' ? 
          JSON.parse(user.interestedCategories) : user.interestedCategories) : [],
      profileVisibility: user.profileVisibility || 'experts'
    };

    return NextResponse.json({
      success: true,
      data: responseData,
      message: '프로필이 성공적으로 업데이트되었습니다.'
    });

  } catch (error) {
    console.error('프로필 업데이트 실패:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: '프로필 업데이트에 실패했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      },
      { status: 500 }
    );
  }
}