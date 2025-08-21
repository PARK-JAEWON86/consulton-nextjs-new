import { NextRequest, NextResponse } from 'next/server';
import { dummyExperts } from '@/data/dummy/experts';

export type ConsultationStatus = "completed" | "scheduled" | "canceled";

export interface ConsultationItem {
  id: number;
  date: string; // ISO string
  customer: string;
  topic: string;
  amount: number; // credits
  status: ConsultationStatus;
  method?: "chat" | "video" | "voice" | "call";
  duration?: number; // minutes
  summary?: string;
  notes?: string;
  issue?: {
    type: "refund" | "quality" | "other";
    reason: string;
    createdAt: string; // ISO
    status: "open" | "resolved" | "rejected";
  };
}

interface ConsultationsState {
  items: ConsultationItem[];
  currentConsultationId: number | null;
}

// 메모리 기반 상태 저장 (실제 프로덕션에서는 데이터베이스 사용 권장)
let consultationsState: ConsultationsState = {
  items: [],
  currentConsultationId: null,
};

// GET: 상담 내역 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const expertId = searchParams.get('expertId');
    const status = searchParams.get('status');
    
    let filteredItems = consultationsState.items;
    
    // 전문가 ID로 필터링
    if (expertId) {
      // 실제로는 데이터베이스에서 전문가별 상담 내역을 조회
      // 여기서는 간단한 필터링만 구현
      filteredItems = consultationsState.items.filter(item => 
        item.customer.includes(expertId) || item.id.toString().includes(expertId)
      );
    }
    
    // 상태로 필터링
    if (status && status !== 'all') {
      filteredItems = filteredItems.filter(item => item.status === status);
    }
    
    return NextResponse.json({
      success: true,
      data: {
        items: filteredItems,
        currentConsultationId: consultationsState.currentConsultationId,
        total: filteredItems.length
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '상담 내역 조회 실패' },
      { status: 500 }
    );
  }
}

