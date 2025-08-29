"use client";

import { useState, useEffect } from 'react';
import ExpertCard from '@/components/expert/ExpertCard';
import { ExpertProfile } from '@/types';

// 테스트용 전문가 데이터
const testExperts: ExpertProfile[] = [
  {
    id: 1,
    name: "김전문",
    specialty: "비즈니스 컨설팅",
    description: "10년간 다양한 기업의 성장 전략을 수립한 경험이 있습니다. 특히 스타트업과 중소기업의 비즈니스 모델 개선에 전문성을 가지고 있습니다.",
    rating: 4.8,
    reviewCount: 127,
    experience: 10,
    totalSessions: 45,
    avgRating: 4.8,
    profileImage: null,
    specialties: ["전략 수립", "비즈니스 모델", "성장 전략"],
    consultationTypes: ["video", "chat"],
    responseTime: 30
  },
  {
    id: 2,
    name: "이고수",
    specialty: "마케팅 전략",
    description: "디지털 마케팅과 브랜드 전략 분야에서 15년간 활동하며, 수많은 브랜드의 성공 사례를 만들어왔습니다.",
    rating: 4.9,
    reviewCount: 203,
    experience: 15,
    totalSessions: 120,
    avgRating: 4.9,
    profileImage: null,
    specialties: ["디지털 마케팅", "브랜드 전략", "콘텐츠 마케팅"],
    consultationTypes: ["video"],
    responseTime: 15
  },
  {
    id: 3,
    name: "박초보",
    specialty: "개인 상담",
    description: "새로 시작하는 상담사입니다. 열정과 성실함으로 고객의 만족을 위해 노력하겠습니다.",
    rating: 4.2,
    reviewCount: 8,
    experience: 1,
    totalSessions: 5,
    avgRating: 4.2,
    profileImage: null,
    specialties: ["일반 상담", "초기 상담"],
    consultationTypes: ["chat"],
    responseTime: 120
  }
];

