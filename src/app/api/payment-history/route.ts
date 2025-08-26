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

// 더미 데이터 (실제로는 데이터베이스에서 가져와야 함)
import { getUserPaymentHistory } from '@/data/dummy/payment';

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
    
    // 사용자의 결제 내역 조회
    let userPaymentHistory = getUserPaymentHistory(userId);
    
    // 필터링 적용
    if (type) {
      userPaymentHistory = userPaymentHistory.filter(history => history.type === type);
    }
    
    if (status) {
      userPaymentHistory = userPaymentHistory.filter(history => history.status === status);
    }
    
    if (startDate) {
      userPaymentHistory = userPaymentHistory.filter(history => 
        new Date(history.date) >= new Date(startDate)
      );
    }
    
    if (endDate) {
      userPaymentHistory = userPaymentHistory.filter(history => 
        new Date(history.date) <= new Date(endDate)
      );
    }
    
    // 총 개수
    const totalCount = userPaymentHistory.length;
    
    // 페이지네이션 적용
    const paginatedHistory = userPaymentHistory.slice(offset, offset + maxLimit);
    
    // 통계 정보 계산
    const totalAmount = userPaymentHistory.reduce((sum, history) => sum + history.amount, 0);
    const completedAmount = userPaymentHistory
      .filter(history => history.status === 'completed')
      .reduce((sum, history) => sum + history.amount, 0);
    
    return NextResponse.json({
      success: true,
      data: {
        history: paginatedHistory,
        pagination: {
          page,
          limit: maxLimit,
          totalCount,
          totalPages: Math.ceil(totalCount / maxLimit)
        },
        summary: {
          totalAmount,
          completedAmount,
          totalTransactions: totalCount
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

// POST: 새로운 결제 내역 생성 (크레딧 충전, 상담 결제 등)
export async function POST(request: NextRequest) {
  try {
    // 인증 확인
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();
    
    // 입력 데이터 검증
    const { amount, description, type, paymentMethodId, consultationId, credits } = body;
    
    if (!amount || !description || !type) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 금액 유효성 검사
    if (typeof amount !== 'number' || amount === 0) {
      return NextResponse.json(
        { error: '유효하지 않은 금액입니다.' },
        { status: 400 }
      );
    }

    // 타입별 추가 검증
    if (type === 'topup' && amount <= 0) {
      return NextResponse.json(
        { error: '충전 금액은 0보다 커야 합니다.' },
        { status: 400 }
      );
    }

    if (type === 'consultation' && amount >= 0) {
      return NextResponse.json(
        { error: '상담 결제는 음수 금액이어야 합니다.' },
        { status: 400 }
      );
    }

    // 새로운 결제 내역 생성
    const newPaymentHistory: PaymentHistory = {
      id: `ph_${Date.now()}`,
      userId,
      date: new Date().toISOString().split('T')[0],
      amount,
      description,
      status: 'pending', // 초기 상태는 대기중
      type,
      paymentMethodId,
      consultationId,
      credits,
      createdAt: new Date().toISOString()
    };

    // 실제로는 데이터베이스에 저장하고 결제 처리 로직 실행해야 함
    // await processPayment(newPaymentHistory);

    return NextResponse.json({
      success: true,
      data: newPaymentHistory,
      message: '결제 내역이 생성되었습니다.'
    }, { status: 201 });

  } catch (error) {
    console.error('결제 내역 생성 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// PUT: 결제 내역 상태 업데이트 (결제 완료, 실패 등)
export async function PUT(request: NextRequest) {
  try {
    // 인증 확인
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
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

    // 사용자의 결제 내역인지 확인
    const userPaymentHistory = getUserPaymentHistory(userId);
    const existingHistory = userPaymentHistory.find(history => history.id === id);
    
    if (!existingHistory) {
      return NextResponse.json(
        { error: '해당 결제 내역을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 결제 내역 업데이트
    const updatedHistory: PaymentHistory = {
      ...existingHistory,
      status,
      description: description || existingHistory.description
    };

    // 실제로는 데이터베이스에서 업데이트해야 함
    // await updatePaymentHistory(updatedHistory);

    return NextResponse.json({
      success: true,
      data: updatedHistory,
      message: '결제 내역이 성공적으로 업데이트되었습니다.'
    });

  } catch (error) {
    console.error('결제 내역 업데이트 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
