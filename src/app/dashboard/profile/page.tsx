import UserProfile from "@/components/dashboard/UserProfile";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">프로필</h1>
          <p className="text-gray-600 mt-1">
            개인 정보를 관리하고 프로필을 업데이트하세요.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow">
          <UserProfile />
        </div>
      </div>
    </div>
  );
}
