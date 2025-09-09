import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { UserCredits } from '@/lib/db/models';
import { initializeDatabase } from '@/lib/db/init';

// AI 토큰 정책 상수
const MONTHLY_FREE_TOKENS = 100000; // 매월 100,000 토큰 제공 (100%)
const AVERAGE_TOKENS_PER_TURN = 900; // GPT-5 기준 1턴당 평균 900 토큰
const AVERAGE_COST_PER_1K_TOKENS = 0.0071; // 1K 토큰당 평균 $0.0071
const EXCHANGE_RATE_KRW = 1385; // 환율: 1달러 = 1,385원

// 크레딧 시스템 상수
const CREDIT_TO_KRW = 10; // 1크레딧 = ₩10원
const CREDIT_TO_TOKENS = 1000; // 1크레딧 = 1,000토큰
const TOKENS_TO_KRW = 0.01; // 1,000토큰 = ₩10원 (크레딧 구매 시)

interface AIUsageState {
  usedTokens: number;
  purchasedTokens: number;
  remainingPercent: number;
  monthlyResetDate: string;
  totalTurns: number;
  totalTokens: number;
  averageTokensPerTurn: number;
}

// 토큰 사용량을 퍼센트로 변환
function tokensToPercent(tokens: number): number {
  return Math.round((tokens / MONTHLY_FREE_TOKENS) * 100);
}

// 남은 토큰 퍼센트 계산
function calcRemainingPercent(
  usedTokens: number,
  purchasedTokens: number
): number {
  const total = MONTHLY_FREE_TOKENS + purchasedTokens;
  return Math.max(0, Math.round(100 * (1 - usedTokens / total)));
}

// summary 객체 생성 helper 함수
function createSummary(aiUsageState: AIUsageState) {
  const totalFreeTokens = MONTHLY_FREE_TOKENS;
  
  // 구매 토큰이 있으면 구매 토큰을 우선 사용하도록 로직 수정
  let usedFreeTokens, usedPurchasedTokens, remainingFreeTokens, remainingPurchasedTokens;
  
  if (aiUsageState.purchasedTokens > 0) {
    // 구매 토큰이 있는 경우: 구매 토큰을 먼저 사용
    usedPurchasedTokens = Math.min(aiUsageState.usedTokens, aiUsageState.purchasedTokens);
    usedFreeTokens = Math.max(0, aiUsageState.usedTokens - aiUsageState.purchasedTokens);
    remainingPurchasedTokens = Math.max(0, aiUsageState.purchasedTokens - usedPurchasedTokens);
    remainingFreeTokens = Math.max(0, totalFreeTokens - usedFreeTokens);
  } else {
    // 구매 토큰이 없는 경우: 기존 로직
    usedFreeTokens = Math.min(aiUsageState.usedTokens, totalFreeTokens);
    usedPurchasedTokens = Math.max(0, aiUsageState.usedTokens - totalFreeTokens);
    remainingFreeTokens = Math.max(0, totalFreeTokens - aiUsageState.usedTokens);
    remainingPurchasedTokens = 0;
  }
  
  // 예상 턴 수 계산
  const estimatedTurnsFromFree = Math.floor(remainingFreeTokens / AVERAGE_TOKENS_PER_TURN);
  const estimatedTurnsFromPurchased = Math.floor(remainingPurchasedTokens / AVERAGE_TOKENS_PER_TURN);
  
  return {
    totalTokens: totalFreeTokens + aiUsageState.purchasedTokens,
    freeTokens: totalFreeTokens,
    usedFreeTokens,
    usedPurchasedTokens,
    remainingFreeTokens,
    remainingPurchasedTokens,
    estimatedTurnsFromFree,
    estimatedTurnsFromPurchased,
    totalEstimatedTurns: estimatedTurnsFromFree + estimatedTurnsFromPurchased,
    nextResetDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString(),
    // 무료 제공량 사용률 (무료 토큰만의 사용률)
    freeTokensUsagePercent: Math.round((usedFreeTokens / totalFreeTokens) * 100),
    // 비용 정보
    averageCostPerTurn: (AVERAGE_TOKENS_PER_TURN / 1000) * AVERAGE_COST_PER_1K_TOKENS,
    monthlyFreeValue: (MONTHLY_FREE_TOKENS / 1000) * AVERAGE_COST_PER_1K_TOKENS,
    // 원화 비용 정보
    averageCostPerTurnKRW: (AVERAGE_TOKENS_PER_TURN / 1000) * AVERAGE_COST_PER_1K_TOKENS * EXCHANGE_RATE_KRW,
    monthlyFreeValueKRW: (MONTHLY_FREE_TOKENS / 1000) * AVERAGE_COST_PER_1K_TOKENS * EXCHANGE_RATE_KRW,
    // 크레딧 시스템 정보
    creditToTokens: CREDIT_TO_TOKENS,
    creditToKRW: CREDIT_TO_KRW,
    tokensToKRW: TOKENS_TO_KRW,
    creditDiscount: Math.round((1 - (TOKENS_TO_KRW / (AVERAGE_COST_PER_1K_TOKENS * EXCHANGE_RATE_KRW))) * 100)
  };
}

