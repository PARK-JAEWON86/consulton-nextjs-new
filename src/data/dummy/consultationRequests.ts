/**
 * 전문가별 상담 요청 더미 데이터
 * 전문가 대시보드에서 사용할 요청 관리 데이터
 */

export interface ConsultationRequest {
  id: string;
  expertId: number;
  clientId: string;
  clientName: string;
  clientEmail: string;
  topic: string;
  description: string;
  consultationType: 'video' | 'chat' | 'voice';
  preferredDate?: string; // ISO string
  preferredTime?: string; // "14:00" 형식
  duration: number; // 분
  budget: number; // 크레딧
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  requestedAt: string; // ISO string
  respondedAt?: string; // ISO string
  scheduledAt?: string; // ISO string
  notes?: string;
  tags?: string[];
}

// 더미 클라이언트 정보
const dummyRequestClients = [
  { id: 'client_req_001', name: '김영수', email: 'youngsu.kim@email.com' },
  { id: 'client_req_002', name: '박미나', email: 'mina.park@email.com' },
  { id: 'client_req_003', name: '이준호', email: 'junho.lee@email.com' },
  { id: 'client_req_004', name: '정서연', email: 'seoyeon.jung@email.com' },
  { id: 'client_req_005', name: '최동민', email: 'dongmin.choi@email.com' },
  { id: 'client_req_006', name: '한지원', email: 'jiwon.han@email.com' },
  { id: 'client_req_007', name: '송현아', email: 'hyuna.song@email.com' },
  { id: 'client_req_008', name: '임태윤', email: 'taeyoon.lim@email.com' },
  { id: 'client_req_009', name: '윤서진', email: 'seojin.yoon@email.com' },
  { id: 'client_req_010', name: '강민수', email: 'minsu.kang@email.com' },
  { id: 'client_req_011', name: '조은혜', email: 'eunhye.cho@email.com' },
  { id: 'client_req_012', name: '신재현', email: 'jaehyun.shin@email.com' },
  { id: 'client_req_013', name: '홍수빈', email: 'subin.hong@email.com' },
  { id: 'client_req_014', name: '오지현', email: 'jihyun.oh@email.com' },
  { id: 'client_req_015', name: '배준영', email: 'junyoung.bae@email.com' },
];

