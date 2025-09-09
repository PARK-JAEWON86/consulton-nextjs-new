import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/db/init';
import { Expert, User, ExpertProfile as ExpertProfileModel } from '@/lib/db/models';
import { calculateRankingScore } from '@/utils/rankingCalculator';
import { getTierInfo } from '@/utils/expertLevels';

/**
 * 특정 전문가의 상세 통계 정보 조회 API
 * 랭킹 페이지와 프로필 상세 페이지에서 사용
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initializeDatabase();
    
    const expertId = parseInt(params.id);
    
    if (isNaN(expertId)) {
      return NextResponse.json(
        { success: false, message: '유효하지 않은 전문가 ID입니다.' },
        { status: 400 }
      );
    }
    
    // 전문가 기본 정보 조회
    const expert = await Expert.findByPk(expertId, {
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
      ]
    });
    
    if (!expert) {
      return NextResponse.json(
        { success: false, message: '전문가를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    // 랭킹 점수 계산
    const rankingScore = calculateRankingScore({
      totalSessions: expert.totalSessions || 0,
      avgRating: expert.avgRating || 0,
      reviewCount: expert.reviewCount || 0,
      repeatClients: 0,
      likeCount: 0
    });
    
    // 티어 정보 가져오기
    const tierInfo = getTierInfo(expert.level || 1);
    
    // 전체 전문가 수 조회 (랭킹 계산용)
    const totalExperts = await Expert.count({
      where: { isProfilePublic: true }
    });
    
    // 해당 전문가보다 높은 랭킹 점수를 가진 전문가 수 조회 (전체 랭킹)
    const { Op } = require('sequelize');
    const higherRankedCount = await Expert.count({
      where: { 
        isProfilePublic: true,
        rankingScore: { [Op.gt]: expert.rankingScore || 0 }
      }
    });
    
    const ranking = higherRankedCount + 1;
    
    // 분야별 랭킹도 계산
    const specialtyTotalExperts = await Expert.count({
      where: { 
        specialty: expert.specialty,
        isProfilePublic: true 
      }
    });
    
    const specialtyHigherRankedCount = await Expert.count({
      where: { 
        specialty: expert.specialty,
        isProfilePublic: true,
        rankingScore: { [Op.gt]: expert.rankingScore || 0 }
      }
    });
    
    const specialtyRanking = specialtyHigherRankedCount + 1;
    
    // 응답 데이터 구성
    const responseData = {
      expertId: expert.id,
      expertName: expert.user?.name || expert.profile?.fullName || 'Unknown',
      specialty: expert.specialty,
      
      // 기본 통계
      totalSessions: expert.totalSessions || 0,
      avgRating: expert.avgRating || 0,
      reviewCount: expert.reviewCount || 0,
      likeCount: expert.likeCount || 0, // 좋아요 수 추가
      
      // 레벨 및 랭킹
      level: expert.level || 1,
      rankingScore: expert.rankingScore || Math.round(rankingScore * 100) / 100, // DB에 저장된 값 우선 사용
      tierInfo,
      
      // 전체 랭킹
      ranking,
      totalExperts,
      
      // 분야별 랭킹
      specialtyRanking,
      specialtyTotalExperts,
      
      // 추가 정보
      experience: expert.experience || 0,
      responseTime: expert.responseTime || '2시간 내',
      completionRate: expert.completionRate || 95,
      isOnline: expert.isOnline || false,
      
      // 프로필 정보
      profileImage: expert.profile?.profileImage || null,
      location: expert.location || '',
      languages: expert.languages ? JSON.parse(expert.languages) : ['한국어'],
      consultationTypes: expert.consultationTypes ? JSON.parse(expert.consultationTypes) : [],
      
      // 가격 정보
      pricePerMinute: expert.pricePerMinute || 0,
      hourlyRate: expert.hourlyRate || 0
    };
    
    return NextResponse.json({
      success: true,
      data: responseData
    });
    
  } catch (error) {
    console.error('전문가 상세 통계 조회 실패:', error);
    return NextResponse.json(
      { success: false, message: '전문가 통계 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}
