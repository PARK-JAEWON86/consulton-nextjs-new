import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/lib/db/models';
import { initializeDatabase } from '@/lib/db/init';

// 임시 저장소 (실제로는 Redis나 데이터베이스 사용)
const phoneVerificationCodes = new Map<string, { code: string; expires: number; phone: string }>();

// 전화번호 인증 코드 발송 API
export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { success: false, message: "전화번호가 필요합니다." },
        { status: 400 }
      );
    }

    // 전화번호 형식 검증 (간단한 검증)
    const phoneRegex = /^01[0-9]-\d{3,4}-\d{4}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { success: false, message: "올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)" },
        { status: 400 }
      );
    }

    // 6자리 인증 코드 생성
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 인증 코드 저장 (3분 유효)
    const expires = Date.now() + (3 * 60 * 1000); // 3분
    phoneVerificationCodes.set(phone, { code: verificationCode, expires, phone });

    // 실제 프로덕션에서는 SMS 발송 서비스 사용
    // 예: AWS SNS, Twilio, 네이버 클라우드 플랫폼 등
    console.log(`📱 SMS 인증 코드 발송: ${phone} -> ${verificationCode}`);
    
    // 개발 환경에서는 콘솔에 코드 출력
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔐 개발용 인증 코드: ${verificationCode}`);
    }

    // 실제 SMS 발송 로직 (예시)
    // await sendSMS(phone, verificationCode);

    return NextResponse.json({
      success: true,
      message: "인증 코드가 전화번호로 발송되었습니다.",
      // 개발 환경에서만 코드 반환
      ...(process.env.NODE_ENV === 'development' && { 
        verificationCode,
        note: "개발 환경에서만 코드가 표시됩니다."
      })
    });

  } catch (error) {
    console.error("전화번호 인증 코드 발송 오류:", error);
    return NextResponse.json(
      { success: false, message: "인증 코드 발송 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 실제 SMS 발송 함수 (구현 예시)
async function sendSMS(phone: string, code: string) {
  // 실제 SMS 발송 서비스 연동
  // 예: AWS SNS, Twilio, 네이버 클라우드 플랫폼 등
  
  const smsContent = {
    to: phone,
    message: `[ConsultOn] 인증번호: ${code}\n3분 내에 입력해주세요.`
  };

  // 실제 SMS 발송 로직 구현
  console.log('SMS 발송:', smsContent);
}

// 인증 코드 저장 함수
export function storePhoneVerificationCode(phone: string, code: string, expiresInMinutes: number = 3) {
  const expires = Date.now() + (expiresInMinutes * 60 * 1000);
  phoneVerificationCodes.set(phone, { code, expires, phone });
}

// 인증 코드 조회 함수
export function getPhoneVerificationCode(phone: string) {
  return phoneVerificationCodes.get(phone);
}
