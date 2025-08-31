"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Users, Target, Brain, DollarSign, Scale, BookOpen, Heart, Briefcase, Code, Palette, Languages, Music, Trophy, Plane, ChefHat, Scissors, PawPrint, Sprout, TrendingUp, Receipt, Building2, GraduationCap, Baby, School, User, UserCheck, X, Star, Award, Clock, MessageCircle, Video } from "lucide-react";
import SearchFields from "./SearchFields";
import { ExpertProfile } from "@/types";
// API를 통해 레벨별 크레딧을 계산하는 함수
const calculateCreditsByLevel = (level: number = 1): number => {
  // 클라이언트 컴포넌트에서는 동기적으로 처리하기 위해 기본값 반환
  // 실제로는 useEffect에서 미리 로드하거나 다른 방식으로 처리해야 함
  return 100; // 기본값
};
import ExpertLevelBadge from "@/components/expert/ExpertLevelBadge";

type IconType = any;

export interface CategoryOption {
  id: string;
  name: string;
  icon: IconType;
  description: string;
}

export interface AgeGroupOption {
  id: string;
  name: string;
  icon: IconType;
}

export interface DurationOption {
  id: string;
  name: string;
  description: string;
}

interface HeroSectionProps {
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
  searchResults?: any[];
  hasSearched?: boolean;
  exactMatchCount?: number;
}

