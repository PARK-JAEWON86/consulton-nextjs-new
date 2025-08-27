"use client";

import { useState } from "react";
import {
  Key,
  Check,
  X,
} from "lucide-react";

type SaveStatus = "idle" | "saving" | "saved" | "error";

const SecuritySettings = () => {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const handleSaveSecuritySettings = async () => {
    setSaveStatus("saving");

    try {
      // 보안 설정 저장 API 호출 시뮬레이션
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
          <Key className="h-5 w-5 mr-2 text-blue-600" />
          보안 설정
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          계정 보안을 위한 설정을 관리하세요.
        </p>
      </div>

      <div className="p-6">
        {/* 보안 설정 내용이 여기에 들어갈 예정입니다 */}
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-900 mb-2">2단계 인증</h4>
            <p className="text-sm text-gray-600 mb-3">
              계정 보안을 강화하기 위해 2단계 인증을 설정하세요.
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              2단계 인증 설정
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-900 mb-2">로그인 활동</h4>
            <p className="text-sm text-gray-600 mb-3">
              최근 로그인 활동을 확인하고 의심스러운 활동을 차단하세요.
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              로그인 활동 보기
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-900 mb-2">보안 질문</h4>
            <p className="text-sm text-gray-600 mb-3">
              계정 복구를 위한 보안 질문을 설정하세요.
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              보안 질문 설정
            </button>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="text-md font-medium text-blue-900 mb-2">비밀번호 변경</h4>
            <p className="text-sm text-blue-700 mb-3">
              비밀번호 변경은 사이드바의 프로필 메뉴에서 할 수 있습니다.
            </p>
            <div className="text-xs text-blue-600">
              💡 사이드바 하단의 프로필을 클릭하여 비밀번호 변경 메뉴에 접근하세요.
            </div>
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="flex justify-end mt-6">
          <button
            onClick={handleSaveSecuritySettings}
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
                <Key className="h-4 w-4" />
                <span>보안 설정 저장</span>
              </>
            )}
          </button>
        </div>

        {/* 상태 메시지 */}
        {saveStatus === "saved" && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2 text-green-800">
              <Check className="h-5 w-5" />
              <span>보안 설정이 성공적으로 저장되었습니다.</span>
            </div>
          </div>
        )}

        {saveStatus === "error" && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2 text-red-800">
              <X className="h-5 w-5" />
              <span>보안 설정 저장에 실패했습니다. 다시 시도해주세요.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecuritySettings;
