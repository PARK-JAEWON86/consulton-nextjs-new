"use client";

import CreditBalance from "./CreditBalance";
import PackCard from "./PackCard";
import ConsultationRecommendation from "@/components/recommendation/ConsultationRecommendation";

export default function DashboardContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">대시보드</h1>
          <p className="text-gray-600">
            상담 현황과 계정 정보를 한눈에 확인하세요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <CreditBalance credits={150} />
          </div>
          <div>
            <PackCard
              pack={{
                id: "premium-credit",
                name: "프리미엄 크레딧 패키지",
                type: "credit",
                credits: 200,
                price: 90000,
                description: "대량 크레딧으로 경제적인 상담 서비스",
                features: [
                  "200 크레딧 제공",
                  "전문가 우선 매칭",
                  "상담 요약 PDF 제공",
                  "30일 내 사용 가능",
                  "추가 할인 혜택",
                ],
                isRecommended: true,
                extraMinutes: 30,
                totalCredits: 230,
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <ConsultationRecommendation />
        </div>
      </div>
    </div>
  );
}
