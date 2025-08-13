"use client";

import React, { useState } from "react";
import {
  Calendar,
  Target,
  Clock,
  Users,
  ChevronDown,
  Search,
} from "lucide-react";

type IconType = React.ElementType;

type CategoryOption = {
  id: string;
  name: string;
  icon: IconType;
  description: string;
};

type AgeGroupOption = {
  id: string;
  name: string;
  icon: IconType;
};

type DurationOption = {
  id: string;
  name: string;
  description: string;
};

interface SearchFieldsProps {
  searchCategory: string;
  setSearchCategory: (value: string) => void;
  searchStartDate: string;
  setSearchStartDate: (value: string) => void;
  searchEndDate: string;
  setSearchEndDate: (value: string) => void;
  searchAgeGroup: string;
  setSearchAgeGroup: (value: string) => void;
  isSearching: boolean;
  onSearch: () => void;
  categories: CategoryOption[];
  ageGroups: AgeGroupOption[];
  durations: DurationOption[];
}

export default function SearchFields(props: SearchFieldsProps) {
  const {
    searchCategory,
    setSearchCategory,
    searchStartDate,
    setSearchStartDate,
    searchEndDate,
    setSearchEndDate,
    searchAgeGroup,
    setSearchAgeGroup,
    isSearching,
    onSearch,
    categories,
    ageGroups,
    durations,
  } = props;

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (dropdown: string) => {
    if (activeDropdown === dropdown) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(dropdown);
    }
  };

  const closeDropdown = () => setActiveDropdown(null);

  const getDisplayText = (type: string, value: string) => {
    switch (type) {
      case "category": {
        const category = categories.find((c) => c.id === value);
        return category ? category.name : "상담 분야 선택";
      }
      case "startDate":
        return value
          ? new Date(value).toLocaleDateString("ko-KR", {
              month: "long",
              day: "numeric",
            })
          : "날짜 선택";
      case "duration": {
        const duration = durations.find((d) => d.id === value);
        return duration ? duration.name : "상담시간 선택";
      }
      case "ageGroup": {
        const ageGroup = ageGroups.find((a) => a.id === value);
        return ageGroup ? ageGroup.name : "연령대 선택";
      }
      default:
        return "";
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-16">
      <div className="flex flex-col items-stretch md:flex-row md:flex-wrap md:items-end md:justify-center gap-3 md:gap-4">
        {/* 상담 카테고리 */}
        <div className="relative md:flex-none">
          <button
            onClick={() => toggleDropdown("category")}
            className={`w-full md:w-auto md:min-w-[220px] h-12 md:h-14 px-4 rounded-2xl text-left transition-all duration-200 flex items-center justify-between border ${
              activeDropdown === "category"
                ? "border-indigo-500 ring-2 ring-indigo-200 bg-white"
                : searchCategory
                  ? "border-gray-200 bg-white"
                  : "border-gray-200 bg-white/60 hover:bg-white"
            }`}
          >
            <div className="flex items-center space-x-3 overflow-hidden">
              {searchCategory ? (
                <>
                  {(() => {
                    const category = categories.find(
                      (c) => c.id === searchCategory
                    );
                    const IconComponent = category?.icon as
                      | IconType
                      | undefined;
                    return IconComponent ? (
                      <IconComponent className="h-5 w-5 text-blue-600" />
                    ) : null;
                  })()}
                  <span className="text-gray-900 font-medium whitespace-nowrap">
                    {getDisplayText("category", searchCategory)}
                  </span>
                </>
              ) : (
                <>
                  <Target className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-500 whitespace-nowrap">
                    상담 분야 선택
                  </span>
                </>
              )}
            </div>
            <ChevronDown
              className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                activeDropdown === "category" ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* 카테고리 드롭다운 */}
          {activeDropdown === "category" && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-lg z-50 max-h-80 overflow-y-auto">
              <div className="p-2">
                {categories.map((category) => {
                  const IconComponent = category.icon as IconType;
                  return (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSearchCategory(category.id);
                        closeDropdown();
                      }}
                      className="w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-3"
                    >
                      <IconComponent className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {category.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {category.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 상담 희망일 */}
        <div className="relative md:flex-none">
          <button
            onClick={() => toggleDropdown("startDate")}
            className={`w-full md:w-auto md:min-w-[220px] h-12 md:h-14 px-4 rounded-2xl text-left transition-all duration-200 flex items-center justify-between border ${
              activeDropdown === "startDate"
                ? "border-indigo-500 ring-2 ring-indigo-200 bg-white"
                : searchStartDate
                  ? "border-gray-200 bg-white"
                  : "border-gray-200 bg-white/60 hover:bg-white"
            }`}
          >
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <span
                className={
                  searchStartDate
                    ? "text-gray-900 font-medium whitespace-nowrap"
                    : "text-gray-500 whitespace-nowrap"
                }
              >
                {getDisplayText("startDate", searchStartDate)}
              </span>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                activeDropdown === "startDate" ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* 날짜 선택 드롭다운 */}
          {activeDropdown === "startDate" && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-lg z-50 p-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  상담 희망일 선택
                </h3>
                <input
                  type="date"
                  value={searchStartDate}
                  onChange={(e) => setSearchStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={closeDropdown}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  취소
                </button>
                <button
                  onClick={closeDropdown}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  확인
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 상담시간 */}
        <div className="relative md:flex-none">
          <button
            onClick={() => toggleDropdown("duration")}
            className={`w-full md:w-auto md:min-w-[220px] h-12 md:h-14 px-4 rounded-2xl text-left transition-all duration-200 flex items-center justify-between border ${
              activeDropdown === "duration"
                ? "border-indigo-500 ring-2 ring-indigo-200 bg-white"
                : searchEndDate
                  ? "border-gray-200 bg-white"
                  : "border-gray-200 bg-white/60 hover:bg-white"
            }`}
          >
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-gray-400" />
              <span
                className={
                  searchEndDate
                    ? "text-gray-900 font-medium whitespace-nowrap"
                    : "text-gray-500 whitespace-nowrap"
                }
              >
                {getDisplayText("duration", searchEndDate)}
              </span>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                activeDropdown === "duration" ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* 상담시간 선택 드롭다운 */}
          {activeDropdown === "duration" && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-lg z-50 max-h-80 overflow-y-auto">
              <div className="p-2">
                {durations.map((duration) => (
                  <button
                    key={duration.id}
                    onClick={() => {
                      setSearchEndDate(duration.id);
                      closeDropdown();
                    }}
                    className="w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="font-medium text-gray-900">
                      {duration.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {duration.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 연령대 */}
        <div className="relative md:flex-none">
          <button
            onClick={() => toggleDropdown("ageGroup")}
            className={`w-full md:w-auto md:min-w-[220px] h-12 md:h-14 px-4 rounded-2xl text-left transition-all duration-200 flex items-center justify-between border ${
              activeDropdown === "ageGroup"
                ? "border-indigo-500 ring-2 ring-indigo-200 bg-white"
                : searchAgeGroup
                  ? "border-gray-200 bg-white"
                  : "border-gray-200 bg-white/60 hover:bg-white"
            }`}
          >
            <div className="flex items-center space-x-3">
              {searchAgeGroup ? (
                <>
                  {(() => {
                    const ageGroup = ageGroups.find(
                      (a) => a.id === searchAgeGroup
                    );
                    const IconComponent = ageGroup?.icon as
                      | IconType
                      | undefined;
                    return IconComponent ? (
                      <IconComponent className="h-5 w-5 text-blue-600" />
                    ) : null;
                  })()}
                  <span className="text-gray-900 font-medium whitespace-nowrap">
                    {getDisplayText("ageGroup", searchAgeGroup)}
                  </span>
                </>
              ) : (
                <>
                  <Users className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-500 whitespace-nowrap">
                    연령대 선택
                  </span>
                </>
              )}
            </div>
            <ChevronDown
              className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                activeDropdown === "ageGroup" ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* 연령대 선택 드롭다운 */}
          {activeDropdown === "ageGroup" && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-lg z-50 max-h-50 overflow-y-auto">
              <div className="p-2">
                {ageGroups.map((ageGroup) => {
                  const IconComponent = ageGroup.icon as IconType;
                  return (
                    <button
                      key={ageGroup.id}
                      onClick={() => {
                        setSearchAgeGroup(ageGroup.id);
                        closeDropdown();
                      }}
                      className="w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-3"
                    >
                      <IconComponent className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-gray-900">
                        {ageGroup.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 검색 버튼 */}
        <div className="relative md:flex-none md:self-stretch md:flex md:items-stretch">
          <button
            aria-label="전문가 검색"
            onClick={onSearch}
            disabled={isSearching}
            className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-sm hover:from-indigo-700 hover:to-violet-700 disabled:from-indigo-400 disabled:to-violet-400"
          >
            {isSearching ? (
              <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white"></div>
            ) : (
              <Search className="h-4 w-4 md:h-5 md:w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