// GET: AI 사용량 조회
export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();
    
    // 인증된 사용자 확인
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    // 데이터베이스에서 사용자 크레딧 조회
    let userCredits = await UserCredits.findOne({
      where: { userId: authUser.id }
    });

    // 사용자 크레딧이 없으면 새로 생성
    if (!userCredits) {
      userCredits = await UserCredits.create({
        userId: authUser.id,
        aiChatTotal: 7300, // 기본 AI 채팅 토큰
        aiChatUsed: 0,
        purchasedTotal: 0,
        purchasedUsed: 0,
        lastResetDate: null
      });
    }

    // 월간 리셋 체크
    const now = new Date();
    const lastReset = userCredits.lastResetDate ? new Date(userCredits.lastResetDate) : null;
    
    // 월이 바뀌었는지 확인 (매월 1일 리셋)
    if (!lastReset || now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
      // 월간 리셋 실행 (무료 토큰만 리셋)
      await userCredits.update({
        aiChatUsed: 0,
        lastResetDate: now.toISOString().split('T')[0] // YYYY-MM-DD 형식
      });
      
      // 업데이트된 데이터 다시 조회
      userCredits = await UserCredits.findByPk(userCredits.id);
    }

    // AI 사용량 상태 객체 생성
    const totalUsedTokens = userCredits!.aiChatUsed + userCredits!.purchasedUsed;
    const totalAvailableTokens = userCredits!.aiChatTotal + userCredits!.purchasedTotal;
    const totalTurns = Math.floor(totalUsedTokens / AVERAGE_TOKENS_PER_TURN);
    
    const aiUsageState: AIUsageState = {
      usedTokens: totalUsedTokens,
      purchasedTokens: userCredits!.purchasedTotal,
      remainingPercent: calcRemainingPercent(totalUsedTokens, userCredits!.purchasedTotal),
      monthlyResetDate: userCredits!.lastResetDate || now.toISOString(),
      totalTurns: totalTurns,
      totalTokens: totalUsedTokens,
      averageTokensPerTurn: totalTurns > 0 ? Math.round(totalUsedTokens / totalTurns) : 0
    };

    const responseData = {
      ...aiUsageState,
      summary: createSummary(aiUsageState)
    };

    const response = NextResponse.json({
      success: true,
      data: responseData
    });

    // 캐싱 헤더 추가 (3초간 캐시)
    response.headers.set('Cache-Control', 'public, s-maxage=3, stale-while-revalidate=5');
    
    return response;
  } catch (error) {
    console.error('AI 사용량 조회 실패:', error);
    return NextResponse.json(
      { success: false, error: 'AI 사용량 조회 실패' },
      { status: 500 }
    );
  }
}