// POST: 상담 내역 관리 액션
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'addScheduled':
        const id = Date.now();
        const newItem: ConsultationItem = {
          id,
          date: data.date ?? new Date().toISOString(),
          customer: data.customer,
          topic: data.topic,
          amount: data.amount,
          status: "scheduled",
          method: data.method,
          duration: data.duration,
          summary: data.summary,
        };
        
        consultationsState.items = [newItem, ...consultationsState.items];
        consultationsState.currentConsultationId = id;
        
        return NextResponse.json({
          success: true,
          data: {
            consultation: newItem,
            currentConsultationId: id,
            message: '상담이 예약되었습니다.'
          }
        });

      case 'updateCurrent':
        const currentId = consultationsState.currentConsultationId;
        if (!currentId) {
          return NextResponse.json(
            { success: false, error: '진행 중인 상담이 없습니다.' },
            { status: 400 }
          );
        }
        
        consultationsState.items = consultationsState.items.map(item =>
          item.id === currentId ? { ...item, ...data } : item
        );
        
        return NextResponse.json({
          success: true,
          data: {
            updatedConsultation: consultationsState.items.find(item => item.id === currentId),
            message: '상담 정보가 업데이트되었습니다.'
          }
        });

      case 'updateById':
        const targetId = data.id;
        consultationsState.items = consultationsState.items.map(item =>
          item.id === targetId ? { ...item, ...data.payload } : item
        );
        
        return NextResponse.json({
          success: true,
          data: {
            updatedConsultation: consultationsState.items.find(item => item.id === targetId),
            message: '상담 정보가 업데이트되었습니다.'
          }
        });

      case 'completeCurrent':
        const currentConsultationId = consultationsState.currentConsultationId;
        if (!currentConsultationId) {
          return NextResponse.json(
            { success: false, error: '진행 중인 상담이 없습니다.' },
            { status: 400 }
          );
        }
        
        consultationsState.items = consultationsState.items.map(item =>
          item.id === currentConsultationId ? { ...item, status: "completed" } : item
        );
        consultationsState.currentConsultationId = null;
        
        return NextResponse.json({
          success: true,
          data: {
            completedConsultation: consultationsState.items.find(item => item.id === currentConsultationId),
            currentConsultationId: null,
            message: '상담이 완료되었습니다.'
          }
        });

      case 'markCompleted':
        const consultationId = data.id;
        consultationsState.items = consultationsState.items.map(item =>
          item.id === consultationId ? { ...item, status: "completed" } : item
        );
        
        return NextResponse.json({
          success: true,
          data: {
            updatedConsultation: consultationsState.items.find(item => item.id === consultationId),
            message: '상담이 완료 상태로 변경되었습니다.'
          }
        });

      case 'clearCurrent':
        consultationsState.currentConsultationId = null;
        
        return NextResponse.json({
          success: true,
          data: {
            currentConsultationId: null,
            message: '현재 상담이 초기화되었습니다.'
          }
        });

      case 'clearAll':
        consultationsState = {
          items: [],
          currentConsultationId: null,
        };
        
        return NextResponse.json({
          success: true,
          data: {
            items: [],
            currentConsultationId: null,
            message: '모든 상담 내역이 초기화되었습니다.'
          }
        });

      case 'loadExpertConsultations':
        const expertId = data.expertId;
        // 더미데이터에서 해당 전문가 찾기
        const expert = dummyExperts.find(e => e.id.toString() === expertId || e.name.includes(expertId));
        
        if (expert) {
          // 전문가 정보를 기반으로 더미 상담 데이터 생성
          const dummyConsultations: ConsultationItem[] = [
            {
              id: 1,
              date: new Date().toISOString(),
              customer: `${expert.name} 고객`,
              topic: `${expert.specialty} 상담`,
              amount: Math.floor(expert.pricePerMinute * 30), // 30분 상담 기준
              status: "completed",
              method: expert.consultationTypes[0] as "chat" | "video" | "voice",
              duration: 30,
              summary: `${expert.specialty} 30분 상담 완료 - ${expert.name} 전문가`
            },
            {
              id: 2,
              date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 어제
              customer: `${expert.name} 고객2`,
              topic: `${expert.specialty} 후속 상담`,
              amount: Math.floor(expert.pricePerMinute * 45), // 45분 상담 기준
              status: "completed",
              method: expert.consultationTypes[0] as "chat" | "video" | "voice",
              duration: 45,
              summary: `${expert.specialty} 45분 후속 상담 완료 - ${expert.name} 전문가`
            }
          ];
          
          consultationsState.items = dummyConsultations;
          consultationsState.currentConsultationId = null;
          
          return NextResponse.json({
            success: true,
            data: {
              items: dummyConsultations,
              currentConsultationId: null,
              message: `전문가 ${expert.name}의 상담 내역이 더미데이터로 로드되었습니다.`
            }
          });
        } else {
          // 전문가를 찾을 수 없는 경우 기본 더미 데이터
          const defaultConsultations: ConsultationItem[] = [
            {
              id: 1,
              date: new Date().toISOString(),
              customer: `고객 ${expertId}`,
              topic: "상담 주제",
              amount: 100,
              status: "completed",
              method: "chat",
              duration: 30,
              summary: "30분 채팅 상담 완료"
            }
          ];
          
          consultationsState.items = defaultConsultations;
          consultationsState.currentConsultationId = null;
          
          return NextResponse.json({
            success: true,
            data: {
              items: defaultConsultations,
              currentConsultationId: null,
              message: `전문가 ${expertId}의 상담 내역이 로드되었습니다.`
            }
          });
        }

      default:
        return NextResponse.json(
          { success: false, error: '알 수 없는 액션' },
          { status: 400 }
        );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '상담 내역 관리 실패' },
      { status: 500 }
    );
  }
}

// PATCH: 상담 내역 부분 업데이트
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, updates } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: '상담 ID가 필요합니다.' },
        { status: 400 }
      );
    }
    
    consultationsState.items = consultationsState.items.map(item =>
      item.id === id ? { ...item, ...updates } : item
    );
    
    const updatedConsultation = consultationsState.items.find(item => item.id === id);
    
    return NextResponse.json({
      success: true,
      data: {
        updatedConsultation,
        message: '상담 정보가 업데이트되었습니다.'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '상담 정보 업데이트 실패' },
      { status: 500 }
    );
  }
}

// DELETE: 상담 내역 삭제
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
      // 특정 상담 삭제
      const consultationId = parseInt(id);
      consultationsState.items = consultationsState.items.filter(item => item.id !== consultationId);
      
      // 현재 상담이 삭제된 경우 초기화
      if (consultationsState.currentConsultationId === consultationId) {
        consultationsState.currentConsultationId = null;
      }
      
      return NextResponse.json({
        success: true,
        data: {
          deletedId: consultationId,
          message: '상담이 삭제되었습니다.'
        }
      });
    } else {
      // 모든 상담 삭제
      consultationsState = {
        items: [],
        currentConsultationId: null,
      };
      
      return NextResponse.json({
        success: true,
        data: {
          message: '모든 상담 내역이 삭제되었습니다.'
        }
      });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '상담 삭제 실패' },
      { status: 500 }
    );
  }
}
