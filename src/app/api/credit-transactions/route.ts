import { NextRequest, NextResponse } from 'next/server';

// 크레딧 거래 내역 인터페이스
interface CreditTransaction {
  id: string;
  userId: string;
  type: 'earn' | 'spend' | 'refund' | 'expire';
  amount: number;
  balance: number;
  description: string;
  consultationId?: string;
  createdAt: string;
}

// 더미 데이터 (실제로는 데이터베이스에서 가져와야 함)
import { getUserCreditTransactions } from '@/data/dummy/payment';
import { userDataService } from '@/services/UserDataService';

// GET: 사용자의 크레딧 거래 내역 조회
export async function GET(request: NextRequest) {
  try {
    // 더미 사용자 데이터에서 김철수의 ID 가져오기
    const dummyUsers = userDataService.getAllUsers();
    const kimCheolsu = dummyUsers.find(user => user.name === "김철수");
    const userId = kimCheolsu?.id || 'user_001'; // 기본값으로 fallback
    
    const { searchParams } = new URL(request.url);
    
    // 쿼리 파라미터 처리
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const type = searchParams.get('type');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // 페이지네이션 제한
    const maxLimit = Math.min(limit, 100); // 최대 100건까지 조회 가능
    const offset = (page - 1) * maxLimit;
    
    // 사용자의 크레딧 거래 내역 조회
    let userCreditTransactions = getUserCreditTransactions(userId);
    
    // 필터링 적용
    if (type) {
      userCreditTransactions = userCreditTransactions.filter(transaction => transaction.type === type);
    }
    
    if (startDate) {
      userCreditTransactions = userCreditTransactions.filter(transaction => 
        new Date(transaction.createdAt) >= new Date(startDate)
      );
    }
    
    if (endDate) {
      userCreditTransactions = userCreditTransactions.filter(transaction => 
        new Date(transaction.createdAt) <= new Date(endDate)
      );
    }
    
    // 총 개수
    const totalCount = userCreditTransactions.length;
    
    // 페이지네이션 적용
    const paginatedTransactions = userCreditTransactions.slice(offset, offset + maxLimit);
    
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
    
    const currentBalance = userCreditTransactions.length > 0 
      ? userCreditTransactions[userCreditTransactions.length - 1].balance 
      : 0;
    
    return NextResponse.json({
      success: true,
      data: {
        transactions: paginatedTransactions,
        pagination: {
          page,
          limit: maxLimit,
          totalCount,
          totalPages: Math.ceil(totalCount / maxLimit)
        },
        summary: {
          currentBalance,
          totalEarned,
          totalSpent,
          totalRefunded,
          totalTransactions: totalCount
        }
      }
    });

  } catch (error) {
    console.error('크레딧 거래 내역 조회 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// POST: 새로운 크레딧 거래 내역 생성
export async function POST(request: NextRequest) {
  try {
    // 더미 사용자 데이터에서 김철수의 ID 가져오기
    const dummyUsers = userDataService.getAllUsers();
    const kimCheolsu = dummyUsers.find(user => user.name === "김철수");
    const userId = kimCheolsu?.id || 'user_001'; // 기본값으로 fallback
    
    const body = await request.json();
    
    // 입력 데이터 검증
    const { type, amount, description, consultationId } = body;
    
    if (!type || !amount || !description) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 타입 유효성 검사
    const validTypes = ['earn', 'spend', 'refund', 'expire'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: '유효하지 않은 거래 타입입니다.' },
        { status: 400 }
      );
    }

    // 금액 유효성 검사
    if (typeof amount !== 'number' || amount === 0) {
      return NextResponse.json(
        { error: '유효하지 않은 크레딧 양입니다.' },
        { status: 400 }
      );
    }

    // 타입별 금액 검증
    if (type === 'earn' && amount <= 0) {
      return NextResponse.json(
        { error: '적립 크레딧은 0보다 커야 합니다.' },
        { status: 400 }
      );
    }

    if (type === 'spend' && amount >= 0) {
      return NextResponse.json(
        { error: '사용 크레딧은 음수여야 합니다.' },
        { status: 400 }
      );
    }

    // 현재 잔액 계산 (실제로는 데이터베이스에서 가져와야 함)
    const userCreditTransactions = getUserCreditTransactions(userId);
    const currentBalance = userCreditTransactions.length > 0 
      ? userCreditTransactions[userCreditTransactions.length - 1].balance 
      : 0;
    
    const newBalance = currentBalance + amount;
    
    // 잔액 부족 검사
    if (newBalance < 0) {
      return NextResponse.json(
        { error: '크레딧이 부족합니다.' },
        { status: 400 }
      );
    }

    // 새로운 크레딧 거래 내역 생성
    const newCreditTransaction: CreditTransaction = {
      id: `ct_${Date.now()}`,
      userId,
      type,
      amount,
      balance: newBalance,
      description,
      consultationId,
      createdAt: new Date().toISOString()
    };

    // 실제로는 데이터베이스에 저장하고 크레딧 잔액 업데이트해야 함
    // await createCreditTransaction(newCreditTransaction);
    // await updateUserCredits(userId, newBalance);

    return NextResponse.json({
      success: true,
      data: newCreditTransaction,
      message: '크레딧 거래가 성공적으로 처리되었습니다.'
    }, { status: 201 });

  } catch (error) {
    console.error('크레딧 거래 생성 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}


