"use client";

import { useState } from "react";
import {
  Calendar,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Plus,
} from "lucide-react";

const CalendarIntegration = () => {
  const [connectedCalendars, setConnectedCalendars] = useState([
    {
      id: "google",
      name: "Google Calendar",
      email: "user@gmail.com",
      status: "connected",
      syncEnabled: true,
      color: "#4285f4",
    },
  ]);

  const [availableCalendars] = useState([
    {
      id: "outlook",
      name: "Outlook Calendar",
      icon: "📅",
      description: "Microsoft Outlook 일정과 동기화",
    },
    {
      id: "apple",
      name: "Apple Calendar",
      icon: "🍎",
      description: "Apple 기본 캘린더와 동기화",
    },
    {
      id: "naver",
      name: "Naver Calendar",
      icon: "🟢",
      description: "네이버 캘린더와 동기화",
    },
  ]);

  const handleConnect = async (calendarId) => {
    try {
      // 캘린더 연결 API 호출
      console.log(`Connecting to ${calendarId}`);

      // 연결 성공 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newCalendar = {
        id: calendarId,
        name: availableCalendars.find((cal) => cal.id === calendarId)?.name,
        email: "user@example.com",
        status: "connected",
        syncEnabled: true,
        color: "#" + Math.floor(Math.random() * 16777215).toString(16),
      };

      setConnectedCalendars([...connectedCalendars, newCalendar]);
    } catch (error) {
      console.error("Calendar connection failed:", error);
      alert("캘린더 연결에 실패했습니다.");
    }
  };

  const handleDisconnect = (calendarId) => {
    if (confirm("정말로 캘린더 연결을 해제하시겠습니까?")) {
      setConnectedCalendars(
        connectedCalendars.filter((cal) => cal.id !== calendarId)
      );
    }
  };

  const handleToggleSync = (calendarId) => {
    setConnectedCalendars(
      connectedCalendars.map((cal) =>
        cal.id === calendarId ? { ...cal, syncEnabled: !cal.syncEnabled } : cal
      )
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Calendar className="h-6 w-6 text-blue-600" />
        <div>
          <h2 className="text-xl font-semibold text-gray-900">캘린더 연동</h2>
          <p className="text-sm text-gray-600">
            상담 일정을 외부 캘린더와 동기화하세요
          </p>
        </div>
      </div>

      {/* 연결된 캘린더 목록 */}
      {connectedCalendars.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            연결된 캘린더
          </h3>
          <div className="space-y-4">
            {connectedCalendars.map((calendar) => (
              <div
                key={calendar.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: calendar.color }}
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900">
                          {calendar.name}
                        </h4>
                        {getStatusIcon(calendar.status)}
                      </div>
                      <p className="text-sm text-gray-500">{calendar.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* 동기화 토글 */}
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">동기화</span>
                      <button
                        onClick={() => handleToggleSync(calendar.id)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          calendar.syncEnabled ? "bg-blue-600" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            calendar.syncEnabled
                              ? "translate-x-5"
                              : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    {/* 연결 해제 버튼 */}
                    <button
                      onClick={() => handleDisconnect(calendar.id)}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      연결 해제
                    </button>
                  </div>
                </div>

                {/* 동기화 설정 */}
                {calendar.syncEnabled && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <input
                          type="checkbox"
                          id={`${calendar.id}-upcoming`}
                          defaultChecked
                          className="mr-2"
                        />
                        <label
                          htmlFor={`${calendar.id}-upcoming`}
                          className="text-gray-700"
                        >
                          예정된 상담 일정 동기화
                        </label>
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          id={`${calendar.id}-completed`}
                          defaultChecked
                          className="mr-2"
                        />
                        <label
                          htmlFor={`${calendar.id}-completed`}
                          className="text-gray-700"
                        >
                          완료된 상담 기록 동기화
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 새 캘린더 연결 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          새 캘린더 연결
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableCalendars
            .filter(
              (cal) =>
                !connectedCalendars.find((connected) => connected.id === cal.id)
            )
            .map((calendar) => (
              <div
                key={calendar.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{calendar.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      {calendar.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {calendar.description}
                    </p>
                    <button
                      onClick={() => handleConnect(calendar.id)}
                      className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <Plus className="h-4 w-4" />
                      <span>연결하기</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {availableCalendars.filter(
          (cal) =>
            !connectedCalendars.find((connected) => connected.id === cal.id)
        ).length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>모든 캘린더가 연결되었습니다.</p>
          </div>
        )}
      </div>

      {/* 동기화 설명 */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">캘린더 동기화 정보</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• 상담 예약 시 자동으로 캘린더에 일정이 추가됩니다</li>
          <li>• 상담 시작 30분 전 캘린더 알림이 발송됩니다</li>
          <li>• 상담 완료 후 요약본 링크가 캘린더 일정에 추가됩니다</li>
          <li>• 개인정보는 안전하게 암호화되어 전송됩니다</li>
        </ul>
      </div>
    </div>
  );
};

export default CalendarIntegration;
