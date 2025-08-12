"use client";

/**
 * Consult On 메인 홈페이지
 * - 서비스 소개 및 상담 검색 기능
 * - AI 채팅상담 안내
 * - 다양한 상담 분야 소개
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import MainNavigation from "../components/layout/MainNavigation";
import {
  Search,
  Calendar,
  Users,
  MapPin,
  Star,
  Clock,
  MessageCircle,
  Video,
  Target,
  Brain,
  DollarSign,
  Scale,
  BookOpen,
  Heart,
  Baby,
  GraduationCap,
  School,
  User,
  UserCheck,
  ChevronDown,
  X,
  Shield,
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
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  // 검색 상태
  const [searchCategory, setSearchCategory] = useState("");
  const [searchStartDate, setSearchStartDate] = useState("");
  const [searchEndDate, setSearchEndDate] = useState("");
  const [searchAgeGroup, setSearchAgeGroup] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // 드롭다운 상태
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

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

  // 드롭다운 토글
  const toggleDropdown = (dropdown: string) => {
    if (activeDropdown === dropdown) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(dropdown);
    }
  };

  // 드롭다운 닫기
  const closeDropdown = () => {
    setActiveDropdown(null);
  };

  // 선택된 값 표시 텍스트
  const getDisplayText = (type: string, value: string) => {
    switch (type) {
      case "category":
        const category = categories.find((c) => c.id === value);
        return category ? category.name : "상담 분야 선택";
      case "startDate":
        return value
          ? new Date(value).toLocaleDateString("ko-KR", {
              month: "long",
              day: "numeric",
            })
          : "날짜 선택";
      case "duration":
        const duration = durations.find((d) => d.id === value);
        return duration ? duration.name : "상담시간 선택";
      case "ageGroup":
        const ageGroup = ageGroups.find((a) => a.id === value);
        return ageGroup ? ageGroup.name : "연령대 선택";
      default:
        return "";
    }
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
    closeDropdown();
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

  return (
    <div className="min-h-screen bg-white">
      {/* 메인 네비게이션 */}
      <MainNavigation />

      {/* 메인 히어로 섹션 */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            전문가와 함께
            <br />
            <span className="text-blue-600">성장하는 상담</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            진로, 심리, 재무 등 다양한 분야의 전문가들과 1:1 상담을 통해 당신의
            고민을 해결하고 목표를 달성해보세요.
          </p>

          {/* 메인 검색바 */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              {/* 상담 카테고리 */}
              <div className="relative flex-1">
                <button
                  onClick={() => toggleDropdown("category")}
                  className={`w-full h-14 px-4 border rounded-2xl text-left transition-all duration-200 flex items-center justify-between ${
                    activeDropdown === "category"
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : searchCategory
                        ? "border-gray-300 bg-white"
                        : "border-gray-300 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {searchCategory ? (
                      <>
                        {(() => {
                          const category = categories.find(
                            (c) => c.id === searchCategory
                          );
                          const IconComponent = category?.icon;
                          return IconComponent ? (
                            <IconComponent className="h-5 w-5 text-blue-600" />
                          ) : null;
                        })()}
                        <span className="text-gray-900 font-medium">
                          {getDisplayText("category", searchCategory)}
                        </span>
                      </>
                    ) : (
                      <>
                        <Target className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-500">상담 분야 선택</span>
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
                        const IconComponent = category.icon;
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
              <div className="relative flex-1">
                <button
                  onClick={() => toggleDropdown("startDate")}
                  className={`w-full h-14 px-4 border rounded-2xl text-left transition-all duration-200 flex items-center justify-between ${
                    activeDropdown === "startDate"
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : searchStartDate
                        ? "border-gray-300 bg-white"
                        : "border-gray-300 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span
                      className={
                        searchStartDate
                          ? "text-gray-900 font-medium"
                          : "text-gray-500"
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
              <div className="relative w-48">
                <button
                  onClick={() => toggleDropdown("duration")}
                  className={`w-full h-14 px-4 border rounded-2xl text-left transition-all duration-200 flex items-center justify-between ${
                    activeDropdown === "duration"
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : searchEndDate
                        ? "border-gray-300 bg-white"
                        : "border-gray-300 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span
                      className={
                        searchEndDate
                          ? "text-gray-900 font-medium"
                          : "text-gray-500"
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
              <div className="relative w-48">
                <button
                  onClick={() => toggleDropdown("ageGroup")}
                  className={`w-full h-14 px-4 border rounded-2xl text-left transition-all duration-200 flex items-center justify-between ${
                    activeDropdown === "ageGroup"
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : searchAgeGroup
                        ? "border-gray-300 bg-white"
                        : "border-gray-300 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {searchAgeGroup ? (
                      <>
                        {(() => {
                          const ageGroup = ageGroups.find(
                            (a) => a.id === searchAgeGroup
                          );
                          const IconComponent = ageGroup?.icon;
                          return IconComponent ? (
                            <IconComponent className="h-5 w-5 text-blue-600" />
                          ) : null;
                        })()}
                        <span className="text-gray-900 font-medium">
                          {getDisplayText("ageGroup", searchAgeGroup)}
                        </span>
                      </>
                    ) : (
                      <>
                        <Users className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-500">연령대 선택</span>
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
                        const IconComponent = ageGroup.icon;
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
              <div className="relative flex-shrink-0">
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="w-24 h-14 bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white rounded-full transition-colors duration-200 flex items-center justify-center"
                >
                  {isSearching ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <Search className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 검색 결과 섹션 */}
      {isSearching && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                전문가를 찾고 있습니다...
              </h2>
              <p className="text-gray-600">
                {searchCategory &&
                  `"${categories.find((c) => c.id === searchCategory)?.name}"`}{" "}
                분야의
                {searchAgeGroup &&
                  ` ${ageGroups.find((a) => a.id === searchAgeGroup)?.name} 대상`}{" "}
                전문가를 검색하고 있습니다.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 매칭된 전문가 결과 */}
      {!isSearching &&
        (searchCategory ||
          searchStartDate ||
          searchEndDate ||
          searchAgeGroup) && (
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  매칭된 전문가
                </h2>
                <p className="text-gray-600">
                  {searchCategory &&
                    `"${categories.find((c) => c.id === searchCategory)?.name}"`}{" "}
                  분야의
                  {searchAgeGroup &&
                    ` ${ageGroups.find((a) => a.id === searchAgeGroup)?.name} 대상`}{" "}
                  전문가 {matchedExperts.length}명을 찾았습니다.
                </p>
              </div>

              {/* 전문가 카드 그리드 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchedExperts.map((expert) => (
                  <div
                    key={expert.id}
                    className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-200"
                  >
                    {/* 전문가 이미지 및 상태 */}
                    <div className="relative">
                      <div className="h-48 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-t-xl flex items-center justify-center">
                        <Users className="h-16 w-16 text-blue-600" />
                      </div>
                      {expert.isOnline && (
                        <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                          <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                          온라인
                        </div>
                      )}
                      <button className="absolute top-3 left-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                        <svg
                          className="w-5 h-5 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* 전문가 정보 */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {expert.name}
                          </h3>
                          <p className="text-blue-600 font-medium">
                            {expert.specialty}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">
                            {expert.price}
                          </p>
                          <p className="text-sm text-gray-500">
                            {expert.duration}
                          </p>
                        </div>
                      </div>

                      {/* 평점 및 상담 수 */}
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm font-medium text-gray-900">
                            {expert.rating}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          상담 {expert.totalConsultations}회
                        </span>
                      </div>

                      {/* 태그 */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {expert.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* 설명 */}
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {expert.description}
                      </p>

                      {/* 액션 버튼 */}
                      <div className="flex space-x-2">
                        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                          상담 예약
                        </button>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                          프로필
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 더 보기 버튼 */}
              <div className="text-center mt-8">
                <button className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-medium transition-colors">
                  더 많은 전문가 보기
                </button>
              </div>
            </div>
          </section>
        )}

      {/* 인기 카테고리 섹션 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              인기 상담 분야
            </h2>
            <p className="text-gray-600">
              많은 분들이 찾고 있는 상담 분야를 확인해보세요
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-6">
            {/* 인기 상담 분야 6개만 표시 */}
            {categories.slice(0, 6).map((category) => {
              const IconComponent = category.icon;
              return (
                <div
                  key={category.id}
                  className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                >
                  <div className="flex justify-center mb-3">
                    <IconComponent className="h-12 w-12 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {category.description}
                  </p>
                </div>
              );
            })}

            {/* 더보기 칸 */}
            <div
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-200 cursor-pointer border-2 border-dashed border-blue-300 hover:border-blue-400 group"
            >
              <div className="flex justify-center mb-3">
                <div className="bg-blue-100 rounded-full p-3 group-hover:bg-blue-200 transition-colors">
                  <ChevronDown
                    className={`h-12 w-12 text-blue-600 transition-transform duration-200 ${showAllCategories ? "rotate-180" : ""}`}
                  />
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {showAllCategories ? "접기" : "더 많은 분야"}
              </h3>
              <p className="text-sm text-gray-600">
                총 {categories.length}개의 상담 분야
              </p>
            </div>
          </div>

          {/* 추가 카테고리들 */}
          {showAllCategories && (
            <div className="mt-8">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {categories.slice(6).map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <div
                      key={category.id}
                      className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex justify-center mb-3">
                        <IconComponent className="h-12 w-12 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {category.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* AI 채팅상담 섹션 */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            {/* AI 아이콘 */}
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-6">
                <Brain className="h-16 w-16 text-white" />
              </div>
            </div>

            {/* 메인 제목 */}
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              어떤 상담을 해야할지 모르시나요?
            </h2>

            {/* 설명 */}
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              AI가 당신의 상황을 파악하고 가장 적합한 상담 분야를
              추천해드립니다.
              <br />
              무료로 간단한 대화를 통해 맞춤형 상담 방향을 찾아보세요.
            </p>

            {/* 특징들 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <MessageCircle className="h-8 w-8 text-white mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  즉시 상담
                </h3>
                <p className="text-blue-100 text-sm">
                  24시간 언제든지 AI와 대화하며 상담 방향을 찾아보세요
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Target className="h-8 w-8 text-white mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  맞춤 추천
                </h3>
                <p className="text-blue-100 text-sm">
                  AI가 분석하여 가장 적합한 전문가와 상담 분야를 추천
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <DollarSign className="h-8 w-8 text-white mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  완전 무료
                </h3>
                <p className="text-blue-100 text-sm">
                  AI 채팅상담은 100% 무료로 제공됩니다
                </p>
              </div>
            </div>

            {/* CTA 버튼 */}
            <button
              onClick={() => router.push("/chat")}
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              무료 AI 채팅상담 시작하기 →
            </button>

            {/* 추가 정보 */}
            <p className="text-blue-200 text-sm mt-6">
              평균 3-5분 소요 • 별도 가입 불필요 • 즉시 시작 가능
            </p>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Consult On</h3>
              <p className="text-gray-400 text-sm">
                전문가와 함께 성장하는 상담 플랫폼
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">서비스</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    상담 찾기
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    전문가 등록
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    커뮤니티
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">지원</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    고객센터
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    이용약관
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    개인정보처리방침
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">연결</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    문의하기
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    파트너십
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    채용
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 Consult On. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* 드롭다운 외부 클릭 시 닫기 */}
      {activeDropdown && (
        <div className="fixed inset-0 z-40" onClick={closeDropdown} />
      )}
    </div>
  );
}
