"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Star,
  Clock,
  Video,
  MessageCircle,
  Users,
  Award,
  ChevronDown,
  ChevronUp,
  Heart,
  X,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Brain,
  Scale,
  DollarSign,
  Heart as HeartIcon,
  Target,
  Home,
  Monitor,
  BookOpen,
  Youtube,
  TrendingUp,
  Zap,
  Palette,
  Camera,
  Mic,
  Smartphone,
  Globe,
  ShoppingBag,
} from "lucide-react";
import ConsultationRecommendation from "@/components/recommendation/ConsultationRecommendation";

// 전문가 레벨 계산 함수들
const calculateExpertLevel = (expert) => {
  // 경험, 평점, 상담 수 등을 종합하여 레벨 계산
  const experienceScore = expert.experience * 10;
  const ratingScore = expert.rating * 20;
  const consultationScore = (expert.totalConsultations || 0) * 0.5;
  
  return Math.floor((experienceScore + ratingScore + consultationScore) / 10);
};

const calculateCreditsPerMinute = (expert) => {
  const baseRate = 10; // 기본 크레딧
  const levelMultiplier = (expert.level || 1) * 0.1;
  return Math.max(5, Math.floor(baseRate + levelMultiplier));
};

const getLevelBadgeStyles = (levelName) => {
  const styles = {
    beginner: "bg-green-500 text-white",
    intermediate: "bg-yellow-500 text-white",
    advanced: "bg-orange-500 text-white",
    expert: "bg-red-500 text-white",
    master: "bg-purple-500 text-white",
  };
  return styles[levelName] || styles.beginner;
};

const getKoreanLevelName = (level) => {
  if (level >= 800) return "마스터";
  if (level >= 600) return "전문가";
  if (level >= 400) return "고급";
  if (level >= 200) return "중급";
  return "초급";
};

const ExpertSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    specialty: "",
    minRating: 0,
    maxPrice: 10000,
    availability: "",
    experience: 0,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("rating");
  const [favorites, setFavorites] = useState([]);
  const [filteredExperts, setFilteredExperts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [consultationTopic, setConsultationTopic] = useState("");
  const [consultationSummary, setConsultationSummary] = useState("");
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [isRecommendationCollapsed, setIsRecommendationCollapsed] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);

  // 샘플 전문가 데이터
  const allExperts = [
    {
      id: 1,
      name: "박지영",
      specialty: "심리상담",
      experience: 8,
      rating: 4.9,
      reviewCount: 245,
      totalSessions: 245,
      avgRating: 4.9,
      description: "8년간의 임상 경험을 바탕으로 다양한 심리적 어려움을 겪고 계신 분들에게 도움을 드리고 있습니다.",
      specialties: ["스트레스 관리", "우울증", "불안장애", "관계상담"],
      consultationTypes: ["video", "chat"],
      languages: ["한국어", "영어"],
      profileImage: null,
      responseTime: 30,
      education: ["서울대학교 심리학과 학사", "연세대학교 임상심리학 석사"],
      certifications: ["임상심리사 1급", "정신건강임상심리사"],
      totalConsultations: 245,
      level: 156,
    },
    {
      id: 2,
      name: "이민수",
      specialty: "법률상담",
      experience: 12,
      rating: 4.8,
      reviewCount: 189,
      totalSessions: 189,
      avgRating: 4.8,
      description: "12년간 다양한 법률 분야에서 활동하며 개인과 기업의 법적 문제 해결에 도움을 드리고 있습니다.",
      specialties: ["계약법", "부동산법", "가족법", "노동법"],
      consultationTypes: ["video", "chat"],
      languages: ["한국어"],
      profileImage: null,
      responseTime: 120,
      education: ["서울대학교 법학과 학사", "하버드 로스쿨 LL.M."],
      certifications: ["변호사", "공인중개사"],
      totalConsultations: 189,
      level: 342,
    },
    {
      id: 3,
      name: "김소연",
      specialty: "재무상담",
      experience: 6,
      rating: 4.7,
      reviewCount: 156,
      totalSessions: 156,
      avgRating: 4.7,
      description: "개인 자산관리와 투자 전략 수립을 통해 고객의 재정 목표 달성을 도와드립니다.",
      specialties: ["투자", "자산관리", "세무", "보험"],
      consultationTypes: ["video", "chat"],
      languages: ["한국어", "영어"],
      profileImage: null,
      responseTime: 60,
      education: ["연세대학교 경영학과 학사", "KAIST 금융공학 석사"],
      certifications: ["재무설계사", "투자상담사"],
      totalConsultations: 156,
      level: 89,
    },
    {
      id: 4,
      name: "정수현",
      specialty: "건강상담",
      experience: 10,
      rating: 4.6,
      reviewCount: 203,
      totalSessions: 203,
      avgRating: 4.6,
      description: "10년간의 임상 경험을 바탕으로 건강한 생활습관과 질병 예방에 대한 전문적인 조언을 제공합니다.",
      specialties: ["영양", "운동", "건강관리", "질병예방"],
      consultationTypes: ["video", "chat"],
      languages: ["한국어"],
      profileImage: null,
      responseTime: 45,
      education: ["서울대학교 의학과 학사", "존스홉킨스 공중보건학 석사"],
      certifications: ["의사", "영양사"],
      totalConsultations: 203,
      level: 567,
    },
    {
      id: 5,
      name: "한동훈",
      specialty: "진로상담",
      experience: 7,
      rating: 4.9,
      reviewCount: 134,
      totalSessions: 134,
      avgRating: 4.9,
      description: "다양한 산업 경험을 바탕으로 개인의 적성과 역량에 맞는 진로 설계를 도와드립니다.",
      specialties: ["취업", "이직", "커리어", "직업상담"],
      consultationTypes: ["video", "chat"],
      languages: ["한국어", "영어"],
      profileImage: null,
      responseTime: 90,
      education: ["고려대학교 경영학과 학사", "스탠포드 MBA"],
      certifications: ["직업상담사", "진로진학상담사"],
      totalConsultations: 134,
      level: 234,
    },
    {
      id: 6,
      name: "최유진",
      specialty: "부동산상담",
      experience: 15,
      rating: 4.8,
      reviewCount: 298,
      totalSessions: 298,
      avgRating: 4.8,
      description: "15년간 부동산 투자와 거래 경험을 바탕으로 안전하고 수익성 있는 부동산 투자를 도와드립니다.",
      specialties: ["부동산투자", "매매", "임대차", "세무"],
      consultationTypes: ["video", "chat"],
      languages: ["한국어"],
      profileImage: null,
      responseTime: 180,
      education: ["건국대학교 부동산학과 학사"],
      certifications: ["공인중개사", "부동산투자상담사"],
      totalConsultations: 298,
      level: 789,
    },
    {
      id: 7,
      name: "조영희",
      specialty: "교육상담",
      experience: 9,
      rating: 4.8,
      reviewCount: 167,
      totalSessions: 167,
      avgRating: 4.8,
      description: "9년간 교육 현장에서 학습자의 성장을 도와온 경험을 바탕으로 맞춤형 교육 솔루션을 제공합니다.",
      specialties: ["학습코칭", "진학상담", "교육과정", "학습법"],
      consultationTypes: ["video", "chat"],
      languages: ["한국어", "영어"],
      profileImage: null,
      responseTime: 75,
      education: ["이화여자대학교 교육학과 학사", "서울교육대학교 교육학 석사"],
      certifications: ["교사자격증", "학습코칭전문가"],
      totalConsultations: 167,
      level: 423,
    },
    {
      id: 8,
      name: "김태현",
      specialty: "IT상담",
      experience: 11,
      rating: 4.9,
      reviewCount: 223,
      totalSessions: 223,
      avgRating: 4.9,
      description: "11년간 IT 업계에서 다양한 프로젝트를 경험하며 기술 컨설팅과 디지털 전환을 도와드리고 있습니다.",
      specialties: ["웹개발", "앱개발", "데이터분석", "AI/ML"],
      consultationTypes: ["video", "chat"],
      languages: ["한국어", "영어"],
      profileImage: null,
      responseTime: 40,
      education: ["KAIST 컴퓨터공학과 학사", "스탠포드 컴퓨터공학 석사"],
      certifications: ["정보처리기사", "AWS 솔루션 아키텍트"],
      totalConsultations: 223,
      level: 678,
    },
  ];

  const specialtyOptions = [
    "심리상담", "법률상담", "재무상담", "건강상담", "진로상담",
    "부동산상담", "IT상담", "교육상담", "유튜브상담", "인플루언서상담",
    "창업상담", "투자상담", "디자인상담", "마케팅상담", "언어상담", "쇼핑몰상담",
  ];

  // 필터링 로직
  useEffect(() => {
    let filtered = allExperts;

    // 검색어 필터
    if (searchQuery) {
      filtered = filtered.filter(
        (expert) =>
          expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          expert.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
          expert.specialties.some((s) =>
            s.toLowerCase().includes(searchQuery.toLowerCase())
          ) ||
          expert.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 전문분야 필터
    if (selectedFilters.specialty) {
      filtered = filtered.filter(
        (expert) => expert.specialty === selectedFilters.specialty
      );
    }

    // 평점 필터
    if (selectedFilters.minRating > 0) {
      filtered = filtered.filter(
        (expert) => expert.rating >= selectedFilters.minRating
      );
    }

    // 경력 필터
    if (selectedFilters.experience > 0) {
      filtered = filtered.filter(
        (expert) => expert.experience >= selectedFilters.experience
      );
    }

    // 정렬
    switch (sortBy) {
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "experience":
        filtered.sort((a, b) => b.experience - a.experience);
        break;
      case "reviews":
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        break;
    }

    setFilteredExperts(filtered);
    setCurrentPage(1);
  }, [searchQuery, selectedFilters, sortBy]);

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const toggleFavorite = (expertId) => {
    setFavorites((prev) =>
      prev.includes(expertId)
        ? prev.filter((id) => id !== expertId)
        : [...prev, expertId]
    );
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      specialty: "",
      minRating: 0,
      maxPrice: 10000,
      availability: "",
      experience: 0,
    });
    setSearchQuery("");
  };

  const getConsultationTypeIcon = (type) => {
    switch (type) {
      case "video":
        return Video;
      case "chat":
        return MessageCircle;
      default:
        return MessageCircle;
    }
  };

  const getResponseTimeText = (responseTime) => {
    if (!responseTime) return "답변 시간 정보 없음";
    
    if (typeof responseTime === 'number') {
      if (responseTime < 60) {
        return `${responseTime}분 내`;
      } else if (responseTime < 1440) {
        const hours = Math.floor(responseTime / 60);
        return `${hours}시간 내`;
      } else {
        const days = Math.floor(responseTime / 1440);
        return `${days}일 내`;
      }
    }
    
    return "답변 시간 정보 없음";
  };

  const getResponseTimeColor = (responseTime) => {
    if (!responseTime) return "text-gray-400";
    
    if (typeof responseTime === 'number') {
      if (responseTime < 60) {
        return "text-green-500";
      } else if (responseTime < 1440) {
        return "text-yellow-500";
      } else {
        return "text-red-500";
      }
    }
    
    return "text-gray-400";
  };

  // 페이징 관련 계산
  const totalPages = Math.ceil(filteredExperts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExperts = filteredExperts.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const handleProfileView = (expert) => {
    // 전문가 프로필 페이지로 이동
    console.log("전문가 프로필 보기:", expert);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  전문가 찾기
                </h1>
                <p className="text-gray-600 mt-2">
                  다양한 분야의 전문가들을 찾아 상담받아보세요
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 상담 요약 추천 섹션 */}
        <ConsultationRecommendation
          consultationTopic={consultationTopic}
          consultationSummary={consultationSummary}
          showRecommendation={showRecommendation}
          isRecommendationCollapsed={isRecommendationCollapsed}
          setIsRecommendationCollapsed={setIsRecommendationCollapsed}
        />

        {/* 검색 및 필터 바 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* 검색 입력 */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="전문가 이름, 전문분야, 키워드로 검색하세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 필터 토글 버튼 */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-3 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition-colors"
            >
              <SlidersHorizontal className="h-5 w-5 mr-2" />
              필터
              {showFilters ? (
                <ChevronUp className="h-4 w-4 ml-2" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-2" />
              )}
            </button>

            {/* 정렬 선택 */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="rating">평점 높은 순</option>
              <option value="experience">경력 많은 순</option>
              <option value="reviews">리뷰 많은 순</option>
            </select>
          </div>

          {/* 인기 카테고리 */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-700">
                인기 카테고리
              </h3>
              <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                {showAllCategories ? "접기" : "더보기"}
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                { name: "심리상담", icon: Brain, color: "bg-purple-100 text-purple-700 hover:bg-purple-200" },
                { name: "법률상담", icon: Scale, color: "bg-blue-100 text-blue-700 hover:bg-blue-200" },
                { name: "재무상담", icon: DollarSign, color: "bg-green-100 text-green-700 hover:bg-green-200" },
                { name: "건강상담", icon: HeartIcon, color: "bg-red-100 text-red-700 hover:bg-red-200" },
                { name: "진로상담", icon: Target, color: "bg-orange-100 text-orange-700 hover:bg-orange-200" },
                { name: "부동산상담", icon: Home, color: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200" },
                { name: "IT상담", icon: Monitor, color: "bg-gray-100 text-gray-700 hover:bg-gray-200" },
                { name: "교육상담", icon: BookOpen, color: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" },
              ]
                .slice(0, showAllCategories ? undefined : 7)
                .map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={category.name}
                      onClick={() => {
                        setSelectedFilters((prev) => ({
                          ...prev,
                          specialty: category.name,
                        }));
                        setSearchQuery("");
                      }}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${category.color}`}
                    >
                      <IconComponent className="h-4 w-4" />
                      <span>{category.name}</span>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* 필터 패널 */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* 전문분야 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    전문분야
                  </label>
                  <select
                    value={selectedFilters.specialty}
                    onChange={(e) =>
                      handleFilterChange("specialty", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">전체</option>
                    {specialtyOptions.map((specialty) => (
                      <option key={specialty} value={specialty}>
                        {specialty}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 최소 평점 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    최소 평점
                  </label>
                  <select
                    value={selectedFilters.minRating}
                    onChange={(e) =>
                      handleFilterChange(
                        "minRating",
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={0}>전체</option>
                    <option value={4.5}>4.5점 이상</option>
                    <option value={4.0}>4.0점 이상</option>
                    <option value={3.5}>3.5점 이상</option>
                  </select>
                </div>

                {/* 최소 경력 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    최소 경력 ({selectedFilters.experience}년 이상)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="1"
                    value={selectedFilters.experience}
                    onChange={(e) =>
                      handleFilterChange("experience", parseInt(e.target.value))
                    }
                    className="w-full"
                  />
                </div>
              </div>

              {/* 필터 초기화 버튼 */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={clearAllFilters}
                  className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X className="h-4 w-4 mr-1" />
                  필터 초기화
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 검색 결과 및 상단 페이징 */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              총 <span className="font-semibold">{filteredExperts.length}</span>
              명의 전문가를 찾았습니다
              {filteredExperts.length > 0 && (
                <span className="ml-2 text-sm">
                  (페이지 {currentPage} / {totalPages})
                </span>
              )}
            </p>

            {/* 상단 페이징 */}
            {filteredExperts.length > 0 && totalPages > 1 && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className={`flex items-center px-2 py-1 rounded border transition-colors text-sm ${
                    currentPage === 1
                      ? "border-gray-300 text-gray-400 cursor-not-allowed"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`flex items-center px-2 py-1 rounded border transition-colors text-sm ${
                    currentPage === totalPages
                      ? "border-gray-300 text-gray-400 cursor-not-allowed"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 전문가 목록 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {currentExperts.map((expert) => {
            const creditsPerMinute = calculateCreditsPerMinute(expert);

            return (
              <div
                key={expert.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:border-blue-200"
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
                        <div className={`absolute -bottom-1 -right-1 border-2 border-white rounded-full shadow-sm flex items-center justify-center ${
                          expert.level >= 100 ? 'w-12 h-6 px-2' : 'w-10 h-6 px-1'
                        } ${
                          expert.level >= 800 ? 'bg-purple-500' :
                          expert.level >= 600 ? 'bg-red-500' :
                          expert.level >= 400 ? 'bg-orange-500' :
                          expert.level >= 200 ? 'bg-yellow-500' :
                          expert.level >= 100 ? 'bg-green-500' :
                          'bg-blue-500'
                        }`}>
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
                        className={`h-5 w-5 ${
                          favorites.includes(expert.id) ? "fill-current" : ""
                        }`}
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
                    {expert.specialties.slice(0, 3).map((specialty, index) => (
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
                      {expert.consultationTypes.map((type) => {
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
                      <Clock className={`h-3 w-3 ${getResponseTimeColor(expert.responseTime)}`} />
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

        {/* 하단 페이징 */}
        {filteredExperts.length > 0 && totalPages > 1 && (
          <div className="mt-8">
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                  currentPage === 1
                    ? "border-gray-300 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                이전
              </button>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                  currentPage === totalPages
                    ? "border-gray-300 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                다음
                <ChevronRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* 검색 결과가 없을 때 */}
        {filteredExperts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="max-w-md mx-auto">
              <Users className="h-20 w-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {searchQuery ||
                Object.values(selectedFilters).some((filter) =>
                  Array.isArray(filter)
                    ? filter.length > 0
                    : filter !== "" && filter !== 0
                )
                  ? "검색 조건에 맞는 전문가가 없습니다"
                  : "전문가를 검색해보세요"}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {searchQuery ||
                Object.values(selectedFilters).some((filter) =>
                  Array.isArray(filter)
                    ? filter.length > 0
                    : filter !== "" && filter !== 0
                ) ? (
                  <>
                    현재 검색 조건에 맞는 전문가를 찾을 수 없습니다.
                    <br />
                    다른 키워드나 필터 조건으로 다시 시도해보세요.
                  </>
                ) : (
                  <>
                    다양한 분야의 전문가들이 준비되어 있습니다.
                    <br />
                    검색창에 키워드를 입력하거나 필터를 사용해보세요.
                  </>
                )}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {(searchQuery ||
                  Object.values(selectedFilters).some((filter) =>
                    Array.isArray(filter)
                      ? filter.length > 0
                      : filter !== "" && filter !== 0
                  )) && (
                  <button
                    onClick={clearAllFilters}
                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
                  >
                    🔄 필터 초기화
                  </button>
                )}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
                >
                  🔍 필터 {showFilters ? "닫기" : "열기"}
                </button>
              </div>

              {/* 인기 검색어 제안 */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  인기 검색 분야
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    "심리상담",
                    "법률상담",
                    "재무상담",
                    "건강상담",
                    "진로상담",
                  ].map((keyword) => (
                    <button
                      key={keyword}
                      onClick={() => {
                        setSearchQuery(keyword);
                        clearAllFilters();
                      }}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full text-sm transition-colors"
                    >
                      {keyword}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpertSearch;
