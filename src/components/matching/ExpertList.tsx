"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Grid, List } from "lucide-react";
import ExpertCard from "./ExpertCard";

/**
 * 전문가 데이터 유효성 검사 함수
 * @param {Object} expert - 검사할 전문가 객체
 * @returns {boolean} 유효한 전문가 데이터인지 여부
 */
const validateExpert = (expert) => {
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
  onExpertSelect = () => {},
  loading = false,
  defaultViewMode = "grid",
  defaultSortBy = "rating",
  showViewModeToggle = true,
  showSortOptions = true,
  itemsPerPage = 12,
}) => {
  const [viewMode, setViewMode] = useState(defaultViewMode);
  const [sortBy, setSortBy] = useState(defaultSortBy);
  const [displayCount, setDisplayCount] = useState(itemsPerPage);

  // 유효한 전문가만 필터링
  const validExperts = useMemo(() => {
    if (!Array.isArray(experts)) {
      console.warn("ExpertList: experts prop should be an array");
      return [];
    }
    return experts.filter((expert) => {
      const isValid = validateExpert(expert);
      if (!isValid) {
        console.warn("ExpertList: Invalid expert data:", expert);
      }
      return isValid;
    });
  }, [experts]);

  // 정렬 함수 최적화
  const sortExperts = useCallback((experts, sortBy) => {
    return [...experts].sort((a, b) => {
      try {
        switch (sortBy) {
          case "rating":
            return (b.rating || 0) - (a.rating || 0);
          case "price":
            const aPrice = a.pricePerHour || a.creditsPerMinute || 0;
            const bPrice = b.pricePerHour || b.creditsPerMinute || 0;
            return aPrice - bPrice;
          case "experience":
            const aExp = parseInt(a.experience?.replace(/[^0-9]/g, "") || "0");
            const bExp = parseInt(b.experience?.replace(/[^0-9]/g, "") || "0");
            return bExp - aExp;
          case "availability":
            const availabilityOrder = { available: 3, busy: 2, offline: 1 };
            return (
              (availabilityOrder[b.availability] || 0) -
              (availabilityOrder[a.availability] || 0)
            );
          default:
            return 0;
        }
      } catch (error) {
        console.error("ExpertList: Error sorting experts:", error);
        return 0;
      }
    });
  }, []);

  // 정렬된 전문가 목록 (메모화)
  const sortedExperts = useMemo(() => {
    return sortExperts(validExperts, sortBy);
  }, [validExperts, sortBy, sortExperts]);

  // 표시할 전문가 목록 (페이지네이션)
  const displayedExperts = useMemo(() => {
    return sortedExperts.slice(0, displayCount);
  }, [sortedExperts, displayCount]);

  // 더 보기 핸들러
  const handleLoadMore = useCallback(() => {
    setDisplayCount((prev) => prev + itemsPerPage);
  }, [itemsPerPage]);

  // 뷰 모드 변경 핸들러
  const handleViewModeChange = useCallback((mode) => {
    setViewMode(mode);
  }, []);

  // 정렬 변경 핸들러
  const handleSortChange = useCallback(
    (e) => {
      setSortBy(e.target.value);
      setDisplayCount(itemsPerPage); // 정렬 변경 시 표시 개수 초기화
    },
    [itemsPerPage],
  );

  const getSortLabel = (sortBy) => {
    switch (sortBy) {
      case "rating":
        return "평점순";
      case "price":
        return "가격순";
      case "experience":
        return "경력순";
      case "availability":
        return "응답 가능순";
      default:
        return "평점순";
    }
  };

  // 로딩 상태 렌더링
  if (loading) {
    return (
      <div className="space-y-4" role="status" aria-label="전문가 목록 로딩 중">
        <div className="flex items-center justify-between">
          <div
            className="h-6 bg-gray-200 rounded w-32 animate-pulse"
            aria-hidden="true"
          ></div>
          <div className="flex space-x-2">
            <div
              className="h-8 bg-gray-200 rounded w-20 animate-pulse"
              aria-hidden="true"
            ></div>
            <div
              className="h-8 bg-gray-200 rounded w-16 animate-pulse"
              aria-hidden="true"
            ></div>
          </div>
        </div>

        <div
          className={`grid ${
            viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          } gap-6`}
        >
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm p-6 animate-pulse"
              aria-hidden="true"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
        <span className="sr-only">전문가 목록을 불러오는 중입니다...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 컨트롤 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">
            전문가 목록 ({sortedExperts.length}명)
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          {/* 정렬 옵션 */}
          {showSortOptions && (
            <div className="flex items-center space-x-2">
              <label htmlFor="sort-select" className="text-sm text-gray-600">
                정렬:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={handleSortChange}
                className="text-sm border border-gray-300 rounded px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="전문가 목록 정렬 기준 선택"
              >
                <option value="rating">평점순</option>
                <option value="price">가격순</option>
                <option value="experience">경력순</option>
                <option value="availability">응답 가능순</option>
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
      </div>

      {/* 전문가 목록 */}
      {sortedExperts.length > 0 ? (
        <>
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            }`}
            role="list"
            aria-label="전문가 목록"
          >
            {displayedExperts.map((expert) => (
              <div key={expert.id} role="listitem">
                <ExpertCard
                  expert={expert}
                  onProfileView={() => onExpertSelect(expert)}
                  viewMode={viewMode}
                />
              </div>
            ))}
          </div>

          {/* 더 보기 버튼 (페이지네이션) */}
          {displayCount < sortedExperts.length && (
            <div className="flex justify-center">
              <button
                onClick={handleLoadMore}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label={`더 많은 전문가 보기 (${
                  sortedExperts.length - displayCount
                }명 남음)`}
              >
                더 많은 전문가 보기 ({sortedExperts.length - displayCount}명
                남음)
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12" role="status">
          <div className="text-gray-400 mb-4" aria-hidden="true">
            <svg
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            조건에 맞는 전문가가 없습니다
          </h3>
          <p className="text-gray-500 mb-4">
            검색 조건을 조정하거나 필터를 변경해보세요.
          </p>
          {experts.length > 0 && validExperts.length === 0 && (
            <p className="text-sm text-red-600">
              일부 전문가 데이터에 오류가 있습니다. 관리자에게 문의해주세요.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// 컴포넌트 displayName 설정 (개발 도구에서 식별하기 쉽게)
ExpertList.displayName = "ExpertList";

// 컴포넌트 사용 시 참고할 수 있는 타입 정보
ExpertList.propTypes = {
  // 실제로는 PropTypes 라이브러리를 사용하지 않지만,
  // 개발자를 위한 참고용 주석입니다.
  // experts: PropTypes.arrayOf(PropTypes.shape({
  //   id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  //   name: PropTypes.string.isRequired,
  //   rating: PropTypes.number.isRequired,
  //   pricePerHour: PropTypes.number,
  //   creditsPerMinute: PropTypes.number,
  //   experience: PropTypes.string.isRequired,
  //   availability: PropTypes.oneOf(['available', 'busy', 'offline']).isRequired,
  //   specialties: PropTypes.arrayOf(PropTypes.string),
  //   location: PropTypes.string,
  //   responseTime: PropTypes.string,
  //   consultationCount: PropTypes.number,
  //   description: PropTypes.string,
  //   avatar: PropTypes.string,
  //   reviewCount: PropTypes.number
  // })),
  // onExpertSelect: PropTypes.func,
  // loading: PropTypes.bool,
  // defaultViewMode: PropTypes.oneOf(['grid', 'list']),
  // defaultSortBy: PropTypes.oneOf(['rating', 'price', 'experience', 'availability']),
  // showViewModeToggle: PropTypes.bool,
  // showSortOptions: PropTypes.bool,
  // itemsPerPage: PropTypes.number
};

export default ExpertList;
