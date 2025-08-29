import { NextRequest, NextResponse } from 'next/server';

// 인기 카테고리 통계 인터페이스
interface PopularCategoryStats {
  categoryId: string;
  categoryName: string;
  consultationCount: number;
  reviewCount: number;
  bookingCount: number;
  totalScore: number;
  rank: number;
}

// 임시 인기 카테고리 통계 데이터 (실제로는 데이터베이스에서 계산)
let popularCategoryStats: PopularCategoryStats[] = [
  {
    categoryId: "psychology",
    categoryName: "심리상담",
    consultationCount: 1250,
    reviewCount: 890,
    bookingCount: 980,
    totalScore: 3120,
    rank: 1
  },
  {
    categoryId: "legal",
    categoryName: "법률상담",
    consultationCount: 980,
    reviewCount: 720,
    bookingCount: 850,
    totalScore: 2550,
    rank: 2
  },
  {
    categoryId: "finance",
    categoryName: "재무상담",
    consultationCount: 850,
    reviewCount: 650,
    bookingCount: 720,
    totalScore: 2220,
    rank: 3
  },
  {
    categoryId: "career",
    categoryName: "진로상담",
    consultationCount: 720,
    reviewCount: 580,
    bookingCount: 650,
    totalScore: 1950,
    rank: 4
  },
  {
    categoryId: "health",
    categoryName: "건강상담",
    consultationCount: 680,
    reviewCount: 520,
    bookingCount: 580,
    totalScore: 1780,
    rank: 5
  },
  {
    categoryId: "education",
    categoryName: "교육상담",
    consultationCount: 620,
    reviewCount: 480,
    bookingCount: 520,
    totalScore: 1620,
    rank: 6
  },
  {
    categoryId: "real-estate",
    categoryName: "부동산상담",
    consultationCount: 580,
    reviewCount: 450,
    bookingCount: 480,
    totalScore: 1510,
    rank: 7
  },
  {
    categoryId: "technology",
    categoryName: "IT상담",
    consultationCount: 520,
    reviewCount: 420,
    bookingCount: 450,
    totalScore: 1390,
    rank: 8
  },
  {
    categoryId: "business",
    categoryName: "창업상담",
    consultationCount: 480,
    reviewCount: 380,
    bookingCount: 420,
    totalScore: 1280,
    rank: 9
  },
  {
    categoryId: "design",
    categoryName: "디자인상담",
    consultationCount: 450,
    reviewCount: 350,
    bookingCount: 380,
    totalScore: 1180,
    rank: 10
  }
];

// GET: 인기 카테고리 통계 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'totalScore';
    
    let sortedStats = [...popularCategoryStats];
    
    // 정렬 기준에 따라 정렬
    switch (sortBy) {
      case 'consultationCount':
        sortedStats.sort((a, b) => b.consultationCount - a.consultationCount);
        break;
      case 'reviewCount':
        sortedStats.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'bookingCount':
        sortedStats.sort((a, b) => b.bookingCount - a.bookingCount);
        break;
      case 'totalScore':
      default:
        sortedStats.sort((a, b) => b.totalScore - a.totalScore);
        break;
    }
    
    // limit만큼 반환
    const limitedStats = sortedStats.slice(0, limit);
    
    return NextResponse.json({
      success: true,
      data: limitedStats,
      total: limitedStats.length,
      sortBy,
      limit
    });
  } catch (error) {
    console.error('인기 카테고리 통계 조회 실패:', error);
    return NextResponse.json(
      { success: false, message: '인기 카테고리 통계 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// POST: 인기 카테고리 통계 업데이트
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, stats } = body;
    
    if (action === 'updateStats') {
      // 특정 카테고리의 통계 업데이트
      const { categoryId, consultationCount, reviewCount, bookingCount } = stats;
      
      const existingIndex = popularCategoryStats.findIndex(
        stat => stat.categoryId === categoryId
      );
      
      if (existingIndex !== -1) {
        // 기존 통계 업데이트
        const updatedStats = {
          ...popularCategoryStats[existingIndex],
          consultationCount: consultationCount || popularCategoryStats[existingIndex].consultationCount,
          reviewCount: reviewCount || popularCategoryStats[existingIndex].reviewCount,
          bookingCount: bookingCount || popularCategoryStats[existingIndex].bookingCount,
          totalScore: (consultationCount || popularCategoryStats[existingIndex].consultationCount) +
                     (reviewCount || popularCategoryStats[existingIndex].reviewCount) +
                     (bookingCount || popularCategoryStats[existingIndex].bookingCount)
        };
        
        popularCategoryStats[existingIndex] = updatedStats;
        
        // 전체 점수로 재정렬
        popularCategoryStats.sort((a, b) => b.totalScore - a.totalScore);
        
        // 순위 업데이트
        popularCategoryStats.forEach((stat, index) => {
          stat.rank = index + 1;
        });
        
        return NextResponse.json({
          success: true,
          message: '카테고리 통계가 성공적으로 업데이트되었습니다.',
          data: updatedStats
        });
      } else {
        return NextResponse.json(
          { success: false, message: '존재하지 않는 카테고리입니다.' },
          { status: 404 }
        );
      }
    } else if (action === 'recalculateAll') {
      // 모든 카테고리의 통계를 재계산 (실제 구현에서는 데이터베이스 쿼리)
      // 여기서는 임시로 랜덤 값으로 업데이트
      popularCategoryStats.forEach(stat => {
        stat.consultationCount = Math.floor(Math.random() * 1000) + 100;
        stat.reviewCount = Math.floor(Math.random() * 800) + 50;
        stat.bookingCount = Math.floor(Math.random() * 900) + 100;
        stat.totalScore = stat.consultationCount + stat.reviewCount + stat.bookingCount;
      });
      
      // 전체 점수로 재정렬
      popularCategoryStats.sort((a, b) => b.totalScore - a.totalScore);
      
      // 순위 업데이트
      popularCategoryStats.forEach((stat, index) => {
        stat.rank = index + 1;
      });
      
      return NextResponse.json({
        success: true,
        message: '모든 카테고리 통계가 재계산되었습니다.',
        data: popularCategoryStats
      });
    } else {
      return NextResponse.json(
        { success: false, message: '잘못된 액션입니다.' },
        { status: 400 }
      );
    }
    
  } catch (error) {
    console.error('인기 카테고리 통계 업데이트 실패:', error);
    return NextResponse.json(
      { success: false, message: '인기 카테고리 통계 업데이트에 실패했습니다.' },
      { status: 500 }
    );
  }
}
