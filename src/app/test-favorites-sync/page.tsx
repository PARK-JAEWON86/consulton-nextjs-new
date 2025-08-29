"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function TestFavoritesSyncPage() {
  const [likedExperts, setLikedExperts] = useState<number[]>([]);
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // 로컬 스토리지에서 좋아요 상태 로드
  const loadLikedExperts = () => {
    try {
      const stored = localStorage.getItem('likedExperts');
      const experts = stored ? JSON.parse(stored) : [];
      setLikedExperts(experts);
      addTestResult(`좋아요 상태 로드: ${experts.length}개 전문가`);
      return experts;
    } catch (error) {
      addTestResult(`좋아요 상태 로드 실패: ${error}`);
      return [];
    }
  };

  // 좋아요 상태 변경 이벤트 리스너
  useEffect(() => {
    const handleFavoritesUpdate = (event: CustomEvent) => {
      const { expertId, action, likeCount } = event.detail;
      addTestResult(`좋아요 상태 변경 이벤트 수신: 전문가 ${expertId}, 액션: ${action}, 좋아요 수: ${likeCount}`);
      
      // 이벤트 수신 후 상태 새로고침
      setTimeout(() => {
        loadLikedExperts();
      }, 100);
    };

    // 커스텀 이벤트 리스너 등록
    window.addEventListener('favoritesUpdated', handleFavoritesUpdate as EventListener);
    
    // 페이지 로드 시 초기 상태 로드
    loadLikedExperts();

    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate as EventListener);
    };
  }, []);

  // 수동 새로고침
  const refreshState = () => {
    loadLikedExperts();
    addTestResult('수동으로 상태 새로고침');
  };

  // 테스트용 좋아요 추가/제거
  const testToggleFavorite = (expertId: number) => {
    try {
      const current = JSON.parse(localStorage.getItem('likedExperts') || '[]');
      const newState = current.includes(expertId)
        ? current.filter((id: number) => id !== expertId)
        : [...current, expertId];
      
      localStorage.setItem('likedExperts', JSON.stringify(newState));
      setLikedExperts(newState);
      
      const action = current.includes(expertId) ? '제거' : '추가';
      addTestResult(`테스트: 전문가 ${expertId} 좋아요 ${action}`);
    } catch (error) {
      addTestResult(`테스트 실패: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            좋아요 상태 연동 테스트
          </h1>
          
          <div className="space-y-4 mb-6">
            <p className="text-gray-600">
              이 페이지는 전문가 찾기 페이지와 전문가 상세페이지 간의 좋아요 상태 연동을 테스트합니다.
            </p>
          </div>

          {/* 현재 좋아요 상태 */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">현재 좋아요 상태</h3>
            {likedExperts.length === 0 ? (
              <p className="text-gray-500">좋아요한 전문가가 없습니다.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {likedExperts.map(expertId => (
                  <span key={expertId} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                    전문가 {expertId}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 테스트 버튼들 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <button
              onClick={() => testToggleFavorite(1)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              전문가 1 토글
            </button>
            
            <button
              onClick={() => testToggleFavorite(2)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              전문가 2 토글
            </button>
            
            <button
              onClick={refreshState}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              상태 새로고침
            </button>
            
            <button
              onClick={() => {
                localStorage.removeItem('likedExperts');
                setLikedExperts([]);
                addTestResult('좋아요 상태 초기화');
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              전체 초기화
            </button>
          </div>

          {/* 테스트 결과 */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">테스트 결과</h3>
            {testResults.length === 0 ? (
              <p className="text-gray-500">아직 테스트 결과가 없습니다.</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {testResults.map((result, index) => (
                  <div key={index} className="text-sm text-gray-700 bg-white p-2 rounded border">
                    {result}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 테스트 시나리오 */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium text-blue-900 mb-2">테스트 시나리오</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
              <li>
                <strong>기본 연동 테스트:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>전문가 찾기 페이지에서 전문가 1을 좋아요</li>
                  <li>전문가 1의 상세페이지로 이동</li>
                  <li>좋아요 상태가 유지되는지 확인</li>
                  <li>좋아요 취소 후 전문가 찾기 페이지로 돌아가기</li>
                  <li>좋아요 상태가 반영되는지 확인</li>
                </ul>
              </li>
              <li>
                <strong>페이지 이동 테스트:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>전문가 찾기 페이지에서 여러 전문가를 좋아요</li>
                  <li>각 전문가의 상세페이지에서 좋아요 상태 확인</li>
                  <li>다시 전문가 찾기 페이지로 돌아가서 상태 확인</li>
                </ul>
              </li>
              <li>
                <strong>실시간 업데이트 테스트:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>이 페이지에서 좋아요 상태 변경</li>
                  <li>전문가 찾기 페이지에서 상태 반영 확인</li>
                  <li>전문가 상세페이지에서 상태 반영 확인</li>
                </ul>
              </li>
            </ol>
          </div>

          {/* 링크 */}
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-green-900 mb-2">테스트 페이지 링크</h3>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/experts" 
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                전문가 찾기 페이지
              </Link>
              <Link 
                href="/experts/1" 
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                전문가 1 상세페이지
              </Link>
              <Link 
                href="/experts/2" 
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                전문가 2 상세페이지
              </Link>
              <Link 
                href="/test-like-state" 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                좋아요 상태 테스트
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
