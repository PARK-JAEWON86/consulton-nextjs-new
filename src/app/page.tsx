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
import UserReviewsSection from "../components/home/UserReviewsSection";
import AIChatPromoSection from "../components/home/AIChatPromoSection";
import Footer from "../components/layout/Footer";
// import { convertExpertItemToProfile } from "../data/dummy/experts"; // 더미 데이터 제거
// import { dummyExperts } from "../data/dummy/experts"; // 더미 데이터 제거
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
  Activity
} from "lucide-react";
// import { getExtendedAgeGroups, getExtendedDurations } from "@/data/dummy/categories"; // 더미 데이터 제거

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

  // 사용자 인증 상태
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 페이지 로딩 및 에러 상태
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  // 초기 데이터 로드 (인증 상태, 전문가 프로필, 카테고리를 한 번에 처리)
  useEffect(() => {
    const initializePageData = async () => {
      setIsPageLoading(true);
      setPageError(null);
      
      try {
        // 서비스 진입 상태 설정
        fetch('/api/app-state', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'enterService', data: {} })
        }).catch(error => console.warn('서비스 진입 상태 설정 실패:', error));

        // 병렬로 필요한 데이터들을 모두 로드 (타임아웃 설정)
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('API 호출 시간 초과')), 10000)
        );

        const [authResult, expertsResult, categoriesResult] = await Promise.race([
          Promise.allSettled([
            // 인증 상태 확인
            fetch('/api/app-state').then(res => res.json()),
            // 전문가 프로필 로드
            fetch('/api/expert-profiles').then(res => res.json()),
            // 카테고리 로드
            fetch('/api/categories?activeOnly=true').then(res => res.json())
          ]),
          timeoutPromise
        ]) as any;

        // 인증 상태 처리
        if (authResult.status === 'fulfilled' && authResult.value.success) {
          setIsAuthenticated(authResult.value.data.isAuthenticated);
          setCurrentUserId(authResult.value.data.userId || "");
        } else {
          // API 실패 시 로컬 스토리지에서 확인
          try {
            const storedUser = localStorage.getItem('consulton-user');
            const storedAuth = localStorage.getItem('consulton-auth');
            
            if (storedUser && storedAuth) {
              const user = JSON.parse(storedUser);
              const isAuth = JSON.parse(storedAuth);
              
              if (isAuth) {
                setIsAuthenticated(true);
                setCurrentUserId(user.id || user.email || "");
              }
            }
          } catch (error) {
            console.error('로컬 스토리지 파싱 오류:', error);
          }
        }

        // 전문가 프로필 처리
        if (expertsResult.status === 'fulfilled' && expertsResult.value.success && expertsResult.value.data?.profiles) {
          const convertedExperts = expertsResult.value.data.profiles.map((apiExpert: any) => {
            // 안전한 데이터 변환을 위한 헬퍼 함수들
            const safeParseInt = (value: any, defaultValue: number = 0) => {
              const parsed = parseInt(value);
              return isNaN(parsed) ? defaultValue : parsed;
            };
            
            const safeParseFloat = (value: any, defaultValue: number = 0) => {
              const parsed = parseFloat(value);
              return isNaN(parsed) ? defaultValue : parsed;
            };
            
            const safeParseJSON = (value: any, defaultValue: any) => {
              try {
                return value && typeof value === 'string' ? JSON.parse(value) : (value || defaultValue);
              } catch {
                return defaultValue;
              }
            };
            
            const safeDate = (value: any) => {
              try {
                return value ? new Date(value) : new Date();
              } catch {
                return new Date();
              }
            };
            
            return {
              id: safeParseInt(apiExpert.id),
              name: apiExpert.fullName || '이름 없음',
              specialty: apiExpert.specialty || '전문 분야 미정',
              experience: safeParseInt(apiExpert.experienceYears),
              description: apiExpert.bio || '소개가 준비 중입니다.',
              education: [],
              certifications: Array.isArray(apiExpert.certifications) 
                ? apiExpert.certifications.map((cert: any) => cert.name || cert) 
                : [],
              specialties: Array.isArray(apiExpert.keywords) ? apiExpert.keywords : [],
              specialtyAreas: Array.isArray(apiExpert.keywords) ? apiExpert.keywords : [],
              consultationTypes: safeParseJSON(apiExpert.consultationTypes, ['video', 'chat']),
              languages: safeParseJSON(apiExpert.languages, ['한국어']),
              hourlyRate: safeParseInt(apiExpert.hourlyRate),
              pricePerMinute: safeParseInt(apiExpert.pricePerMinute),
              totalSessions: safeParseInt(apiExpert.totalSessions),
              avgRating: safeParseFloat(apiExpert.avgRating, 4.5),
              rating: safeParseFloat(apiExpert.avgRating, 4.5),
              reviewCount: safeParseInt(apiExpert.reviewCount),
              completionRate: safeParseInt(apiExpert.completionRate, 95),
              repeatClients: safeParseInt(apiExpert.repeatClients),
              responseTime: apiExpert.responseTime || '1시간 이내',
              averageSessionDuration: safeParseInt(apiExpert.averageSessionDuration, 60),
              cancellationPolicy: apiExpert.cancellationPolicy || '24시간 전 취소 가능',
              availability: safeParseJSON(apiExpert.availability, {}),
              weeklyAvailability: {},
              holidayPolicy: apiExpert.holidayPolicy || undefined,
              contactInfo: {
                phone: apiExpert.phone || '',
                email: apiExpert.email || '',
                location: apiExpert.location || '위치 미설정',
                website: apiExpert.website || ''
              },
              location: apiExpert.location || '위치 미설정',
              timeZone: apiExpert.timeZone || 'Asia/Seoul',
              profileImage: apiExpert.profileImage || null,
              portfolioFiles: [],
              portfolioItems: safeParseJSON(apiExpert.portfolioItems, []),
              tags: Array.isArray(apiExpert.keywords) ? apiExpert.keywords : [],
              targetAudience: safeParseJSON(apiExpert.targetAudience, ['성인']),
              isOnline: true,
              isProfileComplete: true,
              createdAt: safeDate(apiExpert.createdAt),
              updatedAt: safeDate(apiExpert.updatedAt),
              price: apiExpert.hourlyRate ? `₩${safeParseInt(apiExpert.hourlyRate).toLocaleString()}` : '가격 문의',
              image: apiExpert.profileImage || null,
              consultationStyle: apiExpert.consultationStyle || '체계적이고 전문적인 접근',
              successStories: safeParseInt(apiExpert.successStories, 50),
              nextAvailableSlot: apiExpert.nextAvailableSlot || '2024-01-22T10:00:00',
              profileViews: safeParseInt(apiExpert.profileViews, 500),
              lastActiveAt: safeDate(apiExpert.lastActiveAt || apiExpert.updatedAt),
              joinedAt: safeDate(apiExpert.joinedAt || apiExpert.createdAt),
              socialProof: safeParseJSON(apiExpert.socialProof, {
                linkedIn: undefined,
                website: undefined,
                publications: []
              }),
              pricingTiers: safeParseJSON(apiExpert.pricingTiers, [
                { duration: 30, price: Math.round(safeParseInt(apiExpert.hourlyRate, 50000) * 0.5), description: '기본 상담' },
                { duration: 60, price: safeParseInt(apiExpert.hourlyRate, 50000), description: '상세 상담' },
                { duration: 90, price: Math.round(safeParseInt(apiExpert.hourlyRate, 50000) * 1.5), description: '종합 상담' }
              ]),
              reschedulePolicy: apiExpert.reschedulePolicy || '12시간 전 일정 변경 가능'
            };
          });
          
          setAllExperts(convertedExperts);
        } else {
          console.error('전문가 프로필 로드 실패');
          setAllExperts([]);
        }

        // 카테고리 처리
        if (categoriesResult.status === 'fulfilled' && categoriesResult.value.success && Array.isArray(categoriesResult.value.data)) {
          const transformedCategories = categoriesResult.value.data.map((cat: any) => ({
            id: cat.id?.toString() || '',
            name: cat.name || '이름 없음',
            icon: cat.icon || 'Target',
            description: cat.description || '설명 없음'
          }));
          setCategories(transformedCategories);
          setIsLoadingCategories(false);
        } else {
          console.error('카테고리 로드 실패');
          // API 실패 시 기본 카테고리로 fallback
          setCategories([
            { id: "1", name: "프로그래밍/개발", icon: "Code", description: "IT 개발, 프로그래밍 언어, 소프트웨어 아키텍처 등" },
            { id: "2", name: "디자인/크리에이티브", icon: "Palette", description: "UI/UX, 그래픽 디자인, 브랜딩, 영상 편집 등" },
            { id: "3", name: "비즈니스/창업", icon: "Briefcase", description: "사업 전략, 창업, 경영 컨설팅, 마케팅 등" },
            { id: "4", name: "재무/투자", icon: "DollarSign", description: "개인 재정 관리, 투자, 세무, 보험 등" },
            { id: "5", name: "심리/상담", icon: "Heart", description: "심리 상담, 스트레스 관리, 인간관계 등" }
          ]);
          setIsLoadingCategories(false);
        }

      } catch (error) {
        console.error('페이지 초기화 실패:', error);
        setPageError(error instanceof Error ? error.message : '페이지 로드 중 오류가 발생했습니다.');
        
        // 에러 발생 시 기본값들로 설정
        setAllExperts([]);
        setCategories([
          { id: "1", name: "프로그래밍/개발", icon: "Code", description: "IT 개발, 프로그래밍 언어, 소프트웨어 아키텍처 등" },
          { id: "2", name: "디자인/크리에이티브", icon: "Palette", description: "UI/UX, 그래픽 디자인, 브랜딩, 영상 편집 등" },
          { id: "3", name: "비즈니스/창업", icon: "Briefcase", description: "사업 전략, 창업, 경영 컨설팅, 마케팅 등" },
          { id: "4", name: "재무/투자", icon: "DollarSign", description: "개인 재정 관리, 투자, 세무, 보험 등" },
          { id: "5", name: "심리/상담", icon: "Heart", description: "심리 상담, 스트레스 관리, 인간관계 등" }
        ]);
        setIsLoadingCategories(false);
      } finally {
        setIsPageLoading(false);
      }
    };

    initializePageData();
  }, []);


  // 상담 카테고리 옵션 (API에서 동적 로드)
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

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
    console.log('=== 전문가 필터링 시작 ===');
    console.log('검색 조건:', { category, date, duration, ageGroup });
    console.log('전체 전문가 수:', experts.length);
    console.log('사용 가능한 카테고리:', categories);
    
    const selectedCategory = categories.find(c => c.id === category);
    console.log('선택된 카테고리:', selectedCategory);
    
    if (!selectedCategory) {
      console.warn('선택된 카테고리를 찾을 수 없습니다:', category, '- 모든 전문가를 반환합니다.');
      return experts; // 카테고리가 없으면 모든 전문가 반환
    }
    
    const filteredResults = experts.filter(expert => {
      console.log(`\n--- 전문가 ${expert.name} (ID: ${expert.id}) 분석 ---`);
      console.log('전문가 정보:', {
        specialty: expert.specialty,
        specialtyAreas: expert.specialtyAreas,
        specialties: expert.specialties,
        tags: expert.tags,
        targetAudience: expert.targetAudience
      });
      
      // 1. 카테고리 필터링 - 더 유연한 매칭
      const categoryMatch = (
        expert.specialty === selectedCategory.name ||
        (expert.specialtyAreas && Array.isArray(expert.specialtyAreas) && 
         expert.specialtyAreas.some((area: string) => area === selectedCategory.name)) ||
        (expert.specialties && Array.isArray(expert.specialties) && 
         expert.specialties.some((specialty: string) => specialty === selectedCategory.name)) ||
        (expert.tags && Array.isArray(expert.tags) && 
         expert.tags.some((tag: string) => tag === selectedCategory.name))
      );
      
      console.log('카테고리 매칭 결과:', {
        expertSpecialty: expert.specialty,
        selectedCategoryName: selectedCategory.name,
        categoryMatch,
        matchDetails: {
          exactMatch: expert.specialty === selectedCategory.name,
          specialtyAreasMatch: expert.specialtyAreas?.some((area: string) => area === selectedCategory.name),
          specialtiesMatch: expert.specialties?.some((specialty: string) => specialty === selectedCategory.name),
          tagsMatch: expert.tags?.some((tag: string) => tag === selectedCategory.name)
        }
      });
      
      // 2. 연령대 필터링 (targetAudience 기준) - 더 유연하게
      const ageGroupName = ageGroups.find(a => a.id === ageGroup)?.name;
      let ageMatch = true;
      
      if (ageGroupName && expert.targetAudience && Array.isArray(expert.targetAudience)) {
        const targetAudience = expert.targetAudience.map((target: string) => target.toLowerCase());
        
        if (ageGroup === "teen") {
          ageMatch = targetAudience.some((target: string) => 
            target.includes("청소년") || target.includes("중학생") || target.includes("고등학생") || target.includes("10대")
          );
        } else if (ageGroup === "student") {
          ageMatch = targetAudience.some((target: string) => 
            target.includes("대학생") || target.includes("취준생") || target.includes("학생") || target.includes("20대")
          );
        } else if (ageGroup === "adult") {
          ageMatch = targetAudience.some((target: string) => 
            target.includes("성인") || target.includes("직장인") || target.includes("자영업자") || 
            target.includes("30대") || target.includes("40대") || target.includes("50대")
          );
        } else if (ageGroup === "senior") {
          ageMatch = targetAudience.some((target: string) => 
            target.includes("시니어") || target.includes("은퇴") || target.includes("60대") || target.includes("70대")
          );
        }
      }
      
      console.log('연령대 매칭 결과:', {
        targetAudience: expert.targetAudience,
        ageGroupName,
        ageMatch
      });
      
      // 3. 날짜 필터링 (현재는 모든 전문가가 가능하다고 가정)
      const dateMatch = true;
      
      // 4. 상담시간 필터링 - 더 유연하게
      let durationMatch = true;
      if (duration && duration !== "decide_after_matching") {
        const requestedDuration = parseInt(duration);
        if (expert.pricingTiers && Array.isArray(expert.pricingTiers)) {
          durationMatch = expert.pricingTiers.some((tier: any) => tier.duration === requestedDuration);
        } else {
          // pricingTiers가 없는 경우 일반적인 상담 시간을 지원한다고 가정
          durationMatch = [30, 60, 90].includes(requestedDuration);
        }
      }
      
      const finalMatch = categoryMatch && ageMatch && dateMatch && durationMatch;
      console.log('최종 매칭 결과:', {
        categoryMatch,
        ageMatch,
        dateMatch,
        durationMatch,
        finalMatch
      });
      
      return finalMatch;
    });
    
    console.log('필터링 완료: 총', filteredResults.length, '명의 전문가가 매칭되었습니다.');
    return filteredResults;
  };

  // 전문가 검색 실행 (API 기반으로 최적화된 검색 로직)
  const handleSearch = async () => {
    // 필수 검색 조건 검증 - 모든 필드가 선택되어야 함
    if (!searchCategory || !searchStartDate || !searchEndDate || !searchAgeGroup) {
      console.warn("검색 조건이 부족합니다. 모든 필드를 선택해 주세요.");
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    
    try {
      // API를 통한 서버 사이드 전문가 검색 (성능 최적화)
      const searchParams = new URLSearchParams({
        category: searchCategory,
        startDate: searchStartDate,
        endDate: searchEndDate,
        ageGroup: searchAgeGroup,
        limit: '20' // 최대 20명까지 검색하여 성능 최적화
      });

      const response = await fetch(`/api/expert-profiles/search?${searchParams}`);
      const result = await response.json();

      if (result.success && result.data) {
        const { exactMatches, relatedExperts, totalCount } = result.data;
        
        // 정확히 조건에 매칭되는 전문가 수 저장 (사용자 피드백용)
        setExactMatchCount(exactMatches?.length || 0);
        
        // 검색 결과 조합: 정확한 매칭 우선, 관련 전문가 후순위
        const allResults = [
          ...(exactMatches || []),
          ...(relatedExperts || [])
        ].slice(0, 12); // UI 성능을 위해 최대 12명까지만 표시

        setSearchResults(allResults);
      } else {
        // API 검색 실패 시 클라이언트 사이드 필터링으로 폴백 처리
        console.warn('API 검색 실패, 클라이언트 필터링으로 대체');
        const filteredExperts = filterExperts(
          allExperts, 
          searchCategory, 
          searchStartDate, 
          searchEndDate, 
          searchAgeGroup
        );
        
        setExactMatchCount(filteredExperts.length);
        
        // 검색 결과가 부족할 경우 관련 전문가도 추가 표시
        let finalResults = [...filteredExperts];
        if (filteredExperts.length < 3) {
          const additionalExperts = allExperts
            .filter((expert: any) => !filteredExperts.some((filtered: any) => filtered.id === expert.id))
            .slice(0, 5 - filteredExperts.length);
          finalResults = [...filteredExperts, ...additionalExperts];
        }
        
        setSearchResults(finalResults);
      }
    } catch (error) {
      console.error('검색 중 오류 발생:', error);
      
      // 네트워크 오류 등 예외 상황 시 클라이언트 필터링으로 대체
      const filteredExperts = filterExperts(
        allExperts, 
        searchCategory, 
        searchStartDate, 
        searchEndDate, 
        searchAgeGroup
      );
      
      setExactMatchCount(filteredExperts.length);
      setSearchResults(filteredExperts);
    } finally {
      // 검색 로딩 상태 해제
      setIsSearching(false);
    }
  };




  // 페이지 로딩 상태 처리
  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-white">
        {/* 로딩 스켈레톤 UI */}
        <section className="relative z-10 overflow-visible py-28 sm:py-40 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-pulse">
              {/* 제목 스켈레톤 */}
              <div className="h-8 bg-gray-200 rounded-md w-3/4 mx-auto mb-6"></div>
              <div className="h-16 bg-gray-200 rounded-md w-1/2 mx-auto mb-6"></div>
              <div className="h-6 bg-gray-200 rounded-md w-2/3 mx-auto mb-12"></div>
              
              {/* 검색 필드 스켈레톤 */}
              <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto mb-16">
                <div className="h-14 bg-gray-200 rounded-2xl flex-1"></div>
                <div className="h-14 bg-gray-200 rounded-2xl flex-1"></div>
                <div className="h-14 bg-gray-200 rounded-2xl flex-1"></div>
                <div className="h-14 bg-gray-200 rounded-2xl flex-1"></div>
                <div className="h-14 w-14 bg-gray-200 rounded-2xl"></div>
              </div>
              
              {/* AI 채팅 버튼 스켈레톤 */}
              <div className="h-12 bg-gray-200 rounded-lg w-48 mx-auto"></div>
            </div>
          </div>
        </section>
        
        {/* 통계 섹션 스켈레톤 */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 animate-pulse">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="text-center">
                  <div className="h-12 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* 카테고리 섹션 스켈레톤 */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 animate-pulse">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white rounded-xl p-4 min-h-[160px]">
                  <div className="h-10 w-10 bg-gray-200 rounded-full mx-auto mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  // 에러 상태 처리
  if (pageError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              페이지 로드 실패
            </h2>
            <p className="text-gray-600 mb-6">
              {pageError}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

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
        isLoading={isLoadingCategories}
      />

      {/* 사용자 리뷰 섹션 */}
      <UserReviewsSection />

      {/* AI 채팅상담 섹션 */}
      <AIChatPromoSection />

      {/* 푸터 */}
      <Footer />
    </div>
  );
}
