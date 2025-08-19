import { NextRequest, NextResponse } from "next/server";

// 임시 저장소 (실제로는 Redis나 데이터베이스 사용)
const verificationCodes = new Map<string, { code: string; expires: number }>();

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "이메일이 필요합니다." },
        { status: 400 }
      );
    }

    // 6자리 랜덤 인증 코드 생성
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 5분 후 만료
    const expires = Date.now() + 5 * 60 * 1000;
    
    // 인증 코드 저장
    verificationCodes.set(email, { code, expires });

    // 실제로는 이메일 발송 서비스 사용 (예: SendGrid, AWS SES)
    console.log(`📧 인증 코드 발송: ${email} -> ${code}`);
    
    // 개발 환경에서는 콘솔에 코드 출력
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔐 [개발용] ${email}의 인증 코드: ${code}`);
    }

    // 실제 이메일 발송 로직 (예시)
    // await sendVerificationEmail(email, code);

    return NextResponse.json({
      message: "인증 코드가 발송되었습니다.",
      // 개발 환경에서만 코드 반환
      ...(process.env.NODE_ENV === 'development' && { devCode: code })
    });

  } catch (error) {
    console.error("인증 이메일 발송 오류:", error);
    return NextResponse.json(
      { error: "인증 이메일 발송에 실패했습니다." },
      { status: 500 }
    );
  }
}

// 이메일 발송 함수 (실제 구현 예시)
async function sendVerificationEmail(email: string, code: string) {
  // 실제로는 이메일 서비스 사용
  // 예: SendGrid, AWS SES, Nodemailer 등
  
  const emailContent = `
    안녕하세요! 컨설트온 회원가입을 위한 인증 코드입니다.
    
    인증 코드: ${code}
    
    이 코드는 5분 후 만료됩니다.
    만약 회원가입을 신청하지 않으셨다면 이 이메일을 무시해주세요.
    
    감사합니다.
    컨설트온 팀
  `;

  // 실제 이메일 발송 로직
  console.log(`이메일 발송 대상: ${email}`);
  console.log(`이메일 내용: ${emailContent}`);
  
  return true;
}