export default function TestExpertLevelsPage() {
  const [selectedExpert, setSelectedExpert] = useState<ExpertProfile | null>(null);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [scoreInput, setScoreInput] = useState<string>('85.5');
  const [scoreRequirements, setScoreRequirements] = useState<any>(null);

  // API 테스트 함수
  const testAPI = async (action: string, params: Record<string, string> = {}) => {
    try {
      const queryString = new URLSearchParams({ action, ...params }).toString();
      const response = await fetch(`/api/expert-levels?${queryString}`);
      const data = await response.json();
      setApiResponse({ action, params, data });
    } catch (error) {
      setApiResponse({ action, params, error: error instanceof Error ? error.message : '알 수 없는 오류' });
    }
  };

  // 점수 요구사항 조회
  const loadScoreRequirements = async () => {
    try {
      const response = await fetch('/api/expert-levels?action=getScoreRequirements');
      const data = await response.json();
      setScoreRequirements(data);
    } catch (error) {
      console.error('점수 요구사항 조회 실패:', error instanceof Error ? error.message : '알 수 없는 오류');
    }
  };

  useEffect(() => {
    loadScoreRequirements();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            전문가 레벨 API 테스트 (점수 기반 - 더 도전적!)
          </h1>
          <p className="text-gray-600">
            전문가 통계의 rankingScore를 기반으로 레벨을 계산하는 시스템을 테스트해보세요
          </p>
        </div>

        {/* 점수 기반 레벨 계산 테스트 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">점수 기반 레벨 계산</h2>
          <div className="flex items-center space-x-4 mb-4">
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={scoreInput}
              onChange={(e) => setScoreInput(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="점수 입력 (0-100)"
            />
            <button
              onClick={() => testAPI('calculateLevelByScore', { rankingScore: scoreInput })}
              className="px-4 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
            >
              레벨 계산
            </button>
          </div>
          <p className="text-sm text-gray-600">
            점수 범위: 0-51.99 (Tier 1) ~ 98-100 (Tier 10) - 더 도전적!
          </p>
        </div>

        {/* API 테스트 섹션 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">API 테스트</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <button
              onClick={() => testAPI('getAllLevels')}
              className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              모든 레벨 조회
            </button>
            <button
              onClick={() => testAPI('getLevelPricing', { level: '500' })}
              className="px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
            >
              레벨 500 요금
            </button>
            <button
              onClick={() => testAPI('getExpertLevel', { expertId: '1' })}
              className="px-3 py-2 bg-orange-600 text-white text-sm rounded hover:bg-orange-700"
            >
              전문가 레벨
            </button>
            <button
              onClick={() => testAPI('getScoreRequirements')}
              className="px-3 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
            >
              점수 요구사항
            </button>
          </div>

          {/* API 응답 표시 */}
          {apiResponse && (
            <div className="bg-gray-50 rounded p-4">
              <h3 className="font-medium text-gray-900 mb-2">
                {apiResponse.action} 응답:
              </h3>
              <pre className="text-sm text-gray-700 bg-white p-3 rounded border overflow-auto">
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* 점수 요구사항 표시 */}
        {scoreRequirements && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">점수 요구사항 (더 도전적!)</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      티어
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      점수 범위
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      레벨 범위
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      크레딧/분
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {scoreRequirements.scoreRequirements?.map((tier: any, index: number) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {tier.tier}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {tier.minScore.toFixed(1)} - {tier.maxScore.toFixed(1)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        Lv.{tier.levelRange.min} - {tier.levelRange.max}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {tier.creditsPerMinute}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 전문가 카드 테스트 섹션 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">전문가 카드 테스트</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testExperts.map((expert) => (
              <ExpertCard
                key={expert.id}
                expert={expert}
                showFavoriteButton={true}
                isFavorite={false}
                onToggleFavorite={(id) => console.log('Toggle favorite:', id)}
              />
            ))}
          </div>
        </div>

        {/* 점수 계산 공식 설명 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">점수 계산 공식 (더 도전적인 기준)</h2>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">rankingScore = 상담횟수(40%) + 평점(30%) + 리뷰수(15%) + 재방문률(10%) + 좋아요수(5%)</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p>• <strong>상담 횟수 (40%)</strong>: Math.min(totalSessions / 1000, 1) × 40 <span className="text-red-600 font-bold">← 100회 → 1000회로 증가!</span></p>
              <p>• <strong>평점 (30%)</strong>: (avgRating / 5) × 30</p>
              <p>• <strong>리뷰 수 (15%)</strong>: Math.min(reviewCount / 500, 1) × 15 <span className="text-red-600 font-bold">← 50개 → 500개로 증가!</span></p>
              <p>• <strong>재방문 고객 비율 (10%)</strong>: (repeatClients / totalSessions) × 10</p>
              <p>• <strong>좋아요 수 (5%)</strong>: Math.min(likeCount / 1000, 1) × 5 <span className="text-red-600 font-bold">← 100개 → 1000개로 증가!</span></p>
            </div>
          </div>
          
          <div className="mt-4 bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-green-900 mb-2">레벨 999 달성 조건 (더 도전적!)</h3>
            <div className="space-y-1 text-sm text-green-800">
              <p>• 상담 횟수: 1000회 이상 (40점) <span className="text-red-600 font-bold">← 100회 → 1000회!</span></p>
              <p>• 평점: 4.75점 이상 (28.5점)</p>
              <p>• 리뷰 수: 500개 이상 (15점) <span className="text-red-600 font-bold">← 50개 → 500개!</span></p>
              <p>• 재방문률: 100% (10점)</p>
              <p>• 좋아요 수: 1000개 이상 (5점) <span className="text-red-600 font-bold">← 100개 → 1000개!</span></p>
              <p><strong>총점: 98.0점 이상 필요 (95점 → 98점으로 상향!)</strong></p>
            </div>
          </div>
        </div>

        {/* 레벨 체계 정보 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">레벨 체계 정보 (더 도전적!)</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    티어
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    점수 범위
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    레벨 범위
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    크레딧/분
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    원화/분
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="bg-red-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-900">Tier 10</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-700">98.0-100.0</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-700">Lv.999</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-700">600</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-700">6,000원</td>
                </tr>
                <tr className="bg-purple-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-900">Tier 10</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-700">92.0-97.99</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-700">Lv.900-998</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-700">500</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-700">5,000원</td>
                </tr>
                <tr className="bg-indigo-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-900">Tier 9</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-700">87.0-91.99</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-700">Lv.800-899</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-700">500</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-700">5,000원</td>
                </tr>
                <tr className="bg-blue-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">Tier 8</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700">82.0-86.99</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700">Lv.700-799</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700">450</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700">4,500원</td>
                </tr>
                <tr className="bg-cyan-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-cyan-900">Tier 7</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-700">77.0-81.99</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-700">Lv.600-699</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-700">400</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-700">4,000원</td>
                </tr>
                <tr className="bg-teal-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-teal-900">Tier 6</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-teal-700">72.0-76.99</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-teal-700">Lv.500-599</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-teal-700">350</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-teal-700">3,500원</td>
                </tr>
                <tr className="bg-green-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-900">Tier 5</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700">67.0-71.99</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700">Lv.400-499</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700">300</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700">3,000원</td>
                </tr>
                <tr className="bg-emerald-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-900">Tier 4</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-700">62.0-66.99</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-700">Lv.300-399</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-700">250</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-700">2,500원</td>
                </tr>
                <tr className="bg-lime-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-lime-900">Tier 3</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-lime-700">57.0-61.99</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-lime-700">Lv.200-299</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-lime-700">200</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-lime-700">2,000원</td>
                </tr>
                <tr className="bg-yellow-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-yellow-900">Tier 2</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-700">52.0-56.99</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-700">Lv.100-199</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-700">150</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-700">1,500원</td>
                </tr>
                <tr className="bg-orange-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-orange-900">Tier 1</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-700">0.0-51.99</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-700">Lv.1-99</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-700">100</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-700">1,000원</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
