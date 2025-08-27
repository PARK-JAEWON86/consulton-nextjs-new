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

// GET: 채팅 세션 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');
    const search = searchParams.get('search');

    let filteredSessions = [...mockChatSessions];

    // 사용자 ID로 필터링
    if (userId) {
      filteredSessions = filteredSessions.filter(session => session.userId === userId);
    }

    // 카테고리로 필터링
    if (category) {
      filteredSessions = filteredSessions.filter(session => session.category === category);
    }

    // 상태로 필터링
    if (status) {
      filteredSessions = filteredSessions.filter(session => session.status === status);
    }

    // 검색어로 필터링
    if (search) {
      const searchLower = search.toLowerCase();
      filteredSessions = filteredSessions.filter(session =>
        session.title.toLowerCase().includes(searchLower) ||
        session.expert.name.toLowerCase().includes(searchLower) ||
        session.lastMessage.toLowerCase().includes(searchLower)
      );
    }

    // 최신순으로 정렬
    filteredSessions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // 제한 적용
    if (limit) {
      filteredSessions = filteredSessions.slice(0, parseInt(limit));
    }

    return NextResponse.json({
      success: true,
      data: filteredSessions,
      total: filteredSessions.length,
    });
  } catch (error) {
    console.error('채팅 세션 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '채팅 세션을 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// POST: 새로운 채팅 세션 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, userId, expertId, category } = body;

    if (!title || !userId || !category) {
      return NextResponse.json(
        { success: false, error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 새로운 채팅 세션 생성
    const newSession = {
      id: Date.now().toString(),
      title,
      userId,
      expertId: expertId || null,
      expert: expertId ? {
        name: "AI 상담 어시스턴트",
        title: "AI 상담사",
        avatar: null,
      } : null,
      lastMessage: "",
      timestamp: new Date(),
      duration: 0,
      status: "in_progress",
      messageCount: 0,
      creditsUsed: 0,
      category,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 실제로는 데이터베이스에 저장해야 함
    mockChatSessions.unshift(newSession);

    return NextResponse.json({
      success: true,
      data: newSession,
      message: '새로운 채팅 세션이 생성되었습니다.',
    }, { status: 201 });
  } catch (error) {
    console.error('채팅 세션 생성 오류:', error);
    return NextResponse.json(
      { success: false, error: '채팅 세션을 생성하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
