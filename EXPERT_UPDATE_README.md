# 전문가 데이터 실시간 업데이트 기능

## 개요

전문가 찾기 페이지가 `@expert-profiles/`와 `@expert-stats/` API를 통해 실시간으로 데이터를 업데이트하도록 개선되었습니다.

## 주요 변경사항

### 1. API 연동
- **기존**: 정적 더미 데이터 사용
- **개선**: `@expert-profiles/` API를 통한 전문가 프로필 데이터 로드
- **개선**: `@expert-stats/` API를 통한 전문가 통계 데이터 로드

### 2. 실시간 데이터 업데이트
- **리뷰 작성 시**: 전문가 평점, 리뷰 수 자동 업데이트
- **상담 완료 시**: 상담 횟수, 완료율 등 통계 자동 업데이트
- **페이지 포커스 시**: 자동 데이터 새로고침

### 3. 이벤트 기반 업데이트
- `expertDataUpdated` 커스텀 이벤트를 통한 실시간 통신
- 리뷰 제출, 상담 완료 등 주요 액션에서 이벤트 발생

### 4. 좋아요 상태 연동 ⭐ **NEW**
- **전문가 찾기 페이지**와 **전문가 상세페이지** 간 좋아요 상태 실시간 연동
- 로컬 스토리지를 통한 상태 유지 및 중복 증가 방지
- `favoritesUpdated` 커스텀 이벤트를 통한 페이지 간 상태 동기화

## 구현된 기능

### 전문가 프로필 API 연동
```typescript
// 전문가 프로필 데이터 로드
const loadExpertProfiles = async () => {
  const response = await fetch('/api/expert-profiles');
  const result = await response.json();
  
  if (result.success) {
    const convertedExperts = result.data.profiles.map(apiExpert => ({
      // API 데이터를 ExpertProfile 타입으로 변환
      id: parseInt(apiExpert.id),
      name: apiExpert.fullName,
      specialty: apiExpert.specialty,
      // ... 기타 필드들
    }));
    setAllExperts(convertedExperts);
  }
};
```

### 전문가 통계 API 연동
```typescript
// 전문가 통계 데이터 로드 및 업데이트
const loadExpertStats = async () => {
  const statsPromises = allExperts.map(async (expert) => {
    const response = await fetch(`/api/expert-stats?expertId=${expert.id}`);
    const result = await response.json();
    
    if (result.success) {
      return { expertId: expert.id, stats: result.data };
    }
    return null;
  });
  
  // 통계 데이터로 전문가 정보 업데이트
  setAllExperts(prevExperts => 
    prevExperts.map(expert => {
      const stats = validStats.find(s => s?.expertId === expert.id)?.stats;
      if (stats) {
        return {
          ...expert,
          totalSessions: stats.totalSessions,
          avgRating: stats.avgRating,
          reviewCount: stats.reviewCount,
          // ... 기타 통계 필드들
        };
      }
      return expert;
    })
  );
};
```

### 좋아요 상태 연동 시스템 ⭐ **NEW**
```typescript
// 로컬 스토리지 기반 좋아요 상태 관리
const loadFavoritesFromStorage = () => {
  try {
    const stored = localStorage.getItem('likedExperts');
    const favorites = stored ? JSON.parse(stored) : [];
    setFavorites(favorites);
    return favorites;
  } catch (error) {
    console.error('좋아요 상태 로드 실패:', error);
    return [];
  }
};

const saveFavoritesToStorage = (favorites: number[]) => {
  try {
    localStorage.setItem('likedExperts', JSON.stringify(favorites));
  } catch (error) {
    console.error('좋아요 상태 저장 실패:', error);
  }
};

// 좋아요 토글 시 이벤트 발생
const toggleFavorite = (expertId: number) => {
  setFavorites((prev) => {
    const newFavorites = prev.includes(expertId)
      ? prev.filter((id) => id !== expertId)
      : [...prev, expertId];
    
    // 로컬 스토리지에 저장
    saveFavoritesToStorage(newFavorites);
    
    return newFavorites;
  });
};
```

### 실시간 이벤트 처리
```typescript
// 실시간 데이터 업데이트를 위한 이벤트 리스너
useEffect(() => {
  const handleExpertDataUpdate = () => {
    console.log('전문가 데이터 업데이트 이벤트 수신');
    refreshExpertData();
  };

  // 커스텀 이벤트 리스너 등록
  window.addEventListener('expertDataUpdated', handleExpertDataUpdate);
  
  // 페이지 포커스 시 데이터 새로고침
  const handleFocus = () => {
    console.log('페이지 포커스, 데이터 새로고침');
    refreshExpertData();
  };
  
  window.addEventListener('focus', handleFocus);

  return () => {
    window.removeEventListener('expertDataUpdated', handleExpertDataUpdate);
    window.removeEventListener('focus', handleFocus);
  };
}, []);

// 좋아요 상태 변경 이벤트 리스너 ⭐ **NEW**
useEffect(() => {
  const handleFavoritesUpdate = () => {
    console.log('좋아요 상태 업데이트 이벤트 수신');
    loadFavoritesFromStorage();
  };

  // 커스텀 이벤트 리스너 등록
  window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
  
  // 페이지 포커스 시 좋아요 상태 새로고침
  const handleFocus = () => {
    console.log('페이지 포커스, 좋아요 상태 새로고침');
    loadFavoritesFromStorage();
  };
  
  window.addEventListener('focus', handleFocus);

  return () => {
    window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
    window.removeEventListener('focus', handleFocus);
  };
}, []);
```

## 이벤트 발생 지점

