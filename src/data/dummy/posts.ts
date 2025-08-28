// 커뮤니티 게시글 더미 데이터

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAvatar: string | null;
  createdAt: string;
  updatedAt?: string;
  category: string;
  tags: string[];
  likes: number;
  comments: number;
  views?: number;
  postType: "consultation_request" | "consultation_review" | "expert_intro" | "general";
  isAISummary?: boolean;
  isExpert?: boolean;
  urgency?: "낮음" | "보통" | "높음";
  preferredMethod?: "화상상담" | "채팅상담" | "전화상담";
  profileVisibility?: "public" | "experts" | "private";
  // 상담후기 관련 추가 필드
  consultationTopic?: string;
  rating?: number;
  expertName?: string;
  isVerified?: boolean;
  hasExpertReply?: boolean;
}

export const communityPosts: CommunityPost[] = [
  {
    id: "ai-1",
    title: "[AI 상담 요약] 진로 전환에 대한 고민",
    content: "AI 상담을 통해 현재 직장에서의 스트레스와 새로운 분야로의 전환 가능성에 대해 상담했습니다. 개발자로 전향하고 싶지만 나이와 경험 부족이 걱정됩니다.",
    author: "익명사용자",
    authorAvatar: "익",
    createdAt: "2024-01-16",
    category: "진로상담",
    tags: ["AI상담", "진로전환", "개발자"],
    likes: 24,
    comments: 8,
    postType: "consultation_request",
    isAISummary: true,
    urgency: "보통",
    preferredMethod: "화상상담",
    profileVisibility: "private"
  },
  {
    id: "1",
    title: "진로 상담 경험 공유",
    content: "전문가와의 상담을 통해 진로 방향을 찾았습니다. 3개월간의 상담 과정에서 얻은 인사이트를 공유합니다.",
    author: "김철수",
    authorAvatar: "김",
    createdAt: "2024-01-15",
    category: "진로상담",
    tags: ["진로", "상담후기", "경험공유"],
    likes: 12,
    comments: 5,
    postType: "consultation_review",
    profileVisibility: "experts"
  },
  {
    id: "req-1",
    title: "연애 관계 상담 요청드립니다",
    content: "연인과의 소통 문제로 고민이 많습니다. 서로 다른 성격으로 인한 갈등을 해결하고 싶어요.",
    author: "익명사용자",
    authorAvatar: "익",
    createdAt: "2024-01-14",
    category: "관계상담",
    tags: ["연애", "소통", "갈등해결"],
    likes: 8,
    comments: 3,
    postType: "consultation_request",
    urgency: "보통",
    preferredMethod: "화상상담",
    profileVisibility: "private"
  },
  {
    id: "expert-1",
    title: "심리상담 전문가 박상담입니다",
    content: "10년 경력의 심리상담사입니다. 우울, 불안, 트라우마 전문으로 상담하고 있으며, 많은 분들께 도움을 드리고 있습니다.",
    author: "박상담",
    authorAvatar: "박",
    createdAt: "2024-01-14",
    category: "심리상담",
    tags: ["전문가", "심리상담", "경력10년"],
    likes: 45,
    comments: 18,
    postType: "expert_intro",
    isExpert: true,
    profileVisibility: "public"
  },
  {
    id: "2",
    title: "재무 상담 정말 도움됐어요!",
    content: "투자와 저축에 대한 좋은 조언을 받았습니다. 전문가님 덕분에 재정 계획을 체계적으로 세울 수 있었어요.",
    author: "박민수",
    authorAvatar: "박",
    createdAt: "2024-01-13",
    category: "재무상담",
    tags: ["투자", "재무", "상담후기"],
    likes: 15,
    comments: 7,
    postType: "consultation_review",
  },
  {
    id: "ai-2",
    title: "[AI 상담 요약] 투자 초보자를 위한 조언",
    content: "AI와 함께 투자 기초에 대해 상담했습니다. 적금과 주식 투자의 차이점, 초보자가 주의해야 할 점들에 대해 알아봤습니다.",
    author: "익명사용자",
    authorAvatar: "익",
    createdAt: "2024-01-12",
    category: "투자상담",
    tags: ["AI상담", "투자초보", "주식"],
    likes: 31,
    comments: 15,
    postType: "consultation_request",
    isAISummary: true,
    urgency: "낮음",
    preferredMethod: "채팅상담",
  },
  {
    id: "general-1",
    title: "상담 플랫폼 이용 팁 공유",
    content: "처음 상담 플랫폼을 이용하시는 분들을 위해 유용한 팁들을 정리해봤습니다.",
    author: "상담고수",
    authorAvatar: "상",
    createdAt: "2024-01-11",
    category: "기타",
    tags: ["팁", "플랫폼", "가이드"],
    likes: 22,
    comments: 9,
    postType: "general",
  },
  {
    id: "req-2",
    title: "직장 내 스트레스 관리 상담 요청",
    content: "최근 업무 스트레스가 심해져서 일상생활에 지장이 있습니다. 효과적인 스트레스 관리 방법을 배우고 싶어요.",
    author: "직장인A",
    authorAvatar: "직",
    createdAt: "2024-01-10",
    category: "심리상담",
    tags: ["스트레스", "직장", "관리방법"],
    likes: 18,
    comments: 6,
    postType: "consultation_request",
    urgency: "높음",
    preferredMethod: "화상상담",
  },
  {
    id: "expert-2",
    title: "재무설계 전문가 이재무입니다",
    content: "15년 경력의 재무설계사입니다. 개인 맞춤형 재무 계획 수립과 투자 포트폴리오 구성을 도와드립니다.",
    author: "이재무",
    authorAvatar: "이",
    createdAt: "2024-01-09",
    category: "재무상담",
    tags: ["전문가", "재무설계", "투자"],
    likes: 38,
    comments: 12,
    postType: "expert_intro",
    isExpert: true,
  },
  {
    id: "3",
    title: "법률 상담 후기 - 계약서 검토",
    content: "부동산 계약서 검토를 위해 법률 상담을 받았는데, 숨겨진 조항들을 찾아주셔서 큰 손해를 피할 수 있었습니다.",
    author: "김부동산",
    authorAvatar: "김",
    createdAt: "2024-01-08",
    category: "법률상담",
    tags: ["계약서", "부동산", "상담후기"],
    likes: 28,
    comments: 11,
    postType: "consultation_review",
  },
  {
    id: "req-3",
    title: "건강상담 - 다이어트 관련 조언 구합니다",
    content: "건강한 다이어트 방법과 운동 루틴에 대해 전문가의 조언을 구하고 싶습니다.",
    author: "건강지킴이",
    authorAvatar: "건",
    createdAt: "2024-01-07",
    category: "건강상담",
    tags: ["다이어트", "운동", "건강"],
    likes: 16,
    comments: 8,
    postType: "consultation_request",
    urgency: "보통",
    preferredMethod: "화상상담",
  },
  {
    id: "expert-3",
    title: "법무법인 대표변호사 김법률입니다",
    content: "20년 경력의 변호사로 민사, 형사, 가사 전 분야 상담 가능합니다. 복잡한 법적 문제도 쉽게 설명해드립니다.",
    author: "김법률",
    authorAvatar: "김",
    createdAt: "2024-01-06",
    category: "법률상담",
    tags: ["전문가", "변호사", "법률"],
    likes: 52,
    comments: 23,
    postType: "expert_intro",
    isExpert: true,
  },
  {
    id: "4",
    title: "교육상담 후기 - 자녀 진학 상담",
    content: "고등학생 자녀의 대학 진학 상담을 받았는데, 구체적인 로드맵을 제시해주셔서 매우 도움이 되었습니다.",
    author: "학부모A",
    authorAvatar: "학",
    createdAt: "2024-01-05",
    category: "교육상담",
    tags: ["진학", "교육", "자녀"],
    likes: 19,
    comments: 4,
    postType: "consultation_review",
  },
  {
    id: "req-4",
    title: "사업 아이템 검증 상담 요청",
    content: "새로운 사업 아이템에 대한 시장성과 실현 가능성을 검토받고 싶습니다.",
    author: "예비사업가",
    authorAvatar: "예",
    createdAt: "2024-01-04",
    category: "사업상담",
    tags: ["사업", "창업", "아이템"],
    likes: 25,
    comments: 11,
    postType: "consultation_request",
    urgency: "높음",
    preferredMethod: "화상상담",
  },
  {
    id: "5",
    title: "기술상담 후기 - 앱 개발 관련",
    content: "모바일 앱 개발에 대한 기술적 조언을 받았습니다. 개발 방향성을 잡는데 큰 도움이 되었어요.",
    author: "개발초보",
    authorAvatar: "개",
    createdAt: "2024-01-03",
    category: "기술상담",
    tags: ["앱개발", "기술", "모바일"],
    likes: 33,
    comments: 14,
    postType: "consultation_review",
  },
  {
    id: "expert-4",
    title: "디자인 스튜디오 대표 박디자인입니다",
    content: "UI/UX, 브랜딩, 그래픽 디자인 전문가입니다. 12년간 다양한 프로젝트를 진행했습니다.",
    author: "박디자인",
    authorAvatar: "박",
    createdAt: "2024-01-02",
    category: "디자인상담",
    tags: ["전문가", "디자인", "UI/UX"],
    likes: 41,
    comments: 16,
    postType: "expert_intro",
    isExpert: true,
  },
  {
    id: "req-5",
    title: "언어학습 방법 상담 요청",
    content: "영어 회화 실력 향상을 위한 효과적인 학습 방법을 알고 싶습니다.",
    author: "영어초보",
    authorAvatar: "영",
    createdAt: "2024-01-01",
    category: "언어상담",
    tags: ["영어", "회화", "학습법"],
    likes: 14,
    comments: 7,
    postType: "consultation_request",
    urgency: "보통",
    preferredMethod: "채팅상담",
  },
  {
    id: "6",
    title: "예술 활동 상담 후기",
    content: "취미로 시작한 그림 그리기를 전문적으로 배우고 싶어서 상담받았는데, 좋은 방향을 제시해주셨어요.",
    author: "그림러버",
    authorAvatar: "그",
    createdAt: "2023-12-30",
    category: "예술상담",
    tags: ["그림", "예술", "취미"],
    likes: 21,
    comments: 9,
    postType: "consultation_review",
  },
  {
    id: "req-6",
    title: "스포츠 부상 예방 상담",
    content: "축구를 하면서 자주 부상을 당하는데, 예방법과 재활 운동에 대해 상담받고 싶습니다.",
    author: "축구선수",
    authorAvatar: "축",
    createdAt: "2023-12-29",
    category: "스포츠상담",
    tags: ["축구", "부상예방", "재활"],
    likes: 18,
    comments: 6,
    postType: "consultation_request",
    urgency: "높음",
    preferredMethod: "화상상담",
  },
  {
    id: "7",
    title: "여행 계획 상담 정말 유용했어요!",
    content: "유럽 여행 계획을 세우는데 전문가의 조언이 정말 도움되었습니다. 숨겨진 명소들도 많이 알려주셨어요.",
    author: "여행매니아",
    authorAvatar: "여",
    createdAt: "2023-12-28",
    category: "여행상담",
    tags: ["유럽여행", "계획", "명소"],
    likes: 27,
    comments: 13,
    postType: "consultation_review",
  },
];

