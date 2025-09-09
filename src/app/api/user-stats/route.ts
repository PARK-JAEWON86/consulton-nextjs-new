import { NextRequest, NextResponse } from 'next/server';
import { User, Consultation, ConsultationSession } from '@/lib/db/models';
import { initializeDatabase } from '@/lib/db/init';
import { getAuthenticatedUser } from '@/lib/auth';

// GET: 사용자 통계 정보 조회
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
    const user = await User.findByPk(authUser.id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: '사용자 정보를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 총 상담 횟수 조회
    const totalConsultations = await Consultation.count({
      where: {
        clientId: authUser.id,
        status: ['completed', 'in_progress']
      }
    });

    // 완료된 상담 횟수 조회
    const completedConsultations = await Consultation.count({
      where: {
        clientId: authUser.id,
        status: 'completed'
      }
    });

    // 총 상담 세션 수 조회
    const totalSessions = await ConsultationSession.count({
      where: {
        clientId: authUser.id
      }
    });

    // 즐겨찾기 전문가 수 (현재는 0으로 설정, 추후 구현)
    const favoriteExperts = 0;

    // 최근 상담 정보 조회
    const recentConsultation = await Consultation.findOne({
      where: {
        clientId: authUser.id
      },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'expert',
          attributes: ['id', 'name', 'profileImage']
        }
      ]
    });

    // 사용자 통계 데이터
    const userStats = {
      totalConsultations,
      completedConsultations,
      totalSessions,
      favoriteExperts,
      recentConsultation: recentConsultation ? {
        id: recentConsultation.id,
        expertName: recentConsultation.expert?.name || '알 수 없음',
        expertImage: recentConsultation.expert?.profileImage || null,
        status: recentConsultation.status,
        createdAt: recentConsultation.createdAt
      } : null,
      joinDate: user.createdAt,
      lastActiveAt: user.updatedAt
    };

    return NextResponse.json({
      success: true,
      data: userStats
    });

  } catch (error) {
    console.error('사용자 통계 조회 실패:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: '사용자 통계 조회에 실패했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      },
      { status: 500 }
    );
  }
}
