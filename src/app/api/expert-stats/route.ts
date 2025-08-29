import { NextRequest, NextResponse } from 'next/server';

interface ExpertStats {
  expertId: string;
  totalSessions: number;
  waitingClients: number;
  repeatClients: number;
  avgRating: number;
  reviewCount: number;
  likeCount: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  lastUpdated: string;
  // 랭킹 관련 필드 추가
  ranking?: number;
  rankingScore?: number;
  totalExperts?: number;
  // 분야별 랭킹 필드 추가
  specialtyRanking?: number;
  specialtyTotalExperts?: number;
  specialty?: string;
}

// 메모리 기반 저장 (실제 프로덕션에서는 데이터베이스 사용)
let expertStats: ExpertStats[] = [];

// 랭킹 점수 계산 함수 (3자리 점수 체계)
const calculateRankingScore = (stats: ExpertStats): number => {
  // 1. 상담 횟수 (40% 가중치) - 3자리 점수 체계에 맞게 조정
  const sessionScore = Math.min(stats.totalSessions / 100, 1) * 400;
  
  // 2. 평점 (30% 가중치) - 3자리 점수 체계에 맞게 조정
  const ratingScore = (stats.avgRating / 5) * 300;
  
  // 3. 리뷰 수 (15% 가중치) - 3자리 점수 체계에 맞게 조정
  const reviewScore = Math.min(stats.reviewCount / 50, 1) * 150;
  
  // 4. 재방문 고객 비율 (10% 가중치) - 3자리 점수 체계에 맞게 조정
  const repeatRate = stats.totalSessions > 0 ? stats.repeatClients / stats.totalSessions : 0;
  const repeatScore = repeatRate * 100;
  
  // 5. 좋아요 수 (5% 가중치) - 3자리 점수 체계에 맞게 조정
  const likeScore = Math.min(stats.likeCount / 100, 1) * 50;
  
  return Math.round((sessionScore + ratingScore + reviewScore + repeatScore + likeScore) * 100) / 100;
};