// 게시글 타입별 필터링 함수
export const getPostsByType = (type: CommunityPost['postType'] | 'all'): CommunityPost[] => {
  if (type === 'all') return communityPosts;
  return communityPosts.filter(post => post.postType === type);
};

// 카테고리별 필터링 함수
export const getPostsByCategory = (categoryId: string): CommunityPost[] => {
  if (categoryId === 'all') return communityPosts;
  
  // 카테고리 ID를 실제 카테고리 이름으로 매핑
  const categoryMap: Record<string, string> = {
    'career': '진로상담',
    'psychology': '심리상담', 
    'finance': '재무상담',
    'legal': '법률상담',
    'education': '교육상담',
    'health': '건강상담',
    'relationship': '관계상담',
    'business': '사업상담',
    'technology': '기술상담',
    'design': '디자인상담',
    'language': '언어상담',
    'art': '예술상담',
    'sports': '스포츠상담',
    'travel': '여행상담',
    'food': '요리상담',
    'fashion': '패션상담',
    'pet': '반려동물상담',
    'gardening': '정원상담',
    'investment': '투자상담',
    'tax': '세무상담',
    'insurance': '보험상담',
    'admission': '진학상담',
    'other': '기타'
  };

  const categoryName = categoryMap[categoryId];
  if (!categoryName) return [];
  
  return communityPosts.filter(post => post.category === categoryName);
};