// 전문가별 상담 요청 주제 및 설명
const requestTopics = {
  1: [ // 박지영 - 심리상담
    { topic: '우울증 극복 상담', desc: '최근 우울감이 심해져서 전문적인 도움이 필요합니다.', priority: 'high' as const },
    { topic: '불안장애 치료', desc: '사회불안과 공황장애 증상으로 고생하고 있습니다.', priority: 'urgent' as const },
    { topic: '대인관계 개선', desc: '직장 동료들과의 관계에서 어려움을 겪고 있습니다.', priority: 'normal' as const },
    { topic: '자존감 향상', desc: '자신감 부족으로 인해 여러 문제가 발생하고 있습니다.', priority: 'normal' as const },
    { topic: '스트레스 관리', desc: '업무 스트레스로 인한 번아웃 증상이 있습니다.', priority: 'high' as const },
  ],
  2: [ // 이민수 - 법률상담
    { topic: '임대차 분쟁 해결', desc: '임대인과 보증금 반환 문제로 분쟁이 있습니다.', priority: 'urgent' as const },
    { topic: '근로계약서 검토', desc: '새로운 회사 계약서의 조건을 검토해주세요.', priority: 'normal' as const },
    { topic: '손해배상 청구', desc: '교통사고 관련 손해배상 절차를 알고 싶습니다.', priority: 'high' as const },
    { topic: '상속 문제 상담', desc: '부모님 유산 상속 과정에서 문제가 생겼습니다.', priority: 'high' as const },
  ],
  3: [ // 이소연 - 재무상담
    { topic: '투자 포트폴리오 구성', desc: '안전한 투자 방법에 대해 조언을 구합니다.', priority: 'normal' as const },
    { topic: '은퇴 자금 계획', desc: '40대 직장인의 은퇴 준비 전략이 필요합니다.', priority: 'normal' as const },
    { topic: '부채 정리 방안', desc: '신용카드 대출 정리 방법을 알고 싶습니다.', priority: 'high' as const },
    { topic: '세무 절약 방법', desc: '연말정산 최적화 방안을 상담받고 싶습니다.', priority: 'low' as const },
  ],
  4: [ // 김진우 - 진로상담
    { topic: '취업 전략 수립', desc: '신입 개발자 취업을 위한 전략을 세우고 싶습니다.', priority: 'high' as const },
    { topic: '이직 상담', desc: '현재 직장에서 이직을 고려하고 있습니다.', priority: 'normal' as const },
    { topic: '경력 전환', desc: '마케팅에서 IT 분야로 전환하고 싶습니다.', priority: 'high' as const },
    { topic: '면접 준비', desc: '대기업 면접 준비를 도와주세요.', priority: 'urgent' as const },
  ],
  5: [ // 정수민 - 교육상담
    { topic: '대입 전략 상담', desc: '수시와 정시 전략을 세우고 싶습니다.', priority: 'urgent' as const },
    { topic: '학습법 개선', desc: '효율적인 공부 방법을 알고 싶습니다.', priority: 'normal' as const },
    { topic: '진학 상담', desc: '대학원 진학을 고려하고 있습니다.', priority: 'normal' as const },
    { topic: '자녀 교육', desc: '중학생 자녀의 학습 동기 부여가 필요합니다.', priority: 'high' as const },
  ],
  12: [ // 김태수 - IT상담
    { topic: 'AI 시스템 설계', desc: '머신러닝 기반 추천 시스템 구축 방법을 알고 싶습니다.', priority: 'high' as const },
    { topic: '클라우드 마이그레이션', desc: 'AWS로 기존 시스템 이전을 계획하고 있습니다.', priority: 'urgent' as const },
    { topic: '시스템 성능 최적화', desc: '대용량 트래픽 처리를 위한 최적화가 필요합니다.', priority: 'high' as const },
    { topic: '개발팀 리딩', desc: '신입 개발자들을 효과적으로 관리하는 방법을 알고 싶습니다.', priority: 'normal' as const },
    { topic: '보안 컨설팅', desc: '서비스 보안 강화 방안을 상담받고 싶습니다.', priority: 'urgent' as const },
  ],
  13: [ // 박영희 - 유튜브상담
    { topic: '채널 성장 전략', desc: '구독자 1만명 달성을 위한 전략이 필요합니다.', priority: 'normal' as const },
    { topic: '콘텐츠 기획', desc: '요리 채널 콘텐츠 아이디어를 얻고 싶습니다.', priority: 'normal' as const },
    { topic: '수익화 방법', desc: '유튜브 광고 외 추가 수익 창출 방법을 알고 싶습니다.', priority: 'high' as const },
  ],
  14: [ // 이강민 - 투자상담
    { topic: '해외 주식 투자', desc: '미국 주식 투자 전략을 세우고 싶습니다.', priority: 'high' as const },
    { topic: '부동산 투자', desc: '첫 부동산 투자를 계획하고 있습니다.', priority: 'urgent' as const },
    { topic: '리스크 관리', desc: '포트폴리오 리스크를 줄이는 방법을 알고 싶습니다.', priority: 'normal' as const },
    { topic: '대체투자', desc: 'REITs와 원자재 투자에 대해 알고 싶습니다.', priority: 'normal' as const },
  ],
  15: [ // 최지은 - 디자인상담
    { topic: 'UX/UI 개선', desc: '모바일 앱의 사용성을 개선하고 싶습니다.', priority: 'high' as const },
    { topic: '브랜드 아이덴티티', desc: '스타트업 브랜딩 작업을 진행하고 있습니다.', priority: 'normal' as const },
    { topic: '디자인 시스템', desc: '일관된 디자인 시스템 구축이 필요합니다.', priority: 'normal' as const },
  ],
  20: [ // 조현우 - 부동산상담
    { topic: '매매 시점 분석', desc: '아파트 매매 적정 시기를 판단하고 싶습니다.', priority: 'urgent' as const },
    { topic: '투자용 부동산', desc: '수익형 부동산 투자를 고려하고 있습니다.', priority: 'high' as const },
    { topic: '임대 수익률', desc: '오피스텔 임대 수익률을 분석해주세요.', priority: 'normal' as const },
  ]
};

