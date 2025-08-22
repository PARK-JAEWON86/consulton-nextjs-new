import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function NotificationsPage() {
  return (
    <ProtectedRoute requireAuth={true}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">알림</h1>
            <p className="text-gray-600 mt-1">
              중요한 업데이트와 알림을 확인하세요.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center text-gray-500 py-8">
              <p>새로운 알림이 없습니다.</p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

