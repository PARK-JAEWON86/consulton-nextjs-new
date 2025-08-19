# 정산/출금 시스템 구현 가이드

## 🏗️ 아키텍처 개요

이 정산 시스템은 **Repository Pattern + Service Layer** 구조로 설계되어 DB/백엔드 교체가 용이하도록 구현되었습니다.

```
📁 src/
├── 📁 types/settlement.ts          # 순수 비즈니스 타입 정의
├── 📁 repositories/
│   ├── 📁 interfaces/              # Repository 추상화 인터페이스
│   └── 📁 implementations/         # 구체적 구현체 (Mock, Firebase 등)
├── 📁 services/                    # 비즈니스 로직 레이어
│   ├── 📁 settlement/              # 정산 관련 서비스
│   └── 📁 payment/                 # 결제 관련 서비스
├── 📁 config/                      # 환경 설정 및 의존성 주입
└── 📁 app/api/                     # Next.js API 라우트
```

## 🔧 핵심 설계 원칙

### 1. 추상화 레이어
- **Repository Interface**: 데이터 접근을 추상화하여 DB 교체 시에도 비즈니스 로직 변경 없음
- **Service Layer**: 순수한 비즈니스 로직으로 DB/프레임워크와 무관
- **의존성 주입**: 런타임에 환경별로 다른 구현체 주입

### 2. 환경별 구현체
```typescript
// 환경 변수로 구현체 선택
DATABASE_TYPE=mock      # 개발 초기
DATABASE_TYPE=firebase  # 프로덕션
DATABASE_TYPE=postgresql # 확장 시
```

### 3. 이중부기 회계 시스템
```typescript
// 크레딧 충전 시
Debit: cash = 10000원
Credit: credits_liab = 10000원

// 세션 과금 시  
Debit: credits_liab = 30000원
Credit: revenue_platform = 3600원 (12%)
Credit: payable_expert = 26400원 (88%)
```

## 🚀 빠른 시작

### 1. 환경 설정
```bash
# .env 파일 생성
cp .env.example .env

# 개발 환경 설정
NODE_ENV=development
DATABASE_TYPE=mock
SETTLEMENT_DAY=5
WITHHOLD_3_3=true
PLATFORM_FEE_BP=1200
```

### 2. 테스트 실행
```typescript
// 브라우저 콘솔에서
await window.settlementTester.runFullScenario();
```

### 3. API 테스트
```bash
# 크레딧 충전
curl -X POST /api/credits/topup/intent \
  -H "Content-Type: application/json" \
  -d '{"userId":"client_1","amountKrw":10000}'

# 세션 완료
curl -X POST /api/sessions/complete \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"session_1","clientId":"client_1","expertId":"expert_1","startedAt":1640995200000,"endedAt":1640997000000,"durationMin":30,"ratePerMinKrw":1000}'

# 월별 정산 실행 (드라이런)
curl -X POST "/api/settlements/run?month=2025-01&dryRun=true" \
  -H "Authorization: Bearer admin-token"
```

## 📊 비즈니스 로직

### 1. 크레딧 시스템
- **1 크레딧 = 10원** 고정 환율
- 충전 시 PG 수수료(2%) 즉시 비용 처리
- 세션 시 크레딧 차감 및 매출 인식

### 2. 정산 정책
- **매월 5일 자동 정산** (Vercel Cron)
- **플랫폼 수수료 12%** (전문가 매출 기준)
- **원천징수 3.3%** (환경 변수로 토글 가능)

### 3. 회계 처리
```typescript
// 정산 시 장부 기록
Debit: payable_expert = 100000원    // 전문가 채무 감소
Credit: cash = 96700원              // 실제 지급액
Credit: tax_withheld = 3300원       // 원천징수세 (3.3%)
```

## 🔄 DB/백엔드 교체 방법

### 1. 새로운 Repository 구현체 생성
```typescript
// src/repositories/implementations/PostgreSQLRepositories.ts
export class PostgreSQLUserRepository implements UserRepository {
  async getUserById(userId: string): Promise<User | null> {
    // PostgreSQL 구현
  }
  // ... 다른 메서드들
}
```

### 2. Factory에 구현체 등록
```typescript
// src/config/SettlementConfig.ts
private createContainer(): ExtendedRepositoryContainer {
  switch (this.config.DATABASE_TYPE) {
    case 'postgresql':
      return new PostgreSQLRepositoryFactory().createContainer();
    // ...
  }
}
```

### 3. 환경 변수 변경
```bash
DATABASE_TYPE=postgresql
DATABASE_URL=postgresql://...
```

## 🧪 테스트 시나리오

### 전체 플로우 테스트
```typescript
const tester = new SettlementTester();

// 1. 테스트 데이터 초기화
await tester.initializeTestData();

// 2. 크레딧 충전 (100,000원)
await tester.testCreditTopup('client_1', 100000);

// 3. 세션 완료 (30분 × 1000원/분 = 30,000원)
await tester.testSessionComplete('session_1', 'client_1', 'expert_1', 30, 1000);

// 4. 월별 정산 실행
await tester.testMonthlySettlement('2025-01', true);

// 5. 통계 확인
await tester.printStats();
```

## 📈 확장 계획

### 1. 실제 DB 연동
- **Firebase**: 초기 프로덕션 환경
- **PostgreSQL**: 대용량 처리 시
- **MongoDB**: NoSQL 요구 시

### 2. 고급 기능
- 레벨별 주간 정산
- 대량 송금 API 연동
- 원천세 신고 파일 생성
- 실시간 정산 대시보드

### 3. 성능 최적화
- 배치 처리 큐 시스템
- 캐싱 레이어 추가
- 읽기 전용 복제본 활용

## 🔐 보안 고려사항

### 1. API 보안
- 관리자 API는 JWT 토큰 검증
- 웹훅은 서명 검증 필수
- Rate Limiting 적용

### 2. 데이터 무결성
- 트랜잭션 원자성 보장
- 멱등성 키로 중복 처리 방지
- 장부 불변성 유지

### 3. 감사 로그
- 모든 금전 거래 기록
- 사용자 액션 추적
- 에러 모니터링

## 📞 문의 및 지원

구현 과정에서 문제가 발생하거나 추가 기능이 필요한 경우:

1. **개발 환경 테스트**: `window.settlementTester.runFullScenario()`
2. **로그 확인**: 브라우저 콘솔 및 서버 로그
3. **설정 검증**: `validateConfig()` 함수 활용

---

이 시스템은 **확장성과 유지보수성**을 최우선으로 설계되었습니다. 
초기에는 Mock 구현체로 개발을 진행하고, 필요에 따라 실제 DB로 점진적 마이그레이션할 수 있습니다.