// 상담 요청 생성 함수
function generateConsultationRequests(): ConsultationRequest[] {
  const requests: ConsultationRequest[] = [];
  const now = new Date();
  
  // 각 전문가별로 요청 생성
  Object.keys(requestTopics).forEach(expertIdStr => {
    const expertId = parseInt(expertIdStr);
    const topics = requestTopics[expertId as keyof typeof requestTopics];
    
    // 전문가별 시급 (expertAccounts와 동일)
    const ratePerMin = {
      1: 1250,   // 박지영
      2: 1000,   // 이민수
      3: 750,    // 이소연
      4: 833,    // 김진우
      5: 1000,   // 정수민
      12: 6000,  // 김태수
      13: 750,   // 박영희
      14: 4000,  // 이강민
      15: 1333,  // 최지은
      20: 2400   // 조현우
    }[expertId] || 1000;
    
    // 전문가별 요청 수 (인기도에 따라)
    const requestCount = {
      1: 8,    // 박지영 - 심리상담 (높은 수요)
      2: 6,    // 이민수 - 법률상담
      3: 5,    // 이소연 - 재무상담
      4: 7,    // 김진우 - 진로상담
      5: 6,    // 정수민 - 교육상담
      12: 12,  // 김태수 - IT상담 (최고 수요)
      13: 4,   // 박영희 - 유튜브상담
      14: 9,   // 이강민 - 투자상담
      15: 5,   // 최지은 - 디자인상담
      20: 7    // 조현우 - 부동산상담
    }[expertId] || 5;
    
    // 상태별 분포 설정
    const statusDistribution = ['pending', 'pending', 'pending', 'accepted', 'accepted', 'rejected', 'completed'];
    
    for (let i = 0; i < requestCount; i++) {
      // 최근 2주 내 랜덤 날짜
      const daysAgo = Math.floor(Math.random() * 14);
      const requestDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
      
      // 랜덤 클라이언트 및 주제 선택
      const client = dummyRequestClients[Math.floor(Math.random() * dummyRequestClients.length)];
      const topicData = topics[Math.floor(Math.random() * topics.length)];
      
      // 상담 시간 및 예산
      const duration = [30, 45, 60, 90][Math.floor(Math.random() * 4)];
      const budget = duration * ratePerMin;
      
      // 상태 결정
      const status = statusDistribution[Math.floor(Math.random() * statusDistribution.length)] as ConsultationRequest['status'];
      
      // 선호 날짜/시간 (미래 날짜)
      const preferredDate = new Date(now.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000);
      const preferredHours = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
      const preferredTime = preferredHours[Math.floor(Math.random() * preferredHours.length)];
      
      const request: ConsultationRequest = {
        id: `req_${expertId}_${i + 1}_${Date.now() + i}`,
        expertId,
        clientId: client.id,
        clientName: client.name,
        clientEmail: client.email,
        topic: topicData.topic,
        description: topicData.desc,
        consultationType: ['video', 'chat', 'voice'][Math.floor(Math.random() * 3)] as any,
        preferredDate: preferredDate.toISOString(),
        preferredTime,
        duration,
        budget: Math.floor(budget / 10), // KRW to Credits
        status,
        priority: topicData.priority,
        requestedAt: requestDate.toISOString(),
        respondedAt: status !== 'pending' ? new Date(requestDate.getTime() + Math.random() * 24 * 60 * 60 * 1000).toISOString() : undefined,
        scheduledAt: status === 'accepted' ? preferredDate.toISOString() : undefined,
        notes: status === 'rejected' ? '일정 조율이 어려워 다른 전문가를 추천드립니다.' : undefined,
        tags: [topicData.topic.split(' ')[0], status === 'urgent' ? '긴급' : '일반']
      };
      
      requests.push(request);
    }
  });
  
  // 최신순 정렬
  return requests.sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
}

