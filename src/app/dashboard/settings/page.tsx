import AccountSettings from "@/components/settings/AccountSettings";
import ProfileSettings from "@/components/settings/ProfileSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";
import ThemeSettings from "@/components/settings/ThemeSettings";
import LanguageSettings from "@/components/settings/LanguageSettings";
import PrivacySettings from "@/components/settings/PrivacySettings";
import CalendarIntegration from "@/components/settings/CalendarIntegration";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">설정</h1>
          <p className="text-gray-600">계정과 앱 설정을 관리하세요.</p>
        </div>

        <div className="space-y-8">
          <AccountSettings />
          <ProfileSettings />
          <SecuritySettings />
          <ThemeSettings />
          <LanguageSettings />
          <PrivacySettings />
          <CalendarIntegration />
        </div>
      </div>
    </div>
  );
}
