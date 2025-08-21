# AI Usage API

AI 사용량을 관리하는 순수 API 엔드포인트입니다. 사용된 크레딧, 구매한 크레딧, 턴 사용량 추가, 월간 리셋 등의 기능을 제공합니다.

## 엔드포인트

`/api/ai-usage`

## HTTP 메서드

### GET
AI 사용량을 조회합니다. 월간 리셋 체크가 자동으로 실행됩니다.

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "usedCredits": 150,
    "purchasedCredits": 100,
    "remainingPercent": 70,
    "monthlyResetDate": "2024-01-21T10:00:00.000Z",
    "totalTurns": 50,
    "totalTokens": 25000,
    "averageTokensPerTurn": 500,
    "summary": {
      "totalCredits": 400,
      "freeCredits": 300,
      "usedFreeCredits": 150,
      "usedPurchasedCredits": 0,
      "remainingFreeCredits": 150,
      "remainingPurchasedCredits": 100,
      "nextResetDate": "2024-02-01T00:00:00.000Z"
    }
  }
}
```

### POST
AI 사용량 관리 액션을 실행합니다.

**요청 본문 형식:**
```json
{
  "action": "액션명",
  "data": {
    // 액션별 필요한 데이터
  }
}
```

**지원하는 액션들:**

#### addTurnUsage
턴 사용량을 추가하고 소모된 크레딧을 계산합니다.
```json
{
  "action": "addTurnUsage",
  "data": {
    "totalTokens": 600,
    "preciseMode": false
  }
}
```

**크레딧 계산 규칙:**
- 기본: 3 크레딧/턴
- 토큰 길이별 멀티플라이어:
  - 400 토큰 이하: 1.0x (3 크레딧)
  - 800 토큰 이하: 1.5x (5 크레딧)
  - 1200 토큰 이하: 2.0x (6 크레딧)
  - 1200 토큰 초과: 3.0x (9 크레딧)
- 정밀 모드: 1.5x 추가

#### addPurchasedCredits
구매한 크레딧을 추가합니다.
```json
{
  "action": "addPurchasedCredits",
  "data": {
    "credits": 50
  }
}
```

#### grantTurns
턴 수만큼 크레딧을 부여합니다.
```json
{
  "action": "grantTurns",
  "data": {
    "turns": 10
  }
}
```

#### resetMonthly
월간 사용량을 리셋합니다 (무료 크레딧만).
```json
{
  "action": "resetMonthly",
  "data": {}
}
```

#### resetAll
모든 사용량을 리셋합니다.
```json
{
  "action": "resetAll",
  "data": {}
}
```

#### initializeUsage
더미 데이터로 초기화합니다.
```json
{
  "action": "initializeUsage",
  "data": {}
}
```

#### simulateUsage
사용량 시뮬레이션을 실행합니다 (실제 상태에 반영되지 않음).
```json
{
  "action": "simulateUsage",
  "data": {
    "simulationTurns": 20,
    "tokensPerTurn": 500,
    "preciseMode": false
  }
}
```

### PATCH
AI 사용량을 부분적으로 업데이트합니다.

**요청 본문 예시:**
```json
{
  "updates": {
    "usedCredits": 200,
    "purchasedCredits": 150
  }
}
```

### DELETE
모든 AI 사용량을 초기화합니다.

## 사용 예시

### React 컴포넌트에서 직접 사용

```tsx
import { useState, useEffect } from 'react';

