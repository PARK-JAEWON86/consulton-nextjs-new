import { NextRequest, NextResponse } from 'next/server';

// 카테고리 인터페이스
interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// 임시 카테고리 데이터 (실제로는 데이터베이스에서 관리)
let categories: Category[] = [
  {
    id: "career",
    name: "진로상담",
    description: "취업, 이직, 진로 탐색",
    icon: "Target",
    isActive: true,
    order: 1,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "psychology",
    name: "심리상담",
    description: "스트레스, 우울, 불안",
    icon: "Brain",
    isActive: true,
    order: 2,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "finance",
    name: "재무상담",
    description: "투자, 자산관리, 세무",
    icon: "DollarSign",
    isActive: true,
    order: 3,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "legal",
    name: "법률상담",
    description: "계약, 분쟁, 상속",
    icon: "Scale",
    isActive: true,
    order: 4,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "education",
    name: "교육상담",
    description: "학습법, 입시, 유학",
    icon: "BookOpen",
    isActive: true,
    order: 5,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "health",
    name: "건강상담",
    description: "영양, 운동, 건강관리",
    icon: "Heart",
    isActive: true,
    order: 6,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "relationship",
    name: "관계상담",
    description: "연애, 결혼, 가족관계",
    icon: "Users",
    isActive: true,
    order: 7,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "business",
    name: "사업상담",
    description: "창업, 경영, 마케팅",
    icon: "Briefcase",
    isActive: true,
    order: 8,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "technology",
    name: "기술상담",
    description: "프로그래밍, IT, 개발",
    icon: "Code",
    isActive: true,
    order: 9,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "design",
    name: "디자인상담",
    description: "UI/UX, 그래픽, 브랜딩",
    icon: "Palette",
    isActive: true,
    order: 10,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "language",
    name: "언어상담",
    description: "외국어, 통역, 번역",
    icon: "Languages",
    isActive: true,
    order: 11,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "art",
    name: "예술상담",
    description: "음악, 미술, 공연",
    icon: "Music",
    isActive: true,
    order: 12,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "sports",
    name: "스포츠상담",
    description: "운동, 훈련, 경기",
    icon: "Trophy",
    isActive: true,
    order: 13,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "travel",
    name: "여행상담",
    description: "여행계획, 가이드, 숙박",
    icon: "Plane",
    isActive: true,
    order: 14,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "food",
    name: "요리상담",
    description: "요리법, 영양, 식단",
    icon: "ChefHat",
    isActive: true,
    order: 15,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "fashion",
    name: "패션상담",
    description: "스타일링, 코디, 이미지",
    icon: "Scissors",
    isActive: true,
    order: 16,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "pet",
    name: "반려동물상담",
    description: "훈련, 건강, 케어",
    icon: "PawPrint",
    isActive: true,
    order: 17,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "gardening",
    name: "정원상담",
    description: "식물, 조경, 원예",
    icon: "Sprout",
    isActive: true,
    order: 18,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "investment",
    name: "투자상담",
    description: "주식, 부동산, 펀드",
    icon: "TrendingUp",
    isActive: true,
    order: 19,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "tax",
    name: "세무상담",
    description: "세금, 절세, 신고",
    icon: "Receipt",
    isActive: true,
    order: 20,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "insurance",
    name: "보험상담",
    description: "생명보험, 손해보험, 연금",
    icon: "Building2",
    isActive: true,
    order: 21,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "admission",
    name: "진학상담",
    description: "대입, 수시, 정시 전략",
    icon: "GraduationCap",
    isActive: true,
    order: 22,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "real-estate",
    name: "부동산상담",
    description: "매매, 임대, 투자",
    icon: "Building2",
    isActive: true,
    order: 23,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "startup",
    name: "창업상담",
    description: "창업 전략, 사업계획, 자금조달",
    icon: "Rocket",
    isActive: true,
    order: 24,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "it",
    name: "IT상담",
    description: "시스템 구축, 디지털 전환, 보안",
    icon: "Monitor",
    isActive: true,
    order: 25,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "other",
    name: "기타",
    description: "기타 상담 분야",
    icon: "X",
    isActive: true,
    order: 26,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  }
];

