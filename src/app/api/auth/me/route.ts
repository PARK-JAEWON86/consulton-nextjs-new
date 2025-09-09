import { NextRequest, NextResponse } from 'next/server';
import { User, Expert, ExpertProfile, UserCredits } from '@/lib/db/models';
import { initializeDatabase } from '@/lib/db/init';
import { getAuthenticatedUser } from '@/lib/auth';

// 현재 사용자 정보 조회 API
export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();
    
    // 인증된 사용자 확인
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    // 사용자 정보 조회 (크레딧 정보 포함)
    const user = await User.findByPk(authUser.id, {
      include: [
        {
          model: Expert,
          as: 'expert',
          required: false,
          include: [
            {
              model: ExpertProfile,
              as: 'profile',
              required: false
            }
          ]
        }
      ]
    });

    // 사용자 크레딧 정보 조회
    let userCredits = await UserCredits.findOne({
      where: { userId: authUser.id }
    });

    // 사용자 크레딧이 없으면 새로 생성
    if (!userCredits) {
      userCredits = await UserCredits.create({
        userId: authUser.id,
        aiChatTotal: 7300, // 기본 AI 채팅 토큰
        aiChatUsed: 0,
        purchasedTotal: 0,
        purchasedUsed: 0,
        lastResetDate: null
      });
    }

    if (!user) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 실제 크레딧 계산
    const totalCredits = (userCredits.aiChatTotal + userCredits.purchasedTotal) - (userCredits.aiChatUsed + userCredits.purchasedUsed);

    // 응답 데이터 구성
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      credits: totalCredits, // 실제 크레딧 계산값 추가
      isEmailVerified: user.isEmailVerified,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      expert: user.expert ? {
        id: user.expert.id,
        specialty: user.expert.specialty,
        level: 1, // 기본값 (실제로는 API에서 계산된 레벨 사용)
        experience: user.expert.experience,
        rating: user.expert.rating,
        profile: user.expert.profile
      } : null
    };

    return NextResponse.json({
      success: true,
      user: userData
    });

  } catch (error) {
    console.error('사용자 정보 조회 오류:', error);
    return NextResponse.json(
      { error: '사용자 정보 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
