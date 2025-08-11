"use client";

import { useState } from "react";
import { Palette, Sun, Moon, Monitor, Check } from "lucide-react";

const ThemeSettings = () => {
  const [themeSettings, setThemeSettings] = useState({
    mode: "light", // light, dark, system
    colorScheme: "blue", // blue, green, purple, orange
    fontSize: "medium", // small, medium, large
    compactMode: false,
    highContrast: false,
    reducedMotion: false,
  });

  const [saveStatus, setSaveStatus] = useState("idle");

  const themeOptions = [
    {
      value: "light",
      label: "라이트 모드",
      description: "밝은 배경의 기본 테마",
      icon: Sun,
      preview: "bg-white border-gray-200",
    },
    {
      value: "dark",
      label: "다크 모드",
      description: "어둡고 편안한 테마",
      icon: Moon,
      preview: "bg-gray-900 border-gray-700",
    },
    {
      value: "system",
      label: "시스템 설정",
      description: "운영체제 설정에 맞춤",
      icon: Monitor,
      preview: "bg-gradient-to-r from-white to-gray-900 border-gray-400",
    },
  ];

  const colorSchemes = [
    {
      value: "blue",
      label: "블루",
      primary: "bg-blue-600",
      secondary: "bg-blue-100",
      colors: ["bg-blue-600", "bg-blue-500", "bg-blue-400", "bg-blue-300"],
    },
    {
      value: "green",
      label: "그린",
      primary: "bg-green-600",
      secondary: "bg-green-100",
      colors: ["bg-green-600", "bg-green-500", "bg-green-400", "bg-green-300"],
    },
    {
      value: "purple",
      label: "퍼플",
      primary: "bg-purple-600",
      secondary: "bg-purple-100",
      colors: [
        "bg-purple-600",
        "bg-purple-500",
        "bg-purple-400",
        "bg-purple-300",
      ],
    },
    {
      value: "orange",
      label: "오렌지",
      primary: "bg-orange-600",
      secondary: "bg-orange-100",
      colors: [
        "bg-orange-600",
        "bg-orange-500",
        "bg-orange-400",
        "bg-orange-300",
      ],
    },
  ];

  const fontSizes = [
    { value: "small", label: "작게", description: "14px", preview: "text-sm" },
    {
      value: "medium",
      label: "보통",
      description: "16px",
      preview: "text-base",
    },
    { value: "large", label: "크게", description: "18px", preview: "text-lg" },
  ];

  const handleThemeChange = (key, value) => {
    setThemeSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveSettings = async () => {
    setSaveStatus("saving");

    try {
      // 테마 설정 저장 API 호출 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 실제로는 여기서 CSS 변수나 Tailwind 클래스를 업데이트
      document.documentElement.setAttribute("data-theme", themeSettings.mode);
      document.documentElement.setAttribute(
        "data-color-scheme",
        themeSettings.colorScheme
      );

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

  const previewColors = colorSchemes.find(
    (scheme) => scheme.value === themeSettings.colorScheme
  );

  return (
    <div className="space-y-8">
      {/* 테마 모드 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Palette className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">테마 설정</h2>
            <p className="text-sm text-gray-600">
              화면 모드와 색상 테마를 선택하세요
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* 화면 모드 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              화면 모드
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleThemeChange("mode", option.value)}
                  className={`relative p-4 border-2 rounded-lg transition-all ${
                    themeSettings.mode === option.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`w-full h-20 rounded mb-3 border ${option.preview}`}
                  >
                    <div className="p-2">
                      <option.icon className="h-4 w-4 text-gray-600" />
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">
                      {option.label}
                    </div>
                    <div className="text-sm text-gray-500">
                      {option.description}
                    </div>
                  </div>
                  {themeSettings.mode === option.value && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 색상 스킴 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              색상 테마
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {colorSchemes.map((scheme) => (
                <button
                  key={scheme.value}
                  onClick={() => handleThemeChange("colorScheme", scheme.value)}
                  className={`relative p-4 border-2 rounded-lg transition-all ${
                    themeSettings.colorScheme === scheme.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex space-x-1 mb-3">
                    {scheme.colors.map((color, index) => (
                      <div key={index} className={`w-6 h-6 rounded ${color}`} />
                    ))}
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">
                      {scheme.label}
                    </div>
                  </div>
                  {themeSettings.colorScheme === scheme.value && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 글꼴 및 표시 설정 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Monitor className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">표시 설정</h2>
            <p className="text-sm text-gray-600">
              글꼴 크기와 레이아웃을 조정하세요
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* 글꼴 크기 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              글꼴 크기
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {fontSizes.map((size) => (
                <button
                  key={size.value}
                  onClick={() => handleThemeChange("fontSize", size.value)}
                  className={`relative p-4 border-2 rounded-lg transition-all ${
                    themeSettings.fontSize === size.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className={`mb-2 ${size.preview} font-medium`}>
                    예시 텍스트
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">
                      {size.label}
                    </div>
                    <div className="text-sm text-gray-500">
                      {size.description}
                    </div>
                  </div>
                  {themeSettings.fontSize === size.value && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 기타 설정 */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">컴팩트 모드</h4>
                <p className="text-sm text-gray-500">
                  요소 간 간격을 줄여 더 많은 내용을 표시
                </p>
              </div>
              <button
                onClick={() =>
                  handleThemeChange("compactMode", !themeSettings.compactMode)
                }
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  themeSettings.compactMode ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    themeSettings.compactMode
                      ? "translate-x-5"
                      : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">고대비 모드</h4>
                <p className="text-sm text-gray-500">
                  시각적 접근성을 위한 고대비 색상
                </p>
              </div>
              <button
                onClick={() =>
                  handleThemeChange("highContrast", !themeSettings.highContrast)
                }
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  themeSettings.highContrast ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    themeSettings.highContrast
                      ? "translate-x-5"
                      : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">애니메이션 줄이기</h4>
                <p className="text-sm text-gray-500">
                  화면 전환 효과와 애니메이션을 최소화
                </p>
              </div>
              <button
                onClick={() =>
                  handleThemeChange(
                    "reducedMotion",
                    !themeSettings.reducedMotion
                  )
                }
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  themeSettings.reducedMotion ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    themeSettings.reducedMotion
                      ? "translate-x-5"
                      : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 테마 미리보기 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">미리보기</h3>
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4
                className={`font-medium ${previewColors?.primary.replace(
                  "bg-",
                  "text-"
                )}`}
              >
                예시 제목
              </h4>
              <div
                className={`px-3 py-1 rounded-full text-sm text-white ${previewColors?.primary}`}
              >
                버튼
              </div>
            </div>
            <div
              className={`text-gray-600 ${
                themeSettings.fontSize === "small"
                  ? "text-sm"
                  : themeSettings.fontSize === "large"
                  ? "text-lg"
                  : "text-base"
              }`}
            >
              이것은 선택한 설정이 적용된 예시 텍스트입니다. 글꼴 크기와 색상이
              어떻게 보이는지 확인해보세요.
            </div>
            <div
              className={`inline-block px-3 py-1 rounded ${
                previewColors?.secondary
              } ${previewColors?.primary.replace("bg-", "text-")}`}
            >
              예시 태그
            </div>
          </div>
        </div>
      </div>

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
          <Palette className="h-4 w-4" />
          <span>
            {saveStatus === "saving" && "적용 중..."}
            {saveStatus === "saved" && "적용 완료!"}
            {saveStatus === "error" && "적용 실패"}
            {saveStatus === "idle" && "테마 적용"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ThemeSettings;
