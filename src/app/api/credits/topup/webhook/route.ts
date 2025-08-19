/**
 * 토스 결제 웹훅 처리 API
 * POST /api/credits/topup/webhook
 */

import { NextRequest, NextResponse } from 'next/server';
import { getRepositoryContainer, getSettlementConfig } from '../../../../../config/SettlementConfig';
import { PaymentService } from '../../../../../services/payment/PaymentService';
import { SettlementError } from '../../../../../types/settlement';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    // 웹훅 서명 검증
    const signature = request.headers.get('toss-signature');
    const body = await request.text();
    
    const config = getSettlementConfig();
    if (config.TOSS_WEBHOOK_SECRET && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', config.TOSS_WEBHOOK_SECRET)
        .update(body)
        .digest('base64');
      
      if (signature !== expectedSignature) {
        console.error('Invalid webhook signature');
        return NextResponse.json(
          { error: 'Invalid signature', code: 'INVALID_SIGNATURE' },
          { status: 401 }
        );
      }
    }

    // 웹훅 데이터 파싱
    const webhookData = JSON.parse(body);
    const { eventType, data } = webhookData;

    // 결제 승인 이벤트만 처리
    if (eventType !== 'PAYMENT_CONFIRMED') {
      console.log(`Ignoring webhook event: ${eventType}`);
      return NextResponse.json({ success: true, message: 'Event ignored' });
    }

    const { paymentKey, orderId, amount, status } = data;

    // 결제 성공 상태 확인
    if (status !== 'DONE') {
      console.log(`Payment not completed: ${status}`);
      return NextResponse.json({ success: true, message: 'Payment not completed' });
    }

    // 필수 데이터 검증
    if (!paymentKey || !orderId || typeof amount !== 'number') {
      return NextResponse.json(
        { error: 'Invalid webhook data', code: 'INVALID_WEBHOOK_DATA' },
        { status: 400 }
      );
    }

    // 서비스 초기화
    const repos = getRepositoryContainer();
    const paymentService = new PaymentService(repos);

    // 웹훅 처리 (결제 완료 및 크레딧 적립)
    await paymentService.handleTossWebhook(paymentKey, orderId, amount);

    console.log(`Payment webhook processed successfully: ${paymentKey}`);

    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully'
    });

  } catch (error) {
    console.error('Webhook processing error:', error);

    if (error instanceof SettlementError) {
      // 웹훅 에러는 토스에 재시도 신호를 보내기 위해 5xx 상태 코드 사용
      return NextResponse.json(
        { 
          error: error.message, 
          code: error.code,
          context: error.context 
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

// 다른 HTTP 메서드는 허용하지 않음
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' },
    { status: 405 }
  );
}
