"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Crown, 
  Star, 
  Users, 
  Award, 
  TrendingUp,
  Filter,
  Search,
  ArrowLeft
} from "lucide-react";
// import { dummyExpertStats, updateAllRankingScores } from '@/data/dummy/expert-stats'; // 더미 데이터 제거

interface RankingItem {
  expertId: string;
  expertName?: string;
  rankingScore?: number;
  totalSessions: number;
  avgRating: number;
  reviewCount: number;
  likeCount: number;
  specialty?: string;
  specialtyRanking?: number;
  specialtyTotalExperts?: number;
  // 새로운 필드들 추가
  level?: number;
  tierInfo?: any;
  ranking?: number;
}

interface ExpertProfile {
  id: string;
  fullName: string;
  specialty: string;
  rating?: number;
  totalSessions?: number;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
  order: number;
}

export default function ExpertRankingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'overall' | 'specialty' | 'tier'>('overall');
  const [rankingList, setRankingList] = useState<RankingItem[]>([]);
  const [allExpertProfiles, setAllExpertProfiles] = useState<ExpertProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'ranking' | 'score' | 'level' | 'sessions' | 'rating' | 'reviews' | 'likes'>('ranking');
  const [showAllCategories, setShowAllCategories] = useState<boolean>(false);

  // 전문 분야 목록 (API에서 로드)
  const [categories, setCategories] = useState<Category[]>([]);

  // 레벨 티어 목록 (긍정적이고 동기부여가 되는 티어 이름)
  const tierOptions = [
    { id: 'all', name: '전체', range: '모든 레벨' },
    { id: 'freshmind', name: 'Fresh Mind (신예)', range: 'Lv.1-99' },
    { id: 'emergingtalent', name: 'Emerging Talent (신진)', range: 'Lv.100-199' },
    { id: 'risingstar', name: 'Rising Star (신성)', range: 'Lv.200-299' },
    { id: 'core', name: 'Core (핵심)', range: 'Lv.300-399' },
    { id: 'skilled', name: 'Skilled (숙련)', range: 'Lv.400-499' },
    { id: 'professional', name: 'Professional (프로페셔널)', range: 'Lv.500-599' },
    { id: 'senior', name: 'Senior (시니어)', range: 'Lv.600-699' },
    { id: 'expert', name: 'Expert (전문가)', range: 'Lv.700-799' },
    { id: 'master', name: 'Master (마스터)', range: 'Lv.800-899' },
    { id: 'grandmaster', name: 'Grand Master (그랜드마스터)', range: 'Lv.900-998' },
    { id: 'legend', name: 'Legend (전설)', range: 'Lv.999' }
  ];

  // 카테고리 목록 로드
  const loadCategories = async () => {
    try {
      setIsCategoriesLoading(true);
      const response = await fetch('/api/categories');
      const result = await response.json();
      if (result.success) {
        const categoriesData = result.data || [];
        setCategories(categoriesData);
      } else {
        // 기본 카테고리 제공
        const defaultCategories = [
          { id: 'psychology', name: '심리상담', description: '스트레스, 우울, 불안', icon: 'Brain', isActive: true, order: 1 },
          { id: 'legal', name: '법률상담', description: '계약, 분쟁, 상속', icon: 'Scale', isActive: true, order: 2 },
          { id: 'business', name: '사업상담', description: '창업, 경영, 마케팅', icon: 'Briefcase', isActive: true, order: 3 },
          { id: 'health', name: '건강상담', description: '영양, 운동, 건강관리', icon: 'Heart', isActive: true, order: 4 },
          { id: 'education', name: '교육상담', description: '학습법, 입시, 유학', icon: 'BookOpen', isActive: true, order: 5 }
        ];
        setCategories(defaultCategories);
      }
    } catch (error) {
      // 기본 카테고리 제공
      const defaultCategories = [
        { id: 'psychology', name: '심리상담', description: '스트레스, 우울, 불안', icon: 'Brain', isActive: true, order: 1 },
        { id: 'legal', name: '법률상담', description: '계약, 분쟁, 상속', icon: 'Scale', isActive: true, order: 2 },
        { id: 'business', name: '사업상담', description: '창업, 경영, 마케팅', icon: 'Briefcase', isActive: true, order: 3 },
        { id: 'health', name: '건강상담', description: '영양, 운동, 건강관리', icon: 'Heart', isActive: true, order: 4 },
        { id: 'education', name: '교육상담', description: '학습법, 입시, 유학', icon: 'BookOpen', isActive: true, order: 5 }
      ];
      setCategories(defaultCategories);
    } finally {
      setIsCategoriesLoading(false);
    }
  };

  // 전문가 프로필 목록 로드
  const loadExpertProfiles = async () => {
    try {
      const response = await fetch('/api/expert-profiles');
      const result = await response.json();
      if (result.success) {
        setAllExpertProfiles(result.data.profiles || []);
      }
    } catch (error) {
      // 에러 발생 시 조용히 처리
    }
  };

  // 랭킹 목록 로드 (더미데이터 + API 계산 데이터 사용)
  const loadRankingList = async (type: 'overall' | 'specialty' | 'tier', specialty?: string, tier?: string) => {
    setIsLoading(true);
    try {
      // 더미데이터에서 랭킹 점수 계산
      const updatedStats = updateAllRankingScores();
      
      // API에서 추가 정보 가져오기
      let url = `/api/expert-stats?rankingType=${type}`;
      if (type === 'specialty' && specialty) {
        url += `&specialty=${encodeURIComponent(specialty)}`;
      }
      
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.success) {
        const apiRankings = result.data.rankings || [];
        
        // 더미데이터와 API 데이터를 병합
        const mergedRankings = updatedStats.map((stats, index) => {
          const apiData = apiRankings.find((api: any) => api.expertId === stats.expertId);
          const expertProfile = allExpertProfiles.find(exp => exp.id.toString() === stats.expertId);
          
          // API에서 계산된 레벨과 티어 정보를 우선 사용
          const finalLevel = apiData?.level || 1;
          const finalTierInfo = apiData?.tierInfo || null;
          
          return {
            expertId: stats.expertId,
            expertName: expertProfile?.fullName || `전문가 ${stats.expertId}`,
            rankingScore: stats.rankingScore || 0,
            totalSessions: stats.totalSessions,
            avgRating: stats.avgRating,
            reviewCount: stats.reviewCount,
            likeCount: stats.likeCount,
            specialty: stats.specialty,
            // API에서 계산된 레벨 우선 사용
            level: finalLevel,
            ranking: apiData?.ranking || index + 1,
            tierInfo: finalTierInfo,
            specialtyRanking: apiData?.specialtyRanking || 0,
            specialtyTotalExperts: apiData?.specialtyTotalExperts || 0
          };
        });
        
        // 레벨 티어별 필터링 (tier 타입일 때)
        let filteredRankings = mergedRankings;
        if (type === 'tier' && tier && tier !== 'all') {
          const selectedTierOption = tierOptions.find(t => t.id === tier);
          
          if (selectedTierOption) {
            const [minLevel, maxLevel] = selectedTierOption.range.replace('Lv.', '').split('-').map(Number);
            
            filteredRankings = mergedRankings.filter(ranking => {
              const level = ranking.level || 0;
              const isInRange = maxLevel ? (level >= minLevel && level <= maxLevel) : (level === minLevel);
              
              return isInRange;
            });
          }
        }
        
        // 랭킹 점수로 정렬
        const sortedRankings = filteredRankings.sort((a, b) => (b.rankingScore || 0) - (a.rankingScore || 0));
        
        // 순위 재계산
        const finalRankings = sortedRankings.map((ranking, index) => ({
          ...ranking,
          ranking: index + 1
        }));
        
        setRankingList(finalRankings);
      } else {
        // API 실패 시 더미데이터만 사용
        const fallbackRankings = updatedStats.map((stats, index) => {
          const expertProfile = allExpertProfiles.find(exp => exp.id.toString() === stats.expertId);
          return {
            expertId: stats.expertId,
            expertName: expertProfile?.fullName || `전문가 ${stats.expertId}`,
            rankingScore: stats.rankingScore || 0,
            totalSessions: stats.totalSessions,
            avgRating: stats.avgRating,
            reviewCount: stats.reviewCount,
            likeCount: stats.likeCount,
            specialty: stats.specialty,
            ranking: index + 1,
            level: stats.level || 1, // 더미데이터 기본값
            tierInfo: null,
            specialtyRanking: 0,
            specialtyTotalExperts: 0
          };
        });
        
        const sortedFallback = fallbackRankings.sort((a, b) => (b.rankingScore || 0) - (a.rankingScore || 0));
        const finalFallback = sortedFallback.map((ranking, index) => ({
          ...ranking,
          ranking: index + 1
        }));
        
        setRankingList(finalFallback);
      }
    } catch (error) {
      // 에러 시에도 더미데이터 사용
        const errorRankings = updateAllRankingScores().map((stats, index) => {
          const expertProfile = allExpertProfiles.find(exp => exp.id.toString() === stats.expertId);
        return {
          expertId: stats.expertId,
          expertName: expertProfile?.fullName || `전문가 ${stats.expertId}`,
          rankingScore: stats.rankingScore || 0,
          totalSessions: stats.totalSessions,
          avgRating: stats.avgRating,
          reviewCount: stats.reviewCount,
          likeCount: stats.likeCount,
          specialty: stats.specialty,
          ranking: index + 1,
                      level: stats.level || 1, // 더미데이터 기본값
          tierInfo: null,
          specialtyRanking: 0,
          specialtyTotalExperts: 0
        };
      });
      
      const sortedError = errorRankings.sort((a, b) => (b.rankingScore || 0) - (a.rankingScore || 0));
      const finalError = sortedError.map((ranking, index) => ({
        ...ranking,
        ranking: index + 1
      }));
      
              setRankingList(finalError);
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 카테고리, 전문가 프로필, 레벨 정보 로드
  useEffect(() => {
    loadCategories();
    loadExpertProfiles();
    loadExpertLevels();
    
    // 더미데이터 초기화 및 랭킹 로드
    if (allExpertProfiles.length > 0) {
      loadRankingList('overall');
    }
  }, [allExpertProfiles.length]);

  // 탭 변경 시 랭킹 목록 로드
  useEffect(() => {
    if (allExpertProfiles.length > 0) {
      if (activeTab === 'overall') {
        loadRankingList('overall');
      } else if (activeTab === 'specialty') {
        // 분야별 랭킹 탭을 선택했을 때 기본 카테고리 선택
        if (categories.length > 0 && !selectedSpecialty) {
          setSelectedSpecialty(categories[0].name);
        } else if (selectedSpecialty) {
          loadRankingList('specialty', selectedSpecialty);
        }
      } else if (activeTab === 'tier') {
        // 레벨 티어별 랭킹은 전체 랭킹을 로드하고 클라이언트에서 필터링
        loadRankingList('overall');
      }
    }
  }, [activeTab, selectedSpecialty, selectedTier, allExpertProfiles, categories]);

  // 선택된 전문분야가 변경될 때 랭킹 로드
  useEffect(() => {
    if (activeTab === 'specialty' && selectedSpecialty && allExpertProfiles.length > 0) {
      loadRankingList('specialty', selectedSpecialty);
    }
  }, [selectedSpecialty, activeTab, allExpertProfiles]);

  // 선택된 티어가 변경될 때 랭킹 로드
  useEffect(() => {
    if (activeTab === 'tier' && selectedTier && allExpertProfiles.length > 0) {
      // 티어 변경 시에는 이미 로드된 전체 랭킹을 사용하므로 추가 로드 불필요
    }
  }, [selectedTier, activeTab, allExpertProfiles]);

  // 전문가 레벨 계산 (기존 방식 - 호환성 유지)
  const calculateLevel = (sessions: number, rating: number) => {
    return Math.min(999, Math.max(1, Math.floor(sessions / 10) + Math.floor(rating * 10)));
  };

  // 레벨 API에서 전문가 레벨 정보 가져오기
  const [expertLevels, setExpertLevels] = useState<{[key: string]: any}>({});
  
  const loadExpertLevels = async () => {
    try {
      const response = await fetch('/api/expert-levels');
      const result = await response.json();
      if (result.success) {
        const levelsMap: {[key: string]: any} = {};
        result.data.levels.forEach((level: any) => {
          levelsMap[level.expertId] = level;
        });
        setExpertLevels(levelsMap);
      }
    } catch (error) {
      // 에러 발생 시 조용히 처리
    }
  };

  // 레벨 티어별 필터링
  const getTierRange = (tierId: string) => {
    switch (tierId) {
      case 'bronze': return { min: 1, max: 50 };
      case 'silver': return { min: 51, max: 100 };
      case 'gold': return { min: 101, max: 200 };
      case 'platinum': return { min: 201, max: 300 };
      case 'diamond': return { min: 301, max: 500 };
      case 'master': return { min: 501, max: 999 };
      default: return { min: 1, max: 999 };
    }
  };

  // 검색 및 필터링된 랭킹 목록
  const filteredRankings = rankingList.filter(item => {
    // 검색어 필터링
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const nameMatch = (item.expertName || '').toLowerCase().includes(query);
      const specialtyMatch = (item.specialty || '').toLowerCase().includes(query);
      if (!nameMatch && !specialtyMatch) return false;
    }

    // 레벨 티어 필터링
    if (activeTab === 'tier' && selectedTier !== 'all') {
      const level = expertLevels[item.expertId]?.currentLevel || calculateLevel(item.totalSessions, item.avgRating);
      const { min, max } = getTierRange(selectedTier);
      if (level < min || level > max) return false;
    }

    return true;
  });

  // 정렬된 랭킹 목록 (더미데이터 랭킹 점수 우선)
  const sortedRankings = [...filteredRankings].sort((a, b) => {
    switch (sortBy) {
      case 'ranking':
        return (a.ranking || 0) - (b.ranking || 0);
      case 'score':
        return (b.rankingScore || 0) - (a.rankingScore || 0);
      case 'level':
        return (b.level || 0) - (a.level || 0);
      case 'sessions':
        return b.totalSessions - a.totalSessions;
      case 'rating':
        return b.avgRating - a.avgRating;
      case 'reviews':
        return (b.reviewCount || 0) - (a.reviewCount || 0);
      case 'likes':
        return (b.likeCount || 0) - (a.likeCount || 0);
      default:
        return (a.ranking || 0) - (b.ranking || 0); // 기본값은 랭킹 순
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            이전으로
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 페이지 헤드라인 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center mb-4">
            <Crown className="h-8 w-8 text-yellow-500 mr-3" />
            전문가 랭킹
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            전문가들의 상담 실적, 고객 만족도, 리뷰 등을 종합적으로 평가한 랭킹입니다. 
            전체 랭킹과 분야별 랭킹을 확인하고, 검색과 정렬을 통해 원하는 전문가를 찾아보세요.
          </p>
        </div>
        
        {/* 랭킹 통계 */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <Crown className="h-8 w-8 text-yellow-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">총 전문가</p>
                  <p className="text-2xl font-bold text-gray-900">{rankingList.length}명</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">평균 점수</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {rankingList.length > 0 
                      ? (rankingList.reduce((sum, item) => sum + (item.rankingScore || 0), 0) / rankingList.length).toFixed(1)
                      : '0.0'
                    }점
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">총 상담</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {rankingList.reduce((sum, item) => sum + item.totalSessions, 0).toLocaleString()}회
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">평균 평점</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {rankingList.length > 0 
                      ? (rankingList.reduce((sum, item) => sum + item.avgRating, 0) / rankingList.length).toFixed(1)
                      : '0.0'
                    }
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <Award className="h-8 w-8 text-purple-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">총 리뷰</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {rankingList.reduce((sum, item) => sum + (item.reviewCount || 0), 0).toLocaleString()}개
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-pink-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">총 좋아요</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {rankingList.reduce((sum, item) => sum + (item.likeCount || 0), 0).toLocaleString()}개
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 랭킹 탭 및 필터 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          {/* 탭 */}
          <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => {
                setActiveTab('overall');
                setSelectedSpecialty('');
                setSelectedTier('all');
                setSearchQuery('');
                setSortBy('ranking');
                setShowAllCategories(false);
                loadRankingList('overall');
              }}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'overall'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              전체 랭킹
            </button>
            <button
              onClick={() => {
                setActiveTab('specialty');
                setSelectedSpecialty('');
                setSelectedTier('all');
                setSearchQuery('');
                setSortBy('ranking');
                setShowAllCategories(false);
                if (categories.length > 0) {
                  setSelectedSpecialty(categories[0].name);
                  loadRankingList('specialty', categories[0].name);
                }
              }}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'specialty'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              분야별 랭킹
            </button>
            <button
              onClick={() => {
                setActiveTab('tier');
                setSelectedSpecialty('');
                setSelectedTier('all');
                setSearchQuery('');
                setSortBy('ranking');
                setShowAllCategories(false);
                // 티어 탭 선택 시 전체 데이터 로드
                loadRankingList('tier', undefined, 'all');
              }}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'tier'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              레벨 티어별 랭킹
            </button>
          </div>

          {/* 분야 선택 (분야별 랭킹일 때만) */}
          {activeTab === 'specialty' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">전문 분야 선택</label>
              <div className="space-y-3">
                {/* 첫 줄: 주요 카테고리 (최대 5개) */}
                <div className="flex flex-wrap gap-2">
                  {isCategoriesLoading ? (
                    <div className="flex items-center text-gray-500">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      카테고리 로딩 중...
                    </div>
                  ) : categories.length === 0 ? (
                    <div className="text-gray-500 text-sm">
                      카테고리를 불러올 수 없습니다.
                    </div>
                  ) : (
                    <>
                      {categories.slice(0, 5).map((category) => (
                        <button
                          key={category.id}
                          onClick={() => {
                            setSelectedSpecialty(category.name);
                            loadRankingList('specialty', category.name);
                          }}
                          className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                            selectedSpecialty === category.name
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {category.name}
                        </button>
                      ))}
                      
                      {/* 더보기 버튼 (카테고리가 5개 이상일 때만) */}
                      {categories.length > 5 && (
                        <button
                          onClick={() => setShowAllCategories(!showAllCategories)}
                          className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          {showAllCategories ? '접기' : '더보기'}
                        </button>
                      )}
                    </>
                  )}
                </div>
                
                {/* 두 번째 줄: 나머지 카테고리 (더보기 클릭 시) */}
                {showAllCategories && categories.length > 5 && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
                    {categories.slice(5).map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          setSelectedSpecialty(category.name);
                          loadRankingList('specialty', category.name);
                        }}
                        className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                          selectedSpecialty === category.name
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 레벨 티어 선택 (레벨 티어별 랭킹일 때만) */}
          {activeTab === 'tier' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">레벨 티어 선택</label>
              <div className="flex flex-wrap gap-2">
                {tierOptions.map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => {
                      setSelectedTier(tier.id);
                      loadRankingList('tier', undefined, tier.id);
                    }}
                    className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                      selectedTier === tier.id
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-semibold">{tier.name}</div>
                      <div className="text-xs text-gray-500">{tier.range}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 검색 및 정렬 */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="전문가 이름 또는 분야로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ranking">랭킹 순</option>
                <option value="score">점수 순</option>
                <option value="level">레벨 순</option>
                <option value="sessions">상담 횟수 순</option>
                <option value="rating">평점 순</option>
                <option value="reviews">리뷰 순</option>
                <option value="likes">좋아요 순</option>
              </select>
            </div>
          </div>
        </div>

        {/* 랭킹 목록 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">랭킹 정보를 불러오는 중...</p>
            </div>
          ) : sortedRankings.length === 0 ? (
            <div className="p-8 text-center">
              <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">랭킹 정보가 없습니다.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      순위
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      레벨
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      전문가 이름
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      전문분야
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상담 횟수
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      평점
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      리뷰
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      좋아요
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      랭킹 점수
                    </th>

                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedRankings.map((item, index) => (
                    <tr key={item.expertId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mx-auto ${
                          index < 3 
                            ? 'bg-yellow-500 text-white' 
                            : index < 10
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-300 text-gray-700'
                        }`}>
                          {index + 1}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm font-bold text-blue-600">
                          {expertLevels[item.expertId] ? (
                            <div>
                              <div>Lv.{expertLevels[item.expertId].currentLevel}</div>
                              <div className="text-xs text-gray-500">
                                {expertLevels[item.expertId].levelProgress.percentage}%
                              </div>
                            </div>
                          ) : (
                            `Lv.${calculateLevel(item.totalSessions, item.avgRating)}`
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {(item.expertName || '전문가').charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {item.expertName || `전문가 ${item.expertId}`}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                        {item.specialty || '-'}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                        {item.totalSessions.toLocaleString()}회
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm text-gray-900">{item.avgRating}</span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                        <div className="flex items-center justify-center">
                          <span className="text-sm text-gray-900">{item.reviewCount?.toLocaleString() || 0}개</span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                        <div className="flex items-center justify-center">
                          <span className="text-sm text-gray-900">{item.likeCount?.toLocaleString() || 0}개</span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm font-bold text-blue-600">
                          {item.rankingScore?.toFixed(1)}점
                        </div>
                      </td>
                      

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 페이지 정보 */}
        {!isLoading && sortedRankings.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-500">
            총 {sortedRankings.length}명의 전문가 중 {
              activeTab === 'overall' ? '전체' : 
              activeTab === 'specialty' ? selectedSpecialty : 
              activeTab === 'tier' ? `${tierOptions.find(t => t.id === selectedTier)?.name} 티어` : ''
            } 랭킹
            {searchQuery && ` (검색어: "${searchQuery}")`}
          </div>
        )}
      </div>
    </div>
  );
}
