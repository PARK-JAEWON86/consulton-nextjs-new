"use client";

import { useState, useEffect } from "react";

export default function TestLikeStatePage() {
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

  // 좋아요 상태 저장
  const saveLikedExperts = (experts: number[]) => {
    try {
      localStorage.setItem('likedExperts', JSON.stringify(experts));
      setLikedExperts(experts);
      addTestResult(`좋아요 상태 저장: ${experts.length}개 전문가`);
    } catch (error) {
      addTestResult(`좋아요 상태 저장 실패: ${error}`);
    }
  };

  // 좋아요 추가
  const addLike = (expertId: number) => {
    const current = loadLikedExperts();
    if (!current.includes(expertId)) {
      const updated = [...current, expertId];
      saveLikedExperts(updated);
      addTestResult(`전문가 ${expertId} 좋아요 추가`);
    } else {
      addTestResult(`전문가 ${expertId}는 이미 좋아요 상태`);
    }
  };

  // 좋아요 제거
  const removeLike = (expertId: number) => {
    const current = loadLikedExperts();
    const updated = current.filter((id: number) => id !== expertId);
    saveLikedExperts(updated);
    addTestResult(`전문가 ${expertId} 좋아요 제거`);
  };

  // 좋아요 상태 확인
  const checkLikeState = (expertId: number) => {
    const current = loadLikedExperts();
    const isLiked = current.includes(expertId);
    addTestResult(`전문가 ${expertId} 좋아요 상태: ${isLiked ? '좋아요' : '좋아요 안함'}`);
    return isLiked;
  };

  // 로컬 스토리지 초기화
  const clearLikedExperts = () => {
    localStorage.removeItem('likedExperts');
    setLikedExperts([]);
    addTestResult('좋아요 상태 초기화');
  };

  // 페이지 로드 시 좋아요 상태 로드
  useEffect(() => {
    loadLikedExperts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            좋아요 상태 테스트 및 디버깅
          </h1>
          
          <div className="space-y-4 mb-6">
            <p className="text-gray-600">
              이 페이지는 전문가 좋아요 상태의 로컬 스토리지 관리를 테스트하고 디버깅하기 위한 페이지입니다.
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
              onClick={() => addLike(1)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              전문가 1 좋아요
            </button>
            
            <button
              onClick={() => removeLike(1)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              전문가 1 좋아요 취소
            </button>
            
            <button
              onClick={() => checkLikeState(1)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              전문가 1 상태 확인
            </button>
            
            <button
              onClick={() => addLike(2)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              전문가 2 좋아요
            </button>
            
            <button
              onClick={() => removeLike(2)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              전문가 2 좋아요 취소
            </button>
            
            <button
              onClick={() => checkLikeState(2)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              전문가 2 상태 확인
            </button>
            
            <button
              onClick={loadLikedExperts}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              상태 새로고침
            </button>
            
            <button
              onClick={clearLikedExperts}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              전체 초기화
            </button>
          </div>

          {/* 테스트 결과 */}
          <div className="bg-gray-50 rounded-lg p-4">
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

          {/* 사용 방법 */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-medium text-blue-900 mb-2">사용 방법</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
              <li>위의 버튼들을 클릭하여 좋아요 상태를 변경하세요</li>
              <li>전문가 찾기 페이지에서 좋아요 상태가 유지되는지 확인하세요</li>
              <li>페이지를 새로고침하거나 다른 페이지로 이동한 후 돌아와서 상태를 확인하세요</li>
              <li>브라우저 개발자 도구의 Application 탭에서 localStorage를 확인할 수 있습니다</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