// 전체 상담 요청
export const consultationRequests = generateConsultationRequests();

// 전문가별 요청 조회
export const getRequestsByExpert = (expertId: number): ConsultationRequest[] => {
  return consultationRequests.filter(request => request.expertId === expertId);
};

// 상태별 요청 조회
export const getRequestsByStatus = (expertId: number, status: ConsultationRequest['status']): ConsultationRequest[] => {
  return getRequestsByExpert(expertId).filter(request => request.status === status);
};

// 우선순위별 요청 조회
export const getRequestsByPriority = (expertId: number, priority: ConsultationRequest['priority']): ConsultationRequest[] => {
  return getRequestsByExpert(expertId).filter(request => request.priority === priority);
};

// 요청 통계
export const getRequestStats = (expertId: number) => {
  const requests = getRequestsByExpert(expertId);
  
  const totalRequests = requests.length;
  const pendingRequests = requests.filter(r => r.status === 'pending').length;
  const acceptedRequests = requests.filter(r => r.status === 'accepted').length;
  const rejectedRequests = requests.filter(r => r.status === 'rejected').length;
  const completedRequests = requests.filter(r => r.status === 'completed').length;
  
  const urgentRequests = requests.filter(r => r.priority === 'urgent').length;
  const highPriorityRequests = requests.filter(r => r.priority === 'high').length;
  
  const totalBudget = requests.reduce((sum, r) => sum + r.budget, 0);
  const avgBudget = totalRequests > 0 ? Math.round(totalBudget / totalRequests) : 0;
  
  return {
    totalRequests,
    pendingRequests,
    acceptedRequests,
    rejectedRequests,
    completedRequests,
    urgentRequests,
    highPriorityRequests,
    totalBudget,
    avgBudget,
    acceptanceRate: totalRequests > 0 ? Math.round((acceptedRequests / (acceptedRequests + rejectedRequests)) * 100) : 0,
  };
};

// 개발용 콘솔 출력
export const printRequestStats = () => {
  console.log('\n📋 전문가별 상담 요청 통계:');
  console.log('='.repeat(80));
  
  Object.keys(requestTopics).forEach(expertIdStr => {
    const expertId = parseInt(expertIdStr);
    const stats = getRequestStats(expertId);
    
    console.log(`\n전문가 ID ${expertId}:`);
    console.log(`  📨 총 요청: ${stats.totalRequests}건`);
    console.log(`  ⏳ 대기 중: ${stats.pendingRequests}건`);
    console.log(`  ✅ 수락됨: ${stats.acceptedRequests}건`);
    console.log(`  ❌ 거절됨: ${stats.rejectedRequests}건`);
    console.log(`  🎯 완료됨: ${stats.completedRequests}건`);
    console.log(`  🚨 긴급: ${stats.urgentRequests}건`);
    console.log(`  💰 총 예산: ${stats.totalBudget.toLocaleString()}크레딧`);
    console.log(`  📈 수락률: ${stats.acceptanceRate}%`);
  });
  
  console.log('\n' + '='.repeat(80));
};

// 브라우저에서 사용할 수 있도록 전역 객체에 등록
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).consultationRequests = consultationRequests;
  (window as any).getRequestsByExpert = getRequestsByExpert;
  (window as any).getRequestsByStatus = getRequestsByStatus;
  (window as any).getRequestStats = getRequestStats;
  (window as any).printRequestStats = printRequestStats;
  
  // 자동으로 통계 정보 출력
  setTimeout(() => {
    printRequestStats();
  }, 3000);
}
