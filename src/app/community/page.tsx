import CategorySidebar from "@/components/community/CategorySidebar";
import PostCard from "@/components/community/PostCard";
import SearchAndFilter from "@/components/community/SearchAndFilter";
import CreatePostModal from "@/components/community/CreatePostModal";

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">커뮤니티</h1>
          <p className="text-gray-600">
            다른 사용자들과 경험을 공유하고 소통하세요.
          </p>
        </div>

        <div className="flex gap-6">
          <div className="w-64 flex-shrink-0">
            <CategorySidebar
              categories={[
                { id: "all", name: "전체", count: 1247 },
                { id: "career", name: "진로상담", count: 156 },
                { id: "psychology", name: "심리상담", count: 89 },
                { id: "finance", name: "재무상담", count: 234 },
                { id: "legal", name: "법률상담", count: 67 }
              ]}
              activeTab="all"
              onTabChange={() => {}}
              popularTags={["상담후기", "전문가추천", "진로고민", "투자조언"]}
              onTagClick={() => {}}
            />
          </div>

          <div className="flex-1">
            <div className="mb-6">
              <SearchAndFilter
                searchQuery=""
                onSearchChange={() => {}}
                sortBy="latest"
                onSortChange={() => {}}
                onFilterClick={() => {}}
              />
            </div>

            <div className="space-y-4">
              <PostCard
                post={{
                  id: "1",
                  title: "진로 상담 경험 공유",
                  content: "전문가와의 상담을 통해 진로 방향을 찾았습니다.",
                  author: "김철수",
                  authorAvatar: "김",
                  createdAt: "2024-01-15",
                  category: "진로상담",
                  tags: ["진로", "상담후기"],
                  likes: 12,
                  comments: 5
                }}
                onLike={() => {}}
                onComment={() => {}}
              />
              <PostCard
                post={{
                  id: "2",
                  title: "심리 상담 후기",
                  content: "마음의 안정을 찾을 수 있었습니다.",
                  author: "이영희",
                  authorAvatar: "이",
                  createdAt: "2024-01-14",
                  category: "심리상담",
                  tags: ["심리", "치유"],
                  likes: 8,
                  comments: 3
                }}
                onLike={() => {}}
                onComment={() => {}}
              />
              <PostCard
                post={{
                  id: "3",
                  title: "재무 상담 도움 받았어요",
                  content: "투자와 저축에 대한 좋은 조언을 받았습니다.",
                  author: "박민수",
                  authorAvatar: "박",
                  createdAt: "2024-01-13",
                  category: "재무상담",
                  tags: ["투자", "재무"],
                  likes: 15,
                  comments: 7
                }}
                onLike={() => {}}
                onComment={() => {}}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
