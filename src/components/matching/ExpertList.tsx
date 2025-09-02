"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import type React from "react";
import { Grid, List, Users, Star, Award, Clock, MessageCircle, Video, Heart } from "lucide-react";
<<<<<<< HEAD
import ExpertCard from "@/components/expert/ExpertCard";
=======
import ExpertLevelBadge from "@/components/expert/ExpertLevelBadge";
// API를 통해 레벨별 크레딧을 계산하는 함수
const calculateCreditsByLevel = async (level: number = 1): Promise<number> => {
  try {
    const response = await fetch(`/api/expert-levels?action=calculateCreditsByLevel&level=${level}`);
    const data = await response.json();
    return data.creditsPerMinute || 100;
  } catch (error) {
    console.error('크레딧 계산 실패:', error);
    return 100; // 기본값
  }
};
>>>>>>> 6615aeb (expert profile update)

/**
 * 전문가 데이터 유효성 검사 함수
 * @param {Object} expert - 검사할 전문가 객체
 * @returns {boolean} 유효한 전문가 데이터인지 여부
 */
type ExpertItem = {
  id: string | number;
  name: string;
  rating: number;
  pricePerHour?: number;
  creditsPerMinute?: number;
  experience: string;
  availability: "available" | "busy" | "offline" | string;
  specialty?: string;
  title?: string;
  [key: string]: unknown;
};

const validateExpert = (expert: ExpertItem) => {
  return (
    expert &&
    typeof expert.id !== "undefined" &&
    typeof expert.name === "string" &&
    typeof expert.rating === "number" &&
    (typeof expert.pricePerHour !== "undefined" ||
      typeof expert.creditsPerMinute !== "undefined") &&
    typeof expert.experience === "string" &&
    typeof expert.availability === "string"
  );
};

/**
 * 전문가 목록을 표시하는 컴포넌트
 * 그리드/리스트 뷰 전환, 정렬, 페이지네이션 기능을 제공합니다.
 *
 * @param {Object} props - 컴포넌트 props
 * @param {Array<Object>} props.experts - 전문가 데이터 배열
 * @param {Function} props.onExpertSelect - 전문가 선택 시 호출되는 함수
 * @param {boolean} props.loading - 로딩 상태
 * @param {string} props.defaultViewMode - 기본 뷰 모드 ('grid' | 'list')
 * @param {string} props.defaultSortBy - 기본 정렬 기준 ('rating' | 'price' | 'experience' | 'availability')
 * @param {boolean} props.showViewModeToggle - 뷰 모드 전환 버튼 표시 여부
 * @param {boolean} props.showSortOptions - 정렬 옵션 표시 여부
 * @param {number} props.itemsPerPage - 페이지당 표시할 항목 수
 *
 * @example
 * // 기본 사용법
 * <ExpertList
 *   experts={expertsData}
 *   onExpertSelect={(expert) => console.log('Selected:', expert)}
 * />
 *
 * @example
 * // 커스텀 설정
 * <ExpertList
 *   experts={expertsData}
 *   onExpertSelect={handleExpertSelect}
 *   defaultViewMode="list"
 *   defaultSortBy="price"
 *   itemsPerPage={8}
 * />
 */
