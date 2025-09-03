import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/lib/db/models';
import { initializeDatabase } from '@/lib/db/init';

// 임시 저장소 (실제로는 Redis나 데이터베이스 사용)
const verificationCodes = new Map<string, { code: string; expires: number; userId: number }>();

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "이메일과 인증 코드가 필요합니다." },
        { status: 400 }
      );
    }

    // 저장된 인증 코드 확인
    const storedData = verificationCodes.get(email.toLowerCase());

    if (!storedData) {
      return NextResponse.json(
        { error: "인증 코드를 찾을 수 없습니다. 다시 요청해주세요." },
        { status: 400 }
      );
    }

    // 만료 시간 확인
    if (Date.now() > storedData.expires) {
      verificationCodes.delete(email.toLowerCase());
      return NextResponse.json(
        { error: "인증 코드가 만료되었습니다. 다시 요청해주세요." },
        { status: 400 }
      );
    }

    // 인증 코드 확인
    if (storedData.code !== code) {
      return NextResponse.json(
        { error: "인증 코드가 올바르지 않습니다." },
        { status: 400 }
      );
    }

    // 사용자 이메일 인증 상태 업데이트
    const user = await User.findByPk(storedData.userId);
    if (!user) {
      return NextResponse.json(
        { error: "사용자를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    await user.update({ isEmailVerified: true });

    // 인증 성공 - 코드 삭제
    verificationCodes.delete(email.toLowerCase());

    console.log(`✅ 이메일 인증 성공: ${email}`);

    return NextResponse.json({
      success: true,
      message: "이메일 인증이 완료되었습니다.",
      verified: true
    });

  } catch (error) {
    console.error("이메일 인증 확인 오류:", error);
    return NextResponse.json(
      { error: "인증 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 인증 코드 저장 함수 (send-verification에서 사용)
export function storeVerificationCode(email: string, code: string, userId: number, expiresInMinutes: number = 10) {
  const expires = Date.now() + (expiresInMinutes * 60 * 1000);
  verificationCodes.set(email.toLowerCase(), { code, expires, userId });
}

// 인증 코드 조회 함수
export function getVerificationCode(email: string) {
  return verificationCodes.get(email.toLowerCase());
}