/**
 * 전문가별 상담 내역 더미 데이터
 * 정산 시스템에서 사용할 완료된 상담 데이터
 */

export interface ConsultationRecord {
  id: string;
  expertId: number;
  clientId: string;
  clientName: string;
  topic: string;
  consultationType: 'video' | 'chat' | 'voice';
  startedAt: string; // ISO string
  endedAt: string;   // ISO string
  durationMin: number;
  ratePerMinKrw: number;
  totalKrw: number;
  platformFeeKrw: number; // 12%
  expertGrossKrw: number; // 88%
  infraCostKrw: number;
  status: 'completed' | 'cancelled';
  rating?: number; // 1-5
  review?: string;
  createdAt: string;
}

// 더미 클라이언트 정보
const dummyClients = [
  { id: 'client_001', name: '김민수' },
  { id: 'client_002', name: '이영희' },
  { id: 'client_003', name: '박철수' },
  { id: 'client_004', name: '정수연' },
  { id: 'client_005', name: '최지현' },
  { id: 'client_006', name: '한동욱' },
  { id: 'client_007', name: '송미래' },
  { id: 'client_008', name: '임준호' },
  { id: 'client_009', name: '윤서아' },
  { id: 'client_010', name: '강태민' },
  { id: 'client_011', name: '조은비' },
  { id: 'client_012', name: '신현우' },
];

// 전문가별 상담 주제
const consultationTopics = {
  1: [ // 박지영 - 심리상담
    '우울증 상담', '불안장애 극복', '대인관계 고민', '자존감 향상', 
    '스트레스 관리', '감정조절 방법', '트라우마 치료', '수면장애 상담'
  ],
  2: [ // 이민수 - 법률상담
    '계약서 검토', '부동산 분쟁', '노동법 상담', '민사소송 절차',
    '임대차 계약', '상속 문제', '이혼 소송', '손해배상 청구'
  ],
  3: [ // 이소연 - 재무상담
    '투자 포트폴리오', '은퇴 자금 계획', '세무 절약 방법', '보험 상품 비교',
    '부채 관리 전략', '자산 배분', '펀드 투자', '주식 투자 입문'
  ],
  4: [ // 김진우 - 진로상담
    '취업 전략 수립', '이력서 첨삭', '면접 준비', '직장 이직 상담',
    '진로 전환', '자기소개서 작성', '경력 관리', '직무 적성 검사'
  ],
  5: [ // 정수민 - 교육상담
    '대입 전략', '학습법 개선', '진학 상담', '유학 준비',
    '자녀 교육', '학습 동기 부여', '시험 불안 극복', '전공 선택'
  ],
  12: [ // 김태수 - IT상담
    'AI/ML 시스템 설계', '클라우드 아키텍처', '시스템 최적화', '기술 스택 선택',
    '개발팀 리딩', '코드 리뷰', '성능 튜닝', '보안 컨설팅'
  ],
  13: [ // 박영희 - 유튜브상담
    '채널 기획', '콘텐츠 전략', '영상 편집', '구독자 늘리기',
    '수익화 방법', '썸네일 제작', '유튜브 알고리즘', '브랜딩 전략'
  ],
  14: [ // 이강민 - 투자상담
    '글로벌 투자 전략', '리스크 관리', '포트폴리오 리밸런싱', '대체투자',
    '부동산 투자', '채권 투자', '파생상품', '헤지펀드'
  ],
  15: [ // 최지은 - 디자인상담
    'UX/UI 개선', '브랜드 아이덴티티', '디자인 시스템', '사용성 테스트',
    '프로토타이핑', '디자인 트렌드', '색상 심리학', '타이포그래피'
  ],
  20: [ // 조현우 - 부동산상담
    '부동산 투자 전략', '매매 시점 분석', '임대 수익률', '부동산 세무',
    '재개발 투자', '상가 투자', '오피스텔 투자', '토지 투자'
  ]
};