// GET: 카테고리 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('activeOnly') === 'true';
    
    let filteredCategories = categories;
    
    // 활성 카테고리만 필터링
    if (activeOnly) {
      filteredCategories = categories.filter(cat => cat.isActive);
    }
    
    // order 순서대로 정렬
    filteredCategories.sort((a, b) => a.order - b.order);
    
    return NextResponse.json({
      success: true,
      data: filteredCategories,
      total: filteredCategories.length
    });
  } catch (error) {
    console.error('카테고리 조회 실패:', error);
    return NextResponse.json(
      { success: false, message: '카테고리 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// POST: 카테고리 추가/수정
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, category } = body;
    
    if (action === 'create') {
      // 새 카테고리 생성
      const newCategory: Category = {
        ...category,
        id: category.id || `cat_${Date.now()}`,
        isActive: category.isActive !== undefined ? category.isActive : true,
        order: category.order || categories.length + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // ID 중복 체크
      if (categories.find(cat => cat.id === newCategory.id)) {
        return NextResponse.json(
          { success: false, message: '이미 존재하는 카테고리 ID입니다.' },
          { status: 400 }
        );
      }
      
      categories.push(newCategory);
      
      return NextResponse.json({
        success: true,
        message: '카테고리가 성공적으로 생성되었습니다.',
        data: newCategory
      });
      
    } else if (action === 'update') {
      // 기존 카테고리 수정
      const existingIndex = categories.findIndex(cat => cat.id === category.id);
      
      if (existingIndex === -1) {
        return NextResponse.json(
          { success: false, message: '존재하지 않는 카테고리입니다.' },
          { status: 404 }
        );
      }
      
      categories[existingIndex] = {
        ...categories[existingIndex],
        ...category,
        updatedAt: new Date().toISOString()
      };
      
      return NextResponse.json({
        success: true,
        message: '카테고리가 성공적으로 수정되었습니다.',
        data: categories[existingIndex]
      });
      
    } else if (action === 'delete') {
      // 카테고리 삭제 (비활성화)
      const existingIndex = categories.findIndex(cat => cat.id === category.id);
      
      if (existingIndex === -1) {
        return NextResponse.json(
          { success: false, message: '존재하지 않는 카테고리입니다.' },
          { status: 404 }
        );
      }
      
      categories[existingIndex].isActive = false;
      categories[existingIndex].updatedAt = new Date().toISOString();
      
      return NextResponse.json({
        success: true,
        message: '카테고리가 성공적으로 비활성화되었습니다.',
        data: categories[existingIndex]
      });
      
    } else if (action === 'reorder') {
      // 카테고리 순서 변경
      const { categoryIds } = body;
      
      if (!Array.isArray(categoryIds)) {
        return NextResponse.json(
          { success: false, message: '카테고리 ID 배열이 필요합니다.' },
          { status: 400 }
        );
      }
      
      // 순서 업데이트
      categoryIds.forEach((id: string, index: number) => {
        const category = categories.find(cat => cat.id === id);
        if (category) {
          category.order = index + 1;
          category.updatedAt = new Date().toISOString();
        }
      });
      
      return NextResponse.json({
        success: true,
        message: '카테고리 순서가 성공적으로 변경되었습니다.'
      });
      
    } else {
      return NextResponse.json(
        { success: false, message: '잘못된 액션입니다.' },
        { status: 400 }
      );
    }
    
  } catch (error) {
    console.error('카테고리 작업 실패:', error);
    return NextResponse.json(
      { success: false, message: '카테고리 작업에 실패했습니다.' },
      { status: 500 }
    );
  }
}
