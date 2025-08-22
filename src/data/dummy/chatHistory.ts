export interface ChatHistoryItem {
  id: string;
  title: string;
  timestamp: Date;
  category: string;
  summary?: string;
}

export const chatHistoryData: ChatHistoryItem[] = [
  {
    id: "1",
    title: "이직 준비 어떻게 해야 할까요?",
    timestamp: new Date("2024-01-15T10:30:00"),
    category: "커리어",
    summary: "이직 준비 과정과 주의사항에 대한 상담"
  },
  {
    id: "2",
    title: "프로젝트 관리 방법 알려주세요",
    timestamp: new Date("2024-01-15T14:20:00"),
    category: "업무",
    summary: "효율적인 프로젝트 관리와 일정 조율 방법"
  },
  {
    id: "3",
    title: "면접 질문 대비 방법",
    timestamp: new Date("2024-01-14T16:45:00"),
    category: "커리어",
    summary: "면접에서 자주 나오는 질문과 답변 팁"
  },
  {
    id: "4",
    title: "팀워크 개선 방안",
    timestamp: new Date("2024-01-14T11:15:00"),
    category: "업무",
    summary: "팀 내 소통과 협업을 개선하는 방법"
  },
  {
    id: "5",
    title: "업무 스트레스 관리",
    timestamp: new Date("2024-01-13T15:30:00"),
    category: "웰빙",
    summary: "직장에서의 스트레스 관리와 균형 잡기"
  },
  {
    id: "6",
    title: "새로운 기술 학습 계획",
    timestamp: new Date("2024-01-13T09:45:00"),
    category: "개발",
    summary: "새로운 프로그래밍 언어나 기술 학습 로드맵"
  },
  {
    id: "7",
    title: "회사 문화 적응하기",
    timestamp: new Date("2024-01-12T13:20:00"),
    category: "업무",
    summary: "새로운 회사에서 빠르게 적응하는 방법"
  },
  {
    id: "8",
    title: "업무 효율성 향상",
    timestamp: new Date("2024-01-12T17:10:00"),
    category: "업무",
    summary: "업무 시간을 단축하고 효율성을 높이는 팁"
  },
  {
    id: "9",
    title: "코딩 문제 해결 방법",
    timestamp: new Date("2024-01-11T10:00:00"),
    category: "개발",
    summary: "프로그래밍 문제를 체계적으로 해결하는 방법"
  },
  {
    id: "10",
    title: "업무와 개인생활 균형",
    timestamp: new Date("2024-01-11T14:30:00"),
    category: "웰빙",
    summary: "일과 삶의 균형을 맞추는 방법"
  },
  {
    id: "11",
    title: "커리어 계획 수립",
    timestamp: new Date("2024-01-10T16:20:00"),
    category: "커리어",
    summary: "장기적인 커리어 목표 설정과 계획 수립"
  },
  {
    id: "12",
    title: "업무 소통 스킬 향상",
    timestamp: new Date("2024-01-10T11:45:00"),
    category: "업무",
    summary: "동료나 상사와의 효과적인 소통 방법"
  },
  {
    id: "13",
    title: "코드 리뷰 받는 방법",
    timestamp: new Date("2024-01-09T15:15:00"),
    category: "개발",
    summary: "코드 품질을 높이는 리뷰 과정 활용법"
  },
  {
    id: "14",
    title: "업무 환경 개선 제안",
    timestamp: new Date("2024-01-09T09:30:00"),
    category: "업무",
    summary: "회사에 업무 환경 개선안을 제안하는 방법"
  },
  {
    id: "15",
    title: "개발자 포트폴리오 만들기",
    timestamp: new Date("2024-01-08T14:00:00"),
    category: "개발",
    summary: "개발자로서 자신을 어필할 수 있는 포트폴리오 작성법"
  }
];

export const getChatHistory = (limit?: number): ChatHistoryItem[] => {
  if (limit) {
    return chatHistoryData.slice(0, limit);
  }
  return chatHistoryData;
};

export const getChatHistoryByCategory = (category: string): ChatHistoryItem[] => {
  return chatHistoryData.filter(item => item.category === category);
};

export const searchChatHistory = (query: string): ChatHistoryItem[] => {
  const lowercaseQuery = query.toLowerCase();
  return chatHistoryData.filter(item => 
    item.title.toLowerCase().includes(lowercaseQuery) ||
    item.summary?.toLowerCase().includes(lowercaseQuery) ||
    item.category.toLowerCase().includes(lowercaseQuery)
  );
};
