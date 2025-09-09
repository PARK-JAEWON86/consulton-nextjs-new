import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/db/init';
import { sequelize } from '@/lib/db/sequelize';
import { QueryTypes } from 'sequelize';
import { calculateRankingScore } from '@/utils/rankingCalculator';

/**
 * 전문가 통계 동기화 API
 * 실제 데이터를 기반으로 모든 통계를 정확하게 계산하고 업데이트합니다.
 */

// 랭킹 점수를 기반으로 레벨 계산
const calculateLevelByScore = (rankingScore: number = 0): number => {
  if (rankingScore >= 950) return 999; // 최고 레벨
  if (rankingScore >= 900) return Math.floor(900 + (rankingScore - 900) * 2);
  if (rankingScore >= 850) return Math.floor(800 + (rankingScore - 850) * 2);
  if (rankingScore >= 800) return Math.floor(700 + (rankingScore - 800) * 2);
  if (rankingScore >= 750) return Math.floor(600 + (rankingScore - 750) * 2);
  if (rankingScore >= 700) return Math.floor(500 + (rankingScore - 700) * 2);
  if (rankingScore >= 650) return Math.floor(400 + (rankingScore - 650) * 2);
  if (rankingScore >= 600) return Math.floor(300 + (rankingScore - 600) * 2);
  if (rankingScore >= 550) return Math.floor(200 + (rankingScore - 550) * 2);
  if (rankingScore >= 500) return Math.floor(100 + (rankingScore - 500) * 2);
  
  // 0-499점: 레벨 1-99
  return Math.max(1, Math.floor(rankingScore / 5) + 1);
};

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 전문가 통계 동기화 시작');
    
    await initializeDatabase();
    
    // 모든 전문가에 대해 실제 데이터 기반 통계 계산
    const result = await sequelize.query(`
      SELECT 
        e.id as expertId,
        e.specialty,
        -- 실제 리뷰 통계
        COALESCE(r.reviewCount, 0) as reviewCount,
        COALESCE(r.avgRating, 0) as avgRating,
        -- 실제 세션 통계  
        COALESCE(s.totalSessions, 0) as totalSessions,
        -- 기타 통계 (나중에 확장 가능)
        0 as repeatClients,
        0 as likeCount
      FROM experts e
      LEFT JOIN (
        SELECT 
          expertId,
          COUNT(*) as reviewCount,
          ROUND(AVG(rating), 2) as avgRating
        FROM reviews 
        WHERE isDeleted = 0 AND isPublic = 1
        GROUP BY expertId
      ) r ON e.id = r.expertId
      LEFT JOIN (
        SELECT 
          c.expertId,
          COUNT(*) as totalSessions
        FROM consultation_sessions cs
        JOIN consultations c ON cs.consultationId = c.id
        WHERE cs.status = 'completed'
        GROUP BY c.expertId
      ) s ON e.id = s.expertId
      WHERE e.isProfilePublic = 1
      ORDER BY e.id
    `, { type: QueryTypes.SELECT }) as Array<{
      expertId: number;
      specialty: string;
      reviewCount: number;
      avgRating: number;
      totalSessions: number;
      repeatClients: number;
      likeCount: number;
    }>;

    console.log(`📊 ${result.length}명의 전문가 통계 계산 중...`);

    // 각 전문가별로 랭킹 점수와 레벨 계산
    const updates = result.map(expert => {
      // 랭킹 점수 계산
      const rankingScore = calculateRankingScore({
        totalSessions: expert.totalSessions,
        avgRating: expert.avgRating,
        reviewCount: expert.reviewCount,
        repeatClients: expert.repeatClients,
        likeCount: expert.likeCount
      });

      // 레벨 계산
      const level = calculateLevelByScore(rankingScore);

      console.log(`👤 전문가 ${expert.expertId}: 세션${expert.totalSessions}, 평점${expert.avgRating}, 리뷰${expert.reviewCount} → 점수${rankingScore} → 레벨${level}`);

      return {
        expertId: expert.expertId,
        reviewCount: expert.reviewCount,
        avgRating: expert.avgRating,
        rating: expert.avgRating, // rating과 avgRating 동일하게 설정
        totalSessions: expert.totalSessions,
        level: level,
        rankingScore: rankingScore
      };
    });

    // 트랜잭션으로 모든 통계 업데이트
    await sequelize.transaction(async (transaction) => {
      for (const update of updates) {
        await sequelize.query(`
          UPDATE experts 
          SET 
            reviewCount = :reviewCount,
            avgRating = :avgRating,
            rating = :rating,
            totalSessions = :totalSessions,
            level = :level,
            updatedAt = NOW()
          WHERE id = :expertId
        `, {
          replacements: update,
          type: QueryTypes.UPDATE,
          transaction
        });
      }
    });

    console.log('✅ 모든 전문가 통계 동기화 완료');

    // 업데이트 결과 확인
    const verification = await sequelize.query(`
      SELECT 
        id, 
        totalSessions, 
        reviewCount, 
        avgRating, 
        level
      FROM experts 
      WHERE id <= 5
      ORDER BY id
    `, { type: QueryTypes.SELECT });

    return NextResponse.json({
      success: true,
      message: `${result.length}명의 전문가 통계가 실제 데이터로 동기화되었습니다.`,
      data: {
        updated: result.length,
        sample: verification
      }
    });

  } catch (error) {
    console.error('❌ 통계 동기화 실패:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: '통계 동기화에 실패했습니다.',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
