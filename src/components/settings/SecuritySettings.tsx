"use client";

import { useState } from "react";
import {
  Shield,
  Smartphone,
  Key,
  Eye,
  Clock,
  MapPin,
  AlertTriangle,
} from "lucide-react";
import NotificationToggle from "./NotificationToggle";

const SecuritySettings = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30"); // minutes
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle");

  const [loginHistory] = useState([
    {
      id: 1,
      device: "Chrome on Windows",
      location: "서울, 대한민국",
      ip: "192.168.1.100",
      time: "2024-01-15 14:30",
      status: "success",
      current: true,
    },
    {
      id: 2,
      device: "Safari on iPhone",
      location: "서울, 대한민국",
      ip: "192.168.1.101",
      time: "2024-01-15 09:15",
      status: "success",
      current: false,
    },
    {
      id: 3,
      device: "Chrome on Android",
      location: "부산, 대한민국",
      ip: "203.255.100.50",
      time: "2024-01-14 16:45",
      status: "failed",
      current: false,
    },
  ]);

  const recoveryCodes = [
    "A1B2-C3D4-E5F6",
    "G7H8-I9J0-K1L2",
    "M3N4-O5P6-Q7R8",
    "S9T0-U1V2-W3X4",
    "Y5Z6-A7B8-C9D0",
  ];

  const handleEnable2FA = async () => {
    setSaveStatus("saving");

    try {
      // 2FA 설정 API 호출 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setTwoFactorEnabled(true);
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

  const handleDisable2FA = async () => {
    if (
      !confirm(
        "2단계 인증을 비활성화하시겠습니까? 계정 보안이 약해질 수 있습니다."
      )
    ) {
      return;
    }

    setSaveStatus("saving");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setTwoFactorEnabled(false);
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

  const handleRevokeSession = async (sessionId) => {
    if (!confirm("이 세션을 종료하시겠습니까?")) {
      return;
    }

    try {
      // 세션 종료 API 호출 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("세션이 종료되었습니다.");
    } catch (error) {
      alert("세션 종료에 실패했습니다.");
    }
  };

  const handleSaveSecuritySettings = async () => {
    setSaveStatus("saving");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
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

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "text-green-600";
      case "failed":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "success":
        return "성공";
      case "failed":
        return "실패";
      default:
        return "알 수 없음";
    }
  };

  return (
    <div className="space-y-8">
      {/* 2단계 인증 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Shield className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">2단계 인증</h2>
            <p className="text-sm text-gray-600">
              추가 보안 계층으로 계정을 보호하세요
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Smartphone className="h-5 w-5 text-gray-400" />
              <div>
                <h3 className="font-medium text-gray-900">인증 앱 사용</h3>
                <p className="text-sm text-gray-500">
                  Google Authenticator, Authy 등의 앱을 사용한 인증
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {twoFactorEnabled ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  활성화됨
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  비활성화됨
                </span>
              )}
              <button
                onClick={twoFactorEnabled ? handleDisable2FA : handleEnable2FA}
                disabled={saveStatus === "saving"}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  twoFactorEnabled
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                } ${
                  saveStatus === "saving" ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {saveStatus === "saving"
                  ? "처리 중..."
                  : twoFactorEnabled
                  ? "비활성화"
                  : "활성화"}
              </button>
            </div>
          </div>

          {twoFactorEnabled && (
            <div className="space-y-4">
              {/* 복구 코드 */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Key className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-amber-800">복구 코드</h4>
                    <p className="text-sm text-amber-700 mt-1">
                      휴대폰을 분실했을 때 사용할 수 있는 일회용 코드입니다.
                    </p>
                    <button
                      onClick={() => setShowRecoveryCodes(!showRecoveryCodes)}
                      className="mt-2 flex items-center space-x-2 text-sm text-amber-700 hover:text-amber-800 font-medium"
                    >
                      <Eye className="h-4 w-4" />
                      <span>
                        {showRecoveryCodes ? "숨기기" : "복구 코드 보기"}
                      </span>
                    </button>
                  </div>
                </div>

                {showRecoveryCodes && (
                  <div className="mt-4 p-3 bg-white rounded border">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {recoveryCodes.map((code, index) => (
                        <div
                          key={index}
                          className="font-mono text-sm text-gray-700 bg-gray-50 p-2 rounded"
                        >
                          {code}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-amber-600 mt-2">
                      ⚠️ 이 코드들을 안전한 곳에 저장하세요. 각 코드는 한 번만
                      사용할 수 있습니다.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 로그인 알림 및 보안 설정 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-6">
          <AlertTriangle className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">보안 알림</h2>
            <p className="text-sm text-gray-600">
              의심스러운 활동에 대한 알림을 설정하세요
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <NotificationToggle
            label="새로운 로그인 알림"
            description="새로운 기기나 위치에서 로그인할 때 이메일로 알림"
            checked={loginAlerts}
            onChange={setLoginAlerts}
          />

          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">세션 만료 시간</h4>
                <p className="text-sm text-gray-500">
                  비활성 상태로 유지될 최대 시간
                </p>
              </div>
              <select
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="15">15분</option>
                <option value="30">30분</option>
                <option value="60">1시간</option>
                <option value="120">2시간</option>
                <option value="480">8시간</option>
                <option value="1440">24시간</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleSaveSecuritySettings}
            disabled={saveStatus === "saving"}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              saveStatus === "saving"
                ? "bg-gray-400 text-white cursor-not-allowed"
                : saveStatus === "saved"
                ? "bg-green-600 text-white"
                : saveStatus === "error"
                ? "bg-red-600 text-white"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {saveStatus === "saving" && "저장 중..."}
            {saveStatus === "saved" && "저장 완료!"}
            {saveStatus === "error" && "저장 실패"}
            {saveStatus === "idle" && "설정 저장"}
          </button>
        </div>
      </div>

      {/* 로그인 기록 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Clock className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">로그인 기록</h2>
            <p className="text-sm text-gray-600">
              최근 계정 접근 활동을 확인하세요
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {loginHistory.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Smartphone className="h-5 w-5 text-gray-600" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900">
                      {session.device}
                    </h4>
                    {session.current && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        현재 세션
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{session.location}</span>
                    </div>
                    <span>IP: {session.ip}</span>
                    <span>{session.time}</span>
                    <span
                      className={`font-medium ${getStatusColor(
                        session.status
                      )}`}
                    >
                      {getStatusText(session.status)}
                    </span>
                  </div>
                </div>
              </div>

              {!session.current && (
                <button
                  onClick={() => handleRevokeSession(session.id)}
                  className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 border border-red-300 rounded hover:bg-red-50"
                >
                  세션 종료
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">보안 팁</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              • 알 수 없는 로그인 기록이 있다면 즉시 비밀번호를 변경하세요
            </li>
            <li>• 공용 컴퓨터에서는 로그아웃을 잊지 마세요</li>
            <li>• 의심스러운 활동이 발견되면 고객센터로 연락하세요</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
