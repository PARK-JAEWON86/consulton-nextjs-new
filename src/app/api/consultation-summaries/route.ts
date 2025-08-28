import { NextRequest, NextResponse } from "next/server";
import { dummyConsultationSummaries } from "@/data/dummy/consultations";
import { sortByConsultationNumber } from "@/utils/consultationNumber";
import { ConsultationSummary } from "@/types";

// ToDo 상태 타입 확장
interface TodoStatus {
  id: string;
  consultationSummaryId: string;
  userId: string;
  itemIndex: number;
  itemType: 'expert_recommendation' | 'ai_action_item';
  content: string;
  isCompleted: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface ConsultationSummaryWithTodos extends ConsultationSummary {
  todoStatuses?: TodoStatus[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const userId = searchParams.get("userId");

    let filteredSummaries = [...dummyConsultationSummaries];

    // 상담번호가 이미 있는 경우 그대로 사용 (상담 시작 시 부여된 번호)
    // 상담번호가 없는 경우에만 임시 생성 (기존 데이터 호환성)
    filteredSummaries = filteredSummaries.map((summary, index) => {
      if (!summary.consultationNumber) {
        // 상담 날짜를 기준으로 임시 상담번호 생성
        const consultationDate = new Date(summary.date);
        const sequence = index + 1;
        // 임시 번호는 'TEMP-' 접두사 사용
        summary.consultationNumber = `TEMP-${consultationDate.getFullYear()}${String(consultationDate.getMonth() + 1).padStart(2, '0')}${String(consultationDate.getDate()).padStart(2, '0')}-${String(sequence).padStart(3, '0')}`;
      }
      return summary;
    });

    // 상태별 필터링
    if (status && status !== "all") {
      filteredSummaries = filteredSummaries.filter(
        (summary) => summary.status === status
      );
    }

    // 검색 필터링
    if (search) {
      const searchLower = search.toLowerCase();
      filteredSummaries = filteredSummaries.filter(
        (summary) =>
          summary.title.toLowerCase().includes(searchLower) ||
          summary.expert.name.toLowerCase().includes(searchLower) ||
          summary.client.name.toLowerCase().includes(searchLower) ||
          summary.consultationNumber?.toLowerCase().includes(searchLower) ||
          summary.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    // 상담번호 기준으로 정렬 (최신순)
    filteredSummaries.sort(sortByConsultationNumber);

    // 페이지네이션
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedSummaries = filteredSummaries.slice(startIndex, endIndex);

    // ToDo 상태 정보 추가 (사용자 ID가 있는 경우)
    if (userId) {
      for (const summary of paginatedSummaries) {
        try {
          const todoResponse = await fetch(`${request.nextUrl.origin}/api/consultation-summaries/${summary.id}/todo-status?userId=${userId}`);
          if (todoResponse.ok) {
            const todoResult = await todoResponse.json();
            if (todoResult.success) {
              (summary as ConsultationSummaryWithTodos).todoStatuses = todoResult.data;
            }
          }
        } catch (error) {
          console.error(`ToDo 상태 조회 실패 (${summary.id}):`, error);
        }
      }
    }

    const totalCount = filteredSummaries.length;
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: paginatedSummaries,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("상담 요약 목록 조회 중 오류:", error);
    return NextResponse.json(
      { error: "상담 요약 목록을 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // TODO: 실제 인증 로직 구현
    const body = await request.json();
    const {
      consultationId,
      title,
      expertId,
      expertName,
      expertTitle,
      duration,
      summary,
      tags,
      recordingUrl,
      recordingDuration
    } = body;

    // 필수 필드 검증
    if (!consultationId || !title || !expertId || !summary) {
      return NextResponse.json(
        { success: false, message: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // TODO: 실제 데이터베이스에 상담 요약 저장
    // 현재는 더미 응답만 반환
    
    const newSummary = {
      id: `summary_${Date.now()}`,
      consultationId,
      title,
      date: new Date(),
      duration: duration || 0,
      expert: {
        id: expertId,
        name: expertName || "전문가",
        title: expertTitle || "전문가",
        avatar: null
      },
      client: {
        id: "user_001", // TODO: 실제 사용자 ID
        name: "사용자",
        company: null
      },
      status: "processing" as const,
      summary,
      tags: tags || [],
      recordingUrl,
      recordingDuration,
      creditsUsed: 0,
      rating: null,
      hasRecording: !!recordingUrl
    };

    // TODO: 데이터베이스에 저장
    console.log('새 상담 요약 생성:', newSummary);

    return NextResponse.json({
      success: true,
      message: '상담 요약이 생성되었습니다.',
      data: newSummary
    }, { status: 201 });

  } catch (error) {
    console.error('상담 요약 생성 실패:', error);
    return NextResponse.json(
      { success: false, message: '상담 요약 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}
