"use client";

/**
 * Consult On 메인 홈페이지
 * - 서비스 소개 및 상담 검색 기능
 * - AI 채팅상담 안내
 * - 다양한 상담 분야 소개
 */

import { useState, useEffect } from "react";
import HeroSection from "../components/home/HeroSection";
import SearchingSection from "../components/home/SearchingSection";
import MatchedExpertsSection from "../components/home/MatchedExpertsSection";
import StatsSection from "../components/home/StatsSection";
import PopularCategoriesSection from "../components/home/PopularCategoriesSection";
import AIChatPromoSection from "../components/home/AIChatPromoSection";
import Footer from "../components/layout/Footer";
import { convertExpertItemToProfile } from "../data/dummy/experts";
import {
  Users,
  Target,
  Brain,
  DollarSign,
  Scale,
  BookOpen,
  Heart,
  Briefcase,
  Code,
  Palette,
  Languages,
  Music,
  Trophy,
  Plane,
  ChefHat,
  Scissors,
  PawPrint,
  Sprout,
  TrendingUp,
  Receipt,
  Building2,
  GraduationCap,
  Baby,
  School,
  User,
  UserCheck,
  X,
} from "lucide-react";
import { categoriesWithStringIcons, getExtendedAgeGroups, getExtendedDurations } from "@/data/dummy/categories";