function AIUsageComponent() {
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(false);

  // AI 사용량 조회
  const fetchUsage = async () => {
    try {
      const response = await fetch('/api/ai-usage');
      const result = await response.json();
      
      if (result.success) {
        setUsage(result.data);
      }
    } catch (error) {
      console.error('AI 사용량 조회 실패:', error);
    }
  };

  // 턴 사용량 추가
  const handleAddTurnUsage = async (totalTokens, preciseMode = false) => {
    try {
      setLoading(true);
      const response = await fetch('/api/ai-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'addTurnUsage',
          data: { totalTokens, preciseMode }
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setUsage(result.data.newState);
        console.log(`소모된 크레딧: ${result.data.spentCredits}`);
      }
    } catch (error) {
      console.error('턴 사용량 추가 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 크레딧 구매
  const handleAddPurchasedCredits = async (credits) => {
    try {
      const response = await fetch('/api/ai-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'addPurchasedCredits',
          data: { credits }
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setUsage(result.data.newState);
      }
    } catch (error) {
      console.error('크레딧 구매 실패:', error);
    }
  };

  // 턴 부여
  const handleGrantTurns = async (turns) => {
    try {
      const response = await fetch('/api/ai-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'grantTurns',
          data: { turns }
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setUsage(result.data.newState);
        console.log(`부여된 크레딧: ${result.data.grantedCredits}`);
      }
    } catch (error) {
      console.error('턴 부여 실패:', error);
    }
  };

  // 월간 리셋
  const handleResetMonthly = async () => {
    try {
      const response = await fetch('/api/ai-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'resetMonthly',
          data: {}
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setUsage(result.data.newState);
      }
    } catch (error) {
      console.error('월간 리셋 실패:', error);
    }
  };

  // 사용량 시뮬레이션
  const handleSimulateUsage = async (simulationTurns, tokensPerTurn, preciseMode = false) => {
    try {
      const response = await fetch('/api/ai-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'simulateUsage',
          data: { simulationTurns, tokensPerTurn, preciseMode }
        })
      });
      
      const result = await response.json();
      if (result.success) {
        console.log('시뮬레이션 결과:', result.data.simulation);
      }
    } catch (error) {
      console.error('사용량 시뮬레이션 실패:', error);
    }
  };

  // 통계 초기화
  const handleInitializeUsage = async () => {
    try {
      const response = await fetch('/api/ai-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'initializeUsage',
          data: {}
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setUsage(result.data.newState);
      }
    } catch (error) {
      console.error('사용량 초기화 실패:', error);
    }
  };

  // 모든 사용량 리셋
  const handleResetAll = async () => {
    try {
      const response = await fetch('/api/ai-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'resetAll',
          data: {}
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setUsage(result.data.newState);
      }
    } catch (error) {
      console.error('전체 리셋 실패:', error);
    }
  };

  useEffect(() => {
    fetchUsage();
  }, []);

  if (!usage) return <div>로딩 중...</div>;

  return (
    <div>
      <h2>AI 사용량 관리</h2>
      
      {/* 초기화 및 리셋 */}
      <div>
        <button onClick={handleInitializeUsage}>
          더미 데이터로 초기화
        </button>
        <button onClick={handleResetMonthly}>
          월간 리셋
        </button>
        <button onClick={handleResetAll}>
          전체 리셋
        </button>
      </div>

      {/* 현재 상태 표시 */}
      <div>
        <h3>현재 상태</h3>
        <div>
          <p>사용된 크레딧: {usage.usedCredits}</p>
          <p>구매한 크레딧: {usage.purchasedCredits}</p>
          <p>남은 크레딧: {usage.remainingPercent}%</p>
          <p>총 턴: {usage.totalTurns}</p>
          <p>총 토큰: {usage.totalTokens.toLocaleString()}</p>
          <p>평균 토큰/턴: {usage.averageTokensPerTurn.toLocaleString()}</p>
          <p>월간 리셋 날짜: {new Date(usage.monthlyResetDate).toLocaleDateString()}</p>
        </div>
      </div>

      {/* 요약 정보 */}
      {usage.summary && (
        <div>
          <h3>요약 정보</h3>
          <div>
            <p>총 크레딧: {usage.summary.totalCredits}</p>
            <p>무료 크레딧: {usage.summary.freeCredits}</p>
            <p>사용된 무료 크레딧: {usage.summary.usedFreeCredits}</p>
            <p>사용된 구매 크레딧: {usage.summary.usedPurchasedCredits}</p>
            <p>남은 무료 크레딧: {usage.summary.remainingFreeCredits}</p>
            <p>남은 구매 크레딧: {usage.summary.remainingPurchasedCredits}</p>
            <p>다음 리셋: {new Date(usage.summary.nextResetDate).toLocaleDateString()}</p>
          </div>
        </div>
      )}

      {/* 사용량 추가 */}
      <div>
        <h3>사용량 추가</h3>
        <div>
          <button 
            onClick={() => handleAddTurnUsage(300, false)}
            disabled={loading}
          >
            {loading ? '처리 중...' : '턴 추가 (300 토큰)'}
          </button>
          <button onClick={() => handleAddTurnUsage(600, false)}>
            턴 추가 (600 토큰)
          </button>
          <button onClick={() => handleAddTurnUsage(1000, false)}>
            턴 추가 (1000 토큰)
          </button>
          <button onClick={() => handleAddTurnUsage(1500, false)}>
            턴 추가 (1500 토큰)
          </button>
          <button onClick={() => handleAddTurnUsage(600, true)}>
            턴 추가 (600 토큰, 정밀 모드)
          </button>
        </div>
      </div>

      {/* 크레딧 관리 */}
      <div>
        <h3>크레딧 관리</h3>
        <div>
          <button onClick={() => handleAddPurchasedCredits(50)}>
            크레딧 50 추가
          </button>
          <button onClick={() => handleAddPurchasedCredits(100)}>
            크레딧 100 추가
          </button>
          <button onClick={() => handleGrantTurns(10)}>
            턴 10개 부여
          </button>
          <button onClick={() => handleGrantTurns(20)}>
            턴 20개 부여
          </button>
        </div>
      </div>

      {/* 사용량 시뮬레이션 */}
      <div>
        <h3>사용량 시뮬레이션</h3>
        <div>
          <button onClick={() => handleSimulateUsage(10, 500, false)}>
            시뮬레이션 (10턴, 500토큰)
          </button>
          <button onClick={() => handleSimulateUsage(20, 800, false)}>
            시뮬레이션 (20턴, 800토큰)
          </button>
          <button onClick={() => handleSimulateUsage(15, 600, true)}>
            시뮬레이션 (15턴, 600토큰, 정밀 모드)
          </button>
        </div>
      </div>
    </div>
  );
}
```

### 유틸리티 함수로 분리

```typescript
// utils/aiUsageAPI.ts
export const aiUsageAPI = {
  // AI 사용량 조회
  async getUsage() {
    const response = await fetch('/api/ai-usage');
    const result = await response.json();
    return result.success ? result.data : null;
  },

  // 액션 실행
  async executeAction(action: string, data: any = {}) {
    const response = await fetch('/api/ai-usage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, data })
    });
    
    const result = await response.json();
    return result.success ? result.data : null;
  },

  // 편의 메서드들
  addTurnUsage: (totalTokens: number, preciseMode = false) => 
    aiUsageAPI.executeAction('addTurnUsage', { totalTokens, preciseMode }),
  addPurchasedCredits: (credits: number) => 
    aiUsageAPI.executeAction('addPurchasedCredits', { credits }),
  grantTurns: (turns: number) => 
    aiUsageAPI.executeAction('grantTurns', { turns }),
  resetMonthly: () => aiUsageAPI.executeAction('resetMonthly'),
  resetAll: () => aiUsageAPI.executeAction('resetAll'),
  initializeUsage: () => aiUsageAPI.executeAction('initializeUsage'),
  simulateUsage: (simulationTurns: number, tokensPerTurn: number, preciseMode = false) => 
    aiUsageAPI.executeAction('simulateUsage', { simulationTurns, tokensPerTurn, preciseMode }),

  // 부분 업데이트
  async updateUsagePartial(updates: any) {
    const response = await fetch('/api/ai-usage', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updates })
    });
    
    const result = await response.json();
    return result.success ? result.data : null;
  },

  // 사용량 초기화
  async resetAllUsage() {
    const response = await fetch('/api/ai-usage', { method: 'DELETE' });
    
    const result = await response.json();
    return result.success ? result.data : null;
  }
};

