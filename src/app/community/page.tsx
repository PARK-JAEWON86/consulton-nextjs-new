"use client";

import { useState, useEffect } from "react";
import CategorySidebar from "@/components/community/CategorySidebar";
import PostCard from "@/components/community/PostCard";
import SearchAndFilter from "@/components/community/SearchAndFilter";
import CreatePostModal from "@/components/community/CreatePostModal";
import { communityPosts, CommunityPost, getPostsByType, getPostsByCategory, sortPosts, getCategoriesWithCount } from "@/data/dummy";
import { HelpCircle, Star, Award, Bot, MessageSquare, Grid3X3, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";

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
  const postsPerPage = 5; // 페이지당 게시글 수

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
          const transformedCategories = result.data.map((cat: any, index: number) => ({
            id: cat.id,
            name: cat.name,
            count: Math.floor(Math.random() * 50) + 10 // 임시 카운트 (실제로는 API에서 제공)
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

  const handleLike = (postId: string) => {
    // 좋아요 로직 구현
  };

  const handleComment = (postId: string) => {
    // 댓글 로직 구현
  };

  const handleTagClick = (tag: string) => {
    // 태그 클릭 로직 구현
  };

  const handlePostClick = (postId: string) => {
    // 게시글 상세 페이지로 이동
    console.log("게시글 클릭:", postId);
    // 실제로는 Next.js router를 사용하여 페이지 이동
    // router.push(`/community/posts/${postId}`);
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

  const handleSubmitPost = (postData: any) => {
    // 새 게시글 데이터 처리 로직
    console.log("새 게시글 데이터:", postData);
    // 실제로는 API 호출을 통해 서버에 저장
    // 임시로 콘솔에만 출력
  };

  // 게시글 타입 필터 옵션
  const postTypeFilters = [
    { id: "all", name: "전체", icon: Grid3X3, color: "text-gray-600", bgColor: "bg-gray-100", hoverColor: "hover:bg-gray-200" },
    { id: "consultation_request", name: "상담요청", icon: HelpCircle, color: "text-orange-600", bgColor: "bg-orange-100", hoverColor: "hover:bg-orange-200" },
    { id: "consultation_review", name: "상담후기", icon: Star, color: "text-green-600", bgColor: "bg-green-100", hoverColor: "hover:bg-green-200" },
    { id: "expert_intro", name: "전문가소개", icon: Award, color: "text-blue-600", bgColor: "bg-blue-100", hoverColor: "hover:bg-blue-200" },
    { id: "general", name: "일반글", icon: MessageSquare, color: "text-gray-600", bgColor: "bg-gray-100", hoverColor: "hover:bg-gray-200" },
  ];

  // 모든 게시글 데이터 (더미 데이터에서 가져옴)
  const allPosts = communityPosts;

  // 필터링 및 정렬된 게시글
  // 1단계: 카테고리별 필터링
  const categoryFilteredPosts = getPostsByCategory(activeTab);
  // 2단계: 게시글 타입별 필터링
  const typeFilteredPosts = postTypeFilter === "all" 
    ? categoryFilteredPosts 
    : categoryFilteredPosts.filter(post => post.postType === postTypeFilter);
  // 3단계: 정렬
  const filteredPosts = sortPosts(typeFilteredPosts, sortBy);

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  // 각 필터별 게시글 개수 계산 (현재 카테고리 고려)
  const getPostCount = (filterId: string) => {
    const categoryPosts = getPostsByCategory(activeTab);
    if (filterId === "all") return categoryPosts.length;
    return categoryPosts.filter(post => post.postType === filterId).length;
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
    if (currentPage < totalPages) {
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

        <div className="relative flex gap-8">
          {/* 데스크톱 사이드바 */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <CategorySidebar
              categories={categories.length > 0 ? categories : getCategoriesWithCount()}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              popularTags={["상담후기", "전문가추천", "진로고민", "투자조언"]}
              onTagClick={handleTagClick}
              onCreatePost={handleCreatePost}
              isAuthenticated={isAuthenticated}
              user={user}
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
                    categories={categories.length > 0 ? categories : getCategoriesWithCount()}
                    activeTab={activeTab}
                    onTabChange={(categoryId) => {
                      handleTabChange(categoryId);
                      closeSidebar(); // 카테고리 선택 후 사이드바 닫기
                    }}
                    popularTags={["상담후기", "전문가추천", "진로고민", "투자조언"]}
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
                {totalPages > 1 && (
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
                        {currentPage} / {totalPages}
                      </span>
                      
                      <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className={`flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium transition-colors ${
                          currentPage === totalPages
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

            <div className="space-y-4">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <MessageSquare className="h-12 w-12 mx-auto" />
                  </div>
                  <p className="text-gray-500">선택한 타입의 게시글이 없습니다.</p>
                </div>
              ) : (
                currentPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    onComment={handleComment}
                    onPostClick={handlePostClick}
                  />
                ))
              )}
            </div>

            {/* 하단 페이지네이션 - 페이지 번호 포함 */}
            {totalPages > 1 && (
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
                  let endPage = Math.min(totalPages, startPage + showPages - 1);
                  
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
                  if (endPage < totalPages) {
                    if (endPage < totalPages - 1) {
                      pages.push(
                        <span key="end-ellipsis" className="px-2 py-2 text-gray-400">
                          ...
                        </span>
                      );
                    }
                    pages.push(
                      <button
                        key={totalPages}
                        onClick={() => handlePageChange(totalPages)}
                        className="px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-600 hover:text-blue-600 hover:bg-blue-50 bg-white border border-gray-200"
                      >
                        {totalPages}
                      </button>
                    );
                  }

                  return pages;
                })()}

                {/* 다음 버튼 */}
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === totalPages
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
