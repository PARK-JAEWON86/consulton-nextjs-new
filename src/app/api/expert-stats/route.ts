import { NextRequest, NextResponse } from 'next/server';
import { Expert, User, Consultation, Review } from '@/lib/db/models';
import { initializeDatabase } from '@/lib/db/init';
import { getAuthenticatedUser } from '@/lib/auth';
// import { dummyExpertStats, getStatsByExpertId, getStatsBySpecialty, getOverallStats, calculateRankingScore, updateAllRankingScores } from '@/data/dummy/expert-stats'; // 더미 데이터 제거

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
    await initializeDatabase();
    
    const { searchParams } = new URL(request.url);
    const expertId = searchParams.get('expertId');
    const includeRanking = searchParams.get('includeRanking') === 'true';
    const rankingType = searchParams.get('rankingType'); // 'overall' 또는 'specialty'

    if (expertId) {
      // 특정 전문가 통계 조회
      const expert = await Expert.findByPk(parseInt(expertId), {
        include: [
          {
            model: User,
            as: 'user',
            required: false,
            attributes: ['id', 'name', 'email']
          }
        ]
      });

      if (!expert) {
        return NextResponse.json(
          { success: false, message: '전문가를 찾을 수 없습니다.' },
          { status: 404 }
        );
      }

      // 해당 전문가의 상담 통계 조회
      const consultations = await Consultation.findAll({
        where: { expertId: parseInt(expertId) }
      });

      // 해당 전문가의 리뷰 통계 조회
      const reviews = await Review.findAll({
        where: { expertId: parseInt(expertId), isDeleted: false }
      });

      // 통계 계산
      const totalSessions = consultations.length;
      const completedSessions = consultations.filter(c => c.status === 'completed').length;
      const avgRating = reviews.length > 0 ? 
        reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
      
      // 평점 분포 계산
      const ratingDistribution = {
        5: reviews.filter(r => r.rating === 5).length,
        4: reviews.filter(r => r.rating === 4).length,
        3: reviews.filter(r => r.rating === 3).length,
        2: reviews.filter(r => r.rating === 2).length,
        1: reviews.filter(r => r.rating === 1).length
      };

      // 랭킹 점수 계산 (간단한 공식)
      const rankingScore = Math.round(
        (avgRating * 20) + // 평점 기반 (0-100)
        (totalSessions * 2) + // 상담 수 기반 (0-200)
        (completedSessions * 3) + // 완료된 상담 기반 (0-300)
        (reviews.length * 1) // 리뷰 수 기반 (0-100)
      );

      const stats: ExpertStats = {
        expertId: expert.id.toString(),
        totalSessions,
        waitingClients: consultations.filter(c => c.status === 'scheduled').length,
        repeatClients: 0, // TODO: 반복 클라이언트 계산 로직 구현
        avgRating: Math.round(avgRating * 100) / 100,
        reviewCount: reviews.length,
        likeCount: reviews.reduce((sum, review) => sum + review.helpfulCount, 0),
        ratingDistribution,
        specialty: expert.specialty || '일반',
        lastUpdated: new Date().toISOString(),
        rankingScore
      };

      // 랭킹 정보 포함 여부에 따라 응답 구성
      if (includeRanking) {
        // 전체 전문가와 비교하여 랭킹 계산
        const allExperts = await Expert.findAll();
        const allExpertStats = await Promise.all(
          allExperts.map(async (exp) => {
            const expConsultations = await Consultation.findAll({
              where: { expertId: exp.id }
            });
            const expReviews = await Review.findAll({
              where: { expertId: exp.id, isDeleted: false }
            });
            
            const expAvgRating = expReviews.length > 0 ? 
              expReviews.reduce((sum, review) => sum + review.rating, 0) / expReviews.length : 0;
            
            return {
              expertId: exp.id,
              score: Math.round(
                (expAvgRating * 20) +
                (expConsultations.length * 2) +
                (expConsultations.filter(c => c.status === 'completed').length * 3) +
                (expReviews.length * 1)
              )
            };
          })
        );

        // 랭킹 계산
        allExpertStats.sort((a, b) => b.score - a.score);
        const ranking = allExpertStats.findIndex(exp => exp.expertId === parseInt(expertId)) + 1;
        
        stats.ranking = ranking;
        stats.totalExperts = allExpertStats.length;
      }

      return NextResponse.json({
        success: true,
        data: stats
      });
    } else if (rankingType === 'overall') {
      // 전체 랭킹 조회
      const experts = await Expert.findAll({
        include: [
          {
            model: User,
            as: 'user',
            required: false,
            attributes: ['id', 'name', 'email']
          }
        ]
      });

      const allExpertStats = await Promise.all(
        experts.map(async (expert) => {
          const consultations = await Consultation.findAll({
            where: { expertId: expert.id }
          });
          const reviews = await Review.findAll({
            where: { expertId: expert.id, isDeleted: false }
          });

          const avgRating = reviews.length > 0 ? 
            reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;

          const rankingScore = Math.round(
            (avgRating * 20) +
            (consultations.length * 2) +
            (consultations.filter(c => c.status === 'completed').length * 3) +
            (reviews.length * 1)
          );

          return {
            expertId: expert.id.toString(),
            totalSessions: consultations.length,
            waitingClients: consultations.filter(c => c.status === 'scheduled').length,
            repeatClients: 0,
            avgRating: Math.round(avgRating * 100) / 100,
            reviewCount: reviews.length,
            likeCount: reviews.reduce((sum, review) => sum + review.helpfulCount, 0),
            ratingDistribution: {
              5: reviews.filter(r => r.rating === 5).length,
              4: reviews.filter(r => r.rating === 4).length,
              3: reviews.filter(r => r.rating === 3).length,
              2: reviews.filter(r => r.rating === 2).length,
              1: reviews.filter(r => r.rating === 1).length
            },
            specialty: expert.specialty || '일반',
            lastUpdated: new Date().toISOString(),
            rankingScore
          };
        })
      );

      // 랭킹 점수로 정렬
      allExpertStats.sort((a, b) => b.rankingScore - a.rankingScore);
      allExpertStats.forEach((stats, index) => {
        stats.ranking = index + 1;
        stats.totalExperts = allExpertStats.length;
      });
      
      return NextResponse.json({
        success: true,
        data: {
          rankings: allExpertStats,
          total: allExpertStats.length
        }
      });
    } else if (rankingType === 'specialty') {
      // 분야별 랭킹 조회
      const specialty = searchParams.get('specialty');
      if (!specialty) {
        return NextResponse.json(
          { success: false, message: '분야 정보가 필요합니다.' },
          { status: 400 }
        );
      }
      
      const experts = await Expert.findAll({
        where: { specialty },
        include: [
          {
            model: User,
            as: 'user',
            required: false,
            attributes: ['id', 'name', 'email']
          }
        ]
      });

      const specialtyExpertStats = await Promise.all(
        experts.map(async (expert) => {
          const consultations = await Consultation.findAll({
            where: { expertId: expert.id }
          });
          const reviews = await Review.findAll({
            where: { expertId: expert.id, isDeleted: false }
          });

          const avgRating = reviews.length > 0 ? 
            reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;

          const rankingScore = Math.round(
            (avgRating * 20) +
            (consultations.length * 2) +
            (consultations.filter(c => c.status === 'completed').length * 3) +
            (reviews.length * 1)
          );

          return {
            expertId: expert.id.toString(),
            totalSessions: consultations.length,
            waitingClients: consultations.filter(c => c.status === 'scheduled').length,
            repeatClients: 0,
            avgRating: Math.round(avgRating * 100) / 100,
            reviewCount: reviews.length,
            likeCount: reviews.reduce((sum, review) => sum + review.helpfulCount, 0),
            ratingDistribution: {
              5: reviews.filter(r => r.rating === 5).length,
              4: reviews.filter(r => r.rating === 4).length,
              3: reviews.filter(r => r.rating === 3).length,
              2: reviews.filter(r => r.rating === 2).length,
              1: reviews.filter(r => r.rating === 1).length
            },
            specialty: expert.specialty || '일반',
            lastUpdated: new Date().toISOString(),
            rankingScore
          };
        })
      );

      // 분야별 랭킹 점수로 정렬
      specialtyExpertStats.sort((a, b) => b.rankingScore - a.rankingScore);
      specialtyExpertStats.forEach((stats, index) => {
        stats.specialtyRanking = index + 1;
        stats.specialtyTotalExperts = specialtyExpertStats.length;
      });
      
      return NextResponse.json({
        success: true,
        data: {
          rankings: specialtyExpertStats,
          total: specialtyExpertStats.length,
          specialty: specialty
        }
      });
    } else {
      // 모든 전문가 통계 조회
      const experts = await Expert.findAll({
        include: [
          {
            model: User,
            as: 'user',
            required: false,
            attributes: ['id', 'name', 'email']
          }
        ]
      });

      const allExpertStats = await Promise.all(
        experts.map(async (expert) => {
          const consultations = await Consultation.findAll({
            where: { expertId: expert.id }
          });
          const reviews = await Review.findAll({
            where: { expertId: expert.id, isDeleted: false }
          });

          const avgRating = reviews.length > 0 ? 
            reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;

          const rankingScore = Math.round(
            (avgRating * 20) +
            (consultations.length * 2) +
            (consultations.filter(c => c.status === 'completed').length * 3) +
            (reviews.length * 1)
          );

          return {
            expertId: expert.id.toString(),
            totalSessions: consultations.length,
            waitingClients: consultations.filter(c => c.status === 'scheduled').length,
            repeatClients: 0,
            avgRating: Math.round(avgRating * 100) / 100,
            reviewCount: reviews.length,
            likeCount: reviews.reduce((sum, review) => sum + review.helpfulCount, 0),
            ratingDistribution: {
              5: reviews.filter(r => r.rating === 5).length,
              4: reviews.filter(r => r.rating === 4).length,
              3: reviews.filter(r => r.rating === 3).length,
              2: reviews.filter(r => r.rating === 2).length,
              1: reviews.filter(r => r.rating === 1).length
            },
            specialty: expert.specialty || '일반',
            lastUpdated: new Date().toISOString(),
            rankingScore
          };
        })
      );

      // 랭킹 정보 포함 여부에 따라 정렬 및 랭킹 부여
      if (includeRanking) {
        allExpertStats.sort((a, b) => b.rankingScore - a.rankingScore);
        allExpertStats.forEach((stats, index) => {
          stats.ranking = index + 1;
          stats.totalExperts = allExpertStats.length;
        });
      }
      
      return NextResponse.json({
        success: true,
        data: {
          stats: allExpertStats,
          total: allExpertStats.length
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

// POST: 전문가 통계 업데이트
export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // 초기화 요청인 경우
    if (body.action === 'initializeStats') {
      return NextResponse.json({
        success: true,
        message: '전문가 통계는 실시간으로 계산됩니다.',
        count: 0
      });
    }
    
    // 전문가 통계는 실시간으로 계산되므로 수동 생성은 불필요
    return NextResponse.json({
      success: true,
      message: '전문가 통계는 상담과 리뷰 데이터를 기반으로 실시간으로 계산됩니다.'
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
    await initializeDatabase();
    
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { expertId } = body;

    // 전문가 존재 확인
    const expert = await Expert.findByPk(parseInt(expertId));
    if (!expert) {
      return NextResponse.json(
        { success: false, message: '전문가를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 전문가 통계는 실시간으로 계산되므로 수동 업데이트는 불필요
    return NextResponse.json({
      success: true,
      message: '전문가 통계는 상담과 리뷰 데이터를 기반으로 실시간으로 계산됩니다.',
      lastUpdated: new Date().toISOString()
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
    await initializeDatabase();
    
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const expertId = searchParams.get('expertId');

    if (!expertId) {
      return NextResponse.json(
        { success: false, message: '전문가 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 전문가 통계는 실시간으로 계산되므로 삭제는 불필요
    return NextResponse.json({
      success: true,
      message: '전문가 통계는 실시간으로 계산되므로 삭제할 수 없습니다.'
    });
  } catch (error) {
    console.error('전문가 통계 삭제 오류:', error);
    return NextResponse.json(
      { success: false, error: '전문가 통계 삭제 실패' },
      { status: 500 }
    );
  }
}
