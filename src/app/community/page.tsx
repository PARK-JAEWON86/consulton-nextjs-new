import { CategorySidebar } from "@/components/community/CategorySidebar";
import { PostCard } from "@/components/community/PostCard";
import { SearchAndFilter } from "@/components/community/SearchAndFilter";
import { CreatePostModal } from "@/components/community/CreatePostModal";

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
            <CategorySidebar />
          </div>

          <div className="flex-1">
            <div className="mb-6">
              <SearchAndFilter />
            </div>

            <div className="space-y-4">
              <PostCard />
              <PostCard />
              <PostCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