// 전체 랭킹 계산 및 업데이트
const updateAllRankings = async () => {
  // 모든 전문가의 랭킹 점수 계산
  const expertsWithScores = expertStats.map(stats => ({
    ...stats,
    rankingScore: calculateRankingScore(stats)
  }));
  
  // 랭킹 점수로 정렬 (높은 순)
  expertsWithScores.sort((a, b) => (b.rankingScore || 0) - (a.rankingScore || 0));
  
  // 랭킹 부여
  const totalExperts = expertsWithScores.length;
  expertsWithScores.forEach((expert, index) => {
    expert.ranking = index + 1;
    expert.totalExperts = totalExperts;
  });
  
  // 원본 배열 업데이트
  expertStats = expertsWithScores;
  
  // 레벨 API에 랭킹점수 업데이트 요청
  try {
    const expertsForLevelUpdate = expertsWithScores.map(expert => ({
      expertId: expert.expertId,
      rankingScore: expert.rankingScore || 0
    }));
    
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/expert-levels`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'bulkUpdate',
        experts: expertsForLevelUpdate
      })
    });
  } catch (error) {
    console.error('레벨 업데이트 실패:', error);
  }
};

// 분야별 랭킹 계산 및 업데이트
const updateSpecialtyRankings = (specialty: string) => {
  // 해당 분야의 전문가들만 필터링
  const specialtyExperts = expertStats.filter(stats => {
    // 실제로는 전문가 프로필 정보가 필요하므로 임시로 ID 기반으로 처리
    return stats.expertId;
  });
  
  // 랭킹 점수로 정렬 (높은 순)
  const sortedExperts = specialtyExperts.sort((a, b) => (b.rankingScore || 0) - (a.rankingScore || 0));
  
  // 분야별 랭킹 부여
  sortedExperts.forEach((expert, index) => {
    expert.specialtyRanking = index + 1;
    expert.specialtyTotalExperts = sortedExperts.length;
  });
};

// 동적으로 통계 생성하는 함수
const generateDefaultStats = (expertId: string): ExpertStats | null => {
  try {
    const id = parseInt(expertId);
    if (isNaN(id) || id < 1) return null;
    
    // ID 기반으로 현실적인 통계 생성
    const baseRating = 4.5 + (Math.random() * 0.4); // 4.5 ~ 4.9
    const baseSessions = 50 + (id * 10) + (Math.random() * 50); // ID 기반 증가
    const reviewCount = Math.floor(baseSessions * 0.8); // 상담의 80%가 리뷰
    const avgRating = Math.round(baseRating * 10) / 10;
    
    // 분야 정보 추가 (더미 데이터)
    const specialties = ['심리상담', '법률상담', '경영상담', '건강상담', '교육상담'];
    const specialty = specialties[id % specialties.length];
    
    // 별점 분포 계산
    const rating5 = Math.floor(reviewCount * 0.75); // 75%가 5점
    const rating4 = Math.floor(reviewCount * 0.2);  // 20%가 4점
    const rating3 = Math.floor(reviewCount * 0.04); // 4%가 3점
    const rating2 = Math.floor(reviewCount * 0.01); // 1%가 2점
    const rating1 = 0; // 1점은 없음
    
    const stats: ExpertStats = {
      expertId,
      totalSessions: Math.floor(baseSessions),
      waitingClients: Math.floor(Math.random() * 5) + 1,
      repeatClients: Math.floor(baseSessions * 0.3),
      avgRating,
      reviewCount,
      likeCount: Math.floor(reviewCount * 0.8),
      specialty, // 분야 정보 추가
      ratingDistribution: {
        5: rating5,
        4: rating4,
        3: rating3,
        2: rating2,
        1: rating1
      },
      lastUpdated: new Date().toISOString(),
      rankingScore: 0 // 초기값 설정
    };
    
    // 랭킹 점수 계산
    stats.rankingScore = calculateRankingScore(stats);
    
    return stats;
  } catch (error) {
    console.error('기본 통계 생성 오류:', error);
    return null;
  }
};

// 더미 데이터 초기화 (프로덕션에서는 사용하지 않음)
const initializeDummyStats = () => {
  // 프로덕션 환경에서는 데이터베이스에서 데이터를 가져옴
  // 개발/테스트 환경에서만 더미데이터 사용
  if (expertStats.length === 0) {
    // 개발용 더미데이터 생성
    for (let i = 1; i <= 25; i++) {
      const stats = generateDefaultStats(i.toString());
      if (stats) {
        expertStats.push(stats);
      }
    }
    console.log(`${expertStats.length}개의 더미 전문가 통계 데이터가 생성되었습니다.`);
  }
};

// GET: 전문가 통계 정보 조회
export async function GET(request: NextRequest) {
  try {
    initializeDummyStats();
    
    const { searchParams } = new URL(request.url);
    const expertId = searchParams.get('expertId');
    const includeRanking = searchParams.get('includeRanking') === 'true';
    const rankingType = searchParams.get('rankingType'); // 'overall' 또는 'specialty'

    if (expertId) {
      // 특정 전문가 통계 조회
      let stats = expertStats.find(stat => stat.expertId === expertId);
      
      // 더미데이터에 없는 전문가인 경우 동적으로 생성
      if (!stats) {
        const newStats = generateDefaultStats(expertId);
        if (newStats) {
          stats = newStats;
          expertStats.push(newStats);
          // 랭킹 업데이트
          await updateAllRankings();
        }
      }
      
      if (!stats) {
        return NextResponse.json(
          { success: false, error: '전문가 통계를 찾을 수 없습니다.' },
          { status: 404 }
        );
      }
      
      // 랭킹 정보가 요청된 경우 업데이트
      if (includeRanking && expertStats.length > 0) {
        await updateAllRankings();
        // 업데이트된 랭킹 정보로 다시 찾기
        stats = expertStats.find(stat => stat.expertId === expertId);
      }
      
      return NextResponse.json({
        success: true,
        data: stats
      });
    } else if (rankingType === 'overall') {
      // 전체 랭킹 조회
      if (expertStats.length > 0) {
        await updateAllRankings();
      }
      
      // 전체 랭킹 반환 (상위 제한 없음)
      const allRankings = expertStats
        .sort((a, b) => (b.rankingScore || 0) - (a.rankingScore || 0));
      
      return NextResponse.json({
        success: true,
        data: {
          rankings: allRankings,
          total: expertStats.length
        }
      });
    } else if (rankingType === 'specialty') {
      // 분야별 랭킹 조회
      const specialty = searchParams.get('specialty');
      if (!specialty) {
        return NextResponse.json(
          { success: false, error: '분야 정보가 필요합니다.' },
          { status: 400 }
        );
      }
      
      if (expertStats.length > 0) {
        await updateAllRankings();
      }
      
      // 해당 분야의 전문가들만 필터링하여 랭킹 생성
      const specialtyRankings = expertStats
        .filter(stat => stat.specialty === specialty)
        .sort((a, b) => (b.rankingScore || 0) - (a.rankingScore || 0))
        .map((stat, index) => ({
          ...stat,
          specialtyRanking: index + 1,
          specialtyTotalExperts: expertStats.filter(s => s.specialty === specialty).length
        }));
      
      return NextResponse.json({
        success: true,
        data: {
          rankings: specialtyRankings,
          total: specialtyRankings.length,
          specialty: specialty
        }
      });
    } else {
      // 모든 전문가 통계 조회
      // 랭킹 정보 포함하여 반환
      if (expertStats.length > 0) {
        await updateAllRankings();
      }
      
      return NextResponse.json({
        success: true,
        data: {
          stats: expertStats,
          total: expertStats.length
        }
      });
    }
  } catch (error) {
    console.error('전문가 통계 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '전문가 통계 조회 실패' },
      { status: 500 }
    );
  }
}

// POST: 새로운 전문가 통계 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 초기화 요청인 경우
    if (body.action === 'initializeStats') {
      initializeDummyStats();
      return NextResponse.json({
        success: true,
        message: '더미 통계 데이터가 초기화되었습니다.',
        count: expertStats.length
      });
    }
    
    const newStats: ExpertStats = {
      expertId: body.expertId,
      totalSessions: body.totalSessions || 0,
      waitingClients: body.waitingClients || 0,
      repeatClients: body.repeatClients || 0,
      avgRating: body.avgRating || 0,
      reviewCount: body.reviewCount || 0,
      likeCount: body.likeCount || 0,
      ratingDistribution: body.ratingDistribution || {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0
      },
      lastUpdated: new Date().toISOString()
    };

    // 중복 체크
    const existingStats = expertStats.find(stat => stat.expertId === body.expertId);
    if (existingStats) {
      return NextResponse.json(
        { success: false, error: '이미 존재하는 전문가 통계입니다.' },
        { status: 400 }
      );
    }

    expertStats.push(newStats);

    return NextResponse.json({
      success: true,
      data: newStats,
      message: '전문가 통계가 성공적으로 생성되었습니다.'
    });
  } catch (error) {
    console.error('전문가 통계 생성 오류:', error);
    return NextResponse.json(
      { success: false, error: '전문가 통계 생성 실패' },
      { status: 500 }
    );
  }
}

// PATCH: 전문가 통계 업데이트
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { expertId, ...updateData } = body;

    const statsIndex = expertStats.findIndex(stat => stat.expertId === expertId);
    if (statsIndex === -1) {
      return NextResponse.json(
        { success: false, error: '전문가 통계를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    expertStats[statsIndex] = {
      ...expertStats[statsIndex],
      ...updateData,
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: expertStats[statsIndex],
      message: '전문가 통계가 성공적으로 업데이트되었습니다.'
    });
  } catch (error) {
    console.error('전문가 통계 업데이트 오류:', error);
    return NextResponse.json(
      { success: false, error: '전문가 통계 업데이트 실패' },
      { status: 500 }
    );
  }
}

// DELETE: 전문가 통계 삭제
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const expertId = searchParams.get('expertId');

    if (!expertId) {
      return NextResponse.json(
        { success: false, error: '전문가 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const statsIndex = expertStats.findIndex(stat => stat.expertId === expertId);
    if (statsIndex === -1) {
      return NextResponse.json(
        { success: false, error: '전문가 통계를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const deletedStats = expertStats.splice(statsIndex, 1)[0];

    return NextResponse.json({
      success: true,
      data: deletedStats,
      message: '전문가 통계가 성공적으로 삭제되었습니다.'
    });
  } catch (error) {
    console.error('전문가 통계 삭제 오류:', error);
    return NextResponse.json(
      { success: false, error: '전문가 통계 삭제 실패' },
      { status: 500 }
    );
  }
}
