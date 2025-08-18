"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { calculateCreditsByLevel } from "@/utils/expertLevels";
import { ExpertProfile } from "@/types";
import {
  Users,
  Star,
  Award,
  Clock,
  Heart,
  MessageCircle,
  Video,
} from "lucide-react";

interface MatchedExpertsSectionProps {
  title: string;
  subtitle?: string;
  experts: ExpertProfile[];
  onClickProfile?: (expert: ExpertProfile) => void;
  searchContext?: {
    category?: string;
    ageGroup?: string;
    startDate?: string;
    endDate?: string;
  };
}

const getConsultationTypeIcon = (type: string) => {
  switch (type) {
    case "video":
      return Video;
    case "chat":
      return MessageCircle;
    default:
      return MessageCircle;
  }
};

const getResponseTimeText = (responseTime?: number) => {
  if (!responseTime) return "답변 시간 정보 없음";
  if (typeof responseTime === "number") {
    if (responseTime < 60) return `${responseTime}분 내`;
    if (responseTime < 1440) return `${Math.floor(responseTime / 60)}시간 내`;
    return `${Math.floor(responseTime / 1440)}일 내`;
  }
  return "답변 시간 정보 없음";
};

const getResponseTimeColor = (responseTime?: number) => {
  if (!responseTime) return "text-gray-400";
  if (typeof responseTime === "number") {
    if (responseTime < 60) return "text-green-500";
    if (responseTime < 1440) return "text-yellow-500";
    return "text-red-500";
  }
  return "text-gray-400";
};

function normalizeExpert(raw: any) {
  const reviewCount = raw.reviewCount ?? raw.totalConsultations ?? 0;
  const specialties: string[] = Array.isArray(raw.specialties)
    ? raw.specialties
    : Array.isArray(raw.tags)
      ? raw.tags
      : raw.specialty
        ? [raw.specialty]
        : [];
  const consultationTypes: string[] = Array.isArray(raw.consultationTypes)
    ? raw.consultationTypes
    : ["video", "chat"]; // 기본값
  const level =
    raw.level ??
    Math.max(
      1,
      Math.floor(
        ((raw.experience || 0) * 10 +
          (raw.rating || 0) * 20 +
          reviewCount * 0.5) /
          10
      )
    );

  return {
    id: raw.id,
    name: raw.name,
    specialty: raw.specialty ?? (specialties[0] || ""),
    rating: raw.rating ?? 0,
    reviewCount,
    experience: raw.experience ?? 0,
    description: raw.description ?? "",
    specialties,
    consultationTypes,
    languages: raw.languages ?? [],
    profileImage: raw.profileImage ?? raw.image ?? null,
    responseTime: raw.responseTime,
    level,
  };
}

