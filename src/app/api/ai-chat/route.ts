/**
 * AI 채팅 API
 * POST /api/ai-chat - AI 채팅 요청 처리
 */

import { NextRequest, NextResponse } from 'next/server';

// 임시 저장소 (실제로는 데이터베이스 사용)
const chatHistory = new Map<string, Array<{
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  tokens: number;
}>>();

// 간단한 토큰 계산 함수 (실제로는 tiktoken 라이브러리 사용)
function estimateTokens(text: string): number {
  // 대략적인 토큰 계산: 1토큰 ≈ 4글자 (한글 기준)
  return Math.ceil(text.length / 4);
}

// AI 응답 생성 (실제로는 OpenAI API 호출)
async function generateAIResponse(userMessage: string, conversationHistory: any[]): Promise<{
  content: string;
  inputTokens: number;
  outputTokens: number;
}> {
  // 실제 구현에서는 OpenAI API 호출
  // const response = await openai.chat.completions.create({
  //   model: "gpt-4",
  //   messages: conversationHistory,
  //   max_tokens: 1000,
  // });
  
  // 임시 응답 생성 (테스트용)
  const responses = [
    "말씀해주신 상황을 잘 이해했습니다. 더 구체적인 정보를 알려주시면 더 정확한 조언을 드릴 수 있어요.",
    "흥미로운 케이스네요! 이런 상황에서는 몇 가지 접근 방법이 있습니다. 어떤 부분이 가장 우선순위인지 알려주세요.",
    "지금까지 말씀해주신 내용을 종합해보면, 핵심 이슈가 명확해지고 있습니다. 추가로 궁금한 점이 있으실까요?",
    "네, 충분한 정보를 주셨습니다. 이제 구체적인 솔루션과 실행 방안을 제시해드릴 수 있을 것 같습니다.",
  ];
  
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
  return {
    content: randomResponse,
    inputTokens: estimateTokens(userMessage),
    outputTokens: estimateTokens(randomResponse)
  };
}

export async function POST(request: NextRequest) {
  try {
    const { userId, message, conversationId } = await request.json();

    if (!userId || !message) {
      return NextResponse.json(
        { error: '사용자 ID와 메시지가 필요합니다.' },
        { status: 400 }
      );
    }

    // 1. 토큰 사용량 확인
    const tokenCheckResponse = await fetch(`${request.nextUrl.origin}/api/ai-chat/tokens?userId=${userId}`);
    const tokenData = await tokenCheckResponse.json();
    
    if (!tokenData.success) {
      return NextResponse.json(
        { error: '토큰 사용량 확인에 실패했습니다.' },
        { status: 500 }
      );
    }

    // 2. 사용자 메시지 토큰 계산
    const userMessageTokens = estimateTokens(message);
    
    // 3. AI 응답 생성
    const conversationHistory = chatHistory.get(conversationId || userId) || [];
    const aiResponse = await generateAIResponse(message, conversationHistory);
    
    // 4. 총 토큰 사용량 계산
    const totalInputTokens = userMessageTokens;
    const totalOutputTokens = aiResponse.outputTokens;
    
    // 5. 토큰 사용 처리
    const tokenUsageResponse = await fetch(`${request.nextUrl.origin}/api/ai-chat/tokens`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        inputTokens: totalInputTokens,
        outputTokens: totalOutputTokens,
        model: 'gpt-4'
      })
    });
    
    const tokenUsageData = await tokenUsageResponse.json();
    
    if (!tokenUsageData.success) {
      if (tokenUsageData.code === 'INSUFFICIENT_TURNS') {
        return NextResponse.json(
          { 
            error: '무료 턴이 부족합니다. 크레딧을 구매하여 추가 사용하거나, 다음 달을 기다려주세요.',
            code: 'INSUFFICIENT_TURNS',
            required: Math.ceil((totalInputTokens + totalOutputTokens) / 300),
            available: tokenData.data.remainingTurns,
            monthlyFreeTurns: tokenData.data.monthlyFreeTurns
          },
          { status: 402 }
        );
      }
      if (tokenUsageData.code === 'INSUFFICIENT_TOKENS') {
        return NextResponse.json(
          { 
            error: '토큰이 부족합니다.',
            code: 'INSUFFICIENT_TOKENS',
            required: totalInputTokens + totalOutputTokens,
            available: tokenData.data.remainingTokens,
            extensionTokensFor50Credits: tokenData.data.extensionTokensFor50Credits,
            extensionTurnsFor50Credits: tokenData.data.extensionTurnsFor50Credits
          },
          { status: 402 }
        );
      }
      return NextResponse.json(
        { error: '토큰 사용 처리에 실패했습니다.' },
        { status: 500 }
      );
    }

    // 6. 대화 기록 저장
    const newConversationId = conversationId || `conv_${Date.now()}`;
    const userMessage = {
      id: `msg_${Date.now()}_user`,
      role: 'user' as const,
      content: message,
      timestamp: new Date().toISOString(),
      tokens: totalInputTokens
    };
    
    const assistantMessage = {
      id: `msg_${Date.now()}_assistant`,
      role: 'assistant' as const,
      content: aiResponse.content,
      timestamp: new Date().toISOString(),
      tokens: totalOutputTokens
    };
    
    const updatedHistory = [...conversationHistory, userMessage, assistantMessage];
    chatHistory.set(newConversationId, updatedHistory);

    // 7. 응답 반환
    return NextResponse.json({
      success: true,
      data: {
        response: aiResponse.content,
        conversationId: newConversationId,
        usage: {
          inputTokens: totalInputTokens,
          outputTokens: totalOutputTokens,
          totalTokens: totalInputTokens + totalOutputTokens,
          remainingTokens: tokenUsageData.data.remainingTokens,
          remainingTurns: tokenUsageData.data.remainingTurns,
          estimatedCost: tokenUsageData.data.estimatedCost
        },
        message: 'AI 응답이 성공적으로 생성되었습니다.'
      }
    });

  } catch (error) {
    console.error('AI 채팅 처리 오류:', error);
    return NextResponse.json(
      { error: 'AI 채팅 처리에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 대화 기록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');
    const userId = searchParams.get('userId');

    if (!conversationId && !userId) {
      return NextResponse.json(
        { error: '대화 ID 또는 사용자 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const id = conversationId || userId;
    if (!id) {
      return NextResponse.json(
        { error: '대화 ID 또는 사용자 ID가 필요합니다.' },
        { status: 400 }
      );
    }
    
    const history = chatHistory.get(id) || [];

    return NextResponse.json({
      success: true,
      data: {
        conversationId: conversationId || userId,
        messages: history,
        totalMessages: history.length
      }
    });

  } catch (error) {
    console.error('대화 기록 조회 오류:', error);
    return NextResponse.json(
      { error: '대화 기록 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}
