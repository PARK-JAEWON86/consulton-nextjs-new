/**
 * AI 채팅 토큰 사용량 관리 API
 * GET /api/ai-chat/tokens - 현재 토큰 상태 조회
 * POST /api/ai-chat/tokens/use - 토큰 사용
 * POST /api/ai-chat/tokens/reset - 월간 리셋
 */

import { NextRequest, NextResponse } from 'next/server';

// 임시 저장소 (실제로는 데이터베이스 사용)
const userUsage = new Map<string, {
  // 토큰 기반 (AI API 비용 계산용)
  freeTokens: number;
  paidTokens: number;
  usedTokens: number;
  
  // 턴 기반 (사용자 표시용)
  freeTurns: number;
  paidTurns: number;
  usedTurns: number;
  
  lastResetDate: string;
}>();

const MONTHLY_FREE_TOKENS = 30000; // 30,000 토큰
const MONTHLY_FREE_TURNS = 100;     // 100턴
const TOKENS_PER_TURN = 300;        // 1턴당 300토큰 (일반적인 대화 기준)

// GPT-4 비용 계산 상수
const GPT4_INPUT_COST_PER_1K = 0.005;   // $0.005 per 1K tokens
const GPT4_OUTPUT_COST_PER_1K = 0.015;  // $0.015 per 1K tokens
const KRW_TO_USD = 1350;                // 1달러 = 1,350원

// 500원으로 구매 가능한 토큰 계산 함수
function calculateTokensFor500KRW(): number {
  const availableUSD = 500 / KRW_TO_USD; // $0.37
  
  // 실용적인 대화 기준 (입력:출력 = 1:2)
  const avgInputCost = 100 * GPT4_INPUT_COST_PER_1K / 1000;   // $0.0005
  const avgOutputCost = 200 * GPT4_OUTPUT_COST_PER_1K / 1000; // $0.003
  const totalCostPerTurn = avgInputCost + avgOutputCost;        // $0.0035
  
  // 500원으로 가능한 턴 수
  const availableTurns = availableUSD / totalCostPerTurn;
  
  // 총 토큰 수 (턴 × 300토큰)
  return Math.floor(availableTurns * 300);
}

const EXTENSION_TOKENS_FOR_50_CREDITS = calculateTokensFor500KRW(); // 약 31,800 토큰

