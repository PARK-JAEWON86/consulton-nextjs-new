"use client";

import { useState, useEffect } from "react";

export default function TestAIChatPage() {
  const [chatSessions, setChatSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isClient, setIsClient] = useState(false);

  // 클라이언트 사이드에서만 실행
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 채팅 세션 목록 로드
  const loadChatSessions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/aichat-sessions?userId=user1&limit=20');
      const result = await response.json();
      
      if (result.success) {
        setChatSessions(result.data);
        console.log('채팅 세션 로드 완료:', result.data);
      } else {
        console.error('채팅 세션 로드 실패:', result);
      }
    } catch (error) {
      console.error('채팅 세션 로드 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  // 새 채팅 세션 생성
  const createChatSession = async () => {
    if (!message.trim()) return;
    
    try {
      setLoading(true);
      const response = await fetch('/api/aichat-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: message.length > 30 ? message.substring(0, 30) + "..." : message,
          userId: "user1",
          category: "테스트"
        })
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('새 채팅 세션 생성 완료:', result.data);
        setMessage("");
        // 세션 목록 새로고침
        await loadChatSessions();
      } else {
        console.error('채팅 세션 생성 실패:', result);
      }
    } catch (error) {
      console.error('채팅 세션 생성 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  // 채팅 세션 삭제
  const deleteChatSession = async (id: string) => {
    try {
      const response = await fetch(`/api/aichat-sessions?id=${id}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('채팅 세션 삭제 완료');
        // 세션 목록 새로고침
        await loadChatSessions();
      } else {
        console.error('채팅 세션 삭제 실패:', result);
      }
    } catch (error) {
      console.error('채팅 세션 삭제 오류:', error);
    }
  };

  // localStorage 클리어 (테스트용)
  const clearLocalStorage = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.clear();
      alert('localStorage가 클리어되었습니다.');
      // 세션 목록 새로고침
      loadChatSessions();
    }
  };

  // 페이지 로드 시 채팅 세션 로드
  useEffect(() => {
    if (isClient) {
      loadChatSessions();
    }
  }, [isClient]);

  // 서버 사이드 렌더링 중에는 로딩 표시
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">페이지를 로드하는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">AI 채팅 테스트 페이지</h1>
        
        {/* 새 채팅 세션 생성 */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">새 채팅 세션 생성</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="채팅 제목을 입력하세요..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && createChatSession()}
            />
            <button
              onClick={createChatSession}
              disabled={loading || !message.trim()}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '생성 중...' : '생성'}
            </button>
          </div>
        </div>

        {/* 채팅 세션 목록 */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">채팅 세션 목록</h2>
            <button
              onClick={loadChatSessions}
              disabled={loading}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
            >
              {loading ? '로딩 중...' : '새로고침'}
            </button>
          </div>
          
          {chatSessions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">채팅 세션이 없습니다. 새로 생성해보세요.</p>
          ) : (
            <div className="space-y-4">
              {chatSessions.map((session) => (
                <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{session.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        상태: {session.status} | 
                        메시지: {session.messageCount}개 | 
                        크레딧: {session.creditsUsed} | 
                        생성일: {new Date(session.createdAt).toLocaleString()}
                      </p>
                      {session.lastMessage && (
                        <p className="text-sm text-gray-600 mt-2">
                          마지막 메시지: {session.lastMessage}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => deleteChatSession(session.id)}
                      className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 로컬 스토리지 정보 */}
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">로컬 스토리지 정보</h2>
          <div className="space-y-2">
            <div>
              <strong>채팅 세션:</strong> {localStorage.getItem('consulton-aichat-sessions') ? '저장됨' : '없음'}
            </div>
            <div>
              <strong>채팅 메시지:</strong> {localStorage.getItem('consulton-aichat-messages') ? '저장됨' : '없음'}
            </div>
            <div>
              <strong>AI 사용량:</strong> {localStorage.getItem('consulton-ai-usage') ? '저장됨' : '없음'}
            </div>
          </div>
          <button
            onClick={clearLocalStorage}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            로컬 스토리지 초기화
          </button>
        </div>
      </div>
    </div>
  );
}
