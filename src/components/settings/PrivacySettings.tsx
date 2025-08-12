"use client";

import { useState } from "react";
import {
  Lock,
  Eye,
  Download,
  Trash2,
  AlertTriangle,
  Shield,
  Save,
  Check,
  X,
} from "lucide-react";
import NotificationToggle from "./NotificationToggle";

interface PrivacySettings {
  profileVisibility: "public" | "experts" | "private";
  consultationHistory: boolean;
  dataCollection: {
    analytics: boolean;
    personalization: boolean;
    marketing: boolean;
    thirdParty: boolean;
  };
  searchVisibility: boolean;
  activityStatus: boolean;
}

type SaveStatus = "idle" | "saving" | "saved" | "error";

const PrivacySettings = () => {
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    profileVisibility: "experts",
    consultationHistory: true,
    dataCollection: {
      analytics: true,
      personalization: true,
      marketing: false,
      thirdParty: false,
    },
    searchVisibility: true,
    activityStatus: true,
  });

  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handlePrivacyChange = (key: keyof PrivacySettings, value: any) => {
    setPrivacySettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleDataCollectionChange = (
    key: keyof PrivacySettings["dataCollection"],
    value: boolean,
  ) => {
    setPrivacySettings((prev) => ({
      ...prev,
      dataCollection: {
        ...prev.dataCollection,
        [key]: value,
      },
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

  const handleDataExport = async () => {
    try {
      // 데이터 내보내기 API 호출 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 파일 다운로드 시뮬레이션
      const data = {
        profile: "사용자 프로필 데이터",
        consultations: "상담 기록 데이터",
        preferences: "설정 및 선호도 데이터",
        exportDate: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `consultOn-data-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      alert("데이터 내보내기가 완료되었습니다.");
    } catch (error) {
      alert("데이터 내보내기에 실패했습니다.");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // 계정 삭제 API 호출 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert("계정 삭제 요청이 처리되었습니다. 7일 후 영구 삭제됩니다.");
      setShowDeleteConfirm(false);
    } catch (error) {
      alert("계정 삭제 요청에 실패했습니다.");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          개인정보 보호
        </h2>
        <p className="text-gray-600 mb-6">
          개인정보 공개 범위와 데이터 사용을 관리하세요.
        </p>
      </div>

      {/* 프로필 공개 설정 */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Eye className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium text-gray-900">
            프로필 공개 설정
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              프로필 공개 범위
            </label>
            <div className="space-y-3">
              {[
                {
                  value: "public",
                  label: "전체 공개",
                  description: "모든 사용자가 프로필을 볼 수 있습니다",
                },
                {
                  value: "experts",
                  label: "전문가만",
                  description: "전문가와 매칭 시에만 프로필이 공개됩니다",
                },
                {
                  value: "private",
                  label: "비공개",
                  description: "프로필이 공개되지 않습니다",
                },
              ].map((option) => {
                const isActive =
                  privacySettings.profileVisibility === option.value;

                return (
                  <button
                    key={option.value}
                    onClick={() =>
                      handlePrivacyChange("profileVisibility", option.value)
                    }
                    className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      isActive
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`font-medium ${isActive ? "text-blue-900" : "text-gray-900"}`}
                    >
                      {option.label}
                    </div>
                    <div
                      className={`text-sm ${isActive ? "text-blue-700" : "text-gray-600"}`}
                    >
                      {option.description}
                    </div>
                    {isActive && (
                      <div className="mt-2 flex justify-end">
                        <Check className="h-4 w-4 text-blue-600" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
            <div>
              <div className="font-medium text-gray-900">상담 기록 공개</div>
              <div className="text-sm text-gray-600">
                전문가와의 상담 기록을 다른 사용자에게 공개합니다
              </div>
            </div>
            <NotificationToggle
              label=""
              description=""
              checked={privacySettings.consultationHistory}
              onChange={(value) =>
                handlePrivacyChange("consultationHistory", value)
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
            <div>
              <div className="font-medium text-gray-900">검색 노출</div>
              <div className="text-sm text-gray-600">
                전문가 검색 시 프로필이 검색 결과에 표시됩니다
              </div>
            </div>
            <NotificationToggle
              label=""
              description=""
              checked={privacySettings.searchVisibility}
              onChange={(value) =>
                handlePrivacyChange("searchVisibility", value)
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
            <div>
              <div className="font-medium text-gray-900">활동 상태 표시</div>
              <div className="text-sm text-gray-600">
                온라인 상태와 최근 활동을 다른 사용자에게 표시합니다
              </div>
            </div>
            <NotificationToggle
              label=""
              description=""
              checked={privacySettings.activityStatus}
              onChange={(value) => handlePrivacyChange("activityStatus", value)}
            />
          </div>
        </div>
      </div>

      {/* 데이터 수집 설정 */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium text-gray-900">
            데이터 수집 설정
          </h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
            <div>
              <div className="font-medium text-gray-900">
                서비스 개선을 위한 분석
              </div>
              <div className="text-sm text-gray-600">
                서비스 사용 패턴을 분석하여 개선에 활용합니다
              </div>
            </div>
            <NotificationToggle
              label=""
              description=""
              checked={privacySettings.dataCollection.analytics}
              onChange={(value) =>
                handleDataCollectionChange("analytics", value)
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
            <div>
              <div className="font-medium text-gray-900">개인화 서비스</div>
              <div className="text-sm text-gray-600">
                사용자 맞춤형 추천과 서비스를 제공합니다
              </div>
            </div>
            <NotificationToggle
              label=""
              description=""
              checked={privacySettings.dataCollection.personalization}
              onChange={(value) =>
                handleDataCollectionChange("personalization", value)
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
            <div>
              <div className="font-medium text-gray-900">마케팅 목적</div>
              <div className="text-sm text-gray-600">
                관련 서비스와 이벤트 정보를 제공합니다
              </div>
            </div>
            <NotificationToggle
              label=""
              description=""
              checked={privacySettings.dataCollection.marketing}
              onChange={(value) =>
                handleDataCollectionChange("marketing", value)
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
            <div>
              <div className="font-medium text-gray-900">제3자 공유</div>
              <div className="text-sm text-gray-600">
                신뢰할 수 있는 파트너사와 데이터를 공유합니다
              </div>
            </div>
            <NotificationToggle
              label=""
              description=""
              checked={privacySettings.dataCollection.thirdParty}
              onChange={(value) =>
                handleDataCollectionChange("thirdParty", value)
              }
            />
          </div>
        </div>
      </div>

      {/* 데이터 관리 */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">데이터 관리</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
            <div>
              <div className="font-medium text-gray-900">데이터 내보내기</div>
              <div className="text-sm text-gray-600">
                개인정보를 JSON 형태로 다운로드합니다
              </div>
            </div>
            <button
              onClick={handleDataExport}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>내보내기</span>
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
            <div>
              <div className="font-medium text-gray-900">계정 삭제</div>
              <div className="text-sm text-gray-600">
                모든 데이터와 함께 계정을 영구적으로 삭제합니다
              </div>
            </div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>계정 삭제</span>
            </button>
          </div>
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="flex justify-end">
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

      {/* 계정 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  계정을 삭제하시겠습니까?
                </h2>
                <p className="text-gray-600">
                  이 작업은 되돌릴 수 없습니다. 모든 데이터가 영구적으로
                  삭제됩니다.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  계정 삭제
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivacySettings;