// 사용자별 토큰 사용량 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: '사용자 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const usage = userUsage.get(userId) || {
      freeTokens: MONTHLY_FREE_TOKENS,
      paidTokens: 0,
      usedTokens: 0,
      freeTurns: MONTHLY_FREE_TURNS,
      paidTurns: 0,
      usedTurns: 0,
      lastResetDate: new Date().toISOString().slice(0, 7) // YYYY-MM
    };

    // 월간 리셋 체크
    const currentMonth = new Date().toISOString().slice(0, 7);
    if (usage.lastResetDate !== currentMonth) {
      usage.freeTokens = MONTHLY_FREE_TOKENS;
      usage.usedTokens = 0;
      usage.freeTurns = MONTHLY_FREE_TURNS;
      usage.usedTurns = 0;
      usage.lastResetDate = currentMonth;
      userUsage.set(userId, usage);
    }

    const remainingTokens = usage.freeTokens + usage.paidTokens - usage.usedTokens;
    const remainingTurns = usage.freeTurns + usage.paidTurns - usage.usedTurns;
    const remainingPercent = Math.max(0, Math.round(100 * (remainingTurns / (usage.freeTurns + usage.paidTurns))));

    return NextResponse.json({
      success: true,
      data: {
        // 토큰 정보
        freeTokens: usage.freeTokens,
        paidTokens: usage.paidTokens,
        usedTokens: usage.usedTokens,
        remainingTokens,
        
        // 턴 정보
        freeTurns: usage.freeTurns,
        paidTurns: usage.paidTurns,
        usedTurns: usage.usedTurns,
        remainingTurns,
        
        remainingPercent,
        lastResetDate: usage.lastResetDate,
        monthlyFreeTokens: MONTHLY_FREE_TOKENS,
        monthlyFreeTurns: MONTHLY_FREE_TURNS,
        tokensPerTurn: TOKENS_PER_TURN,
        extensionTokensFor50Credits: EXTENSION_TOKENS_FOR_50_CREDITS,
        extensionTurnsFor50Credits: Math.floor(EXTENSION_TOKENS_FOR_50_CREDITS / TOKENS_PER_TURN)
      }
    });

  } catch (error) {
    console.error('토큰 사용량 조회 오류:', error);
    return NextResponse.json(
      { error: '토큰 사용량 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 토큰 사용 처리
export async function POST(request: NextRequest) {
  try {
    const { userId, inputTokens, outputTokens, model = 'gpt-4' } = await request.json();

    if (!userId || !inputTokens || !outputTokens) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      );
    }

    const totalTokens = inputTokens + outputTokens;
    
    // 사용자별 사용량 조회 또는 초기화
    let usage = userUsage.get(userId);
    if (!usage) {
      usage = {
        freeTokens: MONTHLY_FREE_TOKENS,
        paidTokens: 0,
        usedTokens: 0,
        freeTurns: MONTHLY_FREE_TURNS,
        paidTurns: 0,
        usedTurns: 0,
        lastResetDate: new Date().toISOString().slice(0, 7)
      };
    }

    // 월간 리셋 체크
    const currentMonth = new Date().toISOString().slice(0, 7);
    if (usage.lastResetDate !== currentMonth) {
      usage.freeTokens = MONTHLY_FREE_TOKENS;
      usage.usedTokens = 0;
      usage.freeTurns = MONTHLY_FREE_TURNS;
      usage.usedTurns = 0;
      usage.lastResetDate = currentMonth;
    }

    // 턴 기반 제한 확인 (1턴 = 300토큰)
    const estimatedTurns = Math.ceil(totalTokens / TOKENS_PER_TURN);
    const availableTurns = usage.freeTurns + usage.paidTurns - usage.usedTurns;
    
    if (availableTurns < estimatedTurns) {
      return NextResponse.json(
        { 
          error: '무료 턴이 부족합니다. 크레딧을 구매하여 추가 사용하거나, 다음 달을 기다려주세요.',
          code: 'INSUFFICIENT_TURNS',
          required: estimatedTurns,
          available: availableTurns,
          monthlyFreeTurns: MONTHLY_FREE_TURNS
        },
        { status: 402 }
      );
    }

    // 사용 가능한 토큰 확인
    const availableTokens = usage.freeTokens + usage.paidTokens - usage.usedTokens;
    
    if (availableTokens < totalTokens) {
      return NextResponse.json(
        { 
          error: '토큰이 부족합니다.',
          code: 'INSUFFICIENT_TOKENS',
          required: totalTokens,
          available: availableTokens
        },
        { status: 402 }
      );
    }

    // 토큰 사용 처리 (무료 토큰부터 사용)
    let remainingTokens = totalTokens;
    let usedFreeTokens = 0;
    let usedPaidTokens = 0;

    // 무료 토큰 사용
    if (usage.freeTokens > usage.usedTokens) {
      const availableFreeTokens = usage.freeTokens - usage.usedTokens;
      usedFreeTokens = Math.min(availableFreeTokens, remainingTokens);
      remainingTokens -= usedFreeTokens;
    }

    // 유료 토큰 사용 (남은 토큰이 있는 경우)
    if (remainingTokens > 0) {
      usedPaidTokens = remainingTokens;
    }

    // 사용량 업데이트 (토큰과 턴 모두)
    usage.usedTokens += totalTokens;
    usage.usedTurns += estimatedTurns;
    userUsage.set(userId, usage);

    // 예상 비용 계산 (GPT-4 기준)
    const estimatedCost = (inputTokens * 0.005 + outputTokens * 0.015) / 1000;

    return NextResponse.json({
      success: true,
      data: {
        usedTokens: totalTokens,
        usedFreeTokens,
        usedPaidTokens,
        remainingTokens: availableTokens - totalTokens,
        usedTurns: estimatedTurns,
        remainingTurns: availableTurns - estimatedTurns,
        estimatedCost,
        message: '토큰과 턴이 성공적으로 사용되었습니다.'
      }
    });

  } catch (error) {
    console.error('토큰 사용 처리 오류:', error);
    return NextResponse.json(
      { error: '토큰 사용 처리에 실패했습니다.' },
      { status: 500 }
    );
  }
}
