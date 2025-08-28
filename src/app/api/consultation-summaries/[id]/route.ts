import { NextRequest, NextResponse } from 'next/server';
import { dummyConsultationSummaries } from '@/data/dummy/consultations';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // 더미 데이터에서 해당 ID의 상담 요약 찾기
    const summary = dummyConsultationSummaries.find(s => s.id === id);
    
    if (!summary) {
      return NextResponse.json(
        { success: false, message: '상담 요약을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 상세 데이터 구성
    const detailedSummary = {
      ...summary
    };

    return NextResponse.json({
      success: true,
      data: detailedSummary
    });
  } catch (error) {
    console.error('상담 요약 상세 조회 실패:', error);
    return NextResponse.json(
      { success: false, message: '상담 요약을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: 실제 인증 로직 구현
    const { id } = params;
    const body = await request.json();
    
    const {
      title,
      summary,
      tags,
      status,
      rating,
      actionItems
    } = body;

    // TODO: 실제 데이터베이스에서 상담 요약 업데이트
    console.log(`상담 요약 ${id} 업데이트:`, body);

    // 업데이트된 데이터 반환 (실제로는 데이터베이스에서 조회)
    const updatedSummary = {
      id,
      title: title || "상담 요약",
      date: new Date(),
      duration: 60,
      expert: {
        name: "김진우",
        title: "진로 상담 전문가",
        avatar: null
      },
      client: {
        name: "김민수",
        company: "현재 제조업 종사"
      },
      status: status || "completed",
      summary: summary || "상담 내용 요약",
      tags: tags || [],
      creditsUsed: 80,
      rating: rating || null
    };

    return NextResponse.json({
      success: true,
      message: '상담 요약이 업데이트되었습니다.',
      data: updatedSummary
    });

  } catch (error) {
    console.error('상담 요약 업데이트 실패:', error);
    return NextResponse.json(
      { success: false, message: '상담 요약 업데이트에 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: 실제 인증 로직 구현
    const { id } = params;

    // TODO: 실제 데이터베이스에서 상담 요약 삭제
    console.log(`상담 요약 ${id} 삭제`);

    return NextResponse.json({
      success: true,
      message: '상담 요약이 삭제되었습니다.'
    });

  } catch (error) {
    console.error('상담 요약 삭제 실패:', error);
    return NextResponse.json(
      { success: false, message: '상담 요약 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
}
