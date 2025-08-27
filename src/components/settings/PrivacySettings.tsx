"use client";

import { useState } from "react";
import {
  Eye,
  Save,
  Check,
  X,
} from "lucide-react";

interface PrivacySettings {
  dataSharing: boolean;
  analyticsTracking: boolean;
  marketingEmails: boolean;
  thirdPartySharing: boolean;
}

type SaveStatus = "idle" | "saving" | "saved" | "error";

const PrivacySettings = () => {
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    dataSharing: true,
    analyticsTracking: false,
    marketingEmails: false,
    thirdPartySharing: false,
  });

  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const handlePrivacyChange = (key: keyof PrivacySettings, value: any) => {
    setPrivacySettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveSettings = async () => {
    setSaveStatus("saving");

    try {
      // API 호출 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSaveStatus("saved");

      setTimeout(() => {
        setSaveStatus("idle");
      }, 2000);
    } catch (error) {
      setSaveStatus("error");
      setTimeout(() => {
        setSaveStatus("idle");
      }, 3000);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Eye className="h-5 w-5 mr-2 text-blue-600" />
          개인정보 설정
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          데이터 공유 및 개인정보 보호 설정을 관리하세요.
        </p>
      </div>

      <div className="p-6">
        {/* 데이터 공유 설정 */}
        <div className="space-y-6">
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">데이터 공유 설정</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                <div>
                  <div className="font-medium text-gray-900">데이터 분석 공유</div>
                  <div className="text-sm text-gray-600">
                    서비스 개선을 위한 익명화된 데이터 공유
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacySettings.dataSharing}
                    onChange={(e) => handlePrivacyChange("dataSharing", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                <div>
                  <div className="font-medium text-gray-900">사용자 행동 분석</div>
                  <div className="text-sm text-gray-600">
                    개인화된 서비스 제공을 위한 사용 패턴 분석
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacySettings.analyticsTracking}
                    onChange={(e) => handlePrivacyChange("analyticsTracking", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                <div>
                  <div className="font-medium text-gray-900">마케팅 이메일</div>
                  <div className="text-sm text-gray-600">
                    새로운 서비스 및 이벤트 정보 수신
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacySettings.marketingEmails}
                    onChange={(e) => handlePrivacyChange("marketingEmails", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                <div>
                  <div className="font-medium text-gray-900">제3자 데이터 공유</div>
                  <div className="text-sm text-gray-600">
                    신뢰할 수 있는 파트너사와의 제한적 데이터 공유
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacySettings.thirdPartySharing}
                    onChange={(e) => handlePrivacyChange("thirdPartySharing", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="flex justify-end mt-6">
          <button
            onClick={handleSaveSettings}
            disabled={saveStatus === "saving"}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {saveStatus === "saving" ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>저장 중...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>개인정보 설정 저장</span>
              </>
            )}
          </button>
        </div>

        {/* 상태 메시지 */}
        {saveStatus === "saved" && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2 text-green-800">
              <Check className="h-5 w-5" />
              <span>개인정보 설정이 성공적으로 저장되었습니다.</span>
            </div>
          </div>
        )}

        {saveStatus === "error" && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2 text-red-800">
              <X className="h-5 w-5" />
              <span>개인정보 설정 저장에 실패했습니다. 다시 시도해주세요.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivacySettings;
