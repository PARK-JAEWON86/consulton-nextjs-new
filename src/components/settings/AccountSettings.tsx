"use client";

import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Save,
  AlertTriangle,
  Check,
} from "lucide-react";

interface EmailSettings {
  currentEmail: string;
  newEmail: string;
  emailVerified: boolean;
}

interface PasswordSettings {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ShowPasswords {
  current: boolean;
  new: boolean;
  confirm: boolean;
}

interface SaveStatus {
  email: "idle" | "saving" | "success" | "error";
  password: "idle" | "saving" | "success" | "error";
}

interface PasswordStrength {
  score: number;
  feedback: string[];
}

const AccountSettings = () => {
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    currentEmail: "user@example.com",
    newEmail: "",
    emailVerified: true,
  });

  const [passwordSettings, setPasswordSettings] = useState<PasswordSettings>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState<ShowPasswords>({
    current: false,
    new: false,
    confirm: false,
  });

  const [saveStatus, setSaveStatus] = useState<SaveStatus>({
    email: "idle",
    password: "idle",
  });

  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: [],
  });

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0;
    const feedback: string[] = [];

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push("최소 8자 이상");
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("대문자 포함");
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("소문자 포함");
    }

    if (/[0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push("숫자 포함");
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push("특수문자 포함");
    }

    return { score, feedback };
  };

  const handlePasswordChange = (
    field: keyof PasswordSettings,
    value: string,
  ) => {
    setPasswordSettings((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "newPassword") {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const handleEmailSave = async () => {
    if (!emailSettings.newEmail) {
      alert("새 이메일 주소를 입력해주세요.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailSettings.newEmail)) {
      alert("올바른 이메일 형식이 아닙니다.");
      return;
    }

    setSaveStatus((prev) => ({ ...prev, email: "saving" }));

    try {
      // API 호출 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setEmailSettings((prev) => ({
        ...prev,
        currentEmail: prev.newEmail,
        newEmail: "",
      }));
      setSaveStatus((prev) => ({ ...prev, email: "success" }));

      setTimeout(() => {
        setSaveStatus((prev) => ({ ...prev, email: "idle" }));
      }, 3000);
    } catch (error) {
      setSaveStatus((prev) => ({ ...prev, email: "error" }));
      setTimeout(() => {
        setSaveStatus((prev) => ({ ...prev, email: "idle" }));
      }, 3000);
    }
  };

  const handlePasswordSave = async () => {
    if (
      !passwordSettings.currentPassword ||
      !passwordSettings.newPassword ||
      !passwordSettings.confirmPassword
    ) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    if (passwordSettings.newPassword !== passwordSettings.confirmPassword) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    if (passwordStrength.score < 3) {
      alert("비밀번호가 너무 약합니다. 더 강한 비밀번호를 사용해주세요.");
      return;
    }

    setSaveStatus((prev) => ({ ...prev, password: "saving" }));

    try {
      // API 호출 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setPasswordSettings({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordStrength({ score: 0, feedback: [] });
      setSaveStatus((prev) => ({ ...prev, password: "success" }));

      setTimeout(() => {
        setSaveStatus((prev) => ({ ...prev, password: "idle" }));
      }, 3000);
    } catch (error) {
      setSaveStatus((prev) => ({ ...prev, password: "error" }));
      setTimeout(() => {
        setSaveStatus((prev) => ({ ...prev, password: "idle" }));
      }, 3000);
    }
  };

  const handleSendVerification = async () => {
    // 이메일 인증 코드 발송 로직
    alert("인증 코드가 이메일로 발송되었습니다.");
  };

  const getPasswordStrengthColor = (score: number) => {
    if (score <= 2) return "text-red-500";
    if (score <= 3) return "text-yellow-500";
    if (score <= 4) return "text-blue-500";
    return "text-green-500";
  };

  const getPasswordStrengthText = (score: number) => {
    if (score <= 2) return "매우 약함";
    if (score <= 3) return "약함";
    if (score <= 4) return "보통";
    return "강함";
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">계정 설정</h2>
        <p className="text-gray-600 mb-6">계정 정보와 보안을 관리하세요.</p>
      </div>

      {/* 이메일 설정 */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Mail className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium text-gray-900">이메일 주소</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              현재 이메일
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="email"
                value={emailSettings.currentEmail}
                disabled
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
              />
              {emailSettings.emailVerified ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  인증됨
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  미인증
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              새 이메일 주소
            </label>
            <div className="flex space-x-3">
              <input
                type="email"
                value={emailSettings.newEmail}
                onChange={(e) =>
                  setEmailSettings((prev) => ({
                    ...prev,
                    newEmail: e.target.value,
                  }))
                }
                placeholder="새 이메일 주소를 입력하세요"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleEmailSave}
                disabled={saveStatus.email === "saving"}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {saveStatus.email === "saving" ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>저장 중...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>저장</span>
                  </>
                )}
              </button>
            </div>

            {saveStatus.email === "success" && (
              <div className="mt-2 text-sm text-green-600 flex items-center space-x-1">
                <Check className="h-4 w-4" />
                <span>이메일이 성공적으로 변경되었습니다.</span>
              </div>
            )}

            {saveStatus.email === "error" && (
              <div className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                <AlertTriangle className="h-4 w-4" />
                <span>이메일 변경에 실패했습니다. 다시 시도해주세요.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 비밀번호 설정 */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Lock className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium text-gray-900">비밀번호 변경</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              현재 비밀번호
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? "text" : "password"}
                value={passwordSettings.currentPassword}
                onChange={(e) =>
                  handlePasswordChange("currentPassword", e.target.value)
                }
                placeholder="현재 비밀번호를 입력하세요"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((prev) => ({
                    ...prev,
                    current: !prev.current,
                  }))
                }
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPasswords.current ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              새 비밀번호
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                value={passwordSettings.newPassword}
                onChange={(e) =>
                  handlePasswordChange("newPassword", e.target.value)
                }
                placeholder="새 비밀번호를 입력하세요"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
                }
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPasswords.new ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>

            {passwordSettings.newPassword && (
              <div className="mt-2">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm text-gray-600">보안 강도:</span>
                  <span
                    className={`text-sm font-medium ${getPasswordStrengthColor(passwordStrength.score)}`}
                  >
                    {getPasswordStrengthText(passwordStrength.score)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      passwordStrength.score <= 2
                        ? "bg-red-500"
                        : passwordStrength.score <= 3
                          ? "bg-yellow-500"
                          : passwordStrength.score <= 4
                            ? "bg-blue-500"
                            : "bg-green-500"
                    }`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  ></div>
                </div>
                {passwordStrength.feedback.length > 0 && (
                  <div className="mt-2 text-xs text-gray-500">
                    {passwordStrength.feedback.join(", ")}
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              새 비밀번호 확인
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                value={passwordSettings.confirmPassword}
                onChange={(e) =>
                  handlePasswordChange("confirmPassword", e.target.value)
                }
                placeholder="새 비밀번호를 다시 입력하세요"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((prev) => ({
                    ...prev,
                    confirm: !prev.confirm,
                  }))
                }
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handlePasswordSave}
              disabled={saveStatus.password === "saving"}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {saveStatus.password === "saving" ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>저장 중...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>비밀번호 변경</span>
                </>
              )}
            </button>
          </div>

          {saveStatus.password === "success" && (
            <div className="mt-2 text-sm text-green-600 flex items-center space-x-1">
              <Check className="h-4 w-4" />
              <span>비밀번호가 성공적으로 변경되었습니다.</span>
            </div>
          )}

          {saveStatus.password === "error" && (
            <div className="mt-2 text-sm text-red-600 flex items-center space-x-1">
              <AlertTriangle className="h-4 w-4" />
              <span>비밀번호 변경에 실패했습니다. 다시 시도해주세요.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
