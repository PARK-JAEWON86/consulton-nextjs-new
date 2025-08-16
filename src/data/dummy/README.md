# 더미 데이터 관리

이 폴더는 개발 및 테스트를 위한 더미 데이터를 포함합니다.

## ⚠️ 중요: 실제 배포 전 삭제 필요

**실제 API 연동 완료 후 이 폴더 전체를 삭제해주세요.**

## 파일 구조

```
src/data/dummy/
├── README.md              # 이 파일
├── index.ts              # 통합 export 파일
├── experts.ts            # 전문가 데이터
├── consultations.ts      # 상담 관련 데이터
├── users.ts              # 사용자 프로필 데이터
├── categories.ts         # 카테고리 및 필터 데이터
└── stats.ts              # 통계 데이터
```

## 사용 중인 파일들

현재 다음 파일들에서 더미 데이터를 사용하고 있습니다:

### 페이지 파일
- `src/app/page.tsx` - 홈페이지 (카테고리, 연령대, 시간, 매칭된 전문가)
- `src/app/experts/page.tsx` - 전문가 목록 (전문가 데이터)
- `src/app/summary/page.tsx` - 상담 요약 (상담 요약 데이터)

### 컴포넌트 파일
- `src/components/dashboard/DashboardContent.tsx` - 대시보드 (사용자/전문가 프로필, 상담 일정)

### 스토어 파일
- `src/stores/statsStore.ts` - 통계 스토어 (초기 통계 데이터)

## 삭제 방법

1. **API 연동 완료 확인**
   - 모든 더미 데이터를 실제 API 데이터로 교체했는지 확인
   - 각 파일에서 `@/data/dummy`로 시작하는 import 제거

2. **폴더 삭제**
   ```bash
   rm -rf src/data/dummy
   ```

3. **import 구문 정리**
   - 각 파일에서 더미 데이터 import 구문 제거
   - 실제 API 호출 코드로 교체

## 더미 데이터 타입

각 파일에는 다음과 같은 데이터 타입들이 정의되어 있습니다:

- **ExpertItem**: 전문가 정보
- **ConsultationSummary**: 상담 요약
- **UserProfile**: 사용자 프로필
- **ExpertProfileData**: 전문가 프로필
- **Category**: 카테고리 정보
- **AgeGroup**: 연령대 그룹
- **Duration**: 상담 시간
- **PlatformStats**: 플랫폼 통계

## 주의사항

- 더미 데이터는 개발/테스트 목적으로만 사용
- 실제 사용자 정보나 민감한 데이터 포함하지 않음
- 모든 더미 데이터는 가상의 정보로 구성
