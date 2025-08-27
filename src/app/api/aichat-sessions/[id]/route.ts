import { NextRequest, NextResponse } from 'next/server';

// 더미 데이터 (실제로는 데이터베이스에서 가져와야 함)
const mockChatSessions = [
  {
    id: "1",
    title: "마케팅 전략 상담",
    userId: "user1",
    expertId: "expert1",
    expert: {
      name: "이민수",
      title: "마케팅 전문가",
      avatar: null,
    },
    lastMessage: "네, 인스타그램 마케팅에 대해 더 자세히 알려드릴게요.",
    timestamp: new Date("2024-01-15T14:30:00"),
    duration: 45,
    status: "completed",
    messageCount: 23,
    creditsUsed: 25,
    category: "마케팅",
    createdAt: new Date("2024-01-15T14:00:00"),
    updatedAt: new Date("2024-01-15T14:30:00"),
  },
  {
    id: "2",
    title: "비즈니스 모델 검토",
    userId: "user1",
    expertId: "expert2",
    expert: {
      name: "박비즈니스",
      title: "사업 전략 컨설턴트",
      avatar: null,
    },
    lastMessage: "다음 단계로 투자 유치 계획을 세워보시는 것을 추천드립니다.",
    timestamp: new Date("2024-01-12T10:15:00"),
    duration: 60,
    status: "completed",
    messageCount: 31,
    creditsUsed: 30,
    category: "비즈니스",
    createdAt: new Date("2024-01-12T10:00:00"),
    updatedAt: new Date("2024-01-12T10:15:00"),
  },
  {
    id: "3",
    title: "기술 아키텍처 상담",
    userId: "user1",
    expertId: "expert3",
    expert: {
      name: "이테크니컬",
      title: "풀스택 개발자",
      avatar: null,
    },
    lastMessage: "마이크로서비스 아키텍처 적용을 고려해보세요.",
    timestamp: new Date("2024-01-10T16:45:00"),
    duration: 35,
    status: "completed",
    messageCount: 18,
    creditsUsed: 20,
    category: "기술",
    createdAt: new Date("2024-01-10T16:30:00"),
    updatedAt: new Date("2024-01-10T16:45:00"),
  },
];

// GET: 특정 채팅 세션 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const session = mockChatSessions.find(s => s.id === id);

    if (!session) {
      return NextResponse.json(
        { success: false, error: '채팅 세션을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error('채팅 세션 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '채팅 세션을 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// PUT: 채팅 세션 정보 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { title, status, lastMessage, messageCount, creditsUsed, duration } = body;

    const sessionIndex = mockChatSessions.findIndex(s => s.id === id);
    if (sessionIndex === -1) {
      return NextResponse.json(
        { success: false, error: '채팅 세션을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 세션 정보 업데이트
    const updatedSession = {
      ...mockChatSessions[sessionIndex],
      ...(title && { title }),
      ...(status && { status }),
      ...(lastMessage && { lastMessage }),
      ...(messageCount !== undefined && { messageCount }),
      ...(creditsUsed !== undefined && { creditsUsed }),
      ...(duration !== undefined && { duration }),
      updatedAt: new Date(),
    };

    mockChatSessions[sessionIndex] = updatedSession;

    return NextResponse.json({
      success: true,
      data: updatedSession,
      message: '채팅 세션이 업데이트되었습니다.',
    });
  } catch (error) {
    console.error('채팅 세션 수정 오류:', error);
    return NextResponse.json(
      { success: false, error: '채팅 세션을 수정하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE: 채팅 세션 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const sessionIndex = mockChatSessions.findIndex(s => s.id === id);

    if (sessionIndex === -1) {
      return NextResponse.json(
        { success: false, error: '채팅 세션을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 세션 삭제
    mockChatSessions.splice(sessionIndex, 1);

    return NextResponse.json({
      success: true,
      message: '채팅 세션이 삭제되었습니다.',
    });
  } catch (error) {
    console.error('채팅 세션 삭제 오류:', error);
    return NextResponse.json(
      { success: false, error: '채팅 세션을 삭제하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
