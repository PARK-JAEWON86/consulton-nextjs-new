import { NextRequest, NextResponse } from 'next/server';

// 결제 내역 인터페이스
interface PaymentHistory {
  id: string;
  userId: string;
  date: string;
  amount: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  type: 'topup' | 'consultation' | 'refund' | 'withdrawal';
  paymentMethodId?: string;
  consultationId?: string;
  credits?: number;
  createdAt: string;
}

// GET: 사용자의 결제 내역 조회
export async function GET(request: NextRequest) {
  try {
    // 인증 확인 (쿠키 기반)
    const authToken = request.cookies.get('auth-token')?.value;
    const userData = request.cookies.get('user-data')?.value;
    
    if (!authToken || !userData) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    let userId: string;
    try {
      const user = JSON.parse(userData);
      userId = user.id || user.email;
    } catch {
      return NextResponse.json(
        { error: '사용자 정보를 확인할 수 없습니다.' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    
    // 쿼리 파라미터 처리
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // 페이지네이션 제한
    const maxLimit = Math.min(limit, 100); // 최대 100건까지 조회 가능
    const offset = (page - 1) * maxLimit;
    
    // 실제 프로덕션에서는 데이터베이스에서 결제 내역을 조회해야 함
    // 현재는 빈 배열 반환
    const userPaymentHistory: PaymentHistory[] = [];
    
    // 필터링 적용
    let filteredHistory = userPaymentHistory;
    
    if (type) {
      filteredHistory = filteredHistory.filter(history => history.type === type);
    }
    
    if (status) {
      filteredHistory = filteredHistory.filter(history => history.status === status);
    }
    
    if (startDate) {
      filteredHistory = filteredHistory.filter(history => 
        new Date(history.date) >= new Date(startDate)
      );
    }
    
    if (endDate) {
      filteredHistory = filteredHistory.filter(history => 
        new Date(history.date) <= new Date(endDate)
      );
    }
    
    // 총 개수
    const totalCount = filteredHistory.length;
    
    // 페이지네이션 적용
    const paginatedHistory = filteredHistory.slice(offset, offset + maxLimit);
    
    // 통계 정보 계산
    const totalAmount = filteredHistory.reduce((sum, history) => sum + history.amount, 0);
    const completedAmount = filteredHistory
      .filter(history => history.status === 'completed')
      .reduce((sum, history) => sum + history.amount, 0);
    
    return NextResponse.json({
      success: true,
      data: {
        history: paginatedHistory,
        pagination: {
          page,
          limit: maxLimit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / maxLimit)
        },
        summary: {
          totalAmount,
          completedAmount,
          totalCount
        }
      }
    });

  } catch (error) {
    console.error('결제 내역 조회 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// POST: 새로운 결제 내역 추가
export async function POST(request: NextRequest) {
  try {
    // 인증 확인 (쿠키 기반)
    const authToken = request.cookies.get('auth-token')?.value;
    const userData = request.cookies.get('user-data')?.value;
    
    if (!authToken || !userData) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    let userId: string;
    try {
      const user = JSON.parse(userData);
      userId = user.id || user.email;
    } catch {
      return NextResponse.json(
        { error: '사용자 정보를 확인할 수 없습니다.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { amount, description, type, paymentMethodId, consultationId, credits } = body;

    if (!amount || !description || !type) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 실제 프로덕션에서는 데이터베이스에 결제 내역을 저장해야 함
    // 현재는 성공 응답만 반환
    const newPaymentHistory: PaymentHistory = {
      id: Date.now().toString(),
      userId,
      date: new Date().toISOString(),
      amount,
      description,
      status: 'completed',
      type,
      paymentMethodId,
      consultationId,
      credits,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: '결제 내역이 추가되었습니다.',
      data: newPaymentHistory
    }, { status: 201 });

  } catch (error) {
    console.error('결제 내역 추가 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// PUT: 결제 내역 상태 업데이트 (결제 완료, 실패 등)
export async function PUT(request: NextRequest) {
  try {
    // 인증 확인 (쿠키 기반)
    const authToken = request.cookies.get('auth-token')?.value;
    const userData = request.cookies.get('user-data')?.value;
    
    if (!authToken || !userData) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    let userId: string;
    try {
      const user = JSON.parse(userData);
      userId = user.id || user.email;
    } catch {
      return NextResponse.json(
        { error: '사용자 정보를 확인할 수 없습니다.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    const { id, status, description } = body;
    
    if (!id || !status) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 상태값 유효성 검사
    const validStatuses = ['completed', 'pending', 'failed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: '유효하지 않은 상태값입니다.' },
        { status: 400 }
      );
    }

    // 실제 프로덕션에서는 데이터베이스에서 결제 내역을 조회하고 업데이트해야 함
    // 현재는 성공 응답만 반환
    const updatedHistory: PaymentHistory = {
      id,
      userId,
      date: new Date().toISOString(),
      amount: 0,
      description: description || '업데이트된 결제 내역',
      status,
      type: 'topup',
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: updatedHistory,
      message: '결제 내역이 업데이트되었습니다.'
    });

  } catch (error) {
    console.error('결제 내역 업데이트 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
