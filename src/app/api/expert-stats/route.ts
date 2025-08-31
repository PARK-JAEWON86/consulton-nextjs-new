import { NextRequest, NextResponse } from 'next/server';
import { dummyExpertStats, getStatsByExpertId, getStatsBySpecialty, getOverallStats, calculateRankingScore, updateAllRankingScores } from '@/data/dummy/expert-stats';

// ExpertStats 인터페이스 정의
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
  specialty: string;
  lastUpdated: string;
  // 랭킹 관련 필드
  ranking?: number;
  rankingScore?: number;
  totalExperts?: number;
  level?: number;
  tierInfo?: any;
  // 분야별 랭킹 필드
  specialtyRanking?: number;
  specialtyTotalExperts?: number;
}

// 더미데이터 사용 (실제 프로덕션에서는 데이터베이스 사용)
let expertStats: ExpertStats[] = [...dummyExpertStats];

// 더미데이터의 calculateRankingScore 함수 사용

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
  
  // 각 전문가의 레벨 계산 (expert-levels API의 로직 사용)
  expertsWithScores.forEach(expert => {
    const rankingScore = expert.rankingScore || 0;
    
    // 랭킹 점수 기반으로 레벨 계산 (더 정확한 분산)
    let level = 1;
    if (rankingScore >= 950) level = 999; // Legend
    else if (rankingScore >= 900) level = 900 + Math.floor((rankingScore - 900) / 10);
    else if (rankingScore >= 850) level = 800 + Math.floor((rankingScore - 850) / 8);
    else if (rankingScore >= 800) level = 700 + Math.floor((rankingScore - 800) / 6);
    else if (rankingScore >= 750) level = 600 + Math.floor((rankingScore - 750) / 5);
    else if (rankingScore >= 700) level = 500 + Math.floor((rankingScore - 700) / 4);
    else if (rankingScore >= 650) level = 400 + Math.floor((rankingScore - 650) / 3);
    else if (rankingScore >= 600) level = 300 + Math.floor((rankingScore - 600) / 2);
    else if (rankingScore >= 550) level = 200 + Math.floor((rankingScore - 550) / 1.5);
    else if (rankingScore >= 500) level = 100 + Math.floor((rankingScore - 500) / 3); // 3으로 나누어 더 세밀한 분산
    else if (rankingScore >= 400) level = 50 + Math.floor((rankingScore - 400) / 2); // 400-499: 50-99 레벨
    else if (rankingScore >= 300) level = 25 + Math.floor((rankingScore - 300) / 2); // 300-399: 25-74 레벨
    else if (rankingScore >= 200) level = 10 + Math.floor((rankingScore - 200) / 2); // 200-299: 10-59 레벨
    else if (rankingScore >= 100) level = 5 + Math.floor((rankingScore - 100) / 2);  // 100-199: 5-54 레벨
    else level = Math.max(1, Math.floor(rankingScore / 10)); // 1-99: 1-9 레벨
    
    // 레벨을 999로 제한
    level = Math.min(999, level);
    
    expert.level = level;
    
    // 티어 정보도 계산
    if (level >= 950) expert.tierInfo = { name: "Legend (전설)", creditsPerMinute: 600 };
    else if (level >= 900) expert.tierInfo = { name: "Grand Master (그랜드마스터)", creditsPerMinute: 500 };
    else if (level >= 850) expert.tierInfo = { name: "Master (마스터)", creditsPerMinute: 500 };
    else if (level >= 800) expert.tierInfo = { name: "Expert (전문가)", creditsPerMinute: 450 };
    else if (level >= 750) expert.tierInfo = { name: "Senior (시니어)", creditsPerMinute: 400 };
    else if (level >= 700) expert.tierInfo = { name: "Professional (프로페셔널)", creditsPerMinute: 350 };
    else if (level >= 650) expert.tierInfo = { name: "Skilled (숙련)", creditsPerMinute: 300 };
    else if (level >= 600) expert.tierInfo = { name: "Core (핵심)", creditsPerMinute: 250 };
    else if (level >= 550) expert.tierInfo = { name: "Rising Star (신성)", creditsPerMinute: 200 };
    else if (level >= 500) expert.tierInfo = { name: "Emerging Talent (신진)", creditsPerMinute: 150 };
    else expert.tierInfo = { name: "Fresh Mind (신예)", creditsPerMinute: 100 };
  });
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

// 더미데이터에서 통계 조회하는 함수
const getStatsFromDummy = (expertId: string): ExpertStats | null => {
  return getStatsByExpertId(expertId) || null;
};

  // 더미 데이터 초기화 (프로덕션에서는 사용하지 않음)
  const initializeDummyStats = () => {
    // 더미데이터가 이미 로드되어 있음
    if (expertStats.length === 0) {
      expertStats = [...dummyExpertStats];
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
      
      // 더미데이터에 없는 전문가인 경우 더미데이터에서 조회
      if (!stats) {
        const newStats = getStatsFromDummy(expertId);
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
    } else if (rankingType === 'tier') {
      // 레벨 티어별 랭킹 조회
      if (expertStats.length > 0) {
        await updateAllRankings();
      }
      
      // 모든 전문가의 랭킹 정보 반환 (프론트엔드에서 필터링)
      const allRankings = expertStats
        .sort((a, b) => (b.rankingScore || 0) - (a.rankingScore || 0));
      
      return NextResponse.json({
        success: true,
        data: {
          rankings: allRankings,
          total: expertStats.length,
          type: 'tier'
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
        message: '더미 통계 데이터가 로드되었습니다.',
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
      specialty: body.specialty || '일반상담',
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
