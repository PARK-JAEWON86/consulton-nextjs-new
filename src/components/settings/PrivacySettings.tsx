"use client";

import { useState } from "react";
import {
  Lock,
  Eye,
  Download,
  Trash2,
  AlertTriangle,
  Shield,
} from "lucide-react";
import NotificationToggle from "./NotificationToggle";

const PrivacySettings = () => {
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "experts", // public, experts, private
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

  const [saveStatus, setSaveStatus] = useState("idle");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handlePrivacyChange = (key, value) => {
    setPrivacySettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleDataCollectionChange = (key, value) => {
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
      a.download = `consultOn-data-${
        new Date().toISOString().split("T")[0]
      }.json`;
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
      {/* 프로필 공개 설정 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Eye className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              프로필 공개 설정
            </h2>
            <p className="text-sm text-gray-600">
              다른 사용자에게 표시되는 정보를 관리하세요
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              프로필 공개 범위
            </label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="profileVisibility"
                  value="public"
                  checked={privacySettings.profileVisibility === "public"}
                  onChange={(e) =>
                    handlePrivacyChange("profileVisibility", e.target.value)
                  }
                  className="mr-3 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="font-medium text-gray-900">전체 공개</span>
                  <p className="text-sm text-gray-500">
                    모든 사용자가 프로필을 볼 수 있습니다
                  </p>
                </div>
              </label>

              <label className="flex items-center">
                <input
                  type="radio"
                  name="profileVisibility"
                  value="experts"
                  checked={privacySettings.profileVisibility === "experts"}
                  onChange={(e) =>
                    handlePrivacyChange("profileVisibility", e.target.value)
                  }
                  className="mr-3 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="font-medium text-gray-900">전문가만</span>
                  <p className="text-sm text-gray-500">
                    매칭된 전문가만 프로필을 볼 수 있습니다 (권장)
                  </p>
                </div>
              </label>

              <label className="flex items-center">
                <input
                  type="radio"
                  name="profileVisibility"
                  value="private"
                  checked={privacySettings.profileVisibility === "private"}
                  onChange={(e) =>
                    handlePrivacyChange("profileVisibility", e.target.value)
                  }
                  className="mr-3 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="font-medium text-gray-900">비공개</span>
                  <p className="text-sm text-gray-500">
                    프로필을 완전히 비공개로 설정합니다
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-200">
            <NotificationToggle
              label="상담 기록 표시"
              description="프로필에 완료된 상담 수와 평점을 표시합니다"
              checked={privacySettings.consultationHistory}
              onChange={(checked) =>
                handlePrivacyChange("consultationHistory", checked)
              }
            />

            <NotificationToggle
              label="검색 결과에 표시"
              description="전문가 검색 시 추천 사용자로 표시될 수 있습니다"
              checked={privacySettings.searchVisibility}
              onChange={(checked) =>
                handlePrivacyChange("searchVisibility", checked)
              }
            />

            <NotificationToggle
              label="활동 상태 표시"
              description="다른 사용자에게 온라인/오프라인 상태를 표시합니다"
              checked={privacySettings.activityStatus}
              onChange={(checked) =>
                handlePrivacyChange("activityStatus", checked)
              }
            />
          </div>
        </div>
      </div>

      {/* 데이터 수집 및 사용 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Shield className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              데이터 수집 및 사용
            </h2>
            <p className="text-sm text-gray-600">
              개인 데이터 사용 방식을 관리하세요
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <NotificationToggle
            label="서비스 분석 데이터"
            description="서비스 개선을 위한 익명화된 사용 데이터 수집"
            checked={privacySettings.dataCollection.analytics}
            onChange={(checked) =>
              handleDataCollectionChange("analytics", checked)
            }
          />

          <NotificationToggle
            label="개인화 서비스"
            description="맞춤형 전문가 추천 및 콘텐츠 제공을 위한 데이터 사용"
            checked={privacySettings.dataCollection.personalization}
            onChange={(checked) =>
              handleDataCollectionChange("personalization", checked)
            }
          />

          <NotificationToggle
            label="마케팅 목적 사용"
            description="타겟 광고 및 마케팅 활동을 위한 데이터 사용"
            checked={privacySettings.dataCollection.marketing}
            onChange={(checked) =>
              handleDataCollectionChange("marketing", checked)
            }
          />

          <NotificationToggle
            label="제3자 공유"
            description="파트너사와의 데이터 공유 (법적 요구사항 제외)"
            checked={privacySettings.dataCollection.thirdParty}
            onChange={(checked) =>
              handleDataCollectionChange("thirdParty", checked)
            }
          />
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">데이터 보호 정책</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 모든 개인 데이터는 강력한 암호화로 보호됩니다</li>
            <li>
              • 법적 요구사항을 제외하고는 동의 없이 데이터를 공유하지 않습니다
            </li>
            <li>
              • 언제든지 설정을 변경하거나 데이터 삭제를 요청할 수 있습니다
            </li>
          </ul>
        </div>
      </div>

      {/* 데이터 관리 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Download className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">데이터 관리</h2>
            <p className="text-sm text-gray-600">
              개인 데이터를 내보내거나 삭제할 수 있습니다
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">데이터 내보내기</h3>
              <p className="text-sm text-gray-500">
                프로필, 상담 기록, 설정 등 모든 개인 데이터를 JSON 파일로
                다운로드
              </p>
            </div>
            <button
              onClick={handleDataExport}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>내보내기</span>
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
            <div>
              <h3 className="font-medium text-red-900">계정 삭제</h3>
              <p className="text-sm text-red-700">
                계정과 모든 관련 데이터를 영구적으로 삭제합니다 (복구 불가능)
              </p>
            </div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span>계정 삭제</span>
            </button>
          </div>
        </div>
      </div>

      {/* 계정 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                계정 삭제 확인
              </h3>
            </div>

            <div className="space-y-4">
              <p className="text-gray-700">
                정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
              </p>

              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <h4 className="font-medium text-red-900 mb-2">
                  삭제될 데이터:
                </h4>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>• 프로필 정보 및 계정 설정</li>
                  <li>• 모든 상담 기록 및 채팅 내역</li>
                  <li>• 결제 정보 및 크레딧</li>
                  <li>• 평가 및 리뷰 데이터</li>
                </ul>
              </div>

              <p className="text-sm text-gray-600">
                계정은 7일 후 영구 삭제되며, 이 기간 동안 로그인하여 삭제를
                취소할 수 있습니다.
              </p>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                삭제 확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 설정 저장 버튼 */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveSettings}
          disabled={saveStatus === "saving"}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
            saveStatus === "saving"
              ? "bg-gray-400 text-white cursor-not-allowed"
              : saveStatus === "saved"
              ? "bg-green-600 text-white"
              : saveStatus === "error"
              ? "bg-red-600 text-white"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          <Lock className="h-4 w-4" />
          <span>
            {saveStatus === "saving" && "저장 중..."}
            {saveStatus === "saved" && "저장 완료!"}
            {saveStatus === "error" && "저장 실패"}
            {saveStatus === "idle" && "개인정보 설정 저장"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default PrivacySettings;
