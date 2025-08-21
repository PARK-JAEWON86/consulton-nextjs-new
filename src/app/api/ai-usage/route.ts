import { NextRequest, NextResponse } from 'next/server';

// AI 크레딧 정책 상수
const BASE_CREDIT_PER_TURN = 3;
const MONTHLY_FREE_BUDGET_CREDITS = 300; // (= 100턴 × 3크레딧)

interface LengthBracket {
  maxTokens: number;
  mult: number;
}

const LENGTH_BRACKETS: LengthBracket[] = [
  { maxTokens: 400, mult: 1.0 },
  { maxTokens: 800, mult: 1.5 },
  { maxTokens: 1200, mult: 2.0 },
  { maxTokens: Infinity, mult: 3.0 },
];

interface AIUsageState {
  usedCredits: number;
  purchasedCredits: number;
  remainingPercent: number;
  monthlyResetDate: string;
  totalTurns: number;
  totalTokens: number;
  averageTokensPerTurn: number;
}

// 토큰 길이에 따른 크레딧 계산
function estimateCreditsForTurn(
  totalTokens: number,
  preciseMode?: boolean
): number {
  // 토큰 길이에 따른 브라켓 찾기
  const bracket = LENGTH_BRACKETS.find(
    (bracket) => totalTokens <= bracket.maxTokens
  );
  if (!bracket) {
    throw new Error("Invalid token count");
  }

  // 기본 크레딧에 멀티플라이어 적용
  let credits = BASE_CREDIT_PER_TURN * bracket.mult;

  // 정밀 모드일 경우 1.5배 추가
  if (preciseMode) {
    credits *= 1.5;
  }

  // 올림하여 반환
  return Math.ceil(credits);
}

// 남은 크레딧 퍼센트 계산
function calcRemainingPercent(
  usedCredits: number,
  purchasedCredits: number
): number {
  const total = MONTHLY_FREE_BUDGET_CREDITS + purchasedCredits;
  return Math.max(0, Math.round(100 * (1 - usedCredits / total)));
}

// 메모리 기반 상태 저장 (실제 프로덕션에서는 데이터베이스 사용 권장)
let aiUsageState: AIUsageState = {
  usedCredits: 0,
  purchasedCredits: 0,
  remainingPercent: 100,
  monthlyResetDate: new Date().toISOString(),
  totalTurns: 0,
  totalTokens: 0,
  averageTokensPerTurn: 0,
};

// GET: AI 사용량 조회
export async function GET() {
  try {
    // 월간 리셋 체크
    const now = new Date();
    const lastReset = new Date(aiUsageState.monthlyResetDate);
    
    // 월이 바뀌었는지 확인
    if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
      // 월간 리셋 실행
      aiUsageState.usedCredits = 0;
      aiUsageState.totalTurns = 0;
      aiUsageState.totalTokens = 0;
      aiUsageState.averageTokensPerTurn = 0;
      aiUsageState.monthlyResetDate = now.toISOString();
      aiUsageState.remainingPercent = calcRemainingPercent(
        aiUsageState.usedCredits,
        aiUsageState.purchasedCredits
      );
    }

    const responseData = {
      ...aiUsageState,
      summary: {
        totalCredits: MONTHLY_FREE_BUDGET_CREDITS + aiUsageState.purchasedCredits,
        freeCredits: MONTHLY_FREE_BUDGET_CREDITS,
        usedFreeCredits: Math.min(aiUsageState.usedCredits, MONTHLY_FREE_BUDGET_CREDITS),
        usedPurchasedCredits: Math.max(0, aiUsageState.usedCredits - MONTHLY_FREE_BUDGET_CREDITS),
        remainingFreeCredits: Math.max(0, MONTHLY_FREE_BUDGET_CREDITS - aiUsageState.usedCredits),
        remainingPurchasedCredits: Math.max(0, aiUsageState.purchasedCredits - Math.max(0, aiUsageState.usedCredits - MONTHLY_FREE_BUDGET_CREDITS)),
        nextResetDate: new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString(),
      }
    };

    return NextResponse.json({
      success: true,
      data: responseData
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'AI 사용량 조회 실패' },
      { status: 500 }
    );
  }
}

