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

// 더미 데이터 (실제로는 데이터베이스에서 가져와야 함)
import { dummyPaymentMethods, getUserPaymentMethods } from '@/data/dummy/payment';

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
    
    // 사용자의 결제 수단만 조회
    const userPaymentMethods = getUserPaymentMethods(userId);
    
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

    // 새로운 결제 수단 생성
    const newPaymentMethod: PaymentMethod = {
      id: `pm_${Date.now()}`,
      userId,
      type,
      name,
      last4,
      bankName,
      isDefault: false, // 새로 추가되는 결제 수단은 기본값이 아님
      expiryDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // 실제로는 데이터베이스에 저장해야 함
    // dummyPaymentMethods.push(newPaymentMethod);

    return NextResponse.json({
      success: true,
      data: newPaymentMethod,
      message: '결제 수단이 성공적으로 추가되었습니다.'
    }, { status: 201 });

  } catch (error) {
    console.error('결제 수단 추가 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// PUT: 결제 수단 수정
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
    
    const { id, name, isDefault } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: '결제 수단 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 사용자의 결제 수단인지 확인
    const userPaymentMethods = getUserPaymentMethods(userId);
    const existingMethod = userPaymentMethods.find(method => method.id === id);
    
    if (!existingMethod) {
      return NextResponse.json(
        { error: '해당 결제 수단을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 기본 결제 수단 설정 시 다른 결제 수단들의 기본값 해제
    if (isDefault) {
      // 실제로는 데이터베이스에서 업데이트해야 함
      // userPaymentMethods.forEach(method => {
      //   if (method.id !== id) method.isDefault = false;
      // });
    }

    // 결제 수단 정보 업데이트
    const updatedMethod: PaymentMethod = {
      ...existingMethod,
      name: name || existingMethod.name,
      isDefault: isDefault !== undefined ? isDefault : existingMethod.isDefault,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: updatedMethod,
      message: '결제 수단이 성공적으로 수정되었습니다.'
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
    // 인증 확인
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: '결제 수단 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 사용자의 결제 수단인지 확인
    const userPaymentMethods = getUserPaymentMethods(userId);
    const existingMethod = userPaymentMethods.find(method => method.id === id);
    
    if (!existingMethod) {
      return NextResponse.json(
        { error: '해당 결제 수단을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 기본 결제 수단은 삭제 불가
    if (existingMethod.isDefault) {
      return NextResponse.json(
        { error: '기본 결제 수단은 삭제할 수 없습니다.' },
        { status: 400 }
      );
    }

    // 실제로는 데이터베이스에서 삭제해야 함
    // const index = dummyPaymentMethods.findIndex(method => method.id === id);
    // if (index > -1) dummyPaymentMethods.splice(index, 1);

    return NextResponse.json({
      success: true,
      message: '결제 수단이 성공적으로 삭제되었습니다.'
    });

  } catch (error) {
    console.error('결제 수단 삭제 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
