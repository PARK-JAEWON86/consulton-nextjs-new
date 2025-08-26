import { NextRequest, NextResponse } from 'next/server';

// 더미 데이터 (실제로는 데이터베이스에서 가져와야 함)
import { getUserCreditTransactions } from '@/data/dummy/payment';

// GET: 사용자의 현재 크레딧 잔액 조회
export async function GET(request: NextRequest) {
  try {
    // 인증 확인
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    
    // 사용자의 크레딧 거래 내역 조회
    const userCreditTransactions = getUserCreditTransactions(userId);
    
    // 현재 잔액 계산
    const currentBalance = userCreditTransactions.length > 0 
      ? userCreditTransactions[userCreditTransactions.length - 1].balance 
      : 0;
    
    // 최근 거래 내역 (최근 5건)
    const recentTransactions = userCreditTransactions
      .slice(0, 5)
      .map(transaction => ({
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
        createdAt: transaction.createdAt
      }));
    
    // 통계 정보 계산
    const totalEarned = userCreditTransactions
      .filter(transaction => transaction.type === 'earn')
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    
    const totalSpent = userCreditTransactions
      .filter(transaction => transaction.type === 'spend')
      .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
    
    const totalRefunded = userCreditTransactions
      .filter(transaction => transaction.type === 'refund')
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    
    return NextResponse.json({
      success: true,
      data: {
        currentBalance,
        recentTransactions,
        summary: {
          totalEarned,
          totalSpent,
          totalRefunded,
          totalTransactions: userCreditTransactions.length
        }
      }
    });

  } catch (error) {
    console.error('크레딧 잔액 조회 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