// 게시글 검색 함수
export const searchPosts = (query: string): CommunityPost[] => {
  const lowercaseQuery = query.toLowerCase();
  return communityPosts.filter(post => 
    post.title.toLowerCase().includes(lowercaseQuery) ||
    post.content.toLowerCase().includes(lowercaseQuery) ||
    post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

// 게시글 정렬 함수
export const sortPosts = (posts: CommunityPost[], sortBy: 'latest' | 'popular' | 'comments' | 'views'): CommunityPost[] => {
  const sortedPosts = [...posts];
  
  switch (sortBy) {
    case 'latest':
      return sortedPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'popular':
      return sortedPosts.sort((a, b) => b.likes - a.likes);
    case 'comments':
      return sortedPosts.sort((a, b) => b.comments - a.comments);
    case 'views':
      // 뷰수 데이터가 없으므로 좋아요 + 댓글 수로 대체
      return sortedPosts.sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments));
    default:
      return sortedPosts;
  }
};

// 카테고리별 게시글 개수 계산 함수
export const getCategoryCount = (categoryId: string): number => {
  if (categoryId === 'all') return communityPosts.length;
  
  // 카테고리 ID를 실제 카테고리 이름으로 매핑
  const categoryMap: Record<string, string> = {
    'career': '진로상담',
    'psychology': '심리상담', 
    'finance': '재무상담',
    'legal': '법률상담',
    'education': '교육상담',
    'health': '건강상담',
    'relationship': '관계상담',
    'business': '사업상담',
    'technology': '기술상담',
    'design': '디자인상담',
    'language': '언어상담',
    'art': '예술상담',
    'sports': '스포츠상담',
    'travel': '여행상담',
    'food': '요리상담',
    'fashion': '패션상담',
    'pet': '반려동물상담',
    'gardening': '정원상담',
    'investment': '투자상담',
    'tax': '세무상담',
    'insurance': '보험상담',
    'admission': '진학상담',
    'other': '기타'
  };

  const categoryName = categoryMap[categoryId];
  if (!categoryName) return 0;
  
  return communityPosts.filter(post => post.category === categoryName).length;
};

