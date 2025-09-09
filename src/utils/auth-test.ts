/**
 * 인증 시스템 테스트용 유틸리티
 * 개발 환경에서 로그인 상태를 확인하고 디버깅하는데 사용
 */

import { getAuthToken, getAuthHeaders, authenticatedFetch } from './api';

/**
 * 현재 인증 상태를 콘솔에 출력하는 함수
 */
export function debugAuthState(): void {
  console.log('🔍 현재 인증 상태 디버깅');
  console.log('=======================');
  
  // 로컬스토리지 확인
  const token = getAuthToken();
  const userStr = localStorage.getItem('consulton-user');
  const authStr = localStorage.getItem('consulton-auth');
  const viewModeStr = localStorage.getItem('consulton-viewMode');
  
  console.log('📱 로컬스토리지 상태:');
  console.log('  - JWT 토큰:', token ? `${token.substring(0, 20)}...` : '없음');
  console.log('  - 사용자 정보:', userStr ? JSON.parse(userStr) : '없음');
  console.log('  - 인증 상태:', authStr ? JSON.parse(authStr) : '없음');
  console.log('  - 뷰 모드:', viewModeStr ? JSON.parse(viewModeStr) : '없음');
  
  // 헤더 확인
  const headers = getAuthHeaders();
  console.log('🔐 API 헤더:');
  console.log('  - Authorization:', headers['Authorization'] || '없음');
  
  console.log('=======================');
}

/**
 * 인증이 필요한 API를 테스트하는 함수
 */
export async function testAuthenticatedAPI(): Promise<void> {
  console.log('🧪 인증 API 테스트 시작');
  
  try {
    // /api/auth/me 엔드포인트 테스트
    const response = await authenticatedFetch('/api/auth/me');
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ 인증 API 테스트 성공:', data);
    } else {
      console.log('❌ 인증 API 테스트 실패:', data);
    }
  } catch (error) {
    console.log('💥 인증 API 테스트 오류:', error);
  }
}

/**
 * 개발 환경에서 인증 상태를 리셋하는 함수
 */
export function resetAuthState(): void {
  console.log('🔄 인증 상태 리셋');
  
  localStorage.removeItem('consulton-token');
  localStorage.removeItem('consulton-user');
  localStorage.removeItem('consulton-auth');
  localStorage.removeItem('consulton-viewMode');
  
  // 커스텀 이벤트 발생으로 UI 업데이트
  window.dispatchEvent(new CustomEvent('authStateChanged', { 
    detail: { type: 'logout' } 
  }));
  
  console.log('✅ 인증 상태가 리셋되었습니다.');
}

// 개발 환경에서만 전역 객체에 노출
if (process.env.NODE_ENV === 'development') {
  (window as any).authDebug = {
    debugAuthState,
    testAuthenticatedAPI,
    resetAuthState
  };
  
  console.log('🛠️ 개발 모드: window.authDebug로 인증 디버깅 함수들을 사용할 수 있습니다.');
  console.log('  - window.authDebug.debugAuthState(): 현재 인증 상태 확인');
  console.log('  - window.authDebug.testAuthenticatedAPI(): 인증 API 테스트');
  console.log('  - window.authDebug.resetAuthState(): 인증 상태 리셋');
}
