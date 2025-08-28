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
