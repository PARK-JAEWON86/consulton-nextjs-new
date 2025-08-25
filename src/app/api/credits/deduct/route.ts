import { NextRequest, NextResponse } from 'next/server';

// 크레딧 차감 API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, amount, reason } = body;

    // 필수 파라미터 검증
    if (!userId || !amount || amount <= 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: '유효하지 않은 파라미터',
          required: ['userId', 'amount']
        },
        { status: 400 }
      );
    }

    // TODO: 실제 데이터베이스에서 사용자 크레딧 조회 및 차감
    // 현재는 더미 데이터로 응답하지만, 실제로는 사용자별 크레딧 잔액을 조회해야 함
    
    // 사용자 크레딧 잔액 확인 (실제로는 데이터베이스에서 조회)
    // 임시로 요청에서 받은 사용자 ID를 기반으로 더미 데이터 생성
    let currentCredits;
    if (userId === 'user1') {
      currentCredits = 500;
    } else if (userId === 'user2') {
      currentCredits = 200;
    } else {
      currentCredits = 1000; // 기본값
    }
    
    if (currentCredits < amount) {
      return NextResponse.json(
        { 
          success: false, 
          error: '크레딧이 부족합니다',
          currentCredits,
          requiredAmount: amount
        },
        { status: 400 }
      );
    }

    // 크레딧 차감 처리
    const newBalance = currentCredits - amount;
    
    // TODO: 데이터베이스에 크레딧 차감 기록 저장
    // - 사용자 크레딧 잔액 업데이트
    // - 크레딧 사용 내역 기록
    // - AI 토큰 구매 내역 기록

    return NextResponse.json({
      success: true,
      data: {
        userId,
        deductedAmount: amount,
        previousBalance: currentCredits,
        newBalance,
        reason,
        timestamp: new Date().toISOString(),
        message: `${amount}크레딧이 차감되었습니다.`
      }
    });

  } catch (error) {
    console.error('크레딧 차감 오류:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: '크레딧 차감 중 오류가 발생했습니다.' 
      },
      { status: 500 }
    );
  }
}