export default function MatchedExpertsSection({
  title,
  subtitle,
  experts,
  onClickProfile,
  searchContext,
}: MatchedExpertsSectionProps) {
  const router = useRouter();
  const [favorites, setFavorites] = useState<number[]>([]);

  const normalizedExperts = useMemo(
    () => experts.map(normalizeExpert),
    [experts]
  );

  const toggleFavorite = (expertId: number) => {
    setFavorites((prev) =>
      prev.includes(expertId)
        ? prev.filter((id) => id !== expertId)
        : [...prev, expertId]
    );
  };

  const handleProfileView = (expert: any) => {
    if (expert.id) {
      // 검색 컨텍스트가 있으면 URL 파라미터로 전달
      let url = `/experts/${expert.id}`;
      if (searchContext) {
        const params = new URLSearchParams();
        if (searchContext.category) params.set('fromCategory', searchContext.category);
        if (searchContext.ageGroup) params.set('fromAgeGroup', searchContext.ageGroup);
        if (searchContext.startDate) params.set('fromStartDate', searchContext.startDate);
        if (searchContext.endDate) params.set('fromEndDate', searchContext.endDate);
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
      }
      router.push(url);
    } else if (onClickProfile) {
      onClickProfile(expert);
    }
  };

  return (
    <section className={title ? "py-16 bg-white rounded-2xl border border-gray-200" : "bg-transparent"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
            {subtitle && <p className="text-gray-600">{subtitle}</p>}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {normalizedExperts.map((expert) => {
            const creditsPerMinute = calculateCreditsByLevel(expert.level || 1);

            return (
              <div
                key={expert.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-blue-200"
              >
                <div className="p-6">
                  {/* 전문가 기본 정보 */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center space-x-4">
                      <div className="relative flex-shrink-0">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-gray-100">
                          {expert.profileImage ? (
                            <img
                              src={expert.profileImage}
                              alt={expert.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Users className="h-10 w-10 text-gray-400" />
                          )}
                        </div>
                        {/* 전문가 레벨 표시 */}
                        <div
                          className={`absolute -bottom-1 -right-1 border-2 border-white rounded-full shadow-sm flex items-center justify-center ${
                            expert.level >= 100
                              ? "w-12 h-6 px-2"
                              : "w-10 h-6 px-1"
                          } ${
                            expert.level >= 800
                              ? "bg-purple-500"
                              : expert.level >= 600
                                ? "bg-red-500"
                                : expert.level >= 400
                                  ? "bg-orange-500"
                                  : expert.level >= 200
                                    ? "bg-yellow-500"
                                    : expert.level >= 100
                                      ? "bg-green-500"
                                      : "bg-blue-500"
                          }`}
                        >
                          <span className="text-[10px] font-bold text-white">
                            Lv.{expert.level}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-xl font-bold text-gray-900 truncate">
                            {expert.name}
                          </h3>
                        </div>
                        <p className="text-base text-gray-600 font-medium">
                          {expert.specialty}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFavorite(expert.id)}
                      className={`p-2 rounded-full transition-colors ${
                        favorites.includes(expert.id)
                          ? "text-red-500 bg-red-50"
                          : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                      }`}
                    >
                      <Heart
                        className={`h-5 w-5 ${favorites.includes(expert.id) ? "fill-current" : ""}`}
                      />
                    </button>
                  </div>

                  {/* 평점 및 정보 */}
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-semibold text-gray-900 ml-1">
                        {expert.rating}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">
                        ({expert.reviewCount})
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Award className="h-4 w-4 mr-1" />
                      {expert.experience}년 경력
                    </div>
                  </div>

                  {/* 설명 */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {expert.description}
                  </p>

                  {/* 전문 분야 태그 */}
                  <div className="flex gap-1.5 overflow-hidden mb-4">
                    {expert.specialties
                      .slice(0, 3)
                      .map((specialty: string, index: number) => (
                        <span
                          key={index}
                          className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100 flex-shrink-0"
                        >
                          {specialty}
                        </span>
                      ))}
                    {expert.specialties.length > 3 && (
                      <span className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs rounded-full border border-gray-100 flex-shrink-0">
                        +{expert.specialties.length - 3}
                      </span>
                    )}
                  </div>

                  {/* 상담 방식 및 답변 시간 */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {expert.consultationTypes.map((type: string) => {
                        const Icon = getConsultationTypeIcon(type);
                        return (
                          <div
                            key={type}
                            className="flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded"
                            title={type === "video" ? "화상 상담" : "채팅 상담"}
                          >
                            <Icon className="h-3 w-3 mr-1" />
                            {type === "video" && "화상"}
                            {type === "chat" && "채팅"}
                          </div>
                        );
                      })}
                    </div>

                    {/* 답변 시간 표시 */}
                    <div className="flex items-center space-x-1 text-xs text-gray-600">
                      <Clock
                        className={`h-3 w-3 ${getResponseTimeColor(expert.responseTime)}`}
                      />
                      <span>{getResponseTimeText(expert.responseTime)}</span>
                    </div>
                  </div>

                  {/* 가격 및 버튼 */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-xl font-bold text-gray-900">
                      {creditsPerMinute} 크레딧
                      <span className="text-sm font-normal text-gray-500">
                        /분
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleProfileView(expert)}
                        className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
                        aria-label={`${expert.name} 전문가 프로필 보기`}
                      >
                        프로필 보기
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {title && (
          <div className="text-center mt-10">
            <a
              href="/experts"
              className="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              더 많은 전문가 찾기
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
