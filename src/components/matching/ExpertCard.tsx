"use client";

import { useState } from "react";
import { Star, MapPin, Clock, MessageCircle, Calendar } from "lucide-react";

interface Expert {
  name?: string;
  title?: string;
  rating?: number;
  reviewCount?: number;
  specialties?: string[];
  experience?: string | number;
  consultationCount?: number;
  creditsPerMinute?: number;
}

const ExpertCard = ({
  expert = {} as Expert,
  viewMode = "grid",
}: {
  expert?: Expert;
  viewMode?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 ${
        viewMode === "grid" ? "hover:shadow-lg hover:scale-105" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 전문가 이미지 */}
      <div className="relative h-48 bg-gradient-to-br from-blue-100 to-indigo-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">
              {expert.name?.charAt(0) || "E"}
            </span>
          </div>
        </div>
      </div>

      {/* 전문가 정보 */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {expert.name || "전문가 이름"}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {expert.title || "전문 분야"}
          </p>

          {/* 평점 */}
          <div className="flex items-center space-x-1 mb-2">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm font-semibold text-gray-900">
              {expert.rating || 4.5}
            </span>
            <span className="text-sm text-gray-500">
              ({expert.reviewCount || 12})
            </span>
          </div>
        </div>

        {/* 전문 분야 */}
        <div className="mb-3">
          <div className="flex gap-1.5 overflow-hidden">
            {(expert.specialties || ["전문분야1", "전문분야2"]).map(
              (specialty: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 flex-shrink-0"
                >
                  {specialty}
                </span>
              ),
            )}
          </div>
        </div>

        {/* 상담 정보 */}
        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{expert.experience || "5"}년 경력</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <MessageCircle className="h-4 w-4" />
            <span>{expert.consultationCount || "50"}회 상담</span>
          </div>
        </div>

        {/* 하단 섹션 */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {/* 가격 정보 */}
          <div className="flex items-center space-x-2">
            <span className="font-bold text-gray-900 text-xl">
              {expert.creditsPerMinute || 100}크레딧
            </span>
            <span className="text-sm text-gray-500">/분</span>
          </div>

          {/* 프로필 보기 버튼 */}
          <button className="px-4 py-2 rounded-lg font-medium transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm">
            프로필 보기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpertCard;