// POST: AI 사용량 관리 액션
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'addTurnUsage':
        const { totalTokens, preciseMode = false } = data;
        
        if (!totalTokens || totalTokens <= 0) {
          return NextResponse.json(
            { success: false, error: '유효하지 않은 토큰 수' },
            { status: 400 }
          );
        }

        const spentCredits = estimateCreditsForTurn(totalTokens, preciseMode);
        
        // 사용량 업데이트
        aiUsageState.usedCredits += spentCredits;
        aiUsageState.totalTurns += 1;
        aiUsageState.totalTokens += totalTokens;
        aiUsageState.averageTokensPerTurn = Math.round(aiUsageState.totalTokens / aiUsageState.totalTurns);
        
        // 남은 크레딧 퍼센트 재계산
        aiUsageState.remainingPercent = calcRemainingPercent(
          aiUsageState.usedCredits,
          aiUsageState.purchasedCredits
        );

        return NextResponse.json({
          success: true,
          data: {
            spentCredits,
            newState: aiUsageState,
            message: `턴 사용량이 추가되었습니다. 소모된 크레딧: ${spentCredits}`
          }
        });

      case 'addPurchasedCredits':
        const { credits } = data;
        
        if (!credits || credits <= 0) {
          return NextResponse.json(
            { success: false, error: '유효하지 않은 크레딧 수' },
            { status: 400 }
          );
        }

        aiUsageState.purchasedCredits += credits;
        
        // 남은 크레딧 퍼센트 재계산
        aiUsageState.remainingPercent = calcRemainingPercent(
          aiUsageState.usedCredits,
          aiUsageState.purchasedCredits
        );

        return NextResponse.json({
          success: true,
          data: {
            newState: aiUsageState,
            message: `${credits} 크레딧이 구매되었습니다.`
          }
        });

      case 'grantTurns':
        const { turns } = data;
        
        if (!turns || turns <= 0) {
          return NextResponse.json(
            { success: false, error: '유효하지 않은 턴 수' },
            { status: 400 }
          );
        }

        const grantedCredits = turns * BASE_CREDIT_PER_TURN;
        aiUsageState.purchasedCredits += grantedCredits;
        
        // 남은 크레딧 퍼센트 재계산
        aiUsageState.remainingPercent = calcRemainingPercent(
          aiUsageState.usedCredits,
          aiUsageState.purchasedCredits
        );

        return NextResponse.json({
          success: true,
          data: {
            grantedCredits,
            newState: aiUsageState,
            message: `${turns}턴이 부여되었습니다. (${grantedCredits} 크레딧)`
          }
        });

      case 'resetMonthly':
        // 월간 리셋 (무료 크레딧 사용량만 리셋)
        aiUsageState.usedCredits = 0;
        aiUsageState.totalTurns = 0;
        aiUsageState.totalTokens = 0;
        aiUsageState.averageTokensPerTurn = 0;
        aiUsageState.monthlyResetDate = new Date().toISOString();
        
        // 남은 크레딧 퍼센트 재계산
        aiUsageState.remainingPercent = calcRemainingPercent(
          aiUsageState.usedCredits,
          aiUsageState.purchasedCredits
        );

        return NextResponse.json({
          success: true,
          data: {
            newState: aiUsageState,
            message: '월간 사용량이 리셋되었습니다.'
          }
        });

      case 'resetAll':
        // 모든 사용량 리셋
        aiUsageState = {
          usedCredits: 0,
          purchasedCredits: 0,
          remainingPercent: 100,
          monthlyResetDate: new Date().toISOString(),
          totalTurns: 0,
          totalTokens: 0,
          averageTokensPerTurn: 0,
        };

        return NextResponse.json({
          success: true,
          data: {
            newState: aiUsageState,
            message: '모든 AI 사용량이 리셋되었습니다.'
          }
        });

      case 'initializeUsage':
        // 더미 데이터로 초기화
        aiUsageState = {
          usedCredits: 150,
          purchasedCredits: 100,
          remainingPercent: 70,
          monthlyResetDate: new Date().toISOString(),
          totalTurns: 50,
          totalTokens: 25000,
          averageTokensPerTurn: 500,
        };

        return NextResponse.json({
          success: true,
          data: {
            newState: aiUsageState,
            message: 'AI 사용량이 더미 데이터로 초기화되었습니다.'
          }
        });

      case 'simulateUsage':
        // 사용량 시뮬레이션
        const { simulationTurns: simTurns, tokensPerTurn: simTokensPerTurn, preciseMode: simPreciseMode = false } = data;
        
        if (!simTurns || !simTokensPerTurn) {
          return NextResponse.json(
            { success: false, error: '시뮬레이션 파라미터가 필요합니다' },
            { status: 400 }
          );
        }

        let totalSpentCredits = 0;
        let totalSimTokens = 0;

        for (let i = 0; i < simTurns; i++) {
          const spentCredits = estimateCreditsForTurn(simTokensPerTurn, simPreciseMode);
          totalSpentCredits += spentCredits;
          totalSimTokens += simTokensPerTurn;
        }

        // 실제 상태에 반영하지 않고 시뮬레이션 결과만 반환
        const simulationResult = {
          turns: simTurns,
          tokensPerTurn: simTokensPerTurn,
          totalTokens: totalSimTokens,
          totalSpentCredits,
          averageCreditsPerTurn: Math.round(totalSpentCredits / simTurns),
          preciseMode: simPreciseMode,
          estimatedRemainingCredits: Math.max(0, (MONTHLY_FREE_BUDGET_CREDITS + aiUsageState.purchasedCredits) - totalSpentCredits)
        };

        return NextResponse.json({
          success: true,
          data: {
            simulation: simulationResult,
            message: '사용량 시뮬레이션이 완료되었습니다.'
          }
        });

      default:
        return NextResponse.json(
          { success: false, error: '알 수 없는 액션' },
          { status: 400 }
        );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'AI 사용량 관리 실패' },
      { status: 500 }
    );
  }
}

// PATCH: AI 사용량 부분 업데이트
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { updates } = body;
    
    // 사용량 업데이트
    Object.assign(aiUsageState, updates);
    
    // 남은 크레딧 퍼센트 재계산
    aiUsageState.remainingPercent = calcRemainingPercent(
      aiUsageState.usedCredits,
      aiUsageState.purchasedCredits
    );
    
    // 평균 토큰 수 재계산
    if (aiUsageState.totalTurns > 0) {
      aiUsageState.averageTokensPerTurn = Math.round(aiUsageState.totalTokens / aiUsageState.totalTurns);
    }
    
    return NextResponse.json({
      success: true,
      data: {
        newState: aiUsageState,
        message: 'AI 사용량이 업데이트되었습니다.'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'AI 사용량 업데이트 실패' },
      { status: 500 }
    );
  }
}

// DELETE: AI 사용량 초기화
export async function DELETE() {
  try {
    aiUsageState = {
      usedCredits: 0,
      purchasedCredits: 0,
      remainingPercent: 100,
      monthlyResetDate: new Date().toISOString(),
      totalTurns: 0,
      totalTokens: 0,
      averageTokensPerTurn: 0,
    };
    
    return NextResponse.json({
      success: true,
      data: {
        message: '모든 AI 사용량이 초기화되었습니다.'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'AI 사용량 초기화 실패' },
      { status: 500 }
    );
  }
}
