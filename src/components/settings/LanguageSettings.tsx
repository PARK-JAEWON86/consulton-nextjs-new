"use client";

import { useState } from "react";
import { Globe, Check, Download } from "lucide-react";

const LanguageSettings = () => {
  const [languageSettings, setLanguageSettings] = useState({
    primaryLanguage: "ko",
    secondaryLanguage: "en",
    autoTranslate: true,
    translateConsultations: true,
    dateFormat: "YYYY-MM-DD",
    timeFormat: "24h",
    currency: "KRW",
    timezone: "Asia/Seoul",
  });

  const [saveStatus, setSaveStatus] = useState("idle");

  const languages = [
    {
      code: "ko",
      name: "한국어",
      nativeName: "한국어",
      flag: "🇰🇷",
      coverage: 100,
    },
    {
      code: "en",
      name: "영어",
      nativeName: "English",
      flag: "🇺🇸",
      coverage: 100,
    },
    {
      code: "ja",
      name: "일본어",
      nativeName: "日本語",
      flag: "🇯🇵",
      coverage: 95,
    },
    {
      code: "zh",
      name: "중국어",
      nativeName: "中文",
      flag: "🇨🇳",
      coverage: 90,
    },
    {
      code: "es",
      name: "스페인어",
      nativeName: "Español",
      flag: "🇪🇸",
      coverage: 85,
    },
    {
      code: "fr",
      name: "프랑스어",
      nativeName: "Français",
      flag: "🇫🇷",
      coverage: 80,
    },
    {
      code: "de",
      name: "독일어",
      nativeName: "Deutsch",
      flag: "🇩🇪",
      coverage: 75,
    },
    {
      code: "ru",
      name: "러시아어",
      nativeName: "Русский",
      flag: "🇷🇺",
      coverage: 70,
    },
  ];

  const dateFormats = [
    {
      value: "YYYY-MM-DD",
      label: "2024-01-15",
      description: "ISO 8601 (국제 표준)",
    },
    { value: "MM/DD/YYYY", label: "01/15/2024", description: "미국 형식" },
    { value: "DD/MM/YYYY", label: "15/01/2024", description: "유럽 형식" },
    {
      value: "YYYY년 MM월 DD일",
      label: "2024년 01월 15일",
      description: "한국 형식",
    },
  ];

  const timeFormats = [
    { value: "24h", label: "14:30", description: "24시간 형식" },
    { value: "12h", label: "2:30 PM", description: "12시간 형식 (AM/PM)" },
  ];

  const currencies = [
    { value: "KRW", label: "원 (₩)", country: "대한민국" },
    { value: "USD", label: "달러 ($)", country: "미국" },
    { value: "EUR", label: "유로 (€)", country: "유럽연합" },
    { value: "JPY", label: "엔 (¥)", country: "일본" },
    { value: "CNY", label: "위안 (¥)", country: "중국" },
  ];

  const timezones = [
    { value: "Asia/Seoul", label: "서울 (GMT+9)", country: "대한민국" },
    { value: "Asia/Tokyo", label: "도쿄 (GMT+9)", country: "일본" },
    { value: "Asia/Shanghai", label: "상하이 (GMT+8)", country: "중국" },
    { value: "America/New_York", label: "뉴욕 (GMT-5)", country: "미국 동부" },
    {
      value: "America/Los_Angeles",
      label: "로스앤젤레스 (GMT-8)",
      country: "미국 서부",
    },
    { value: "Europe/London", label: "런던 (GMT+0)", country: "영국" },
    { value: "Europe/Paris", label: "파리 (GMT+1)", country: "프랑스" },
  ];

  const handleSettingChange = (key, value) => {
    setLanguageSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveSettings = async () => {
    setSaveStatus("saving");

    try {
      // 언어 설정 저장 API 호출 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 실제로는 여기서 i18n 설정을 업데이트
      localStorage.setItem("language", languageSettings.primaryLanguage);

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

  const handleDownloadLanguagePack = async (languageCode) => {
    try {
      // 언어팩 다운로드 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert(
        `${
          languages.find((lang) => lang.code === languageCode)?.name
        } 언어팩이 다운로드되었습니다.`
      );
    } catch (error) {
      alert("언어팩 다운로드에 실패했습니다.");
    }
  };

  const primaryLang = languages.find(
    (lang) => lang.code === languageSettings.primaryLanguage
  );
  const secondaryLang = languages.find(
    (lang) => lang.code === languageSettings.secondaryLanguage
  );

  return (
    <div className="space-y-8">
      {/* 주 언어 설정 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Globe className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">언어 설정</h2>
            <p className="text-sm text-gray-600">
              인터페이스와 콘텐츠 언어를 선택하세요
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* 주 언어 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              주 사용 언어
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {languages.slice(0, 6).map((language) => (
                <button
                  key={language.code}
                  onClick={() =>
                    handleSettingChange("primaryLanguage", language.code)
                  }
                  className={`relative p-4 border-2 rounded-lg transition-all text-left ${
                    languageSettings.primaryLanguage === language.code
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{language.flag}</span>
                    <div>
                      <div className="font-medium text-gray-900">
                        {language.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {language.nativeName}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${language.coverage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">
                      {language.coverage}%
                    </span>
                  </div>

                  {languageSettings.primaryLanguage === language.code && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 보조 언어 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              보조 언어 (번역용)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {languages
                .filter(
                  (lang) => lang.code !== languageSettings.primaryLanguage
                )
                .map((language) => (
                  <button
                    key={language.code}
                    onClick={() =>
                      handleSettingChange("secondaryLanguage", language.code)
                    }
                    className={`relative p-3 border-2 rounded-lg transition-all text-left ${
                      languageSettings.secondaryLanguage === language.code
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{language.flag}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {language.name}
                        </div>
                      </div>
                    </div>

                    {languageSettings.secondaryLanguage === language.code && (
                      <div className="absolute top-1 right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="h-2 w-2 text-white" />
                      </div>
                    )}
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* 번역 설정 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Globe className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">번역 설정</h2>
            <p className="text-sm text-gray-600">자동 번역 기능을 설정하세요</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">자동 번역</h4>
              <p className="text-sm text-gray-500">
                외국어 콘텐츠를 자동으로 {primaryLang?.name}로 번역
              </p>
            </div>
            <button
              onClick={() =>
                handleSettingChange(
                  "autoTranslate",
                  !languageSettings.autoTranslate
                )
              }
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                languageSettings.autoTranslate ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  languageSettings.autoTranslate
                    ? "translate-x-5"
                    : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">상담 내용 번역</h4>
              <p className="text-sm text-gray-500">
                실시간 상담 중 메시지를 자동으로 번역
              </p>
            </div>
            <button
              onClick={() =>
                handleSettingChange(
                  "translateConsultations",
                  !languageSettings.translateConsultations
                )
              }
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                languageSettings.translateConsultations
                  ? "bg-blue-600"
                  : "bg-gray-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  languageSettings.translateConsultations
                    ? "translate-x-5"
                    : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {languageSettings.autoTranslate && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg">{primaryLang?.flag}</span>
              <span className="text-sm font-medium text-blue-900">
                {primaryLang?.name}
              </span>
              <span className="text-blue-600">←→</span>
              <span className="text-lg">{secondaryLang?.flag}</span>
              <span className="text-sm font-medium text-blue-900">
                {secondaryLang?.name}
              </span>
            </div>
            <p className="text-sm text-blue-800">
              자동 번역이 활성화되어 있습니다. 번역 품질은 언어별로 다를 수
              있습니다.
            </p>
          </div>
        )}
      </div>

      {/* 지역 설정 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Globe className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">지역 설정</h2>
            <p className="text-sm text-gray-600">
              날짜, 시간, 통화 형식을 설정하세요
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 날짜 형식 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              날짜 형식
            </label>
            <div className="space-y-2">
              {dateFormats.map((format) => (
                <label
                  key={format.value}
                  className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name="dateFormat"
                    value={format.value}
                    checked={languageSettings.dateFormat === format.value}
                    onChange={(e) =>
                      handleSettingChange("dateFormat", e.target.value)
                    }
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-medium text-gray-900">
                      {format.label}
                    </div>
                    <div className="text-sm text-gray-500">
                      {format.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* 시간 형식 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              시간 형식
            </label>
            <div className="space-y-2">
              {timeFormats.map((format) => (
                <label
                  key={format.value}
                  className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name="timeFormat"
                    value={format.value}
                    checked={languageSettings.timeFormat === format.value}
                    onChange={(e) =>
                      handleSettingChange("timeFormat", e.target.value)
                    }
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-medium text-gray-900">
                      {format.label}
                    </div>
                    <div className="text-sm text-gray-500">
                      {format.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* 통화 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              통화
            </label>
            <select
              value={languageSettings.currency}
              onChange={(e) => handleSettingChange("currency", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              {currencies.map((currency) => (
                <option key={currency.value} value={currency.value}>
                  {currency.label} - {currency.country}
                </option>
              ))}
            </select>
          </div>

          {/* 시간대 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              시간대
            </label>
            <select
              value={languageSettings.timezone}
              onChange={(e) => handleSettingChange("timezone", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              {timezones.map((timezone) => (
                <option key={timezone.value} value={timezone.value}>
                  {timezone.label} - {timezone.country}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 언어팩 관리 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Download className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">언어팩 관리</h2>
            <p className="text-sm text-gray-600">
              오프라인 사용을 위한 언어팩을 다운로드하세요
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {languages.map((language) => (
            <div
              key={language.code}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">{language.flag}</span>
                <div>
                  <div className="font-medium text-gray-900">
                    {language.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    완성도: {language.coverage}%
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDownloadLanguagePack(language.code)}
                className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
              >
                <Download className="h-3 w-3" />
                <span>다운로드</span>
              </button>
            </div>
          ))}
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
          <Globe className="h-4 w-4" />
          <span>
            {saveStatus === "saving" && "저장 중..."}
            {saveStatus === "saved" && "저장 완료!"}
            {saveStatus === "error" && "저장 실패"}
            {saveStatus === "idle" && "언어 설정 저장"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default LanguageSettings;
