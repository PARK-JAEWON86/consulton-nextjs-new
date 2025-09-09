import { NextRequest, NextResponse } from 'next/server';
import { User, Expert, UserCredits } from '@/lib/db/models';
import { initializeDatabase } from '@/lib/db/init';
import { 
  verifyPassword, 
  generateToken, 
  validateEmail,
  AuthUser 
} from '@/lib/auth';

// 로그인 API
export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    
    const { email, password } = await request.json();
    console.log('로그인 시도:', { email, passwordLength: password?.length });

    // 입력 검증
    if (!email || !password) {
      return NextResponse.json(
        { error: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 이메일 형식 검증
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: '올바른 이메일 형식이 아닙니다.' },
        { status: 400 }
      );
    }

    // 사용자 조회
    const user = await User.findOne({
      where: { email: email.toLowerCase() },
      include: [
        {
          model: Expert,
          as: 'expert',
          required: false,
          attributes: ['id']
        }
      ]
    });

    if (!user) {
      console.log('사용자를 찾을 수 없음:', email);
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }
    
    console.log('사용자 찾음:', { id: user.id, email: user.email, role: user.role });

    // 비밀번호 검증
    const isPasswordValid = await verifyPassword(password, user.password);
    console.log('비밀번호 검증 결과:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('비밀번호 불일치:', email);
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    // 이메일 인증 확인 (선택적)
    if (!user.isEmailVerified) {
      return NextResponse.json(
        { 
          error: '이메일 인증이 필요합니다.',
          requiresEmailVerification: true 
        },
        { status: 403 }
      );
    }

    // 사용자 크레딧 정보 조회
    let userCredits = await UserCredits.findOne({
      where: { userId: user.id }
    });

    // 사용자 크레딧이 없으면 새로 생성
    if (!userCredits) {
      userCredits = await UserCredits.create({
        userId: user.id,
        aiChatTotal: 7300, // 기본 AI 채팅 토큰
        aiChatUsed: 0,
        purchasedTotal: 0,
        purchasedUsed: 0,
        lastResetDate: null
      });
    }

    // 마지막 로그인 시간 업데이트
    await user.update({ lastLoginAt: new Date() });

    // JWT 토큰 생성
    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      name: user.name || '',
      role: user.role,
      expertId: user.expert?.id
    };

    const token = await generateToken(authUser);

    // 실제 크레딧 계산
    const totalCredits = (userCredits.aiChatTotal + userCredits.purchasedTotal) - (userCredits.aiChatUsed + userCredits.purchasedUsed);

    console.log('로그인 성공:', { userId: user.id, email: user.email, role: user.role, credits: totalCredits });
    
    // 응답 생성 - 클라이언트에서 사용할 수 있도록 토큰도 포함
    const responseData = {
      success: true,
      message: '로그인 성공',
      user: {
        id: user.id.toString(), // string으로 변환
        email: user.email,
        name: user.name,
        role: user.role,
        credits: totalCredits, // 실제 크레딧 계산값
        expertLevel: user.expert ? 'Tier 1 (Lv.1-99)' : null,
        expertProfile: user.expert?.id ? { id: user.expert.id } : null,
        isEmailVerified: user.isEmailVerified,
        lastLoginAt: user.lastLoginAt
      },
      token: token // JWT 토큰을 응답에 포함
    };

    const response = NextResponse.json(responseData);

    // 쿠키에 토큰 설정
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7일
    });

    // 사용자 데이터도 쿠키에 설정 (선택적)
    response.cookies.set('user-data', JSON.stringify(authUser), {
      httpOnly: false, // 프론트엔드에서 접근 가능
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7일
    });

    return response;

  } catch (error) {
    console.error('로그인 오류:', error);
    return NextResponse.json(
      { 
        error: '로그인 처리 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
}
