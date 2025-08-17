"use client";

import { useState } from "react";
import CategorySidebar from "@/components/community/CategorySidebar";
import PostCard from "@/components/community/PostCard";
import SearchAndFilter from "@/components/community/SearchAndFilter";
import CreatePostModal from "@/components/community/CreatePostModal";
import { HelpCircle, Star, Award, Bot, MessageSquare, Grid3X3 } from "lucide-react";

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "comments" | "views">("latest");
  const [postTypeFilter, setPostTypeFilter] = useState<"all" | "consultation_request" | "consultation_review" | "expert_intro" | "general">("all");
  


  const handleTabChange = (categoryId: string) => {
    setActiveTab(categoryId);
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

  // 게시글 타입 필터 옵션
  const postTypeFilters = [
    { id: "all", name: "전체", icon: Grid3X3, color: "text-gray-600", bgColor: "bg-gray-100", hoverColor: "hover:bg-gray-200" },
    { id: "consultation_request", name: "상담요청", icon: HelpCircle, color: "text-orange-600", bgColor: "bg-orange-100", hoverColor: "hover:bg-orange-200" },
    { id: "consultation_review", name: "상담후기", icon: Star, color: "text-green-600", bgColor: "bg-green-100", hoverColor: "hover:bg-green-200" },
    { id: "expert_intro", name: "전문가소개", icon: Award, color: "text-blue-600", bgColor: "bg-blue-100", hoverColor: "hover:bg-blue-200" },
    { id: "general", name: "일반글", icon: MessageSquare, color: "text-gray-600", bgColor: "bg-gray-100", hoverColor: "hover:bg-gray-200" },
  ];

  // 모든 게시글 데이터
  const allPosts = [
    {
      id: "ai-1",
      title: "[AI 상담 요약] 진로 전환에 대한 고민",
      content: "AI 상담을 통해 현재 직장에서의 스트레스와 새로운 분야로의 전환 가능성에 대해 상담했습니다. 개발자로 전향하고 싶지만 나이와 경험 부족이 걱정됩니다.",
      author: "익명사용자",
      authorAvatar: "익",
      createdAt: "2024-01-16",
      category: "진로상담",
      tags: ["AI상담", "진로전환", "개발자"],
      likes: 24,
      comments: 8,
      postType: "consultation_request" as const,
      isAISummary: true,
      urgency: "보통",
      preferredMethod: "화상상담",
    },
    {
      id: "1",
      title: "진로 상담 경험 공유",
      content: "전문가와의 상담을 통해 진로 방향을 찾았습니다. 3개월간의 상담 과정에서 얻은 인사이트를 공유합니다.",
      author: "김철수",
      authorAvatar: "김",
      createdAt: "2024-01-15",
      category: "진로상담",
      tags: ["진로", "상담후기", "경험공유"],
      likes: 12,
      comments: 5,
      postType: "consultation_review" as const,
    },
    {
      id: "req-1",
      title: "연애 관계 상담 요청드립니다",
      content: "연인과의 소통 문제로 고민이 많습니다. 서로 다른 성격으로 인한 갈등을 해결하고 싶어요.",
      author: "익명사용자",
      authorAvatar: "익",
      createdAt: "2024-01-14",
      category: "관계상담",
      tags: ["연애", "소통", "갈등해결"],
      likes: 8,
      comments: 3,
      postType: "consultation_request" as const,
      urgency: "보통",
      preferredMethod: "화상상담",
    },
    {
      id: "expert-1",
      title: "심리상담 전문가 박상담입니다",
      content: "10년 경력의 심리상담사입니다. 우울, 불안, 트라우마 전문으로 상담하고 있으며, 많은 분들께 도움을 드리고 있습니다.",
      author: "박상담",
      authorAvatar: "박",
      createdAt: "2024-01-14",
      category: "심리상담",
      tags: ["전문가", "심리상담", "경력10년"],
      likes: 45,
      comments: 18,
      postType: "expert_intro" as const,
      isExpert: true,
    },
    {
      id: "2",
      title: "재무 상담 정말 도움됐어요!",
      content: "투자와 저축에 대한 좋은 조언을 받았습니다. 전문가님 덕분에 재정 계획을 체계적으로 세울 수 있었어요.",
      author: "박민수",
      authorAvatar: "박",
      createdAt: "2024-01-13",
      category: "재무상담",
      tags: ["투자", "재무", "상담후기"],
      likes: 15,
      comments: 7,
      postType: "consultation_review" as const,
    },
    {
      id: "ai-2",
      title: "[AI 상담 요약] 투자 초보자를 위한 조언",
      content: "AI와 함께 투자 기초에 대해 상담했습니다. 적금과 주식 투자의 차이점, 초보자가 주의해야 할 점들에 대해 알아봤습니다.",
      author: "익명사용자",
      authorAvatar: "익",
      createdAt: "2024-01-12",
      category: "투자상담",
      tags: ["AI상담", "투자초보", "주식"],
      likes: 31,
      comments: 15,
      postType: "consultation_request" as const,
      isAISummary: true,
      urgency: "낮음",
      preferredMethod: "채팅상담",
    },
    {
      id: "general-1",
      title: "상담 플랫폼 이용 팁 공유",
      content: "처음 상담 플랫폼을 이용하시는 분들을 위해 유용한 팁들을 정리해봤습니다.",
      author: "상담고수",
      authorAvatar: "상",
      createdAt: "2024-01-11",
      category: "기타",
      tags: ["팁", "플랫폼", "가이드"],
      likes: 22,
      comments: 9,
      postType: "general" as const,
    },
  ];

  // 필터링된 게시글
  const filteredPosts = postTypeFilter === "all" 
    ? allPosts 
    : allPosts.filter(post => post.postType === postTypeFilter);

  // 각 필터별 게시글 개수 계산
  const getPostCount = (filterId: string) => {
    if (filterId === "all") return allPosts.length;
    return allPosts.filter(post => post.postType === filterId).length;
  };
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">커뮤니티</h1>
          <p className="text-gray-600">
            다른 사용자들과 경험을 공유하고 소통하세요.
            {postTypeFilter === "consultation_request" && (
              <span className="block mt-2 text-orange-600 font-medium">
                💼 상담요청 목록입니다. 상담 제안 버튼을 클릭하여 고객과 연결되세요.
              </span>
            )}
          </p>
        </div>

        <div className="flex gap-8">
          <div className="w-72 flex-shrink-0">
            <CategorySidebar
              categories={[
                { id: "all", name: "전체", count: 1247 },
                { id: "career", name: "진로상담", count: 156 },
                { id: "psychology", name: "심리상담", count: 89 },
                { id: "finance", name: "재무상담", count: 234 },
                { id: "legal", name: "법률상담", count: 67 },
                { id: "education", name: "교육상담", count: 45 },
                { id: "health", name: "건강상담", count: 78 },
                { id: "relationship", name: "관계상담", count: 123 },
                { id: "business", name: "사업상담", count: 56 },
                { id: "technology", name: "기술상담", count: 98 },
                { id: "design", name: "디자인상담", count: 34 },
                { id: "language", name: "언어상담", count: 42 },
                { id: "art", name: "예술상담", count: 29 },
                { id: "sports", name: "스포츠상담", count: 37 },
                { id: "travel", name: "여행상담", count: 51 },
                { id: "food", name: "요리상담", count: 33 },
                { id: "fashion", name: "패션상담", count: 28 },
                { id: "pet", name: "반려동물상담", count: 64 },
                { id: "gardening", name: "정원상담", count: 19 },
                { id: "investment", name: "투자상담", count: 87 },
                { id: "tax", name: "세무상담", count: 43 },
                { id: "insurance", name: "보험상담", count: 52 },
                { id: "admission", name: "진학상담", count: 76 },
                { id: "other", name: "그외 기타", count: 95 },
              ]}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              popularTags={["상담후기", "전문가추천", "진로고민", "투자조언"]}
              onTagClick={handleTagClick}
            />
          </div>

          <div className="flex-1 min-w-0">
            {/* 게시글 타입 필터 버튼 */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {postTypeFilters.map((filter) => {
                  const Icon = filter.icon;
                  const isActive = postTypeFilter === filter.id;
                  const postCount = getPostCount(filter.id);
                  
                  return (
                    <button
                      key={filter.id}
                      onClick={() => setPostTypeFilter(filter.id as any)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? `${filter.bgColor} ${filter.color} border-2 border-current`
                          : `bg-white text-gray-600 border border-gray-200 ${filter.hoverColor}`
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{filter.name}</span>
                      <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                        isActive ? "bg-white bg-opacity-50" : "bg-gray-100"
                      }`}>
                        {postCount}
                      </span>
                    </button>
                  );
                })}
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
                filteredPosts.map((post) => (
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
          </div>
        </div>
      </div>
    </div>
  );
}