const ExpertList = ({
  experts = [],
  onExpertSelect,
  loading = false,
  defaultViewMode = "grid",
  defaultSortBy = "rating",
  showViewModeToggle = true,
  showSortOptions = true,
  itemsPerPage = 12,
}: {
  experts?: ExpertItem[];
  onExpertSelect?: (expert: ExpertItem) => void;
  loading?: boolean;
  defaultViewMode?: "grid" | "list";
  defaultSortBy?: "rating" | "price" | "experience" | "availability";
  showViewModeToggle?: boolean;
  showSortOptions?: boolean;
  itemsPerPage?: number;
}) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">(defaultViewMode);
  const [sortBy, setSortBy] = useState<"rating" | "price" | "experience" | "availability">(defaultSortBy);
  const [currentPage, setCurrentPage] = useState(1);

  // 유효한 전문가 데이터만 필터링
  const validExperts = useMemo(() => {
    return experts.filter(validateExpert);
  }, [experts]);

  // 정렬된 전문가 목록
  const sortedExperts = useMemo(() => {
    const sorted = [...validExperts].sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "price":
          const aPrice = a.creditsPerMinute || a.pricePerHour || 0;
          const bPrice = b.creditsPerMinute || b.pricePerHour || 0;
          return aPrice - bPrice;
        case "experience":
          const aExp = parseInt(a.experience) || 0;
          const bExp = parseInt(b.experience) || 0;
          return bExp - aExp;
        case "availability":
          const availabilityOrder = { available: 0, busy: 1, offline: 2 };
          const aAvail = availabilityOrder[a.availability as keyof typeof availabilityOrder] ?? 2;
          const bAvail = availabilityOrder[b.availability as keyof typeof availabilityOrder] ?? 2;
          return aAvail - bAvail;
        default:
          return 0;
      }
    });
    return sorted;
  }, [validExperts, sortBy]);

  // 페이지네이션
  const totalPages = Math.ceil(sortedExperts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExperts = sortedExperts.slice(startIndex, endIndex);

  // 뷰 모드 변경 핸들러
  const handleViewModeChange = useCallback((mode: "grid" | "list") => {
    setViewMode(mode);
    setCurrentPage(1); // 뷰 모드 변경 시 첫 페이지로 이동
  }, []);

  // 정렬 변경 핸들러
  const handleSortChange = useCallback((sort: "rating" | "price" | "experience" | "availability") => {
    setSortBy(sort);
    setCurrentPage(1); // 정렬 변경 시 첫 페이지로 이동
  }, []);

  // 페이지 변경 핸들러
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  // 전문가 선택 핸들러
  const handleExpertSelect = useCallback((expert: ExpertItem) => {
    onExpertSelect?.(expert);
  }, [onExpertSelect]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 컨트롤 패널 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          {/* 정렬 옵션 */}
          {showSortOptions && (
            <div className="flex items-center space-x-2">
              <label htmlFor="sort-select" className="text-sm font-medium text-gray-700">
                정렬:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="rating">평점 높은 순</option>
                <option value="price">가격 낮은 순</option>
                <option value="experience">경력 많은 순</option>
                <option value="availability">접속 가능한 순</option>
              </select>
            </div>
          )}

          {/* 뷰 모드 전환 */}
          {showViewModeToggle && (
            <div
              className="flex items-center border border-gray-300 rounded-lg overflow-hidden"
              role="group"
              aria-label="보기 모드 선택"
            >
              <button
                onClick={() => handleViewModeChange("grid")}
                className={`p-2 text-sm transition-colors ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
                aria-label="그리드 보기"
                aria-pressed={viewMode === "grid"}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleViewModeChange("list")}
                className={`p-2 text-sm transition-colors ${
                  viewMode === "list"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
                aria-label="리스트 보기"
                aria-pressed={viewMode === "list"}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* 결과 수 표시 */}
        <div className="text-sm text-gray-500">
          총 {validExperts.length}명의 전문가
        </div>
      </div>

      {/* 전문가 목록 */}
      {currentExperts.length > 0 ? (
        <>
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
<<<<<<< HEAD
            {currentExperts.map((expert) => (
              <ExpertCard
                key={expert.id}
                expert={expert}
                mode={viewMode}
                showProfileButton={true}
                onProfileView={() => handleExpertSelect(expert)}
              />
            ))}
=======
            {displayedExperts.map((expert) => {

              // 타입 안전성을 위한 타입 가드
              const specialties = Array.isArray(expert.specialties) ? expert.specialties : [];
              const tags = Array.isArray(expert.tags) ? expert.tags : [];
              const consultationTypes = Array.isArray(expert.consultationTypes) ? expert.consultationTypes : ["video", "chat"];
              const profileImage = typeof expert.profileImage === 'string' ? expert.profileImage : null;
              const description = typeof expert.description === 'string' ? expert.description : '';
              const experience = typeof expert.experience === 'string' || typeof expert.experience === 'number' ? expert.experience : '5';
              const reviewCount = typeof expert.reviewCount === 'number' ? expert.reviewCount : 0;
              const responseTime = typeof expert.responseTime === 'string' ? expert.responseTime : '1시간 이내';
              const consultationCount = typeof expert.consultationCount === 'number' ? expert.consultationCount : 50;

              return (
                <div key={expert.id} role="listitem">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-blue-200">
                    {/* 전문가 이미지 */}
                    <div className="relative h-48 bg-gradient-to-br from-blue-100 to-indigo-100">
                      <div className="absolute inset-0 flex items-center justify-center">
                        {profileImage ? (
                          <img
                            src={profileImage}
                            alt={expert.name}
                            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-2xl font-bold">
                              {expert.name?.charAt(0) || "E"}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* 전문가 레벨 표시 */}
                      <div className="absolute top-3 right-3">
                        <ExpertLevelBadge
                          expertId={expert.id.toString()}
                          size="sm"
                          className="border-2 border-white shadow-sm"
                        />
                      </div>

                      {/* 즐겨찾기 버튼 */}
                      <button
                        onClick={() => {
                          // 즐겨찾기 기능 (로컬 상태로 관리)
                          console.log('즐겨찾기:', expert.name);
                        }}
                        className="absolute top-3 left-3 p-2 rounded-full transition-colors text-gray-400 hover:text-red-500 hover:bg-red-50"
                      >
                        <Heart className="h-5 w-5" />
                      </button>
                    </div>

                    {/* 전문가 정보 */}
                    <div className="p-6">
                      <div className="mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {expert.name || "전문가 이름"}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {expert.specialty || expert.title || "전문 분야"}
                        </p>

                        {/* 평점 */}
                        <div className="flex items-center space-x-1 mb-2">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-semibold text-gray-900">
                            {rating}
                          </span>
                          <span className="text-sm text-gray-500">
                            ({reviewCount})
                          </span>
                        </div>
                      </div>

                      {/* 설명 */}
                      {description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {description}
                        </p>
                      )}

                      {/* 전문 분야 */}
                      <div className="mb-3">
                        <div className="flex gap-1.5 overflow-hidden">
                          {(specialties.length > 0 ? specialties : tags).slice(0, 3).map(
                            (specialty: string, index: number) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 flex-shrink-0"
                              >
                                {specialty}
                              </span>
                            ),
                          )}
                          {(specialties.length > 0 ? specialties : tags).length > 3 && (
                            <span className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs rounded-full border border-gray-100 flex-shrink-0">
                              +{(specialties.length > 0 ? specialties : tags).length - 3}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 상담 정보 */}
                      <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Award className="h-4 w-4" />
                          <span>{experience}년 경력</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <MessageCircle className="h-4 w-4" />
                          <span>{consultationCount}회 상담</span>
                        </div>
                      </div>

                      {/* 상담 방식 및 답변 시간 */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          {consultationTypes.map((type: string) => {
                            const Icon = type === "video" ? Video : MessageCircle;
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
                          <Clock className="h-3 w-3 text-green-500" />
                          <span>{responseTime}</span>
                        </div>
                      </div>

                      {/* 하단 섹션 */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        {/* 가격 정보 */}
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-gray-900 text-xl">
                            {actualLevel 
                              ? calculateCreditsByLevel(actualLevel) 
                              : (typeof expert.creditsPerMinute === 'number' ? expert.creditsPerMinute : 100)}크레딧
                          </span>
                          <span className="text-sm text-gray-500">/분</span>
                        </div>

                        {/* 프로필 보기 버튼 */}
                        <button 
                          onClick={() => onExpertSelect(expert)}
                          className="px-4 py-2 rounded-lg font-medium transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm"
                        >
                          프로필 보기
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
>>>>>>> 6615aeb (expert profile update)
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                이전
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 text-sm border rounded-lg ${
                    currentPage === page
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                다음
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">전문가를 찾을 수 없습니다</h3>
          <p className="text-gray-500">검색 조건을 변경해보세요.</p>
        </div>
      )}
    </div>
  );
};

export default ExpertList;