export default function HomePage() {
  // 검색 상태
  const [searchCategory, setSearchCategory] = useState("");
  const [searchStartDate, setSearchStartDate] = useState("");
  const [searchEndDate, setSearchEndDate] = useState("");
  const [searchAgeGroup, setSearchAgeGroup] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [exactMatchCount, setExactMatchCount] = useState(0);

  // 카테고리 표시 상태
  const [showAllCategories, setShowAllCategories] = useState(false);

  // 전문가 프로필 데이터
  const [allExperts, setAllExperts] = useState<any[]>([]);

  // 전문가 프로필 데이터 로드
  useEffect(() => {
    const loadExpertProfiles = async () => {
      try {
        // 먼저 API 초기화 호출
        await fetch('/api/expert-profiles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'initializeProfiles'
          })
        });

        // 그 다음 전문가 프로필 조회
        const response = await fetch('/api/expert-profiles');
        const result = await response.json();
        if (result.success) {
          setAllExperts(result.data.profiles || []);
        }
      } catch (error) {
        console.error('전문가 프로필 로드 실패:', error);
      }
    };

    loadExpertProfiles();
  }, []);

  // 상담 카테고리 옵션 (문자열 아이콘 이름 사용)
  const categories = categoriesWithStringIcons;

  // 연령대 옵션
  const ageGroups = [
    { id: "children", name: "어린이 (7-12세)", icon: Baby },
    { id: "teen", name: "청소년 (13-18세)", icon: GraduationCap },
    { id: "student", name: "학생 (19-25세)", icon: School },
    { id: "adult", name: "성인 (26-59세)", icon: User },
    { id: "senior", name: "시니어 (60세+)", icon: UserCheck },
  ];

  // 상담시간 옵션
  const durations = [
    { id: "30", name: "30분", description: "간단한 상담" },
    { id: "45", name: "45분", description: "표준 상담" },
    { id: "60", name: "60분", description: "심화 상담" },
    { id: "90", name: "90분", description: "종합 상담" },
    { id: "120", name: "120분", description: "전문 상담" },
  ];

  // 전문가 필터링 함수
  const filterExperts = (experts: any[], category: string, date: string, duration: string, ageGroup: string) => {
    return experts.filter(expert => {
      // 1. 카테고리 필터링
      const categoryMatch = expert.specialty === categories.find(c => c.id === category)?.name;
      
      // 2. 연령대 필터링 (targetAudience 기준)
      const ageGroupName = ageGroups.find(a => a.id === ageGroup)?.name;
      let ageMatch = true;
      if (ageGroupName) {
        if (ageGroup === "teen") {
          ageMatch = expert.targetAudience.some((target: string) => 
            target.includes("청소년") || target.includes("중학생") || target.includes("고등학생")
          );
        } else if (ageGroup === "student") {
          ageMatch = expert.targetAudience.some((target: string) => 
            target.includes("대학생") || target.includes("취준생") || target.includes("학생")
          );
        } else if (ageGroup === "adult") {
          ageMatch = expert.targetAudience.some((target: string) => 
            target.includes("성인") || target.includes("직장인") || target.includes("자영업자")
          );
        } else if (ageGroup === "senior") {
          ageMatch = expert.targetAudience.some((target: string) => 
            target.includes("시니어") || target.includes("은퇴")
          );
        }
      }
      
      // 3. 날짜 필터링 (현재는 모든 전문가가 가능하다고 가정)
      const dateMatch = true; // 실제로는 expert.weeklyAvailability와 date를 비교
      
      // 4. 상담시간 필터링
      let durationMatch = true;
      if (duration && duration !== "decide_after_matching") {
        const requestedDuration = parseInt(duration);
        // pricingTiers가 있는 경우에만 필터링, 없으면 기본적으로 매칭됨
        if (expert.pricingTiers && Array.isArray(expert.pricingTiers)) {
          durationMatch = expert.pricingTiers.some((tier: any) => tier.duration === requestedDuration);
        } else {
          // pricingTiers가 없는 경우 일반적인 상담 시간 (30, 60, 90분)을 지원한다고 가정
          durationMatch = [30, 60, 90].includes(requestedDuration);
        }
      }
      
      return categoryMatch && ageMatch && dateMatch && durationMatch;
    });
  };

  // 검색 실행
  const handleSearch = () => {
    if (
      !searchCategory ||
      !searchStartDate ||
      !searchEndDate ||
      !searchAgeGroup
    ) {
      alert("모든 검색 조건을 선택해주세요.");
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    
    // 실제로는 API 호출하여 전문가 검색
    setTimeout(() => {
      // 상태에서 전문가 데이터 가져오기
      const currentExperts = allExperts;
      
      // 검색 조건에 맞는 전문가 필터링
      const filteredExperts = filterExperts(
        currentExperts, 
        searchCategory, 
        searchStartDate, 
        searchEndDate, 
        searchAgeGroup
      );
      
      // 정확한 매칭 수 저장
      setExactMatchCount(filteredExperts.length);
      
      // 결과가 적을 경우 더미 데이터 추가 (실제 서비스에서는 제거)
      let finalResults = [...filteredExperts];
      if (filteredExperts.length < 3) {
        // 부족한 경우 다른 카테고리 전문가도 추가 (관련 전문가로 표시)
        const additionalExperts = currentExperts
          .filter((expert: any) => !filteredExperts.some(filtered => filtered.id === expert.id))
          .slice(0, 5 - filteredExperts.length);
        finalResults = [...filteredExperts, ...additionalExperts];
      }
      
      setSearchResults(finalResults);
      setIsSearching(false);
    }, 800);
  };



  return (
    <div className="min-h-screen bg-white">

      <HeroSection
        searchCategory={searchCategory}
        setSearchCategory={setSearchCategory}
        searchStartDate={searchStartDate}
        setSearchStartDate={setSearchStartDate}
        searchEndDate={searchEndDate}
        setSearchEndDate={setSearchEndDate}
        searchAgeGroup={searchAgeGroup}
        setSearchAgeGroup={setSearchAgeGroup}
        isSearching={isSearching}
        onSearch={handleSearch}
        categories={categories}
        ageGroups={ageGroups}
        durations={durations}
        searchResults={searchResults}
        hasSearched={hasSearched}
        exactMatchCount={exactMatchCount}
      />

      {/* 검색 진행 중일 때만 표시 */}
      {isSearching && (
        <SearchingSection
          searchCategory={searchCategory}
          searchAgeGroup={searchAgeGroup}
          categories={categories}
          ageGroups={ageGroups}
        />
      )}

      {/* 통계 섹션 */}
      <StatsSection />

      {/* 인기 카테고리 섹션 */}
      <PopularCategoriesSection
        categories={categories}
        showAllCategories={showAllCategories}
        setShowAllCategories={setShowAllCategories}
      />

      {/* AI 채팅상담 섹션 */}
      <AIChatPromoSection />

      {/* 푸터 */}
      <Footer />
    </div>
  );
}
