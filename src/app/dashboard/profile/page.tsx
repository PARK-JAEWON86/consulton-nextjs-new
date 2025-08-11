import UserProfile from "@/components/dashboard/UserProfile";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">프로필</h1>
          <p className="text-gray-600">
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