// 사용 예시
const handleAddTurn = async () => {
  const result = await aiUsageAPI.addTurnUsage(600, false);
  if (result) {
    console.log('턴이 추가되었습니다. 소모된 크레딧:', result.spentCredits);
    console.log('새로운 상태:', result.newState);
  }
};

const handlePurchaseCredits = async () => {
  const result = await aiUsageAPI.addPurchasedCredits(100);
  if (result) {
    console.log('크레딧이 구매되었습니다:', result.newState);
  }
};

const handleSimulation = async () => {
  const result = await aiUsageAPI.simulateUsage(20, 500, false);
  if (result) {
    console.log('시뮬레이션 결과:', result.simulation);
    console.log('예상 소모 크레딧:', result.simulation.totalSpentCredits);
  }
};
```

## 크레딧 계산 규칙

### 기본 크레딧
- **기본**: 3 크레딧/턴

### 토큰 길이별 멀티플라이어
| 토큰 범위 | 멀티플라이어 | 크레딧 |
|-----------|-------------|---------|
| 400 이하 | 1.0x | 3 |
| 800 이하 | 1.5x | 5 |
| 1200 이하 | 2.0x | 6 |
| 1200 초과 | 3.0x | 9 |

### 정밀 모드
- 정밀 모드 활성화 시 1.5배 추가
- 예: 600 토큰 + 정밀 모드 = 5 × 1.5 = 8 크레딧

### 월간 무료 크레딧
- **기본 제공**: 300 크레딧 (100턴 × 3크레딧)
- **리셋**: 매월 1일 자동 리셋
- **우선순위**: 무료 크레딧을 먼저 사용, 이후 구매 크레딧 사용

## 장점

1. **자동 월간 리셋**: GET 요청 시 자동으로 월간 리셋 체크
2. **정확한 크레딧 계산**: 토큰 길이와 정밀 모드에 따른 정확한 계산
3. **사용량 시뮬레이션**: 실제 사용 전 예상 비용 계산 가능
4. **상세한 요약 정보**: 무료/구매 크레딧 사용량 상세 분석
5. **실시간 상태 업데이트**: 모든 액션 후 즉시 상태 반영
6. **유연한 관리**: 부분 업데이트, 전체 리셋 등 다양한 관리 옵션

## 주의사항

1. **메모리 기반 저장**: 현재 구현은 메모리 기반이므로 서버 재시작 시 상태가 초기화됩니다.
2. **프로덕션 환경**: 실제 프로덕션에서는 데이터베이스를 사용하여 상태를 영구 저장하는 것을 권장합니다.
3. **월간 리셋**: GET 요청 시 자동으로 월간 리셋이 실행되므로 주의가 필요합니다.
4. **크레딧 정책**: 크레딧 계산 규칙은 비즈니스 요구사항에 따라 조정이 필요할 수 있습니다.
5. **에러 처리**: 모든 API 호출에 적절한 에러 처리를 구현해야 합니다.

## 마이그레이션 가이드

기존 Zustand 스토어에서 API 기반으로 마이그레이션하는 방법:

1. `useAIUsageStore` 제거
2. 컴포넌트에서 직접 `fetch` 사용
3. 상태 변경 후 `setState`로 로컬 상태 업데이트
4. 에러 처리 및 로딩 상태 관리 추가
5. 월간 리셋 로직을 API에 위임
