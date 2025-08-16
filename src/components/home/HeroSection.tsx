"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import SearchFields from "./SearchFields";

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

        <div className="mt-8 flex flex-col items-center space-y-4">
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
      </div>
    </section>
  );
}
