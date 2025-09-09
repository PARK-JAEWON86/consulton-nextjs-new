/**
 * API 호출을 위한 공통 유틸리티 함수들
 */

/**
 * 로컬스토리지에서 JWT 토큰을 가져오는 함수
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    return localStorage.getItem('consulton-token');
  } catch (error) {
    console.error('토큰 가져오기 실패:', error);
    return null;
  }
}

/**
 * 인증이 필요한 API 호출을 위한 헤더를 생성하는 함수
 */
export function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * 인증이 필요한 GET 요청
 */
export async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const headers = getAuthHeaders();
  
  return fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });
}

/**
 * 인증이 필요한 POST 요청
 */
export async function authenticatedPost(url: string, data?: any, options: RequestInit = {}): Promise<Response> {
  const headers = getAuthHeaders();
  
  return fetch(url, {
    method: 'POST',
    headers: {
      ...headers,
      ...options.headers,
    },
    body: data ? JSON.stringify(data) : undefined,
    ...options,
  });
}

/**
 * 인증이 필요한 PUT 요청
 */
export async function authenticatedPut(url: string, data?: any, options: RequestInit = {}): Promise<Response> {
  const headers = getAuthHeaders();
  
  return fetch(url, {
    method: 'PUT',
    headers: {
      ...headers,
      ...options.headers,
    },
    body: data ? JSON.stringify(data) : undefined,
    ...options,
  });
}

/**
 * 인증이 필요한 DELETE 요청
 */
export async function authenticatedDelete(url: string, options: RequestInit = {}): Promise<Response> {
  const headers = getAuthHeaders();
  
  return fetch(url, {
    method: 'DELETE',
    headers: {
      ...headers,
      ...options.headers,
    },
    ...options,
  });
}

/**
 * API 응답 에러 처리 함수
 */
export function handleApiError(response: Response, error?: any): void {
  if (response.status === 401) {
    // 인증 토큰이 만료되었거나 유효하지 않음
    console.warn('인증이 만료되었습니다. 다시 로그인해주세요.');
    
    // 로컬스토리지 클리어
    if (typeof window !== 'undefined') {
      localStorage.removeItem('consulton-token');
      localStorage.removeItem('consulton-user');
      localStorage.removeItem('consulton-auth');
      localStorage.removeItem('consulton-viewMode');
      
      // 로그인 페이지로 리다이렉트
      window.location.href = '/auth/login';
    }
  } else if (response.status === 403) {
    console.warn('권한이 없습니다.');
  } else if (response.status >= 500) {
    console.error('서버 오류가 발생했습니다.');
  } else if (error) {
    console.error('API 호출 오류:', error);
  }
}
