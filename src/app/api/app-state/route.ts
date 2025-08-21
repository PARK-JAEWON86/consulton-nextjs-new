import { NextRequest, NextResponse } from 'next/server';

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
}

// 메모리 기반 상태 저장 (실제 프로덕션에서는 Redis나 데이터베이스 사용 권장)
let appState: AppState = {
  hasEnteredService: false,
  isAuthenticated: false,
  sidebarOpen: false,
  currentPage: "/",
  viewMode: "user",
  user: null,
};

// GET: 현재 앱 상태 조회
export async function GET() {
  try {
    return NextResponse.json({ 
      success: true, 
      data: appState 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '상태 조회 실패' },
      { status: 500 }
    );
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
        appState.isAuthenticated = data.status;
        break;
      
      case 'setSidebarOpen':
        appState.sidebarOpen = data.open;
        break;
      
      case 'setCurrentPage':
        appState.currentPage = data.page;
        break;
      
      case 'setViewMode':
        appState.viewMode = data.mode;
        break;
      
      case 'setUser':
        appState.user = data.user;
        break;
      
      case 'updateCredits':
        if (appState.user) {
          appState.user.credits = data.credits;
        }
        break;
      
      case 'logout':
        appState = {
          hasEnteredService: false,
          isAuthenticated: false,
          sidebarOpen: false,
          currentPage: "/",
          viewMode: "user",
          user: null,
        };
        break;
      
      default:
        return NextResponse.json(
          { success: false, error: '알 수 없는 액션' },
          { status: 400 }
        );
    }

    return NextResponse.json({ 
      success: true, 
      data: appState,
      message: `${action} 완료`
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '상태 업데이트 실패' },
      { status: 500 }
    );
  }
}

// PATCH: 부분 상태 업데이트
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 부분 업데이트
    appState = { ...appState, ...body };
    
    return NextResponse.json({ 
      success: true, 
      data: appState,
      message: '상태 업데이트 완료'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '상태 업데이트 실패' },
      { status: 500 }
    );
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
    };
    
    return NextResponse.json({ 
      success: true, 
      message: '상태가 초기화되었습니다.' 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '상태 초기화 실패' },
      { status: 500 }
    );
  }
}