// POST: AI 사용량 관리 액션
export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    
    // 인증된 사용자 확인
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, data } = body;

    // 사용자 크레딧 조회 또는 생성
    let userCredits = await UserCredits.findOne({
      where: { userId: authUser.id }
    });

    if (!userCredits) {
      userCredits = await UserCredits.create({
        userId: authUser.id,
        aiChatTotal: 7300, // 기본 AI 채팅 토큰
        aiChatUsed: 0,
        purchasedTotal: 0,
        purchasedUsed: 0,
        lastResetDate: null
      });
    }

    switch (action) {
      case 'addTurnUsage':
        const { totalTokens, preciseMode = false } = data;
        
        if (!totalTokens || totalTokens <= 0) {
          return NextResponse.json(
            { success: false, error: '유효하지 않은 토큰 수' },
            { status: 400 }
          );
        }

        // 정밀 모드일 경우 1.2배 토큰 소모
        const actualTokensUsed = preciseMode ? Math.round(totalTokens * 1.2) : totalTokens;
        
        // 무료 토큰을 먼저 사용하고, 부족하면 구매 토큰 사용
        let newAiChatUsed = userCredits.aiChatUsed;
        let newPurchasedUsed = userCredits.purchasedUsed;
        
        if (userCredits.aiChatTotal - userCredits.aiChatUsed >= actualTokensUsed) {
          // 무료 토큰으로 충분한 경우
          newAiChatUsed += actualTokensUsed;
        } else {
          // 무료 토큰이 부족한 경우
          const remainingFreeTokens = userCredits.aiChatTotal - userCredits.aiChatUsed;
          newAiChatUsed = userCredits.aiChatTotal; // 무료 토큰 모두 사용
          newPurchasedUsed += (actualTokensUsed - remainingFreeTokens); // 나머지는 구매 토큰 사용
        }
        
        // 데이터베이스에서 사용량 업데이트
        await userCredits.update({
          aiChatUsed: newAiChatUsed,
          purchasedUsed: newPurchasedUsed
        });

        // 업데이트된 데이터 다시 조회
        userCredits = await UserCredits.findByPk(userCredits.id);

        // AI 사용량 상태 객체 생성
        const totalUsedTokensAfterUsage = userCredits!.aiChatUsed + userCredits!.purchasedUsed;
        const totalTurnsAfterUsage = Math.floor(totalUsedTokensAfterUsage / AVERAGE_TOKENS_PER_TURN);
        
        const aiUsageState: AIUsageState = {
          usedTokens: totalUsedTokensAfterUsage,
          purchasedTokens: userCredits!.purchasedTotal,
          remainingPercent: calcRemainingPercent(totalUsedTokensAfterUsage, userCredits!.purchasedTotal),
          monthlyResetDate: userCredits!.lastResetDate || new Date().toISOString(),
          totalTurns: totalTurnsAfterUsage,
          totalTokens: totalUsedTokensAfterUsage,
          averageTokensPerTurn: totalTurnsAfterUsage > 0 ? Math.round(totalUsedTokensAfterUsage / totalTurnsAfterUsage) : 0
        };

        // 예상 남은 턴 수 계산
        const remainingTokensAfterUsage = Math.max(0, (userCredits!.aiChatTotal + userCredits!.purchasedTotal) - (userCredits!.aiChatUsed + userCredits!.purchasedUsed));
        const estimatedRemainingTurnsAfterUsage = Math.floor(remainingTokensAfterUsage / AVERAGE_TOKENS_PER_TURN);

        return NextResponse.json({
          success: true,
          data: {
            spentTokens: actualTokensUsed,
            newState: {
              ...aiUsageState,
              summary: createSummary(aiUsageState)
            },
            estimatedRemainingTurns: estimatedRemainingTurnsAfterUsage,
            message: `턴 사용량이 추가되었습니다. 소모된 토큰: ${actualTokensUsed} (${preciseMode ? '정밀 모드' : '일반 모드'})`
          }
        });

      case 'addPurchasedTokens':
        const { tokens } = data;
        
        if (!tokens || tokens <= 0) {
          return NextResponse.json(
            { success: false, error: '유효하지 않은 토큰 수' },
            { status: 400 }
          );
        }

        // 데이터베이스에서 구매 토큰 업데이트
        await userCredits.update({
          purchasedTotal: userCredits.purchasedTotal + tokens
        });

        // 업데이트된 데이터 다시 조회
        userCredits = await UserCredits.findByPk(userCredits.id);

        // AI 사용량 상태 객체 생성
        const totalUsedTokensAfterPurchase = userCredits!.aiChatUsed + userCredits!.purchasedUsed;
        const totalTurnsAfterPurchase = Math.floor(totalUsedTokensAfterPurchase / AVERAGE_TOKENS_PER_TURN);
        
        const aiUsageStateAfterPurchase: AIUsageState = {
          usedTokens: totalUsedTokensAfterPurchase,
          purchasedTokens: userCredits!.purchasedTotal,
          remainingPercent: calcRemainingPercent(totalUsedTokensAfterPurchase, userCredits!.purchasedTotal),
          monthlyResetDate: userCredits!.lastResetDate || new Date().toISOString(),
          totalTurns: totalTurnsAfterPurchase,
          totalTokens: totalUsedTokensAfterPurchase,
          averageTokensPerTurn: totalTurnsAfterPurchase > 0 ? Math.round(totalUsedTokensAfterPurchase / totalTurnsAfterPurchase) : 0
        };

        // 예상 추가 턴 수 계산
        const additionalTurns = Math.floor(tokens / AVERAGE_TOKENS_PER_TURN);

        return NextResponse.json({
          success: true,
          data: {
            newState: {
              ...aiUsageStateAfterPurchase,
              summary: createSummary(aiUsageStateAfterPurchase)
            },
            additionalTurns,
            message: `${tokens.toLocaleString()} 토큰이 구매되었습니다. (예상 ${additionalTurns}턴)`
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

        // 크레딧을 토큰으로 변환
        const tokensFromCredits = credits * CREDIT_TO_TOKENS;
        const costInKRW = credits * CREDIT_TO_KRW;
        
        // 데이터베이스에서 구매 토큰 업데이트
        await userCredits.update({
          purchasedTotal: userCredits.purchasedTotal + tokensFromCredits
        });

        // 업데이트된 데이터 다시 조회
        userCredits = await UserCredits.findByPk(userCredits.id);

        // AI 사용량 상태 객체 생성
        const totalUsedTokensAfterCredits = userCredits!.aiChatUsed + userCredits!.purchasedUsed;
        const totalTurnsAfterCredits = Math.floor(totalUsedTokensAfterCredits / AVERAGE_TOKENS_PER_TURN);
        
        const aiUsageStateAfterCredits: AIUsageState = {
          usedTokens: totalUsedTokensAfterCredits,
          purchasedTokens: userCredits!.purchasedTotal,
          remainingPercent: calcRemainingPercent(totalUsedTokensAfterCredits, userCredits!.purchasedTotal),
          monthlyResetDate: userCredits!.lastResetDate || new Date().toISOString(),
          totalTurns: totalTurnsAfterCredits,
          totalTokens: totalUsedTokensAfterCredits,
          averageTokensPerTurn: totalTurnsAfterCredits > 0 ? Math.round(totalUsedTokensAfterCredits / totalTurnsAfterCredits) : 0
        };

        // 예상 추가 턴 수 계산
        const additionalTurnsFromCredits = Math.floor(tokensFromCredits / AVERAGE_TOKENS_PER_TURN);

        return NextResponse.json({
          success: true,
          data: {
            newState: {
              ...aiUsageStateAfterCredits,
              summary: createSummary(aiUsageStateAfterCredits)
            },
            purchasedCredits: credits,
            purchasedTokens: tokensFromCredits,
            costInKRW,
            additionalTurns: additionalTurnsFromCredits,
            message: `${credits}크레딧(₩${costInKRW.toLocaleString()})으로 ${tokensFromCredits.toLocaleString()} 토큰이 구매되었습니다. (예상 ${additionalTurnsFromCredits}턴)`
          }
        });

      case 'resetMonthly':
        // 월간 리셋 (무료 토큰 사용량만 리셋)
        await userCredits.update({
          aiChatUsed: 0,
          lastResetDate: new Date().toISOString().split('T')[0] // YYYY-MM-DD 형식
        });

        return NextResponse.json({
          success: true,
          data: {
            message: '월간 사용량이 리셋되었습니다.'
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
    await initializeDatabase();
    
    // 인증된 사용자 확인
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { updates } = body;
    
    // 사용자 크레딧 조회 또는 생성
    let userCredits = await UserCredits.findOne({
      where: { userId: authUser.id }
    });

    if (!userCredits) {
      userCredits = await UserCredits.create({
        userId: authUser.id,
        aiChatTotal: 7300, // 기본 AI 채팅 토큰
        aiChatUsed: 0,
        purchasedTotal: 0,
        purchasedUsed: 0,
        lastResetDate: null
      });
    }
    
    // 사용량 업데이트
    await userCredits.update(updates);
    
    return NextResponse.json({
      success: true,
      data: {
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
export async function DELETE(request: NextRequest) {
  try {
    await initializeDatabase();
    
    // 인증된 사용자 확인
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    // AI 사용량 초기화
    await UserCredits.update({
      aiChatUsed: 0,
      purchasedUsed: 0,
      lastResetDate: new Date().toISOString().split('T')[0] // YYYY-MM-DD 형식
    }, {
      where: { userId: authUser.id }
    });
    
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
