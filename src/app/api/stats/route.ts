import { NextRequest, NextResponse } from 'next/server';

export interface PlatformStats {
  totalUsers: number;
  totalExperts: number;
  totalConsultations: number;
  totalRevenue: number;
  averageConsultationRating: number;
  averageMatchingTimeMinutes: number;
  monthlyActiveUsers: number;
  monthlyActiveExperts: number;
  consultationCompletionRate: number;
  userSatisfactionScore: number;
  lastUpdated: string;
}

export interface StatsUpdate {
  type: 'consultation_completed' | 'expert_registered' | 'user_registered' | 'matching_time_recorded' | 'revenue_updated' | 'rating_updated';
  data?: {
    matchingTimeMinutes?: number;
    revenue?: number;
    rating?: number;
    completionRate?: number;
    satisfactionScore?: number;
  };
}

export interface MatchingRecord {
  id: string;
  userId: string;
  expertId: string;
  matchingTimeMinutes: number;
  createdAt: string;
}

interface StatsState {
  stats: PlatformStats;
  matchingRecords: MatchingRecord[];
}

// 메모리 기반 상태 저장 (실제 프로덕션에서는 데이터베이스 사용 권장)
let statsState: StatsState = {
  stats: {
    totalUsers: 0,
    totalExperts: 0,
    totalConsultations: 0,
    totalRevenue: 0,
    averageConsultationRating: 0,
    averageMatchingTimeMinutes: 0,
    monthlyActiveUsers: 0,
    monthlyActiveExperts: 0,
    consultationCompletionRate: 0,
    userSatisfactionScore: 0,
    lastUpdated: new Date().toISOString(),
  },
  matchingRecords: [],
};

// GET: 플랫폼 통계 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeMatchingRecords = searchParams.get('includeMatchingRecords') === 'true';
    
    const responseData: any = {
      stats: statsState.stats,
      summary: {
        totalUsers: statsState.stats.totalUsers,
        totalExperts: statsState.stats.totalExperts,
        totalConsultations: statsState.stats.totalConsultations,
        averageMatchingTime: `${statsState.stats.averageMatchingTimeMinutes}분`,
        completionRate: `${statsState.stats.consultationCompletionRate}%`,
        satisfactionScore: `${statsState.stats.userSatisfactionScore}/5`,
      }
    };
    
    if (includeMatchingRecords) {
      responseData.matchingRecords = statsState.matchingRecords;
    }
    
    return NextResponse.json({
      success: true,
      data: responseData
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '통계 조회 실패' },
      { status: 500 }
    );
  }
}

