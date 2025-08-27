import { NextRequest, NextResponse } from 'next/server';

// 더미 메시지 데이터 (실제로는 데이터베이스에서 가져와야 함)
const mockMessages = {
  "1": [
    {
      id: "msg1_1",
      sessionId: "1",
      type: "user",
      content: "안녕하세요! 마케팅 전략에 대해 상담받고 싶습니다.",
      timestamp: new Date("2024-01-15T14:00:00"),
      senderId: "user1",
      senderName: "사용자",
      senderAvatar: null,
    },
    {
      id: "msg1_2",
      sessionId: "1",
      type: "ai",
      content: "안녕하세요! 마케팅 전략 상담을 도와드리겠습니다. 어떤 분야의 마케팅에 대해 궁금하신가요?",
      timestamp: new Date("2024-01-15T14:00:30"),
      senderId: "ai",
      senderName: "AI 상담사",
      senderAvatar: null,
    },
    {
      id: "msg1_3",
      sessionId: "1",
      type: "user",
      content: "인스타그램 마케팅을 시작하고 싶은데 어떻게 해야 할까요?",
      timestamp: new Date("2024-01-15T14:01:00"),
      senderId: "user1",
      senderName: "사용자",
      senderAvatar: null,
    },
    {
      id: "msg1_4",
      sessionId: "1",
      type: "ai",
      content: "인스타그램 마케팅을 시작하기 위해서는 먼저 브랜드 아이덴티티를 확립하고, 타겟 오디언스를 분석해야 합니다. 구체적인 계획을 세워보겠습니다.",
      timestamp: new Date("2024-01-15T14:01:30"),
      senderId: "ai",
      senderName: "AI 상담사",
      senderAvatar: null,
    },
    {
      id: "msg1_5",
      sessionId: "1",
      type: "user",
      content: "네, 인스타그램 마케팅에 대해 더 자세히 알려주세요.",
      timestamp: new Date("2024-01-15T14:02:00"),
      senderId: "user1",
      senderName: "사용자",
      senderAvatar: null,
    },
    {
      id: "msg1_6",
      sessionId: "1",
      type: "ai",
      content: "네, 인스타그램 마케팅에 대해 더 자세히 알려드릴게요.",
      timestamp: new Date("2024-01-15T14:30:00"),
      senderId: "ai",
      senderName: "AI 상담사",
      senderAvatar: null,
    },
  ],
  "2": [
    {
      id: "msg2_1",
      sessionId: "2",
      type: "user",
      content: "비즈니스 모델을 검토해주실 수 있나요?",
      timestamp: new Date("2024-01-12T10:00:00"),
      senderId: "user1",
      senderName: "사용자",
      senderAvatar: null,
    },
    {
      id: "msg2_2",
      sessionId: "2",
      type: "ai",
      content: "네, 비즈니스 모델 검토를 도와드리겠습니다. 현재 어떤 비즈니스를 운영하고 계신가요?",
      timestamp: new Date("2024-01-12T10:00:30"),
      senderId: "ai",
      senderName: "AI 상담사",
      senderAvatar: null,
    },
    {
      id: "msg2_3",
      sessionId: "2",
      type: "user",
      content: "온라인 교육 플랫폼을 만들고 있습니다.",
      timestamp: new Date("2024-01-12T10:01:00"),
      senderId: "user1",
      senderName: "사용자",
      senderAvatar: null,
    },
    {
      id: "msg2_4",
      sessionId: "2",
      type: "ai",
      content: "온라인 교육 플랫폼은 좋은 아이디어입니다. 수익 모델과 타겟 고객층을 분석해보겠습니다.",
      timestamp: new Date("2024-01-12T10:01:30"),
      senderId: "ai",
      senderName: "AI 상담사",
      senderAvatar: null,
    },
    {
      id: "msg2_5",
      sessionId: "2",
      type: "ai",
      content: "다음 단계로 투자 유치 계획을 세워보시는 것을 추천드립니다.",
      timestamp: new Date("2024-01-12T10:15:00"),
      senderId: "ai",
      senderName: "AI 상담사",
      senderAvatar: null,
    },
  ],
  "3": [
    {
      id: "msg3_1",
      sessionId: "3",
      type: "user",
      content: "기술 아키텍처에 대해 상담받고 싶습니다.",
      timestamp: new Date("2024-01-10T16:30:00"),
      senderId: "user1",
      senderName: "사용자",
      senderAvatar: null,
    },
    {
      id: "msg3_2",
      sessionId: "3",
      type: "ai",
      content: "기술 아키텍처 상담을 도와드리겠습니다. 어떤 시스템을 구축하려고 하시나요?",
      timestamp: new Date("2024-01-10T16:30:30"),
      senderId: "ai",
      senderName: "AI 상담사",
      senderAvatar: null,
    },
    {
      id: "msg3_3",
      sessionId: "3",
      type: "user",
      content: "웹 애플리케이션을 만들고 있습니다.",
      timestamp: new Date("2024-01-10T16:31:00"),
      senderId: "user1",
      senderName: "사용자",
      senderAvatar: null,
    },
    {
      id: "msg3_4",
      sessionId: "3",
      type: "ai",
      content: "웹 애플리케이션의 경우 확장성과 유지보수성을 고려한 아키텍처가 중요합니다.",
      timestamp: new Date("2024-01-10T16:31:30"),
      senderId: "ai",
      senderName: "AI 상담사",
      senderAvatar: null,
    },
    {
      id: "msg3_5",
      sessionId: "3",
      type: "ai",
      content: "마이크로서비스 아키텍처 적용을 고려해보세요.",
      timestamp: new Date("2024-01-10T16:45:00"),
      senderId: "ai",
      senderName: "AI 상담사",
      senderAvatar: null,
    },
  ],
};

// GET: 특정 세션의 메시지 목록 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const before = searchParams.get('before'); // 페이지네이션용

    const messages = mockMessages[id as keyof typeof mockMessages] || [];

    let filteredMessages = [...messages];

    // 페이지네이션 처리
    if (before) {
      const beforeDate = new Date(before);
      filteredMessages = filteredMessages.filter(msg => msg.timestamp < beforeDate);
    }

    // 최신순으로 정렬
    filteredMessages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // 제한 적용
    if (limit) {
      filteredMessages = filteredMessages.slice(0, parseInt(limit));
    }

    return NextResponse.json({
      success: true,
      data: filteredMessages,
      total: messages.length,
      hasMore: before ? filteredMessages.length === parseInt(limit || '20') : false,
    });
  } catch (error) {
    console.error('메시지 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '메시지를 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// POST: 새로운 메시지 추가
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { content, type, senderId, senderName, senderAvatar } = body;

    if (!content || !type || !senderId) {
      return NextResponse.json(
        { success: false, error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 세션 존재 여부 확인
    if (!mockMessages[id as keyof typeof mockMessages]) {
      mockMessages[id as keyof typeof mockMessages] = [];
    }

    // 새로운 메시지 생성
    const newMessage = {
      id: `msg${id}_${Date.now()}`,
      sessionId: id,
      type,
      content,
      timestamp: new Date(),
      senderId,
      senderName: senderName || "사용자",
      senderAvatar: senderAvatar || null,
    };

    // 메시지 추가
    mockMessages[id as keyof typeof mockMessages].push(newMessage);

    return NextResponse.json({
      success: true,
      data: newMessage,
      message: '메시지가 전송되었습니다.',
    }, { status: 201 });
  } catch (error) {
    console.error('메시지 전송 오류:', error);
    return NextResponse.json(
      { success: false, error: '메시지를 전송하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
