import { NextRequest, NextResponse } from 'next/server';

// 결제 수단 인터페이스
interface PaymentMethod {
  id: string;
  userId: string;
  type: 'card' | 'bank';
  name: string;
  last4?: string;
  bankName?: string;
  isDefault: boolean;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
}

// GET: 사용자의 결제 수단 목록 조회
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
    
    // 실제 프로덕션에서는 데이터베이스에서 결제 수단을 조회해야 함
    // 현재는 빈 배열 반환
    const userPaymentMethods: PaymentMethod[] = [];
    
    return NextResponse.json({
      success: true,
      data: userPaymentMethods
    });

  } catch (error) {
    console.error('결제 수단 조회 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// POST: 새로운 결제 수단 추가
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
    
    // 입력 데이터 검증
    const { type, name, last4, bankName, expiryDate } = body;
    
    if (!type || !name) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    if (type === 'card' && (!last4 || !expiryDate)) {
      return NextResponse.json(
        { error: '카드 정보가 불완전합니다.' },
        { status: 400 }
      );
    }

    if (type === 'bank' && !bankName) {
      return NextResponse.json(
        { error: '은행 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 실제 프로덕션에서는 데이터베이스에 결제 수단을 저장해야 함
    // 현재는 성공 응답만 반환
    const newPaymentMethod: PaymentMethod = {
      id: Date.now().toString(),
      userId,
      type,
      name,
      last4,
      bankName,
      isDefault: false,
      expiryDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: '결제 수단이 추가되었습니다.',
      data: newPaymentMethod
    }, { status: 201 });

  } catch (error) {
    console.error('결제 수단 추가 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// PUT: 결제 수단 정보 수정
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
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: '결제 수단 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 실제 프로덕션에서는 데이터베이스에서 결제 수단을 조회하고 수정해야 함
    // 현재는 성공 응답만 반환
    const updatedPaymentMethod: PaymentMethod = {
      id,
      userId,
      type: 'card',
      name: '수정된 결제 수단',
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...updates
    };

    return NextResponse.json({
      success: true,
      message: '결제 수단이 수정되었습니다.',
      data: updatedPaymentMethod
    });

  } catch (error) {
    console.error('결제 수단 수정 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE: 결제 수단 삭제
export async function DELETE(request: NextRequest) {
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
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: '결제 수단 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 실제 프로덕션에서는 데이터베이스에서 결제 수단을 삭제해야 함
    // 현재는 성공 응답만 반환
    return NextResponse.json({
      success: true,
      message: '결제 수단이 삭제되었습니다.'
    });

  } catch (error) {
    console.error('결제 수단 삭제 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
