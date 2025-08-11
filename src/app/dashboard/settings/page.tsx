import { AccountSettings } from "@/components/settings/AccountSettings";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { NotificationToggle } from "@/components/settings/NotificationToggle";
import { ThemeSettings } from "@/components/settings/ThemeSettings";
import { LanguageSettings } from "@/components/settings/LanguageSettings";
import { PrivacySettings } from "@/components/settings/PrivacySettings";
import { CalendarIntegration } from "@/components/settings/CalendarIntegration";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">설정</h1>
          <p className="text-gray-600">계정과 앱 설정을 관리하세요.</p>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <AccountSettings />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <ProfileSettings />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <SecuritySettings />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <NotificationToggle />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <ThemeSettings />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <LanguageSettings />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <PrivacySettings />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <CalendarIntegration />
          </div>
        </div>
      </div>
    </div>
  );
}
