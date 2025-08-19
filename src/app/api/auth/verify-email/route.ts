import { NextRequest, NextResponse } from "next/server";

// 임시 저장소 (실제로는 Redis나 데이터베이스 사용)
// send-verification에서 사용하는 것과 동일한 Map
const verificationCodes = new Map<string, { code: string; expires: number }>();

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "이메일과 인증 코드가 필요합니다." },
        { status: 400 }
      );
    }

    // 저장된 인증 코드 확인
    const storedData = verificationCodes.get(email);

    if (!storedData) {
      return NextResponse.json(
        { error: "인증 코드를 찾을 수 없습니다. 다시 요청해주세요." },
        { status: 400 }
      );
    }

    // 만료 시간 확인
    if (Date.now() > storedData.expires) {
      verificationCodes.delete(email);
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

    // 인증 성공 - 코드 삭제
    verificationCodes.delete(email);

    console.log(`✅ 이메일 인증 성공: ${email}`);

    // 실제로는 여기서 사용자 계정 생성 또는 이메일 인증 상태 업데이트
    // await createUserAccount(email);
    // 또는
    // await updateEmailVerificationStatus(email, true);

    return NextResponse.json({
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

// 사용자 계정 생성 함수 (실제 구현 예시)
async function createUserAccount(email: string, userData: any) {
  // 실제로는 데이터베이스에 사용자 정보 저장
  console.log(`사용자 계정 생성: ${email}`, userData);
  
  // 예: Prisma, MongoDB, PostgreSQL 등 사용
  // const user = await prisma.user.create({
  //   data: {
  //     email,
  //     name: userData.name,
  //     password: await bcrypt.hash(userData.password, 10),
  //     emailVerified: true,
  //   }
  // });
  
  return true;
}
