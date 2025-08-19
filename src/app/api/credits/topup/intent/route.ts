/**
 * 크레딧 충전 인텐트 생성 API
 * POST /api/credits/topup/intent
 */

import { NextRequest, NextResponse } from 'next/server';
import { getRepositoryContainer } from '../../../../../config/SettlementConfig';
import { PaymentService } from '../../../../../services/payment/PaymentService';
import { SettlementError } from '../../../../../types/settlement';

export async function POST(request: NextRequest) {
  try {
    // 요청 본문 파싱
    const body = await request.json();
    const { amountKrw, userId, idempotencyKey } = body;

    // 필수 파라미터 검증
    if (!amountKrw || !userId) {
      return NextResponse.json(
        { 
          error: 'Missing required parameters',
          code: 'MISSING_PARAMETER',
          required: ['amountKrw', 'userId']
        },
        { status: 400 }
      );
    }

    // 데이터 타입 검증
    if (typeof amountKrw !== 'number' || amountKrw <= 0) {
      return NextResponse.json(
        { error: 'Invalid amountKrw: must be a positive number', code: 'INVALID_PARAMETER' },
        { status: 400 }
      );
    }

    if (typeof userId !== 'string' || userId.trim().length === 0) {
      return NextResponse.json(
        { error: 'Invalid userId: must be a non-empty string', code: 'INVALID_PARAMETER' },
        { status: 400 }
      );
    }

    // 최소 충전 금액 검증 (10원)
    if (amountKrw < 10) {
      return NextResponse.json(
        { error: 'Minimum topup amount is 10 KRW', code: 'INVALID_AMOUNT' },
        { status: 400 }
      );
    }

    // 최대 충전 금액 검증 (1회 100만원)
    if (amountKrw > 1000000) {
      return NextResponse.json(
        { error: 'Maximum topup amount is 1,000,000 KRW', code: 'INVALID_AMOUNT' },
        { status: 400 }
      );
    }

    // 서비스 초기화
    const repos = getRepositoryContainer();
    const paymentService = new PaymentService(repos);

    // 충전 인텐트 생성
    const result = await paymentService.createTopupIntent({
      amountKrw,
      userId,
      idempotencyKey
    });

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Topup intent creation error:', error);

    if (error instanceof SettlementError) {
      return NextResponse.json(
        { 
          error: error.message, 
          code: error.code,
          context: error.context 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