// 상담 내역 생성 함수
function generateConsultationHistory(): ConsultationRecord[] {
  const records: ConsultationRecord[] = [];
  const now = new Date();
  
  // 각 전문가별로 최근 3개월간의 상담 내역 생성
  Object.keys(consultationTopics).forEach(expertIdStr => {
    const expertId = parseInt(expertIdStr);
    const topics = consultationTopics[expertId as keyof typeof consultationTopics];
    
    // 전문가별 시급 설정 (expertAccounts와 동일)
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
    
    // 전문가별 상담 건수 (레벨에 따라 차등)
    const consultationCount = {
      1: 15,   // 중급
      2: 12,   // 중급
      3: 8,    // 초급
      4: 10,   // 중급
      5: 13,   // 중급
      12: 25,  // 최고급
      13: 6,   // 초급
      14: 20,  // 고급
      15: 14,  // 중급
      20: 18   // 최고급
    }[expertId] || 10;
    
    for (let i = 0; i < consultationCount; i++) {
      // 최근 3개월 내 랜덤 날짜
      const daysAgo = Math.floor(Math.random() * 90);
      const consultationDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
      
      // 상담 시간 (30분~120분)
      const durationMin = [30, 45, 60, 90, 120][Math.floor(Math.random() * 5)];
      
      // 시작/종료 시간 설정
      const startHour = 9 + Math.floor(Math.random() * 10); // 9시~18시
      const startedAt = new Date(consultationDate);
      startedAt.setHours(startHour, 0, 0, 0);
      
      const endedAt = new Date(startedAt.getTime() + (durationMin * 60 * 1000));
      
      // 금액 계산
      const totalKrw = durationMin * ratePerMin;
      const platformFeeKrw = Math.floor(totalKrw * 0.12); // 12%
      const expertGrossKrw = totalKrw - platformFeeKrw;
      const infraCostKrw = Math.floor(durationMin * 6.35); // 6.35원/분
      
      // 랜덤 클라이언트 및 주제 선택
      const client = dummyClients[Math.floor(Math.random() * dummyClients.length)];
      const topic = topics[Math.floor(Math.random() * topics.length)];
      
      const record: ConsultationRecord = {
        id: `consultation_${expertId}_${i + 1}_${Date.now()}`,
        expertId,
        clientId: client.id,
        clientName: client.name,
        topic,
        consultationType: ['video', 'chat', 'voice'][Math.floor(Math.random() * 3)] as any,
        startedAt: startedAt.toISOString(),
        endedAt: endedAt.toISOString(),
        durationMin,
        ratePerMinKrw: ratePerMin,
        totalKrw,
        platformFeeKrw,
        expertGrossKrw,
        infraCostKrw,
        status: 'completed',
        rating: Math.floor(Math.random() * 2) + 4, // 4-5점 (높은 평점)
        review: Math.random() > 0.7 ? '매우 도움이 되었습니다. 감사합니다!' : undefined,
        createdAt: consultationDate.toISOString()
      };
      
      records.push(record);
    }
  });
  
  // 날짜순 정렬 (최신순)
  return records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// 전체 상담 내역
export const consultationHistory = generateConsultationHistory();

// 전문가별 상담 내역 조회
export const getConsultationsByExpert = (expertId: number): ConsultationRecord[] => {
  return consultationHistory.filter(record => record.expertId === expertId);
};

// 전문가별 정산 요약 정보
export const getSettlementSummary = (expertId: number) => {
  const consultations = getConsultationsByExpert(expertId);
  const completed = consultations.filter(c => c.status === 'completed');
  
  const totalConsultations = completed.length;
  const totalGrossKrw = completed.reduce((sum, c) => sum + c.expertGrossKrw, 0);
  const totalPlatformFeeKrw = completed.reduce((sum, c) => sum + c.platformFeeKrw, 0);
  const totalDurationMin = completed.reduce((sum, c) => sum + c.durationMin, 0);
  
  // 원천징수 계산 (3.3%)
  const taxWithheldKrw = Math.floor(totalGrossKrw * 0.033);
  const netPayoutKrw = totalGrossKrw - taxWithheldKrw;
  
  // 크레딧 변환 (10원 = 1크레딧)
  const totalGrossCredits = Math.floor(totalGrossKrw / 10);
  const netPayoutCredits = Math.floor(netPayoutKrw / 10);
  
  return {
    totalConsultations,
    totalDurationMin,
    totalGrossKrw,
    totalGrossCredits,
    totalPlatformFeeKrw,
    taxWithheldKrw,
    netPayoutKrw,
    netPayoutCredits,
    avgRating: completed.length > 0 
      ? Math.round((completed.reduce((sum, c) => sum + (c.rating || 0), 0) / completed.length) * 10) / 10
      : 0,
    avgDurationMin: completed.length > 0 
      ? Math.round(totalDurationMin / completed.length)
      : 0,
    lastConsultationDate: completed.length > 0 
      ? completed[0].createdAt 
      : null
  };
};

// 월별 상담 내역 조회
export const getMonthlyConsultations = (expertId: number, year: number, month: number): ConsultationRecord[] => {
  return consultationHistory.filter(record => {
    if (record.expertId !== expertId) return false;
    const date = new Date(record.createdAt);
    return date.getFullYear() === year && date.getMonth() === month - 1;
  });
};

// 최근 상담 내역 조회 (최대 N개)
export const getRecentConsultations = (expertId: number, limit: number = 10): ConsultationRecord[] => {
  return getConsultationsByExpert(expertId).slice(0, limit);
};

// 개발용 콘솔 출력
export const printConsultationSummary = () => {
  console.log('\n📊 전문가별 상담 내역 요약:');
  console.log('='.repeat(80));
  
  Object.keys(consultationTopics).forEach(expertIdStr => {
    const expertId = parseInt(expertIdStr);
    const summary = getSettlementSummary(expertId);
    
    console.log(`\n전문가 ID ${expertId}:`);
    console.log(`  📈 총 상담: ${summary.totalConsultations}건`);
    console.log(`  💰 총 수익: ${summary.totalGrossKrw.toLocaleString()}원 (${summary.totalGrossCredits.toLocaleString()}크레딧)`);
    console.log(`  💳 정산 예정: ${summary.netPayoutKrw.toLocaleString()}원 (${summary.netPayoutCredits.toLocaleString()}크레딧)`);
    console.log(`  ⭐ 평균 평점: ${summary.avgRating}점`);
    console.log(`  ⏱️ 평균 시간: ${summary.avgDurationMin}분`);
  });
  
  console.log('\n' + '='.repeat(80));
};

// 브라우저에서 사용할 수 있도록 전역 객체에 등록
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).consultationHistory = consultationHistory;
  (window as any).getConsultationsByExpert = getConsultationsByExpert;
  (window as any).getSettlementSummary = getSettlementSummary;
  (window as any).printConsultationSummary = printConsultationSummary;
  
  // 자동으로 요약 정보 출력
  setTimeout(() => {
    printConsultationSummary();
  }, 2000);
}
