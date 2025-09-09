import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/db/init';
import { Expert, User, ExpertProfile as ExpertProfileModel } from '@/lib/db/models';
import { calculateRankingScore } from '@/utils/rankingCalculator';
import { getTierInfo } from '@/utils/expertLevels';
import { Op } from 'sequelize';

/**
 * 전문가 랭킹 목록 API
 * 랭킹 페이지에서 사용
 */
export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();
    
    const { searchParams } = new URL(request.url);
    const rankingType = searchParams.get('rankingType') || 'overall';
    const specialty = searchParams.get('specialty');
    const limit = parseInt(searchParams.get('limit') || '50');
    
    // 기본 조건
    const whereClause: any = {
      isProfilePublic: true
    };
    
    // 분야별 필터링
    if (specialty && rankingType === 'specialty') {
      whereClause.specialty = specialty;
    }
    
    // 전문가 목록 조회
    const experts = await Expert.findAll({
      where: whereClause,
      attributes: [
        'id', 'userId', 'specialty', 'experience', 'rating', 'reviewCount', 
        'totalSessions', 'avgRating', 'completionRate', 'responseTime', 
        'isOnline', 'isProfileComplete', 'isProfilePublic', 'location', 
        'timeZone', 'languages', 'consultationTypes', 'hourlyRate', 
        'pricePerMinute', 'profileViews', 'lastActiveAt', 'joinedAt', 
        'level', 'rankingScore', 'likeCount', 'createdAt', 'updatedAt'
      ],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: ExpertProfileModel,
          as: 'profile',
          required: false
        }
      ],
      limit,
      order: [
        ['avgRating', 'DESC'],
        ['totalSessions', 'DESC'],
        ['reviewCount', 'DESC']
      ]
    });
    
    // 랭킹 데이터 생성
    const rankings = experts.map((expert, index) => {
      // 랭킹 점수 계산
      const rankingScore = calculateRankingScore({
        totalSessions: expert.totalSessions || 0,
        avgRating: expert.avgRating || 0,
        reviewCount: expert.reviewCount || 0,
        repeatClients: 0,
        likeCount: expert.likeCount || 0 // 실제 좋아요 수 사용
      });
      
      // 티어 정보
      const tierInfo = getTierInfo(expert.level || 1);
      
      return {
        expertId: expert.id.toString(),
        expertName: expert.user?.name || expert.profile?.fullName || 'Unknown',
        specialty: expert.specialty,
        
        // 기본 통계
        totalSessions: expert.totalSessions || 0,
        avgRating: expert.avgRating || 0,
        reviewCount: expert.reviewCount || 0,
        likeCount: expert.likeCount || 0, // 실제 좋아요 수
        
        // 레벨 및 랭킹
        level: expert.level || 1,
        rankingScore: expert.rankingScore || Math.round(rankingScore * 100) / 100, // DB에 저장된 값 우선 사용
        tierInfo,
        ranking: index + 1,
        
        // 분야별 랭킹 (specialty 타입일 때만 의미있음)
        specialtyRanking: rankingType === 'specialty' ? index + 1 : undefined,
        specialtyTotalExperts: rankingType === 'specialty' ? experts.length : undefined,
        
        // 추가 정보
        experience: expert.experience || 0,
        responseTime: expert.responseTime || '2시간 내',
        completionRate: expert.completionRate || 95,
        isOnline: expert.isOnline || false,
        
        // 프로필 정보
        profileImage: expert.profile?.profileImage || null,
        location: expert.location || '',
        
        // 가격 정보
        pricePerMinute: expert.pricePerMinute || 0,
        hourlyRate: expert.hourlyRate || 0
      };
    });
    
    // 타입별 정렬
    let sortedRankings = [...rankings];
    
    switch (rankingType) {
      case 'rating':
        sortedRankings.sort((a, b) => b.avgRating - a.avgRating);
        break;
      case 'sessions':
        sortedRankings.sort((a, b) => b.totalSessions - a.totalSessions);
        break;
      case 'overall':
      case 'specialty':
      default:
        sortedRankings.sort((a, b) => b.rankingScore - a.rankingScore);
        break;
    }
    
    // 정렬 후 랭킹 번호 재할당
    sortedRankings.forEach((item, index) => {
      item.ranking = index + 1;
      if (rankingType === 'specialty') {
        item.specialtyRanking = index + 1;
      }
    });
    
    return NextResponse.json({
      success: true,
      data: {
        rankings: sortedRankings,
        total: sortedRankings.length,
        rankingType,
        specialty: specialty || null
      }
    });
    
  } catch (error) {
    console.error('전문가 랭킹 조회 실패:', error);
    console.error('에러 상세:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    return NextResponse.json(
      { 
        success: false, 
        message: '전문가 랭킹 조회에 실패했습니다.',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
