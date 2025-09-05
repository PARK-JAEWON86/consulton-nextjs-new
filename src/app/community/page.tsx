"use client";

import { useState, useEffect, useMemo } from "react";
import CategorySidebar from "@/components/community/CategorySidebar";
import PostCard from "@/components/community/PostCard";
import SearchAndFilter from "@/components/community/SearchAndFilter";
import CreatePostModal from "@/components/community/CreatePostModal";
// import { communityPosts, CommunityPost, getPostsByType, getPostsByCategory, sortPosts, getCategoriesWithCount, dummyReviews } from "@/data/dummy/reviews"; // 더미 데이터 제거
import { HelpCircle, Star, Award, Bot, MessageSquare, Grid3X3, ChevronLeft, ChevronRight, Menu, X, Plus } from "lucide-react";

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "comments" | "views">("latest");
  const [postTypeFilter, setPostTypeFilter] = useState<"all" | "consultation_request" | "consultation_review" | "expert_intro" | "general">("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [communityStats, setCommunityStats] = useState({
    totalPosts: 0,
    activeUsers: 0,
    todayPosts: 0
  });
  const [popularTags, setPopularTags] = useState<string[]>([]);
  const [postCounts, setPostCounts] = useState<Record<string, number>>({
    all: 0,
    general: 0,
    consultation_request: 0,
    consultation_review: 0,
    expert_intro: 0
  });
  const postsPerPage = 10; // 페이지당 게시글 수

  // 인증 상태 확인
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 먼저 로컬 스토리지에서 확인
        const storedUser = localStorage.getItem('consulton-user');
        const storedAuth = localStorage.getItem('consulton-auth');
        
        if (storedUser && storedAuth) {
          try {
            const userData = JSON.parse(storedUser);
            const isAuth = JSON.parse(storedAuth);
            
            if (isAuth) {
              setIsAuthenticated(true);
              setUser(userData);
              return;
            }
          } catch (error) {
            console.error('로컬 스토리지 파싱 오류:', error);
          }
        }
        
        // API에서 앱 상태 로드 (백업)
        const response = await fetch('/api/app-state');
        const result = await response.json();
        if (result.success) {
          setIsAuthenticated(result.data.isAuthenticated);
          setUser(result.data.user);
        }
      } catch (error) {
        console.error('인증 상태 확인 실패:', error);
      }
    };

    checkAuth();
  }, []);

  // URL 쿼리 파라미터에서 탭 설정 확인
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');
      
      if (tabParam === 'consultation_review') {
        setPostTypeFilter('consultation_review');
      }
    }
  }, []);

  // localStorage 변경 감지하여 인증 상태 업데이트
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const storedUser = localStorage.getItem('consulton-user');
        const storedAuth = localStorage.getItem('consulton-auth');
        
        if (storedUser && storedAuth) {
          const userData = JSON.parse(storedUser);
          const isAuth = JSON.parse(storedAuth);
          
          setIsAuthenticated(isAuth);
          setUser(isAuth ? userData : null);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('localStorage 변경 감지 시 파싱 오류:', error);
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    // storage 이벤트 리스너 (다른 탭에서의 변경 감지)
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      
      // 커스텀 이벤트 리스너 (같은 탭에서의 변경 감지)
      window.addEventListener('authStateChanged', handleStorageChange);
      
      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('authStateChanged', handleStorageChange);
      };
    }
  }, []);

  // 카테고리 데이터 로드
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const response = await fetch('/api/categories?activeOnly=true');
        const result = await response.json();
        
        if (result.success) {
          // API 응답을 커뮤니티 카테고리 형식에 맞게 변환
          const transformedCategories = result.data.map((cat: any) => ({
            id: cat.id,
            name: cat.name,
            count: cat.consultationCount || 0 // 실제 상담 수 사용
          }));
          setCategories(transformedCategories);
        } else {
          console.error('카테고리 로드 실패:', result.message);
        }
      } catch (error) {
        console.error('카테고리 로드 실패:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  // 커뮤니티 통계 및 인기 태그 로드
  useEffect(() => {
    const loadCommunityData = async () => {
      try {
        // 커뮤니티 통계 로드
        const statsResponse = await fetch('/api/community/stats');
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          if (statsData.success) {
            setCommunityStats({
              totalPosts: statsData.data.totalPosts,
              activeUsers: statsData.data.activeUsers,
              todayPosts: statsData.data.todayPosts
            });
          }
        }

        // 인기 태그 로드
        const tagsResponse = await fetch('/api/community/popular-tags?limit=8');
        if (tagsResponse.ok) {
          const tagsData = await tagsResponse.json();
          if (tagsData.success) {
            setPopularTags(tagsData.data);
          }
        }

        // 게시글 개수 로드
        const countsResponse = await fetch('/api/community/post-counts');
        if (countsResponse.ok) {
          const countsData = await countsResponse.json();
          if (countsData.success) {
            setPostCounts(countsData.data);
          }
        }
      } catch (error) {
        console.error('커뮤니티 데이터 로드 실패:', error);
        // 에러 시 기본값 설정
        setCommunityStats({
          totalPosts: 0,
          activeUsers: 0,
          todayPosts: 0
        });
        setPopularTags(["상담후기", "전문가추천", "진로고민", "투자조언"]);
      }
    };

    loadCommunityData();
  }, []);


  const handleTabChange = (categoryId: string) => {
    setActiveTab(categoryId);
    setCurrentPage(1); // 카테고리 변경 시 첫 페이지로 리셋
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleSortChange = (sort: "latest" | "popular" | "comments" | "views") => {
    setSortBy(sort);
  };

  const handleFilterClick = () => {
    // 필터 로직 구현
  };


  const handleTagClick = (tag: string) => {
    // 태그 클릭 로직 구현
  };

  const handlePostClick = (postId: string) => {
    // 게시글 상세 페이지로 이동
    window.location.href = `/community/posts/${postId}`;
  };

  const handleCreatePost = () => {
    if (!isAuthenticated) {
      // 로그인되지 않은 경우 로그인 페이지로 이동
      window.location.href = "/auth/login?redirect=/community";
      return;
    }
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleSubmitPost = async (postData: any) => {
    try {
      // 새 게시글 작성 API 호출
      const response = await fetch('/api/community/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: postData.title,
          content: postData.content,
          categoryId: parseInt(postData.category),
          postType: postData.postType,
          tags: postData.tags,
          isAnonymous: false
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // 게시글 작성 성공 시 목록 새로고침
          window.location.reload();
        } else {
          alert('게시글 작성에 실패했습니다: ' + result.message);
        }
      } else {
        alert('게시글 작성 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('게시글 작성 실패:', error);
      alert('게시글 작성 중 오류가 발생했습니다.');
    }
  };

  // 게시글 타입 필터 옵션
  const postTypeFilters = [
    { id: "all", name: "전체", icon: Grid3X3, color: "text-gray-600", bgColor: "bg-gray-100", hoverColor: "hover:bg-gray-200" },
    { id: "consultation_request", name: "상담요청", icon: HelpCircle, color: "text-orange-600", bgColor: "bg-orange-100", hoverColor: "hover:bg-orange-200" },
    { id: "consultation_review", name: "상담후기", icon: Star, color: "text-green-600", bgColor: "bg-green-100", hoverColor: "hover:bg-green-200" },
    { id: "expert_intro", name: "전문가소개", icon: Award, color: "text-blue-600", bgColor: "bg-blue-100", hoverColor: "hover:bg-blue-200" },
    { id: "general", name: "일반글", icon: MessageSquare, color: "text-gray-600", bgColor: "bg-gray-100", hoverColor: "hover:bg-gray-200" },
  ];

  // 모든 게시글 데이터 (실제 API 연동)
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  // 게시글 데이터 로드
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoadingPosts(true);
        
        // 커뮤니티 게시글 API 호출
        const params = new URLSearchParams({
          category: activeTab === 'all' ? '' : activeTab,
          postType: postTypeFilter === 'all' ? '' : postTypeFilter,
          sortBy: sortBy,
          page: currentPage.toString(),
          limit: postsPerPage.toString()
        });
        
        const response = await fetch(`/api/community/posts?${params}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setAllPosts(data.data || []);
            if (data.pagination) {
              setPagination(data.pagination);
            }
          } else {
            console.error('게시글 로드 실패:', data.message);
            setAllPosts([]);
          }
        } else {
          console.error('게시글 API 호출 실패:', response.status);
          setAllPosts([]);
        }
      } catch (error) {
        console.error('게시글 로드 실패:', error);
        setAllPosts([]);
      } finally {
        setIsLoadingPosts(false);
      }
    };

    loadPosts();
  }, [activeTab, postTypeFilter, sortBy, currentPage]);


  // API에서 이미 필터링 및 정렬된 게시글 사용
  const filteredPosts = allPosts;
  const currentPosts = allPosts; // API에서 이미 페이지네이션된 데이터를 받음

  // 각 필터별 게시글 개수 계산
  const getPostCount = (filterId: string) => {
    return postCounts[filterId] || 0;
  };

  // 페이지네이션 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 페이지 변경 시 맨 위로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pagination.totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // 필터 변경 시 첫 페이지로 리셋
  const handleFilterChange = (filterId: string) => {
    setPostTypeFilter(filterId as any);
    setCurrentPage(1);
  };

  // 사이드바 토글 핸들러
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">커뮤니티</h1>
            {/* 모바일 사이드바 토글 버튼 */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden flex items-center justify-center w-10 h-10 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
          <p className="text-gray-600">
            다른 사용자들과 경험을 공유하고 소통하세요.
            {postTypeFilter === "consultation_request" && (
              <span className="block mt-2 text-orange-600 font-medium">
                💼 상담요청 목록입니다. 상담 제안 버튼을 클릭하여 고객과 연결되세요.
              </span>
            )}

          </p>
        </div>

        {/* 로딩 상태 */}
        {isLoadingPosts ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">게시글을 불러오는 중...</p>
            </div>
          </div>
        ) : (
          <div className="relative flex gap-8">
            {/* 데스크톱 사이드바 */}
            <div className="hidden lg:block w-72 flex-shrink-0">
              <CategorySidebar
                categories={categories.length > 0 ? categories : []}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                popularTags={popularTags}
                onTagClick={handleTagClick}
                onCreatePost={handleCreatePost}
                isAuthenticated={isAuthenticated}
                user={user}
                communityStats={communityStats}
              />
          </div>

          {/* 모바일 사이드바 오버레이 */}
          {isSidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              {/* 배경 오버레이 */}
              <div 
                className="fixed inset-0 bg-black bg-opacity-50"
                onClick={closeSidebar}
              ></div>
              
              {/* 사이드바 컨테이너 */}
              <div className="relative w-80 max-w-sm bg-gray-50 shadow-xl overflow-y-auto">
                {/* 사이드바 헤더 */}
                <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">프로필 & 카테고리</h2>
                  <button
                    onClick={closeSidebar}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                {/* 사이드바 내용 */}
                <div className="p-4">
                  <CategorySidebar
                    categories={categories.length > 0 ? categories : []}
                    activeTab={activeTab}
                    onTabChange={(categoryId) => {
                      handleTabChange(categoryId);
                      closeSidebar(); // 카테고리 선택 후 사이드바 닫기
                    }}
                    popularTags={popularTags}
                    onTagClick={(tag) => {
                      handleTagClick(tag);
                      closeSidebar(); // 태그 클릭 후 사이드바 닫기
                    }}
                    onCreatePost={() => {
                      handleCreatePost();
                      closeSidebar(); // 새 글 작성 후 사이드바 닫기
                    }}
                    isAuthenticated={isAuthenticated}
                    user={user}
                    communityStats={communityStats}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 min-w-0 w-full lg:w-auto">
            {/* 게시글 타입 필터 버튼 및 페이징 */}
            <div className="mb-6">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-4">
                {/* 왼쪽: 필터 버튼들 */}
                <div className="flex flex-wrap gap-2">
                  {postTypeFilters.map((filter) => {
                    const Icon = filter.icon;
                    const isActive = postTypeFilter === filter.id;
                    const postCount = getPostCount(filter.id);
                    
                    return (
                      <button
                        key={filter.id}
                        onClick={() => handleFilterChange(filter.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? `${filter.bgColor} ${filter.color} border-2 border-current`
                            : `bg-white text-gray-600 border border-gray-200 ${filter.hoverColor}`
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{filter.name}</span>
                        <span className="sm:hidden">{filter.name.slice(0, 2)}</span>
                        <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                          isActive ? "bg-white bg-opacity-50" : "bg-gray-100"
                        }`}>
                          {postCount}
                        </span>
                      </button>
                    );
                  })}
                  

                </div>

                {/* 오른쪽: 페이징 버튼 */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center lg:justify-end">
                    <div className="flex items-center gap-1 bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200">
                      <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className={`flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium transition-colors ${
                          currentPage === 1
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                        }`}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">이전</span>
                      </button>
                      
                      <span className="text-sm text-gray-500 px-2 min-w-[60px] text-center">
                        {currentPage} / {pagination.totalPages}
                      </span>
                      
                      <button
                        onClick={handleNextPage}
                        disabled={currentPage === pagination.totalPages}
                        className={`flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium transition-colors ${
                          currentPage === pagination.totalPages
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                        }`}
                      >
                        <span className="hidden sm:inline">다음</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <SearchAndFilter
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                sortBy={sortBy}
                onSortChange={handleSortChange}
                onFilterClick={handleFilterClick}
              />
            </div>

            <div className="space-y-3">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-gray-400 mb-6">
                    <MessageSquare className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {allPosts.length === 0 ? '아직 게시글이 없습니다' : '선택한 조건의 게시글이 없습니다'}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {allPosts.length === 0 
                      ? '첫 번째 게시글을 작성해보세요!' 
                      : '다른 필터를 선택하거나 첫 번째 게시글을 작성해보세요.'
                    }
                  </p>
                  {isAuthenticated && (
                    <button
                      onClick={handleCreatePost}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      게시글 작성하기
                    </button>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  {/* 테이블 헤더 */}
                  <div className="bg-gray-50 border-b border-gray-200">
                    <div className="grid grid-cols-12 gap-3 px-4 py-3 text-sm font-medium text-gray-700">
                      <div className="col-span-1 text-center">번호</div>
                      <div className="col-span-5">제목</div>
                      <div className="col-span-1 text-center">분야</div>
                      <div className="col-span-1 text-center">게시자</div>
                      <div className="col-span-1 text-center">날짜</div>
                      <div className="col-span-2 text-center">좋아요-댓글</div>
                      <div className="col-span-1 text-center">조회수</div>
                    </div>
                  </div>
                  
                  {/* 테이블 바디 */}
                  <div className="divide-y divide-gray-200">
                    {currentPosts.map((post, index) => {
                      // 전체 게시글 수에서 현재 페이지의 시작 번호 계산
                      // 최신 게시글이 더 큰 번호를 가지도록 (전체 게시글 수 - 현재 인덱스)
                      const totalPosts = communityStats.totalPosts;
                      const startIndex = (currentPage - 1) * postsPerPage;
                      const postNumber = totalPosts - (startIndex + index);
                      
                      return (
                        <PostCard
                          key={post.id}
                          post={post}
                          index={postNumber}
                          onPostClick={handlePostClick}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 하단 페이지네이션 - 페이지 번호 포함 */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 space-x-1">
                {/* 이전 버튼 */}
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed bg-gray-100"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50 bg-white border border-gray-200"
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {/* 페이지 번호들 */}
                {(() => {
                  const pages = [];
                  const showPages = 5; // 보여줄 페이지 수
                  let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
                  let endPage = Math.min(pagination.totalPages, startPage + showPages - 1);
                  
                  // 끝 페이지가 조정되면 시작 페이지도 다시 조정
                  if (endPage - startPage + 1 < showPages) {
                    startPage = Math.max(1, endPage - showPages + 1);
                  }

                  // 첫 페이지 (1이 범위에 없을 때)
                  if (startPage > 1) {
                    pages.push(
                      <button
                        key={1}
                        onClick={() => handlePageChange(1)}
                        className="px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-600 hover:text-blue-600 hover:bg-blue-50 bg-white border border-gray-200"
                      >
                        1
                      </button>
                    );
                    if (startPage > 2) {
                      pages.push(
                        <span key="start-ellipsis" className="px-2 py-2 text-gray-400">
                          ...
                        </span>
                      );
                    }
                  }

                  // 중간 페이지들
                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          i === currentPage
                            ? "bg-blue-600 text-white"
                            : "text-gray-600 hover:text-blue-600 hover:bg-blue-50 bg-white border border-gray-200"
                        }`}
                      >
                        {i}
                      </button>
                    );
                  }

                  // 마지막 페이지 (totalPages가 범위에 없을 때)
                  if (endPage < pagination.totalPages) {
                    if (endPage < pagination.totalPages - 1) {
                      pages.push(
                        <span key="end-ellipsis" className="px-2 py-2 text-gray-400">
                          ...
                        </span>
                      );
                    }
                    pages.push(
                      <button
                        key={pagination.totalPages}
                        onClick={() => handlePageChange(pagination.totalPages)}
                        className="px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-600 hover:text-blue-600 hover:bg-blue-50 bg-white border border-gray-200"
                      >
                        {pagination.totalPages}
                      </button>
                    );
                  }

                  return pages;
                })()}

                {/* 다음 버튼 */}
                <button
                  onClick={handleNextPage}
                                          disabled={currentPage === pagination.totalPages}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === pagination.totalPages
                      ? "text-gray-400 cursor-not-allowed bg-gray-100"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50 bg-white border border-gray-200"
                  }`}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
        )}

        {/* 새 글 작성 모달 */}
        <CreatePostModal
          isOpen={isCreateModalOpen}
          onClose={handleCloseCreateModal}
          onSubmit={handleSubmitPost}
        />


      </div>
    </div>
  );
}
