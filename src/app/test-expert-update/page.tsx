"use client";

import { useState } from "react";

export default function TestExpertUpdatePage() {
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testExpertDataUpdate = () => {
    // 전문가 데이터 업데이트 이벤트 발생
    window.dispatchEvent(new CustomEvent('expertDataUpdated', {
      detail: { 
        expertId: 'test-expert-1',
        action: 'testUpdate',
        message: '테스트 업데이트'
      }
    }));
    
    addTestResult('전문가 데이터 업데이트 이벤트 발생');
  };

  const testReviewSubmission = () => {
    // 리뷰 제출 이벤트 발생
    window.dispatchEvent(new CustomEvent('expertDataUpdated', {
      detail: { 
        expertId: 'test-expert-1',
        action: 'reviewSubmitted',
        rating: 5,
        review: '테스트 리뷰'
      }
    }));
    
    addTestResult('리뷰 제출 이벤트 발생');
  };

  const testSessionCompletion = () => {
    // 상담 완료 이벤트 발생
    window.dispatchEvent(new CustomEvent('expertDataUpdated', {
      detail: { 
        expertId: 'test-expert-1',
        action: 'sessionCompleted',
        duration: 60,
        sessionType: 'video'
      }
    }));
    
    addTestResult('상담 완료 이벤트 발생');
  };

  const clearTestResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            전문가 데이터 업데이트 테스트
          </h1>
          
          <div className="space-y-4 mb-6">
            <p className="text-gray-600">
              이 페이지는 전문가 데이터 업데이트 이벤트를 테스트하기 위한 페이지입니다.
              각 버튼을 클릭하면 해당 이벤트가 발생하고, 
              전문가 찾기 페이지에서 이벤트를 감지하여 데이터를 새로고침합니다.
            </p>
          </div>

          <div className="flex space-x-4 mb-6">
            <button
              onClick={testExpertDataUpdate}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              일반 업데이트 이벤트
            </button>
            
            <button
              onClick={testReviewSubmission}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              리뷰 제출 이벤트
            </button>
            
            <button
              onClick={testSessionCompletion}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              상담 완료 이벤트
            </button>
            
            <button
              onClick={clearTestResults}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              결과 초기화
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">테스트 결과</h3>
            {testResults.length === 0 ? (
              <p className="text-gray-500">아직 테스트 결과가 없습니다.</p>
            ) : (
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <div key={index} className="text-sm text-gray-700 bg-white p-2 rounded border">
                    {result}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-medium text-blue-900 mb-2">사용 방법</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
              <li>전문가 찾기 페이지를 새 탭에서 열어주세요</li>
              <li>이 페이지에서 위의 버튼들을 클릭하여 이벤트를 발생시키세요</li>
              <li>전문가 찾기 페이지로 돌아가서 데이터가 새로고침되는지 확인하세요</li>
              <li>새로고침 버튼을 클릭하여 수동으로도 데이터를 업데이트할 수 있습니다</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
