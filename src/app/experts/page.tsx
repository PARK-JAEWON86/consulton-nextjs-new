import { ExpertList } from "@/components/matching/ExpertList";
import { SearchAndFilter } from "@/components/community/SearchAndFilter";

export default function ExpertsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">전문가 찾기</h1>
          <p className="text-gray-600">
            필요한 분야의 전문가를 찾아 상담을 받아보세요.
          </p>
        </div>

        <div className="mb-6">
          <SearchAndFilter />
        </div>

        <div className="bg-white rounded-lg shadow">
          <ExpertList />
        </div>
      </div>
    </div>
  );
}
