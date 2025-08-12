"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";
import ServiceLayout from "@/components/layout/ServiceLayout";
import PackCard from "@/components/dashboard/PackCard";
import CreditBalance from "@/components/dashboard/CreditBalance";
import { LEVELS, getKoreanTierName } from "@/utils/expertLevels";
import { useAIChatCreditsStore } from "@/stores/aiChatCreditsStore";
import React from "react"; // Added missing import for React

export default function CreditPackagesPage() {
  // AI 채팅 크레딧 스토어에서 실제 크레딧 정보 가져오기
  const { remainingAIChatCredits, checkAndResetMonthly, setCreditsTo7300 } =
    useAIChatCreditsStore();

  // 컴포넌트 마운트 시 월간 리셋 체크 및 크레딧을 7300으로 설정
  React.useEffect(() => {
    checkAndResetMonthly();
    setCreditsTo7300(); // 크레딧을 7300으로 설정
  }, [checkAndResetMonthly, setCreditsTo7300]);

  // 새로운 과금 체계 기반 평균 요금 계산
  const calculateAverageRatePerMinute = () => {
    const totalCredits = LEVELS.reduce(
      (sum, level) => sum + level.creditsPerMinute,
      0
    );
    return Math.round(totalCredits / LEVELS.length);
  };

  const averageRatePerMinute = calculateAverageRatePerMinute(); // 약 3,000원/분
  const creditsPerMinute = averageRatePerMinute / 10; // 1크레딧 = 10원이므로 300크레딧/분

  // 레벨별 요금 정보 계산
  const getLevelPricingInfo = () => {
    const minLevel = LEVELS[LEVELS.length - 1]; // Tier 1 (최저 요금)
    const maxLevel = LEVELS[0]; // Tier 10 (최고 요금)

    return {
      minRate: minLevel.creditsPerMinute,
      maxRate: maxLevel.creditsPerMinute,
      averageRate: averageRatePerMinute,
      minTier: getKoreanTierName(minLevel.name),
      maxTier: getKoreanTierName(maxLevel.name),
    };
  };

  const pricingInfo = getLevelPricingInfo();

  const packs = [
    // 크레딧 충전 패키지들 (충전량이 많을수록 보너스 증가)
    {
      id: 1,
      type: "credit" as const,
      name: "베이직 충전",
      description: "시작하기 좋은 기본 충전 + 추가크레딧",
      price: 30000,
      credits: 3000,
      bonusCredits: 1050, // 150 (5% 보너스) + 900 (추가 크레딧)
      totalCredits: 4050,
      payPerMinute: averageRatePerMinute,
      usageMinutes: Math.floor((4050 / creditsPerMinute) * 100) / 100, // 13.5분
      usageTime: "약 13분 30초",
      features: [
        "3,000 + 1,050 보너스 크레딧",
        "총 4,050 크레딧 제공",
        "AI 상담 및 전문가 상담에 사용 가능",
        "5% 보너스 + 추가 크레딧 혜택",
        "사용기한 없음",
        "언제든지 사용 가능",
      ],
    },
    {
      id: 2,
      type: "credit" as const,
      name: "스탠다드 충전",
      description: "가장 인기있는 추천 패키지 + 추가크레딧",
      price: 50000,
      credits: 5000,
      bonusCredits: 2300, // 500 (10% 보너스) + 1800 (추가 크레딧)
      totalCredits: 7300,
      payPerMinute: averageRatePerMinute,
      usageMinutes: Math.floor((7300 / creditsPerMinute) * 100) / 100, // 24.33분
      usageTime: "약 24분 20초",
      isRecommended: true,
      features: [
        "5,000 + 2,300 보너스 크레딧",
        "총 7,300 크레딧 제공",
        "AI 상담 및 전문가 상담에 사용 가능",
        "10% 보너스 + 추가 크레딧 혜택",
        "우선 고객지원",
        "사용기한 없음",
      ],
    },
    {
      id: 3,
      type: "credit" as const,
      name: "프리미엄 충전",
      description: "대용량 충전으로 최대 혜택 + 추가크레딧",
      price: 100000,
      credits: 10000,
      bonusCredits: 5100, // 1500 (15% 보너스) + 3600 (추가 크레딧)
      totalCredits: 15100,
      payPerMinute: averageRatePerMinute,
      usageMinutes: Math.floor((15100 / creditsPerMinute) * 100) / 100, // 50.33분
      usageTime: "약 50분 20초",
      features: [
        "10,000 + 5,100 보너스 크레딧",
        "총 15,100 크레딧 제공",
        "AI 상담 및 전문가 상담에 사용 가능",
        "15% 보너스 + 추가 크레딧 혜택",
        "VIP 고객지원",
        "전문가 우선 매칭",
        "사용기한 없음",
      ],
    },
  ];

  return (
    <ServiceLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 헤더 */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    크레딧 충전
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 mt-2">
                    상담에 필요한 크레딧을 충전하세요. 충전량이 많을수록 더 많은
                    보너스 혜택을 받을 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 새로운 과금 체계 안내 */}
          <div className="mb-6 sm:mb-8">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">
                💡 새로운 전문가 레벨별 과금 체계
              </h3>
              <div className="text-xs text-blue-800 space-y-1">
                <p>
                  <strong>평균 요금:</strong> 분당 ₩
                  {averageRatePerMinute.toLocaleString()}
                </p>
                <p>
                  <strong>요금 범위:</strong> ₩
                  {pricingInfo.minRate.toLocaleString()} ~ ₩
                  {pricingInfo.maxRate.toLocaleString()}
                </p>
                <p>
                  <strong>전문가 레벨:</strong> {pricingInfo.minTier} ~{" "}
                  {pricingInfo.maxTier}
                </p>
                <p className="text-blue-600 mt-2">
                  ※ 전문가 레벨에 따라 요금이 다를 수 있습니다. 상담 시 정확한
                  요금을 확인해주세요.
                </p>
              </div>
            </div>
          </div>

          {/* 크레딧 잔액 */}
          <div className="mb-6 sm:mb-8">
            <CreditBalance credits={remainingAIChatCredits} />
          </div>

          {/* 패키지 카드들 */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              크레딧 충전 패키지
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
              {packs.map((pack) => (
                <PackCard key={pack.id} pack={pack} />
              ))}
            </div>
          </div>

          {/* 패키지 비교 테이블 - 데스크톱용 */}
          <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden max-w-4xl mx-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                크레딧 충전 비교
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                각 충전 옵션의 혜택, 보너스, 사용 가능 시간을 비교해보세요.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      패키지
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      가격
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      기본 크레딧
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      보너스
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      총 크레딧
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      사용 가능 시간
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {packs.map((pack) => (
                    <tr key={pack.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm font-medium text-gray-900">
                          {pack.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {pack.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm text-gray-900">
                          ₩{pack.price.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm text-gray-900">
                          {pack.credits} 크레딧
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm text-gray-900">
                          {pack.bonusCredits && pack.bonusCredits > 0 ? (
                            <span className="text-green-600 font-medium">
                              +{pack.bonusCredits}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm font-medium text-gray-900">
                          {pack.totalCredits} 크레딧
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm font-medium text-blue-600">
                          {pack.usageTime}
                        </div>
                        <div className="text-xs text-gray-500">
                          (평균 ₩{averageRatePerMinute.toLocaleString()}/분
                          기준)
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 패키지 비교 카드 - 모바일/태블릿용 */}
          <div className="lg:hidden max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  크레딧 충전 비교
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  각 충전 옵션의 혜택, 보너스, 사용 가능 시간을 비교해보세요.
                </p>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-4">
                  {packs.map((pack) => (
                    <div
                      key={pack.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {pack.name}
                        </h4>
                        {pack.isRecommended && (
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                            추천
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        {pack.description}
                      </p>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="text-gray-500 text-xs">가격</div>
                          <div className="font-medium text-gray-900">
                            ₩{pack.price.toLocaleString()}
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="text-gray-500 text-xs">
                            기본 크레딧
                          </div>
                          <div className="font-medium text-gray-900">
                            {pack.credits} 크레딧
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="text-gray-500 text-xs">보너스</div>
                          <div className="font-medium text-green-600">
                            +{pack.bonusCredits} 크레딧
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="text-gray-500 text-xs">총 크레딧</div>
                          <div className="font-medium text-gray-900">
                            {pack.totalCredits} 크레딧
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded col-span-2">
                          <div className="text-gray-500 text-xs">
                            사용 가능 시간
                          </div>
                          <div className="font-medium text-blue-600">
                            {pack.usageTime}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            (평균 ₩{averageRatePerMinute.toLocaleString()}/분
                            기준)
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ServiceLayout>
  );
}
