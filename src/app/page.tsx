"use client";

/**
 * Consult On 메인 홈페이지
 * - 서비스 소개 및 상담 검색 기능
 * - AI 채팅상담 안내
 * - 다양한 상담 분야 소개
 */

import { useState } from "react";
import HeroSection from "../components/home/HeroSection";
import SearchingSection from "../components/home/SearchingSection";
import MatchedExpertsSection from "../components/home/MatchedExpertsSection";
import StatsSection from "../components/home/StatsSection";
import PopularCategoriesSection from "../components/home/PopularCategoriesSection";
import AIChatPromoSection from "../components/home/AIChatPromoSection";
import Footer from "../components/layout/Footer";
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
import { getExtendedCategories, getExtendedAgeGroups, getExtendedDurations, dummyMatchedExperts } from "@/data/dummy";

export default function HomePage() {
  // 검색 상태
  const [searchCategory, setSearchCategory] = useState("");
  const [searchStartDate, setSearchStartDate] = useState("");
  const [searchEndDate, setSearchEndDate] = useState("");
  const [searchAgeGroup, setSearchAgeGroup] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // 카테고리 표시 상태
  const [showAllCategories, setShowAllCategories] = useState(false);

  // 상담 카테고리 옵션
  const categories = [
    {
      id: "career",
      name: "진로상담",
      icon: Target,
      description: "취업, 이직, 진로 탐색",
    },
    {
      id: "psychology",
      name: "심리상담",
      icon: Brain,
      description: "스트레스, 우울, 불안",
    },
    {
      id: "finance",
      name: "재무상담",
      icon: DollarSign,
      description: "투자, 자산관리, 세무",
    },
    {
      id: "legal",
      name: "법률상담",
      icon: Scale,
      description: "계약, 분쟁, 상속",
    },
    {
      id: "education",
      name: "교육상담",
      icon: BookOpen,
      description: "학습법, 입시, 유학",
    },
    {
      id: "health",
      name: "건강상담",
      icon: Heart,
      description: "영양, 운동, 건강관리",
    },
    {
      id: "relationship",
      name: "관계상담",
      icon: Users,
      description: "연애, 결혼, 가족관계",
    },
    {
      id: "business",
      name: "사업상담",
      icon: Briefcase,
      description: "창업, 경영, 마케팅",
    },
    {
      id: "technology",
      name: "기술상담",
      icon: Code,
      description: "프로그래밍, IT, 개발",
    },
    {
      id: "design",
      name: "디자인상담",
      icon: Palette,
      description: "UI/UX, 그래픽, 브랜딩",
    },
    {
      id: "language",
      name: "언어상담",
      icon: Languages,
      description: "외국어, 통역, 번역",
    },
    {
      id: "art",
      name: "예술상담",
      icon: Music,
      description: "음악, 미술, 공연",
    },
    {
      id: "sports",
      name: "스포츠상담",
      icon: Trophy,
      description: "운동, 훈련, 경기",
    },
    {
      id: "travel",
      name: "여행상담",
      icon: Plane,
      description: "여행계획, 가이드, 숙박",
    },
    {
      id: "food",
      name: "요리상담",
      icon: ChefHat,
      description: "요리법, 영양, 식단",
    },
    {
      id: "fashion",
      name: "패션상담",
      icon: Scissors,
      description: "스타일링, 코디, 이미지",
    },
    {
      id: "pet",
      name: "반려동물상담",
      icon: PawPrint,
      description: "훈련, 건강, 케어",
    },
    {
      id: "gardening",
      name: "정원상담",
      icon: Sprout,
      description: "식물, 조경, 원예",
    },
    {
      id: "investment",
      name: "투자상담",
      icon: TrendingUp,
      description: "주식, 부동산, 펀드",
    },
    {
      id: "tax",
      name: "세무상담",
      icon: Receipt,
      description: "세금, 절세, 신고",
    },
    {
      id: "insurance",
      name: "보험상담",
      icon: Building2,
      description: "생명보험, 손해보험, 연금",
    },
    {
      id: "admission",
      name: "진학상담",
      icon: GraduationCap,
      description: "대입, 수시, 정시 전략",
    },
    {
      id: "other",
      name: "그외 기타",
      icon: X,
      description: "기타 상담 분야",
    },
  ];

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
    // no-op: dropdown is now managed inside SearchFields
    // 실제로는 API 호출하여 전문가 검색
    setTimeout(() => {
      setIsSearching(false);
    }, 2000);
  };

  // 전문가 데이터 (실제로는 API에서 가져옴)
  const matchedExperts = [
    {
      id: 1,
      name: "김민수",
      specialty: "진로상담",
      rating: 4.8,
      totalConsultations: 156,
      price: "₩50,000",
      duration: "45분",
      tags: ["취업준비", "이직", "진로고민"],
      isOnline: true,
      image: null,
      description:
        "10년간의 HR 경험과 진로상담 자격증을 바탕으로 취업 준비생과 직장인들의 진로 고민을 함께 해결해나가고 있습니다.",
    },
    {
      id: 2,
      name: "박지영",
      specialty: "심리상담",
      rating: 4.9,
      totalConsultations: 203,
      price: "₩60,000",
      duration: "50분",
      tags: ["스트레스", "우울증", "불안장애"],
      isOnline: false,
      image: null,
      description:
        "임상심리학 박사로서 다양한 연령대의 심리적 어려움을 전문적으로 상담하고 있습니다.",
    },
    {
      id: 3,
      name: "이소연",
      specialty: "재무상담",
      rating: 4.7,
      totalConsultations: 89,
      price: "₩70,000",
      duration: "60분",
      tags: ["투자", "자산관리", "세무"],
      isOnline: true,
      image: null,
      description:
        "금융권 15년 경력과 재무설계사 자격을 갖춘 전문가로 개인과 기업의 재무상담을 제공합니다.",
    },
  ];

  const categoryText = searchCategory
    ? `"${categories.find((c) => c.id === searchCategory)?.name}"`
    : "";
  const ageText = searchAgeGroup
    ? ` ${ageGroups.find((a) => a.id === searchAgeGroup)?.name} 대상`
    : "";

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
      />

      {/* 검색 결과 섹션 */}
      {isSearching && (
        <SearchingSection
          searchCategory={searchCategory}
          searchAgeGroup={searchAgeGroup}
          categories={categories}
          ageGroups={ageGroups}
        />
      )}

      {/* 매칭된 전문가 결과 */}
      {!isSearching &&
        (searchCategory ||
          searchStartDate ||
          searchEndDate ||
          searchAgeGroup) && (
          <MatchedExpertsSection
            title="매칭된 전문가"
            subtitle={`${categoryText} 분야의${ageText} 전문가 ${matchedExperts.length}명을 찾았습니다.`}
            experts={matchedExperts}
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