### 1. 리뷰 제출 시
```typescript
// ConsultationSummary.tsx
const handleSubmitReview = async () => {
  // ... 리뷰 제출 로직
  
  // 전문가 데이터 업데이트 이벤트 발생
  window.dispatchEvent(new CustomEvent('expertDataUpdated', {
    detail: { 
      expertId: consultation.expertId,
      action: 'reviewSubmitted',
      rating,
      review 
    }
  }));
};
```

### 2. 상담 완료 시
```typescript
// ConsultationSession.tsx
const handleEndSession = useCallback(() => {
  // ... 상담 종료 로직
  
  // 상담 완료 시 전문가 데이터 업데이트 이벤트 발생
  window.dispatchEvent(new CustomEvent('expertDataUpdated', {
    detail: { 
      expertId: consultation.expertId,
      action: 'sessionCompleted',
      duration: sessionTime,
      sessionType: consultation.consultationType
    }
  }));
}, [consultation.expertId, consultation.consultationType, sessionTime]);
```

### 3. 좋아요 상태 변경 시 ⭐ **NEW**
```typescript
// ExpertProfilePage.tsx
const handleLikeToggle = async () => {
  // ... 좋아요 토글 로직
  
  // 좋아요 상태 변경 이벤트 발생 (전문가 찾기 페이지에서 감지)
  window.dispatchEvent(new CustomEvent('favoritesUpdated', {
    detail: { 
      expertId: expert.id,
      action: isLiked ? 'unlike' : 'like',
      likeCount: newLikeCount
    }
  }));
};
```

## UI 개선사항

### 새로고침 버튼 추가
- 검색 및 필터 바에 새로고침 버튼 추가
- 수동으로 전문가 데이터를 새로고침할 수 있음
- `RefreshCw` 아이콘과 함께 직관적인 디자인

### 실시간 데이터 반영
- 평점, 리뷰 수, 상담 횟수 등이 실시간으로 업데이트
- 전문가 레벨 계산이 최신 데이터를 반영하여 정확하게 표시

### 좋아요 상태 연동 UI ⭐ **NEW**
- 전문가 찾기 페이지와 상세페이지에서 동일한 좋아요 상태 표시
- 좋아요 버튼에 현재 상태를 명확하게 표시 ("좋아요" / "좋아요 취소")
- 실시간으로 좋아요 상태가 페이지 간 동기화

## 테스트 방법

### 테스트 페이지
- **`/test-expert-update`**: 전문가 데이터 업데이트 이벤트 테스트
- **`/test-like-state`**: 좋아요 상태 관리 테스트
- **`/test-favorites-sync`**: 좋아요 상태 연동 테스트 ⭐ **NEW**

### 테스트 시나리오
1. **전문가 데이터 업데이트 테스트**:
   - 전문가 찾기 페이지를 새 탭에서 열기
   - 테스트 페이지에서 이벤트 발생시키기
   - 전문가 찾기 페이지로 돌아가서 데이터 업데이트 확인

2. **좋아요 상태 연동 테스트** ⭐ **NEW**:
   - 전문가 찾기 페이지에서 전문가 1을 좋아요
   - 전문가 1의 상세페이지로 이동하여 좋아요 상태 확인
   - 좋아요 취소 후 전문가 찾기 페이지로 돌아가서 상태 반영 확인
   - 페이지 새로고침 후에도 상태가 유지되는지 확인

3. **실시간 업데이트 테스트**:
   - 새로고침 버튼으로 수동 업데이트 테스트
   - 페이지 포커스 시 자동 업데이트 테스트

## 성능 최적화

### 병렬 API 호출
- 모든 전문가의 통계를 병렬로 로드하여 성능 향상
- `Promise.all()`을 사용한 효율적인 데이터 처리

### 조건부 업데이트
- `allExperts.length > 0`일 때만 통계 로드
- 불필요한 API 호출 방지

### 에러 처리
- API 호출 실패 시 더미 데이터를 fallback으로 사용
- 개별 전문가 통계 로드 실패 시에도 다른 전문가 데이터는 정상 처리

### 좋아요 상태 최적화 ⭐ **NEW**
- 로컬 스토리지를 통한 빠른 상태 접근
- 이벤트 기반 상태 동기화로 불필요한 API 호출 방지
- 중복 좋아요 방지로 데이터 일관성 보장

## 향후 개선 계획

1. **웹소켓 연동**: 실시간 양방향 통신 구현
2. **캐싱 전략**: Redis 등을 활용한 데이터 캐싱
3. **배치 업데이트**: 여러 변경사항을 묶어서 일괄 처리
4. **프로그레시브 로딩**: 페이지네이션과 무한 스크롤 개선
5. **서버 사이드 좋아요 관리**: 로컬 스토리지 대신 서버 기반 상태 관리

## 기술 스택

- **프론트엔드**: React, TypeScript, Tailwind CSS
- **API**: Next.js API Routes
- **상태 관리**: React Hooks (useState, useEffect)
- **이벤트 시스템**: CustomEvent API
- **데이터 변환**: TypeScript 인터페이스 기반 타입 안전성
- **로컬 스토리지**: 브라우저 localStorage API ⭐ **NEW**

## 결론

이번 개선을 통해 전문가 찾기 페이지가 실시간으로 최신 데이터를 반영하게 되었으며, **좋아요 상태 연동**을 통해 사용자 경험이 크게 향상되었습니다. 

### 주요 성과:
- ✅ API 연동으로 실시간 데이터 업데이트
- ✅ 이벤트 기반 실시간 통신
- ✅ **좋아요 상태 페이지 간 연동** ⭐
- ✅ 중복 증가 문제 해결
- ✅ 로컬 스토리지 기반 상태 유지
- ✅ 사용자 친화적인 UI/UX

전문가의 최신 정보를 정확하게 제공하고, 사용자의 좋아요 상태를 일관되게 관리할 수 있게 되었습니다.