// POST: 통계 관리 액션
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'updateStats':
        const update: StatsUpdate = data.update;
        
        switch (update.type) {
          case 'consultation_completed':
            statsState.stats.totalConsultations += 1;
            break;
          case 'expert_registered':
            statsState.stats.totalExperts += 1;
            break;
          case 'user_registered':
            statsState.stats.totalUsers += 1;
            break;
          case 'matching_time_recorded':
            if (update.data?.matchingTimeMinutes) {
              // 매칭 시간 기록은 recordMatching에서 처리
            }
            break;
          case 'revenue_updated':
            if (update.data?.revenue) {
              statsState.stats.totalRevenue = update.data.revenue;
            }
            break;
          case 'rating_updated':
            if (update.data?.rating) {
              statsState.stats.averageConsultationRating = update.data.rating;
            }
            break;
        }
        
        statsState.stats.lastUpdated = new Date().toISOString();
        
        return NextResponse.json({
          success: true,
          data: {
            stats: statsState.stats,
            message: '통계가 업데이트되었습니다.'
          }
        });

      case 'recordMatching':
        const { userId, expertId, matchingTimeMinutes } = data;
        const newRecord: MatchingRecord = {
          id: `matching_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId,
          expertId,
          matchingTimeMinutes,
          createdAt: new Date().toISOString(),
        };
        
        statsState.matchingRecords.push(newRecord);
        
        // 평균 매칭 시간 재계산
        if (statsState.matchingRecords.length > 0) {
          const totalTime = statsState.matchingRecords.reduce(
            (sum, record) => sum + record.matchingTimeMinutes,
            0
          );
          statsState.stats.averageMatchingTimeMinutes = Math.round(totalTime / statsState.matchingRecords.length);
        }
        
        statsState.stats.lastUpdated = new Date().toISOString();
        
        return NextResponse.json({
          success: true,
          data: {
            record: newRecord,
            averageMatchingTime: statsState.stats.averageMatchingTimeMinutes,
            message: '매칭 기록이 저장되었습니다.'
          }
        });

      case 'completeConsultation':
        statsState.stats.totalConsultations += 1;
        statsState.stats.lastUpdated = new Date().toISOString();
        
        return NextResponse.json({
          success: true,
          data: {
            stats: statsState.stats,
            message: '상담 완료 통계가 업데이트되었습니다.'
          }
        });

      case 'registerExpert':
        statsState.stats.totalExperts += 1;
        statsState.stats.lastUpdated = new Date().toISOString();
        
        return NextResponse.json({
          success: true,
          data: {
            stats: statsState.stats,
            message: '전문가 등록 통계가 업데이트되었습니다.'
          }
        });

      case 'registerUser':
        statsState.stats.totalUsers += 1;
        statsState.stats.lastUpdated = new Date().toISOString();
        
        return NextResponse.json({
          success: true,
          data: {
            stats: statsState.stats,
            message: '사용자 등록 통계가 업데이트되었습니다.'
          }
        });

      case 'updateMetrics':
        const { completionRate, satisfactionScore, monthlyActiveUsers, monthlyActiveExperts } = data;
        
        if (completionRate !== undefined) {
          statsState.stats.consultationCompletionRate = completionRate;
        }
        if (satisfactionScore !== undefined) {
          statsState.stats.userSatisfactionScore = satisfactionScore;
        }
        if (monthlyActiveUsers !== undefined) {
          statsState.stats.monthlyActiveUsers = monthlyActiveUsers;
        }
        if (monthlyActiveExperts !== undefined) {
          statsState.stats.monthlyActiveExperts = monthlyActiveExperts;
        }
        
        statsState.stats.lastUpdated = new Date().toISOString();
        
        return NextResponse.json({
          success: true,
          data: {
            stats: statsState.stats,
            message: '메트릭이 업데이트되었습니다.'
          }
        });

      case 'resetStats':
        statsState = {
          stats: {
            totalUsers: 0,
            totalExperts: 0,
            totalConsultations: 0,
            totalRevenue: 0,
            averageConsultationRating: 0,
            averageMatchingTimeMinutes: 0,
            monthlyActiveUsers: 0,
            monthlyActiveExperts: 0,
            consultationCompletionRate: 0,
            userSatisfactionScore: 0,
            lastUpdated: new Date().toISOString(),
          },
          matchingRecords: [],
        };
        
        return NextResponse.json({
          success: true,
          data: {
            message: '통계가 초기화되었습니다.'
          }
        });

      case 'initializeStats':
        // 더미 데이터로 초기화
        statsState = {
          stats: {
            totalUsers: 1250,
            totalExperts: 85,
            totalConsultations: 3200,
            totalRevenue: 12500000,
            averageConsultationRating: 4.7,
            averageMatchingTimeMinutes: 3,
            monthlyActiveUsers: 450,
            monthlyActiveExperts: 65,
            consultationCompletionRate: 92,
            userSatisfactionScore: 4.6,
            lastUpdated: new Date().toISOString(),
          },
          matchingRecords: [
            {
              id: 'matching_1',
              userId: 'user_1',
              expertId: 'expert_1',
              matchingTimeMinutes: 2,
              createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: 'matching_2',
              userId: 'user_2',
              expertId: 'expert_2',
              matchingTimeMinutes: 5,
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: 'matching_3',
              userId: 'user_3',
              expertId: 'expert_3',
              matchingTimeMinutes: 1,
              createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            }
          ],
        };
        
        // 평균 매칭 시간 계산
        if (statsState.matchingRecords.length > 0) {
          const totalTime = statsState.matchingRecords.reduce(
            (sum, record) => sum + record.matchingTimeMinutes,
            0
          );
          statsState.stats.averageMatchingTimeMinutes = Math.round(totalTime / statsState.matchingRecords.length);
        }
        
        return NextResponse.json({
          success: true,
          data: {
            stats: statsState.stats,
            matchingRecords: statsState.matchingRecords,
            message: '통계가 더미 데이터로 초기화되었습니다.'
          }
        });

      default:
        return NextResponse.json(
          { success: false, error: '알 수 없는 액션' },
          { status: 400 }
        );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '통계 관리 실패' },
      { status: 500 }
    );
  }
}

// PATCH: 통계 부분 업데이트
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { updates } = body;
    
    // 통계 업데이트
    Object.assign(statsState.stats, updates);
    statsState.stats.lastUpdated = new Date().toISOString();
    
    return NextResponse.json({
      success: true,
      data: {
        stats: statsState.stats,
        message: '통계가 업데이트되었습니다.'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '통계 업데이트 실패' },
      { status: 500 }
    );
  }
}

// DELETE: 통계 초기화
export async function DELETE() {
  try {
    statsState = {
      stats: {
        totalUsers: 0,
        totalExperts: 0,
        totalConsultations: 0,
        totalRevenue: 0,
        averageConsultationRating: 0,
        averageMatchingTimeMinutes: 0,
        monthlyActiveUsers: 0,
        monthlyActiveExperts: 0,
        consultationCompletionRate: 0,
        userSatisfactionScore: 0,
        lastUpdated: new Date().toISOString(),
      },
      matchingRecords: [],
    };
    
    return NextResponse.json({
      success: true,
      data: {
        message: '모든 통계가 초기화되었습니다.'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '통계 초기화 실패' },
      { status: 500 }
    );
  }
}