export default function HeroSection(props: HeroSectionProps) {
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
    searchResults = [],
    hasSearched = false,
    exactMatchCount = 0,
  } = props;

  const router = useRouter();

  const handleAIChatClick = () => {
    router.push("/chat");
  };

  return (
    <section className="relative z-10 overflow-visible py-28 sm:py-40 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl"
      >
        <div className="relative left-1/2 -translate-x-1/2 h-[36rem] w-[72rem] bg-gradient-to-tr from-indigo-200 via-purple-200 to-pink-200 opacity-40 rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-6 flex justify-center">
          <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 ring-1 ring-inset ring-gray-200">
            온디맨드 전문가 상담 플렛폼
            <button className="ml-2 inline-flex items-center text-indigo-600 hover:text-indigo-700">
              자세히 보기 <ArrowRight className="ml-1 h-4 w-4" />
            </button>
          </span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          전문가와 함께
          <br />
          <span className="block mt-3 text-blue-600">
            성장하는 온디맨드 상담
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          다양한 분야의 전문가들과 1:1 상담을 통해 당신의 고민을 해결하고 목표를
          달성해보세요.
        </p>

        <SearchFields
          searchCategory={searchCategory}
          setSearchCategory={setSearchCategory}
          searchStartDate={searchStartDate}
          setSearchStartDate={setSearchStartDate}
          searchEndDate={searchEndDate}
          setSearchEndDate={setSearchEndDate}
          searchAgeGroup={searchAgeGroup}
          setSearchAgeGroup={setSearchAgeGroup}
          isSearching={isSearching}
          onSearch={onSearch}
          categories={categories}
          ageGroups={ageGroups}
          durations={durations}
        />

        {/* 검색 결과가 없을 때만 AI 채팅 버튼 표시 */}
        {!hasSearched && (
          <div className="mt-16 flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-2 text-gray-500">
              <div className="h-px bg-gray-300 w-16"></div>
              <span className="text-sm">또는</span>
              <div className="h-px bg-gray-300 w-16"></div>
            </div>
            
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                어떤 전문가를 찾아야 할지 모르겠나요?
              </p>
              <button 
                onClick={handleAIChatClick}
                className="inline-flex items-center px-6 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group"
              >
                <svg
                  className="w-5 h-5 mr-2 text-purple-500 group-hover:text-blue-500 transition-colors duration-300 animate-pulse"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 group-hover:from-purple-700 group-hover:via-blue-600 group-hover:to-cyan-500 font-medium transition-all duration-300">AI 채팅 상담하기</span>
              </button>
            </div>
          </div>
        )}

        {/* 검색 결과 표시 */}
        {hasSearched && searchResults && searchResults.length > 0 && (
          <div className="mt-12">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-6 border-b border-gray-100 bg-gray-50">
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">매칭된 전문가</h3>
                  <p className="text-gray-600 text-lg">
                    {categories.find((c) => c.id === searchCategory)?.name || ""} 분야의 전문가 {exactMatchCount > 0 ? exactMatchCount : searchResults.length}명을 찾았습니다.
                  </p>
                  {exactMatchCount > 0 && exactMatchCount < searchResults.length && (
                    <p className="text-gray-500 text-sm mt-1">
                      * 정확히 일치하는 전문가 {exactMatchCount}명과 관련 전문가 {searchResults.length - exactMatchCount}명을 포함합니다.
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <button 
                    onClick={() => {
                      // 검색 조건 초기화
                      window.location.reload();
                    }}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    새로 검색
                  </button>
                  {searchResults.length > 6 && (
                    <button 
                      onClick={() => router.push(`/experts?category=${searchCategory}&ageGroup=${searchAgeGroup}&date=${searchStartDate}`)}
                      className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                    >
                      전체 {searchResults.length}명 보기
                    </button>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.slice(0, 6).map((expert: ExpertProfile) => {

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
                                <ExpertLevelBadge
                                  expertId={expert.id.toString()}
                                  size="md"
                                  className="absolute -bottom-1 -right-1"
                                />
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
                              onClick={() => {
                                // 즐겨찾기 기능 (로컬 상태로 관리)
                                console.log('즐겨찾기:', expert.name);
                              }}
                              className="p-2 rounded-full transition-colors text-gray-400 hover:text-red-500 hover:bg-red-50"
                            >
                              <Heart className="h-5 w-5" />
                            </button>
                          </div>

                          {/* 평점 및 정보 */}
                          <div className="flex items-center space-x-4 mb-3">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-semibold text-gray-900 ml-1">
                                {expert.rating || 4.5}
                              </span>
                              <span className="text-sm text-gray-500 ml-1">
                                ({expert.reviewCount || 0})
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Award className="h-4 w-4 mr-1" />
                              {expert.experience || 0}년 경력
                            </div>
                          </div>

                          {/* 설명 */}
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2 text-left">
                            {expert.description || "전문적인 상담 서비스를 제공합니다."}
                          </p>

                          {/* 전문 분야 태그 */}
                          <div className="flex gap-1.5 overflow-hidden mb-4">
                            {(expert.specialties || []).slice(0, 3).map((specialty, index) => (
                              <span
                                key={index}
                                className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100 flex-shrink-0"
                              >
                                {specialty}
                              </span>
                            ))}
                            {(expert.specialties || []).length > 3 && (
                              <span className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs rounded-full border border-gray-100 flex-shrink-0">
                                +{(expert.specialties || []).length - 3}
                              </span>
                            )}
                          </div>

                          {/* 상담 방식 및 답변 시간 */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                              {(expert.consultationTypes || ["video", "chat"]).map((type) => {
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
                              <span>{expert.responseTime || "1시간 이내"}</span>
                            </div>
                          </div>

                          {/* 가격 및 버튼 */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="text-xl font-bold text-gray-900">
                              {calculateCreditsByLevel(1)} 크레딧
                              <span className="text-sm font-normal text-gray-500">
                                /분
                              </span>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => router.push(`/experts/${expert.id}`)}
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
                
                {searchResults.length > 6 && (
                  <div className="mt-8 text-center">
                    <button 
                      onClick={() => router.push(`/experts?category=${searchCategory}&ageGroup=${searchAgeGroup}&date=${searchStartDate}`)}
                      className="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                    >
                      더 많은 전문가 보기 (+{searchResults.length - 6}명)
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 검색 결과가 없을 때 */}
        {hasSearched && (!searchResults || searchResults.length === 0) && (
          <div className="mt-12 text-center">
            <div className="bg-gray-50 rounded-xl p-8">
              <p className="text-gray-600 text-lg mb-4">
                검색 조건에 맞는 전문가를 찾지 못했습니다.
              </p>
              <p className="text-gray-500 mb-6">
                다른 조건으로 다시 검색해보시거나 AI 채팅 상담을 이용해보세요.
              </p>
              <button 
                onClick={handleAIChatClick}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
                AI 채팅 상담하기
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
