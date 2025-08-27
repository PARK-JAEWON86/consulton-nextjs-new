import { NextRequest, NextResponse } from 'next/server';

// 테스트용 더미 데이터
const testData = {
  sessions: [
    {
      id: "test1",
      title: "테스트 상담 1",
      userId: "testuser",
      expertId: null,
      expert: {
        name: "AI 상담사",
        title: "AI 상시 상담",
        avatar: null,
      },
      lastMessage: "테스트 메시지입니다.",
      timestamp: new Date(),
      duration: 10,
      status: "in_progress",
      messageCount: 5,
      creditsUsed: 10,
      category: "테스트",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "test2",
      title: "테스트 상담 2",
      userId: "testuser",
      expertId: "expert1",
      expert: {
        name: "테스트 전문가",
        title: "테스트 분야",
        avatar: null,
      },
      lastMessage: "전문가 상담 테스트입니다.",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1일 전
      duration: 30,
      status: "completed",
      messageCount: 15,
      creditsUsed: 25,
      category: "테스트",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
  ],
  messages: {
    "test1": [
      {
        id: "msg_test1_1",
        sessionId: "test1",
        type: "user",
        content: "안녕하세요! 테스트 상담을 시작하겠습니다.",
        timestamp: new Date(),
        senderId: "testuser",
        senderName: "테스트 사용자",
        senderAvatar: null,
      },
      {
        id: "msg_test1_2",
        sessionId: "test1",
        type: "ai",
        content: "안녕하세요! 테스트 상담을 도와드리겠습니다. 무엇을 도와드릴까요?",
        timestamp: new Date(),
        senderId: "ai",
        senderName: "AI 상담사",
        senderAvatar: null,
      },
    ],
    "test2": [
      {
        id: "msg_test2_1",
        sessionId: "test2",
        type: "user",
        content: "전문가 상담 테스트입니다.",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        senderId: "testuser",
        senderName: "테스트 사용자",
        senderAvatar: null,
      },
      {
        id: "msg_test2_2",
        sessionId: "test2",
        type: "expert",
        content: "전문가 상담을 시작하겠습니다. 어떤 도움이 필요하신가요?",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        senderId: "expert1",
        senderName: "테스트 전문가",
        senderAvatar: null,
      },
    ],
  },
};

// GET: 테스트 데이터 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // sessions, messages, all

    if (type === 'sessions') {
      return NextResponse.json({
        success: true,
        data: testData.sessions,
        message: '테스트 세션 데이터입니다.',
      });
    }

    if (type === 'messages') {
      return NextResponse.json({
        success: true,
        data: testData.messages,
        message: '테스트 메시지 데이터입니다.',
      });
    }

    // 기본적으로 모든 테스트 데이터 반환
    return NextResponse.json({
      success: true,
      data: {
        sessions: testData.sessions,
        messages: testData.messages,
      },
      message: '테스트 데이터입니다.',
      endpoints: {
        'GET /api/aichat-sessions/test': '이 페이지 (테스트 데이터 조회)',
        'GET /api/aichat-sessions/test?type=sessions': '테스트 세션만 조회',
        'GET /api/aichat-sessions/test?type=messages': '테스트 메시지만 조회',
        'GET /api/aichat-sessions': '실제 채팅 세션 목록 조회',
        'POST /api/aichat-sessions': '새로운 채팅 세션 생성',
        'GET /api/aichat-sessions/[id]': '특정 채팅 세션 조회',
        'PUT /api/aichat-sessions/[id]': '채팅 세션 정보 수정',
        'DELETE /api/aichat-sessions/[id]': '채팅 세션 삭제',
        'GET /api/aichat-sessions/[id]/messages': '채팅 메시지 목록 조회',
        'POST /api/aichat-sessions/[id]/messages': '새로운 메시지 전송',
      },
    });
  } catch (error) {
    console.error('테스트 데이터 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '테스트 데이터를 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// POST: 테스트 데이터 초기화
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'reset') {
      // 테스트 데이터를 초기 상태로 리셋
      testData.sessions = [
        {
          id: "test1",
          title: "테스트 상담 1",
          userId: "testuser",
          expertId: null,
          expert: {
            name: "AI 상담사",
            title: "AI 상시 상담",
            avatar: null,
          },
          lastMessage: "테스트 메시지입니다.",
          timestamp: new Date(),
          duration: 10,
          status: "in_progress",
          messageCount: 5,
          creditsUsed: 10,
          category: "테스트",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      testData.messages = {
        "test1": [
          {
            id: "msg_test1_1",
            sessionId: "test1",
            type: "user",
            content: "안녕하세요! 테스트 상담을 시작하겠습니다.",
            timestamp: new Date(),
            senderId: "testuser",
            senderName: "테스트 사용자",
            senderAvatar: null,
          },
        ],
      };

      return NextResponse.json({
        success: true,
        message: '테스트 데이터가 초기화되었습니다.',
      });
    }

    return NextResponse.json(
      { success: false, error: '알 수 없는 액션입니다.' },
      { status: 400 }
    );
  } catch (error) {
    console.error('테스트 데이터 초기화 오류:', error);
    return NextResponse.json(
      { success: false, error: '테스트 데이터 초기화 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
