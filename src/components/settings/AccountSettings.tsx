"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Save, AlertTriangle } from "lucide-react";

const AccountSettings = () => {
  const [emailSettings, setEmailSettings] = useState({
    currentEmail: "user@example.com",
    newEmail: "",
    emailVerified: true,
  });

  const [passwordSettings, setPasswordSettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [saveStatus, setSaveStatus] = useState({
    email: "idle",
    password: "idle",
  });

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: [],
  });

  const calculatePasswordStrength = (password) => {
    let score = 0;
    const feedback = [];

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

  const handlePasswordChange = (field, value) => {
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
        emailVerified: false, // 새 이메일은 인증이 필요
      }));

      setSaveStatus((prev) => ({ ...prev, email: "saved" }));

      setTimeout(() => {
        setSaveStatus((prev) => ({ ...prev, email: "idle" }));
      }, 2000);
    } catch (error) {
      setSaveStatus((prev) => ({ ...prev, email: "error" }));
      setTimeout(() => {
        setSaveStatus((prev) => ({ ...prev, email: "idle" }));
      }, 3000);
    }
  };

  const handlePasswordSave = async () => {
    if (!passwordSettings.currentPassword) {
      alert("현재 비밀번호를 입력해주세요.");
      return;
    }

    if (!passwordSettings.newPassword) {
      alert("새 비밀번호를 입력해주세요.");
      return;
    }

    if (passwordSettings.newPassword !== passwordSettings.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (passwordStrength.score < 3) {
      alert("비밀번호 강도가 너무 약합니다. 더 강한 비밀번호를 설정해주세요.");
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

      setSaveStatus((prev) => ({ ...prev, password: "saved" }));

      setTimeout(() => {
        setSaveStatus((prev) => ({ ...prev, password: "idle" }));
      }, 2000);
    } catch (error) {
      setSaveStatus((prev) => ({ ...prev, password: "error" }));
      setTimeout(() => {
        setSaveStatus((prev) => ({ ...prev, password: "idle" }));
      }, 3000);
    }
  };

  const handleSendVerification = async () => {
    try {
      // 인증 메일 발송 API 호출 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("인증 이메일이 발송되었습니다. 이메일을 확인해주세요.");
    } catch (error) {
      alert("인증 이메일 발송에 실패했습니다.");
    }
  };

  const getPasswordStrengthColor = (score) => {
    if (score <= 2) return "bg-red-500";
    if (score <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = (score) => {
    if (score <= 2) return "약함";
    if (score <= 3) return "보통";
    return "강함";
  };

  return (
    <div className="space-y-8">
      {/* 이메일 설정 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Mail className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">이메일 설정</h2>
            <p className="text-sm text-gray-600">
              계정의 이메일 주소를 관리하세요
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              현재 이메일 주소
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="email"
                value={emailSettings.currentEmail}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                disabled
              />
              <div className="flex items-center space-x-2">
                {emailSettings.emailVerified ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    인증됨
                  </span>
                ) : (
                  <button
                    onClick={handleSendVerification}
                    className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded text-red-700 bg-red-50 hover:bg-red-100"
                  >
                    인증하기
                  </button>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              새 이메일 주소
            </label>
            <input
              type="email"
              value={emailSettings.newEmail}
              onChange={(e) =>
                setEmailSettings((prev) => ({
                  ...prev,
                  newEmail: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="새로운 이메일 주소를 입력하세요"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleEmailSave}
              disabled={
                saveStatus.email === "saving" || !emailSettings.newEmail
              }
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                saveStatus.email === "saving" || !emailSettings.newEmail
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : saveStatus.email === "saved"
                  ? "bg-green-600 text-white"
                  : saveStatus.email === "error"
                  ? "bg-red-600 text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              <Save className="h-4 w-4" />
              <span>
                {saveStatus.email === "saving" && "변경 중..."}
                {saveStatus.email === "saved" && "변경 완료!"}
                {saveStatus.email === "error" && "변경 실패"}
                {saveStatus.email === "idle" && "이메일 변경"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 비밀번호 설정 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Lock className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              비밀번호 설정
            </h2>
            <p className="text-sm text-gray-600">
              계정 보안을 위해 정기적으로 비밀번호를 변경하세요
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              현재 비밀번호 *
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? "text" : "password"}
                value={passwordSettings.currentPassword}
                onChange={(e) =>
                  handlePasswordChange("currentPassword", e.target.value)
                }
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="현재 비밀번호를 입력하세요"
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
              새 비밀번호 *
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                value={passwordSettings.newPassword}
                onChange={(e) =>
                  handlePasswordChange("newPassword", e.target.value)
                }
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="새 비밀번호를 입력하세요"
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

            {/* 비밀번호 강도 표시 */}
            {passwordSettings.newPassword && (
              <div className="mt-2">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(
                        passwordStrength.score
                      )}`}
                      style={{
                        width: `${(passwordStrength.score / 5) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {getPasswordStrengthText(passwordStrength.score)}
                  </span>
                </div>
                {passwordStrength.feedback.length > 0 && (
                  <p className="text-sm text-gray-500">
                    필요한 조건: {passwordStrength.feedback.join(", ")}
                  </p>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              새 비밀번호 확인 *
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                value={passwordSettings.confirmPassword}
                onChange={(e) =>
                  handlePasswordChange("confirmPassword", e.target.value)
                }
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="새 비밀번호를 다시 입력하세요"
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
            {passwordSettings.newPassword &&
              passwordSettings.confirmPassword &&
              passwordSettings.newPassword !==
                passwordSettings.confirmPassword && (
                <p className="text-sm text-red-600 mt-1">
                  비밀번호가 일치하지 않습니다.
                </p>
              )}
          </div>

          <div className="flex justify-end">
            <button
              onClick={handlePasswordSave}
              disabled={
                saveStatus.password === "saving" ||
                !passwordSettings.currentPassword ||
                !passwordSettings.newPassword ||
                !passwordSettings.confirmPassword ||
                passwordSettings.newPassword !==
                  passwordSettings.confirmPassword
              }
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                saveStatus.password === "saving" ||
                !passwordSettings.currentPassword ||
                !passwordSettings.newPassword ||
                !passwordSettings.confirmPassword ||
                passwordSettings.newPassword !==
                  passwordSettings.confirmPassword
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : saveStatus.password === "saved"
                  ? "bg-green-600 text-white"
                  : saveStatus.password === "error"
                  ? "bg-red-600 text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              <Save className="h-4 w-4" />
              <span>
                {saveStatus.password === "saving" && "변경 중..."}
                {saveStatus.password === "saved" && "변경 완료!"}
                {saveStatus.password === "error" && "변경 실패"}
                {saveStatus.password === "idle" && "비밀번호 변경"}
              </span>
            </button>
          </div>
        </div>

        {/* 비밀번호 보안 팁 */}
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">
                안전한 비밀번호 팁
              </h3>
              <div className="mt-2 text-sm text-amber-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>8자 이상의 길이로 설정하세요</li>
                  <li>대문자, 소문자, 숫자, 특수문자를 조합하세요</li>
                  <li>개인정보(이름, 생년월일 등)는 사용하지 마세요</li>
                  <li>다른 사이트와 같은 비밀번호를 사용하지 마세요</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
