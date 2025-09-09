import { NextRequest, NextResponse } from 'next/server';
import { Op } from 'sequelize';
import { ConsultationRequest, User, Expert, Notification } from '@/lib/db/models';
import sequelize, { testConnection } from '@/lib/db/connection';

// 데이터베이스 연결 확인
testConnection();

// 상담 신청 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const expertId = searchParams.get('expertId');
    const clientId = searchParams.get('clientId');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // 쿼리 조건 구성
    const whereClause: any = {};
    
    if (expertId) {
      whereClause.expertId = expertId;
    }
    
    if (clientId) {
      whereClause.clientId = clientId;
    }
    
    if (status) {
      whereClause.status = status;
    }

    // 만료되지 않은 요청만 조회
    const now = new Date();
    whereClause[Op.or] = [
      { expiresAt: null },
      { expiresAt: { [Op.gt]: now } }
    ];

    // 데이터베이스에서 조회
    const { count, rows: requests } = await ConsultationRequest.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Expert,
          as: 'expert',
          attributes: ['id', 'userId'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    // 대기 중인 신청 개수 계산 (expertId가 있는 경우에만)
    let pendingCount = 0;
    if (expertId) {
      pendingCount = await ConsultationRequest.count({
        where: {
          expertId,
          status: 'pending',
          [Op.or]: [
            { expiresAt: null },
            { expiresAt: { [Op.gt]: now } }
          ]
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        requests,
        summary: {
          totalCount: count,
          pendingCount,
          hasMore: offset + limit < count
        }
      }
    });

  } catch (error) {
    console.error('상담 신청 목록 조회 실패:', error);
    return NextResponse.json(
      { success: false, error: '상담 신청 목록을 불러올 수 없습니다.' },
      { status: 500 }
    );
  }
}

// 새 상담 신청 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      clientId, 
      expertId, 
      clientName, 
      clientEmail, 
      consultationType, 
      preferredDate, 
      message 
    } = body;

    // 필수 필드 검증
    if (!clientId || !expertId || !clientName || !consultationType) {
      return NextResponse.json(
        { success: false, error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 중복 신청 확인 (24시간 내 동일한 클라이언트-전문가 조합)
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const existingRequest = await ConsultationRequest.findOne({
      where: {
        clientId,
        expertId,
        status: 'pending',
        createdAt: { [Op.gt]: oneDayAgo }
      }
    });

    if (existingRequest) {
      return NextResponse.json(
        { success: false, error: '이미 상담 신청이 진행 중입니다. 24시간 후에 다시 신청해주세요.' },
        { status: 409 }
      );
    }

    // 새 상담 신청 생성
    const newRequest = await ConsultationRequest.create({
      clientId: parseInt(clientId),
      expertId: parseInt(expertId),
      clientName,
      clientEmail,
      consultationType,
      preferredDate: preferredDate ? new Date(preferredDate) : undefined,
      message,
      status: 'pending',
      expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24시간 후 만료
    });

    // 전문가에게 알림 생성
    const notification: Notification = {
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: expertId,
      type: 'consultation_request',
      title: '새로운 상담 신청',
      message: `${clientName}님이 ${consultationType === 'video' ? '화상' : consultationType === 'chat' ? '채팅' : '음성'} 상담을 신청했습니다.`,
      data: {
        consultationId: newRequest.id,
        clientId,
        clientName,
        consultationType,
        preferredDate: newRequest.preferredDate,
        message: newRequest.message
      },
      isRead: false,
      priority: 'high',
      createdAt: new Date(),
      expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000)
    };

    // 알림 API 호출 (실제로는 내부 함수 호출)
    try {
      const notificationResponse = await fetch(`${request.nextUrl.origin}/api/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notification)
      });
      
      if (!notificationResponse.ok) {
        console.error('알림 생성 실패:', await notificationResponse.text());
      }
    } catch (error) {
      console.error('알림 생성 중 오류:', error);
    }

    return NextResponse.json({
      success: true,
      data: newRequest,
      message: '상담 신청이 완료되었습니다. 전문가가 확인 후 연락드릴 예정입니다.'
    });

  } catch (error) {
    console.error('상담 신청 생성 실패:', error);
    return NextResponse.json(
      { success: false, error: '상담 신청에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 상담 신청 상태 업데이트 (수락/거절)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { requestId, status, expertId, expertMessage } = body;

    // 필수 필드 검증
    if (!requestId || !status || !expertId) {
      return NextResponse.json(
        { success: false, error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 유효한 상태인지 확인
    if (!['accepted', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 상태입니다.' },
        { status: 400 }
      );
    }

    // 상담 신청 찾기
    const consultationRequest = await ConsultationRequest.findByPk(requestId);
    if (!consultationRequest) {
      return NextResponse.json(
        { success: false, error: '상담 신청을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 권한 확인 (해당 전문가의 신청인지)
    if (consultationRequest.expertId !== parseInt(expertId)) {
      return NextResponse.json(
        { success: false, error: '상담 신청을 처리할 권한이 없습니다.' },
        { status: 403 }
      );
    }

    // 이미 처리된 신청인지 확인
    if (consultationRequest.status !== 'pending') {
      return NextResponse.json(
        { success: false, error: '이미 처리된 상담 신청입니다.' },
        { status: 409 }
      );
    }

    // 상태 업데이트
    await consultationRequest.update({
      status,
      expertMessage,
      updatedAt: new Date()
    });

    // 클라이언트에게 알림 생성
    const notification: Notification = {
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: consultationRequest.clientId,
      type: status === 'accepted' ? 'consultation_accepted' : 'consultation_rejected',
      title: status === 'accepted' ? '상담 신청이 수락되었습니다' : '상담 신청이 거절되었습니다',
      message: status === 'accepted' 
        ? '전문가가 상담 신청을 수락했습니다. 곧 연락드릴 예정입니다.'
        : '전문가가 상담 신청을 거절했습니다.',
      data: {
        consultationId: consultationRequest.id,
        expertId: consultationRequest.expertId,
        consultationType: consultationRequest.consultationType,
        expertMessage
      },
      isRead: false,
      priority: status === 'accepted' ? 'high' : 'medium',
      createdAt: new Date()
    };

    // 알림 API 호출
    try {
      const notificationResponse = await fetch(`${request.nextUrl.origin}/api/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notification)
      });
      
      if (!notificationResponse.ok) {
        console.error('알림 생성 실패:', await notificationResponse.text());
      }
    } catch (error) {
      console.error('알림 생성 중 오류:', error);
    }

    return NextResponse.json({
      success: true,
      data: consultationRequest,
      message: `상담 신청이 ${status === 'accepted' ? '수락' : '거절'}되었습니다.`
    });

  } catch (error) {
    console.error('상담 신청 상태 업데이트 실패:', error);
    return NextResponse.json(
      { success: false, error: '상담 신청 상태 업데이트에 실패했습니다.' },
      { status: 500 }
    );
  }
}
