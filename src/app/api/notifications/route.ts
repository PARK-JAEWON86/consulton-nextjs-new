import { NextRequest, NextResponse } from 'next/server';
import { Notification } from '@/types';

// 임시 메모리 저장소 (실제로는 데이터베이스 사용)
let notifications: Notification[] = [];

// 알림 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');
    const isRead = searchParams.get('isRead');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: '사용자 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 사용자별 알림 필터링
    let filteredNotifications = notifications.filter(notification => 
      notification.userId === userId
    );

    // 타입별 필터링
    if (type) {
      filteredNotifications = filteredNotifications.filter(notification => 
        notification.type === type
      );
    }

    // 읽음 상태별 필터링
    if (isRead !== null) {
      const readStatus = isRead === 'true';
      filteredNotifications = filteredNotifications.filter(notification => 
        notification.isRead === readStatus
      );
    }

    // 만료된 알림 제거
    const now = new Date();
    filteredNotifications = filteredNotifications.filter(notification => 
      !notification.expiresAt || notification.expiresAt > now
    );

    // 최신순 정렬
    filteredNotifications.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // 페이징
    const paginatedNotifications = filteredNotifications.slice(offset, offset + limit);

    // 읽지 않은 알림 개수 계산
    const unreadCount = filteredNotifications.filter(n => !n.isRead).length;

    return NextResponse.json({
      success: true,
      data: {
        notifications: paginatedNotifications,
        totalCount: filteredNotifications.length,
        unreadCount,
        hasMore: offset + limit < filteredNotifications.length
      }
    });

  } catch (error) {
    console.error('알림 목록 조회 실패:', error);
    return NextResponse.json(
      { success: false, error: '알림 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 새 알림 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, type, title, message, data, priority = 'medium' } = body;

    // 필수 필드 검증
    if (!userId || !type || !title || !message) {
      return NextResponse.json(
        { success: false, error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 새 알림 생성
    const newNotification: Notification = {
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type,
      title,
      message,
      data,
      isRead: false,
      priority,
      createdAt: new Date(),
      expiresAt: type === 'consultation_request' ? 
        new Date(Date.now() + 24 * 60 * 60 * 1000) : // 상담 신청은 24시간 후 만료
        undefined
    };

    // 알림 저장
    notifications.push(newNotification);

    return NextResponse.json({
      success: true,
      data: newNotification
    });

  } catch (error) {
    console.error('알림 생성 실패:', error);
    return NextResponse.json(
      { success: false, error: '알림 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 알림 읽음 처리
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { notificationId, userId, markAllAsRead = false } = body;

    if (markAllAsRead) {
      // 사용자의 모든 알림을 읽음 처리
      if (!userId) {
        return NextResponse.json(
          { success: false, error: '사용자 ID가 필요합니다.' },
          { status: 400 }
        );
      }

      const updatedCount = notifications
        .filter(notification => 
          notification.userId === userId && !notification.isRead
        )
        .map(notification => {
          notification.isRead = true;
          notification.readAt = new Date();
          return notification;
        }).length;

      return NextResponse.json({
        success: true,
        data: { updatedCount }
      });

    } else {
      // 특정 알림 읽음 처리
      if (!notificationId) {
        return NextResponse.json(
          { success: false, error: '알림 ID가 필요합니다.' },
          { status: 400 }
        );
      }

      const notification = notifications.find(n => n.id === notificationId);
      if (!notification) {
        return NextResponse.json(
          { success: false, error: '알림을 찾을 수 없습니다.' },
          { status: 404 }
        );
      }

      notification.isRead = true;
      notification.readAt = new Date();

      return NextResponse.json({
        success: true,
        data: notification
      });
    }

  } catch (error) {
    console.error('알림 읽음 처리 실패:', error);
    return NextResponse.json(
      { success: false, error: '알림 읽음 처리에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 알림 삭제
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!notificationId) {
      return NextResponse.json(
        { success: false, error: '알림 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const notificationIndex = notifications.findIndex(n => n.id === notificationId);
    if (notificationIndex === -1) {
      return NextResponse.json(
        { success: false, error: '알림을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 사용자 권한 확인 (선택사항)
    if (userId && notifications[notificationIndex].userId !== userId) {
      return NextResponse.json(
        { success: false, error: '알림을 삭제할 권한이 없습니다.' },
        { status: 403 }
      );
    }

    notifications.splice(notificationIndex, 1);

    return NextResponse.json({
      success: true,
      message: '알림이 삭제되었습니다.'
    });

  } catch (error) {
    console.error('알림 삭제 실패:', error);
    return NextResponse.json(
      { success: false, error: '알림 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
}
