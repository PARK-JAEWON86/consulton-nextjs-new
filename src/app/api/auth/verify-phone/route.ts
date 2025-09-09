import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/lib/db/models';
import { initializeDatabase } from '@/lib/db/init';

// 임시 저장소 (실제로는 Redis나 데이터베이스 사용)
const phoneVerificationCodes = new Map<string, { code: string; expires: number; phone: string }>();

// 전화번호 인증 코드 확인 API
export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    
    const { phone, verificationCode } = await request.json();

    if (!phone || !verificationCode) {
      return NextResponse.json(
        { success: false, message: "전화번호와 인증 코드가 필요합니다." },
        { status: 400 }
      );
    }

    // 저장된 인증 코드 확인
    const storedData = phoneVerificationCodes.get(phone);

    if (!storedData) {
      return NextResponse.json(
        { success: false, message: "인증 코드를 찾을 수 없습니다. 다시 요청해주세요." },
        { status: 400 }
      );
    }

    // 만료 시간 확인
    if (Date.now() > storedData.expires) {
      phoneVerificationCodes.delete(phone);
      return NextResponse.json(
        { success: false, message: "인증 코드가 만료되었습니다. 다시 요청해주세요." },
        { status: 400 }
      );
    }

    // 인증 코드 확인
    if (storedData.code !== verificationCode) {
      return NextResponse.json(
        { success: false, message: "인증 코드가 올바르지 않습니다." },
        { status: 400 }
      );
    }

    // 인증 성공 - 코드 삭제
    phoneVerificationCodes.delete(phone);

    console.log(`✅ 전화번호 인증 성공: ${phone}`);

    return NextResponse.json({
      success: true,
      message: "전화번호 인증이 완료되었습니다."
    });

  } catch (error) {
    console.error("전화번호 인증 확인 오류:", error);
    return NextResponse.json(
      { success: false, message: "인증 확인 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 인증 코드 저장 함수 (send-phone-verification에서 사용)
export function storePhoneVerificationCode(phone: string, code: string, expiresInMinutes: number = 3) {
  const expires = Date.now() + (expiresInMinutes * 60 * 1000);
  phoneVerificationCodes.set(phone, { code, expires, phone });
}

// 인증 코드 조회 함수
export function getPhoneVerificationCode(phone: string) {
  return phoneVerificationCodes.get(phone);
}