// 모든 카테고리의 개수를 포함한 카테고리 목록 생성
export const getCategoriesWithCount = () => {
  const categories = [
    { id: "all", name: "전체" },
    { id: "career", name: "진로상담" },
    { id: "psychology", name: "심리상담" },
    { id: "finance", name: "재무상담" },
    { id: "legal", name: "법률상담" },
    { id: "education", name: "교육상담" },
    { id: "health", name: "건강상담" },
    { id: "relationship", name: "관계상담" },
    { id: "business", name: "사업상담" },
    { id: "technology", name: "기술상담" },
    { id: "design", name: "디자인상담" },
    { id: "language", name: "언어상담" },
    { id: "art", name: "예술상담" },
    { id: "sports", name: "스포츠상담" },
    { id: "travel", name: "여행상담" },
    { id: "food", name: "요리상담" },
    { id: "fashion", name: "패션상담" },
    { id: "pet", name: "반려동물상담" },
    { id: "gardening", name: "정원상담" },
    { id: "investment", name: "투자상담" },
    { id: "tax", name: "세무상담" },
    { id: "insurance", name: "보험상담" },
    { id: "admission", name: "진학상담" },
    { id: "other", name: "그외 기타" },
  ];

  return categories.map(category => ({
    ...category,
    count: getCategoryCount(category.id)
  }));
};
