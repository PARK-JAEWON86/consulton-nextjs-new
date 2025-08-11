import { SummaryCard } from "@/components/summary/SummaryCard";
import { RecordingPlayer } from "@/components/summary/RecordingPlayer";
import { RecordingStatus } from "@/components/summary/RecordingStatus";
import { ToDoList } from "@/components/summary/ToDoList";

export default function SummaryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">상담 요약</h1>
          <p className="text-gray-600">
            상담 내용을 요약하고 액션 아이템을 확인하세요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <SummaryCard />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <ToDoList />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <RecordingStatus />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <RecordingPlayer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
