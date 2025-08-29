import { NextRequest, NextResponse } from 'next/server';

// 리뷰 타입 정의
interface Review {
  id: string;
  consultationId: string;
  userId: string;
  userName: string;
  userAvatar?: string | null;
  expertId: string;
  expertName: string;
  rating: number;
  content: string;
  category: string;
  date: string;
  isVerified: boolean;
  isPublic: boolean;
  expertReply?: {
    message: string;
    createdAt: string;
  };
}

import { dummyReviews } from '@/data/dummy/reviews';

// 임시 저장소 (실제로는 데이터베이스 사용)
let reviews: Review[] = [...dummyReviews];

// 전문가 통계 업데이트 헬퍼 함수
async function updateExpertStatsAfterReview(
  expertId: string, 
  action: 'add' | 'update' | 'delete', 
  newRating?: number, 
  oldRating?: number
) {
  try {
    // 현재 전문가 통계 조회
    const statsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/expert-stats?expertId=${expertId}`);
    if (!statsResponse.ok) {
      throw new Error('전문가 통계 조회 실패');
    }
    
    const statsResult = await statsResponse.json();
    if (!statsResult.success) {
      throw new Error('전문가 통계 데이터 없음');
    }
    
    const currentStats = statsResult.data;
    
    // 해당 전문가의 모든 리뷰 조회
    const reviewsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/reviews?expertId=${expertId}`);
    if (!reviewsResponse.ok) {
      throw new Error('리뷰 조회 실패');
    }
    
    const reviewsResult = await reviewsResponse.json();
    if (!reviewsResult.success) {
      throw new Error('리뷰 데이터 없음');
    }
    
    const expertReviews = reviewsResult.data.reviews;
    
    // 새로운 통계 계산
    let newReviewCount = currentStats.reviewCount;
    let newAvgRating = currentStats.avgRating;
    
    if (action === 'add') {
      newReviewCount += 1;
      // 평균 평점 재계산
      const totalRating = expertReviews.reduce((sum: number, review: any) => sum + review.rating, 0);
      newAvgRating = totalRating / newReviewCount;
    } else if (action === 'update' && oldRating !== undefined && newRating !== undefined) {
      // 평점 변경 시 평균 재계산
      const totalRating = expertReviews.reduce((sum: number, review: any) => {
        if (review.id === currentStats.expertId) {
          return sum + newRating; // 새로운 평점 사용
        }
        return sum + review.rating;
      }, 0);
      newAvgRating = totalRating / newReviewCount;
    } else if (action === 'delete') {
      newReviewCount = Math.max(0, newReviewCount - 1);
      if (newReviewCount > 0) {
        const totalRating = expertReviews.reduce((sum: number, review: any) => sum + review.rating, 0);
        newAvgRating = totalRating / newReviewCount;
      } else {
        newAvgRating = 0;
      }
    }
    
    // 전문가 통계 업데이트
    const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/expert-stats`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        expertId,
        reviewCount: newReviewCount,
        avgRating: Math.round(newAvgRating * 10) / 10 // 소수점 첫째 자리까지 반올림
      })
    });
    
    if (!updateResponse.ok) {
      throw new Error('전문가 통계 업데이트 실패');
    }
    
  } catch (error) {
    console.error('전문가 통계 업데이트 오류:', error);
    throw error;
  }
}

// GET: 리뷰 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const consultationId = searchParams.get('consultationId');
    const expertId = searchParams.get('expertId');
    const isPublic = searchParams.get('isPublic');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let filteredReviews = [...reviews];

    // 필터링
    if (consultationId) {
      filteredReviews = filteredReviews.filter(review => review.consultationId === consultationId);
    }
    if (expertId) {
      filteredReviews = filteredReviews.filter(review => review.expertId === expertId);
    }
    if (isPublic !== null) {
      filteredReviews = filteredReviews.filter(review => review.isPublic === (isPublic === 'true'));
    }

    // 정렬 (최신순)
    filteredReviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // 페이지네이션
    const paginatedReviews = filteredReviews.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: {
        reviews: paginatedReviews,
        total: filteredReviews.length,
        limit,
        offset
      }
    });
  } catch (error) {
    console.error('리뷰 조회 실패:', error);
    return NextResponse.json(
      { success: false, message: '리뷰 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// POST: 새 리뷰 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      consultationId,
      userId,
      userName,
      userAvatar,
      expertId,
      expertName,
      rating,
      content,
      category
    } = body;

    // 필수 필드 검증
    if (!consultationId || !userId || !userName || !expertId || !expertName || !rating || !content || !category) {
      return NextResponse.json(
        { success: false, message: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 평점 범위 검증
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: '평점은 1-5 사이여야 합니다.' },
        { status: 400 }
      );
    }

    // 중복 리뷰 검증 (같은 상담에 대해 한 사용자가 하나의 리뷰만 작성 가능)
    const existingReview = reviews.find(
      review => review.consultationId === consultationId && review.userId === userId
    );

    if (existingReview) {
      return NextResponse.json(
        { success: false, message: '이미 이 상담에 대한 리뷰를 작성했습니다.' },
        { status: 400 }
      );
    }

    // 새 리뷰 생성
    const newReview: Review = {
      id: Date.now().toString(),
      consultationId,
      userId,
      userName,
      userAvatar,
      expertId,
      expertName,
      rating,
      content,
      category,
      date: new Date().toISOString(),
      isVerified: false, // 기본적으로 미검증
      isPublic: true // 기본적으로 공개
    };

    reviews.push(newReview);

    // 전문가 통계 업데이트
    try {
      await updateExpertStatsAfterReview(expertId, 'add', rating);
      
      // 전문가 데이터 업데이트 이벤트 발생 (클라이언트에서 감지)
      // 이 이벤트는 클라이언트 측에서 전문가 찾기 페이지의 데이터를 새로고침하는 데 사용됨
      console.log(`전문가 ${expertId}의 리뷰 추가로 인한 통계 업데이트 완료`);
    } catch (error) {
      console.error('전문가 통계 업데이트 실패:', error);
      // 리뷰는 성공했지만 통계 업데이트는 실패한 경우
    }

    return NextResponse.json({
      success: true,
      data: newReview,
      message: '리뷰가 성공적으로 작성되었습니다.'
    });
  } catch (error) {
    console.error('리뷰 생성 실패:', error);
    return NextResponse.json(
      { success: false, message: '리뷰 작성에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// PUT: 리뷰 수정
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, rating, content, isPublic, expertReply } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: '리뷰 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const reviewIndex = reviews.findIndex(review => review.id === id);
    if (reviewIndex === -1) {
      return NextResponse.json(
        { success: false, message: '리뷰를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 수정 가능한 필드만 업데이트
    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return NextResponse.json(
          { success: false, message: '평점은 1-5 사이여야 합니다.' },
          { status: 400 }
        );
      }
      reviews[reviewIndex].rating = rating;
    }

    if (content !== undefined) {
      reviews[reviewIndex].content = content;
    }

    if (isPublic !== undefined) {
      reviews[reviewIndex].isPublic = isPublic;
    }

    if (expertReply !== undefined) {
      reviews[reviewIndex].expertReply = expertReply;
    }

    reviews[reviewIndex].date = new Date().toISOString();

    // 평점이 변경된 경우 전문가 통계 업데이트
    if (rating !== undefined) {
      try {
        const oldRating = reviews[reviewIndex].rating;
        const expertId = reviews[reviewIndex].expertId;
        await updateExpertStatsAfterReview(expertId, 'update', rating, oldRating);
      } catch (error) {
        console.error('전문가 통계 업데이트 실패:', error);
      }
    }

    return NextResponse.json({
      success: true,
      data: reviews[reviewIndex],
      message: '리뷰가 성공적으로 수정되었습니다.'
    });
  } catch (error) {
    console.error('리뷰 수정 실패:', error);
    return NextResponse.json(
      { success: false, message: '리뷰 수정에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE: 리뷰 삭제
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: '리뷰 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const reviewIndex = reviews.findIndex(review => review.id === id);
    if (reviewIndex === -1) {
      return NextResponse.json(
        { success: false, message: '리뷰를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const deletedReview = reviews.splice(reviewIndex, 1)[0];

    // 전문가 통계 업데이트
    try {
      await updateExpertStatsAfterReview(deletedReview.expertId, 'delete');
    } catch (error) {
      console.error('전문가 통계 업데이트 실패:', error);
      // 리뷰는 삭제했지만 통계 업데이트는 실패한 경우
    }

    return NextResponse.json({
      success: true,
      data: deletedReview,
      message: '리뷰가 성공적으로 삭제되었습니다.'
    });
  } catch (error) {
    console.error('리뷰 삭제 실패:', error);
    return NextResponse.json(
      { success: false, message: '리뷰 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
}
