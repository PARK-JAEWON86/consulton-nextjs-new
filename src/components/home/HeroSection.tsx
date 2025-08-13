"use client";

import { ArrowRight } from "lucide-react";
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
      </div>
    </section>
  );
}
