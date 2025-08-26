import { NextRequest, NextResponse } from 'next/server';
import { userDataService } from '@/services/UserDataService';

interface ChatHistoryItem {
  id: string;
  title: string;
  timestamp: Date;
  category: string;
  summary?: string;
}

interface AppState {
  hasEnteredService: boolean;
  isAuthenticated: boolean;
  sidebarOpen: boolean;
  currentPage: string;
  viewMode: "user" | "expert";
  user: {
    id: string | null;
    email: string | null;
    name: string | null;
    credits: number;
    expertLevel: string | null;
    role?: 'expert' | 'client' | 'admin';
    expertProfile?: any;
  } | null;
  chatHistory: ChatHistoryItem[];
}

// 메모리 기반 상태 저장 (실제 프로덕션에서는 Redis나 데이터베이스 사용 권장)
let appState: AppState = {
  hasEnteredService: false,
  isAuthenticated: false,
  sidebarOpen: false,
  currentPage: "/",
  viewMode: "user",
  user: null,
  chatHistory: [], // 빈 배열로 초기화 (더미데이터에서 가져올 예정)
};

// GET: 현재 앱 상태 조회
export async function GET() {
  try {
    // 더미 사용자 데이터 가져오기
    const dummyUsers = userDataService.getAllUsers();
    const kimCheolsu = dummyUsers.find(user => user.name === "김철수");
    
    // 기본 상태에 더미 사용자 정보 추가
    const responseData = {
      ...appState,
      isAuthenticated: true, // 김철수를 로그인된 상태로 설정
      user: kimCheolsu ? {
        id: kimCheolsu.id,
        email: kimCheolsu.email,
        name: kimCheolsu.name,
        credits: kimCheolsu.credits, // 더미데이터에서 크레딧 가져오기
        expertLevel: null, // 하드코딩 제거
        role: 'client' as const
      } : null
    };

    const response = NextResponse.json({ 
      success: true, 
      data: responseData 
    });
    
    // CORS 헤더 추가
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    
    // 캐싱 헤더 추가 (5초간 캐시)
    response.headers.set('Cache-Control', 'public, s-maxage=5, stale-while-revalidate=10');
    
    return response;
  } catch (error) {
    console.error('app-state API 오류:', error);
    const errorResponse = NextResponse.json(
      { success: false, error: '상태 조회 실패' },
      { status: 500 }
    );
    
    errorResponse.headers.set('Access-Control-Allow-Origin', '*');
    return errorResponse;
  }
}

// POST: 앱 상태 업데이트
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'enterService':
        appState.hasEnteredService = true;
        break;
      
      case 'exitService':
        appState.hasEnteredService = false;
        break;
      
      case 'setAuthenticated':
        appState.isAuthenticated = data.isAuthenticated;
        break;
      
      case 'setSidebarOpen':
        appState.sidebarOpen = data.open;
        break;
      
      case 'setCurrentPage':
        appState.currentPage = data.page;
        break;
      
      case 'setViewMode':
        appState.viewMode = data.viewMode;
        break;
      
      case 'setUser':
        appState.user = data.user;
        break;
      
      case 'updateCredits':
        if (appState.user) {
          appState.user.credits = data.credits;
        }
        break;
      
      case 'addChatHistory':
        // 새로운 채팅 히스토리 추가
        const newChatItem: ChatHistoryItem = {
          id: data.id || Date.now().toString(),
          title: data.title,
          timestamp: new Date(data.timestamp || Date.now()),
          category: data.category || "일반",
          summary: data.summary
        };
        appState.chatHistory.unshift(newChatItem); // 최신 항목을 맨 위에 추가
        
        // 최대 50개까지만 유지
        if (appState.chatHistory.length > 50) {
          appState.chatHistory = appState.chatHistory.slice(0, 50);
        }
        break;
      
      case 'updateChatHistory':
        // 채팅 히스토리 항목 업데이트
        const updateIndex = appState.chatHistory.findIndex(item => item.id === data.id);
        if (updateIndex !== -1) {
          appState.chatHistory[updateIndex] = {
            ...appState.chatHistory[updateIndex],
            ...data,
            timestamp: data.timestamp ? new Date(data.timestamp) : appState.chatHistory[updateIndex].timestamp
          };
        }
        break;
      
      case 'deleteChatHistory':
        // 채팅 히스토리 항목 삭제
        appState.chatHistory = appState.chatHistory.filter(item => item.id !== data.id);
        break;
      
      case 'clearChatHistory':
        // 채팅 히스토리 전체 삭제
        appState.chatHistory = [];
        break;
      
      case 'logout':
        appState = {
          hasEnteredService: false,
          isAuthenticated: false,
          sidebarOpen: false,
          currentPage: "/",
          viewMode: "user",
          user: null,
          chatHistory: [],
        };
        break;
      
      default:
        return NextResponse.json(
          { success: false, error: '알 수 없는 액션' },
          { status: 400 }
        );
    }

    const response = NextResponse.json({ 
      success: true, 
      data: appState,
      message: `${action} 완료`
    });
    
    // CORS 헤더 추가
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    
    return response;
  } catch (error) {
    const errorResponse = NextResponse.json(
      { success: false, error: '상태 업데이트 실패' },
      { status: 500 }
    );
    
    errorResponse.headers.set('Access-Control-Allow-Origin', '*');
    return errorResponse;
  }
}

// PATCH: 부분 상태 업데이트
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 부분 업데이트
    appState = { ...appState, ...body };
    
    const response = NextResponse.json({ 
      success: true, 
      data: appState,
      message: '상태 업데이트 완료'
    });
    
    // CORS 헤더 추가
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    
    return response;
  } catch (error) {
    const errorResponse = NextResponse.json(
      { success: false, error: '상태 업데이트 실패' },
      { status: 500 }
    );
    
    errorResponse.headers.set('Access-Control-Allow-Origin', '*');
    return errorResponse;
  }
}

// DELETE: 상태 초기화
export async function DELETE() {
  try {
    appState = {
      hasEnteredService: false,
      isAuthenticated: false,
      sidebarOpen: false,
      currentPage: "/",
      viewMode: "user",
      user: null,
      chatHistory: [],
    };
    
    const response = NextResponse.json({ 
      success: true, 
      message: '상태가 초기화되었습니다.' 
    });
    
    // CORS 헤더 추가
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    
    return response;
  } catch (error) {
    const errorResponse = NextResponse.json(
      { success: false, error: '상태 초기화 실패' },
      { status: 500 }
    );
    
    errorResponse.headers.set('Access-Control-Allow-Origin', '*');
    return errorResponse;
  }
}

// OPTIONS: CORS preflight 요청 처리
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  
  return response;
}
