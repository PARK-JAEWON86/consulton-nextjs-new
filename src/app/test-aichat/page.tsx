"use client";

import { useState } from 'react';

export default function TestAIChatPage() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const addTestResult = (action: string, result: any) => {
    setTestResults(prev => [...prev, {
      timestamp: new Date().toLocaleTimeString(),
      action,
      result
    }]);
  };

  const testCreateSession = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/aichat-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `테스트 상담 ${Date.now()}`,
          userId: 'testuser',
          category: '테스트'
        })
      });
      
      const result = await response.json();
      addTestResult('새 세션 생성', result);
    } catch (error) {
      addTestResult('새 세션 생성 실패', { error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testGetSessions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/aichat-sessions?userId=testuser&limit=5');
      const result = await response.json();
      addTestResult('세션 목록 조회', result);
    } catch (error) {
      addTestResult('세션 목록 조회 실패', { error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testSendMessage = async () => {
    setLoading(true);
    try {
      // 먼저 세션 생성
      const sessionResponse = await fetch('/api/aichat-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `메시지 테스트 ${Date.now()}`,
          userId: 'testuser',
          category: '테스트'
        })
      });
      
      const sessionResult = await sessionResponse.json();
      if (sessionResult.success) {
        // 메시지 전송
        const messageResponse = await fetch(`/api/aichat-sessions/${sessionResult.data.id}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: '안녕하세요! 테스트 메시지입니다.',
            type: 'user',
            senderId: 'testuser',
            senderName: '테스트 사용자'
          })
        });
        
        const messageResult = await messageResponse.json();
        addTestResult('메시지 전송', { session: sessionResult, message: messageResult });
      }
    } catch (error) {
      addTestResult('메시지 전송 실패', { error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testUpdateSession = async () => {
    setLoading(true);
    try {
      // 먼저 세션 목록 조회
      const sessionsResponse = await fetch('/api/aichat-sessions?userId=testuser&limit=1');
      const sessionsResult = await sessionsResponse.json();
      
      if (sessionsResult.success && sessionsResult.data.length > 0) {
        const sessionId = sessionsResult.data[0].id;
        
        // 세션 업데이트
        const updateResponse = await fetch(`/api/aichat-sessions/${sessionId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: `업데이트된 제목 ${Date.now()}`,
            status: 'completed'
          })
        });
        
        const updateResult = await updateResponse.json();
        addTestResult('세션 업데이트', updateResult);
      }
    } catch (error) {
      addTestResult('세션 업데이트 실패', { error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">AI 채팅 세션 API 테스트</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">API 테스트</h2>
            <div className="space-y-3">
              <button
                onClick={testCreateSession}
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? '처리 중...' : '새 세션 생성'}
              </button>
              
              <button
                onClick={testGetSessions}
                disabled={loading}
                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? '처리 중...' : '세션 목록 조회'}
              </button>
              
              <button
                onClick={testSendMessage}
                disabled={loading}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
              >
                {loading ? '처리 중...' : '메시지 전송'}
              </button>
              
              <button
                onClick={testUpdateSession}
                disabled={loading}
                className="w-full px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
              >
                {loading ? '처리 중...' : '세션 업데이트'}
              </button>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">테스트 결과</h2>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600">
                총 {testResults.length}개 테스트 실행
              </span>
              <button
                onClick={clearResults}
                className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                결과 지우기
              </button>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {testResults.map((result, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded text-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-blue-600">{result.action}</span>
                    <span className="text-xs text-gray-500">{result.timestamp}</span>
                  </div>
                  <pre className="text-xs text-gray-700 overflow-x-auto">
                    {JSON.stringify(result.result, null, 2)}
                  </pre>
                </div>
              ))}
              
              {testResults.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  테스트를 실행해보세요
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">API 엔드포인트 정보</h2>
          <div className="space-y-2 text-sm">
            <div><strong>POST</strong> /api/aichat-sessions - 새 채팅 세션 생성</div>
            <div><strong>GET</strong> /api/aichat-sessions - 채팅 세션 목록 조회</div>
            <div><strong>GET</strong> /api/aichat-sessions/[id] - 특정 세션 조회</div>
            <div><strong>PUT</strong> /api/aichat-sessions/[id] - 세션 정보 수정</div>
            <div><strong>DELETE</strong> /api/aichat-sessions/[id] - 세션 삭제</div>
            <div><strong>GET</strong> /api/aichat-sessions/[id]/messages - 메시지 목록 조회</div>
            <div><strong>POST</strong> /api/aichat-sessions/[id]/messages - 새 메시지 전송</div>
          </div>
        </div>
      </div>
    </div>
  );
}
