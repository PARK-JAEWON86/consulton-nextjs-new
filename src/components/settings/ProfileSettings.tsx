"use client";

import { useState } from "react";
import { User, Camera, Save, AlertCircle } from "lucide-react";

const ProfileSettings = () => {
  const [profile, setProfile] = useState({
    firstName: "철수",
    lastName: "김",
    displayName: "김철수",
    email: "user@example.com",
    phone: "010-1234-5678",
    bio: "안녕하세요! 다양한 분야의 전문가와 상담을 통해 문제를 해결하고 있습니다.",
    location: "서울, 대한민국",
    timezone: "Asia/Seoul",
    profileImage: null,
  });

  const [saveStatus, setSaveStatus] = useState("idle"); // idle, saving, saved, error
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // 2MB 제한
        alert("이미지 크기는 2MB 이하여야 합니다.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setProfile((prev) => ({
          ...prev,
          profileImage: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
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

  const timezones = [
    { value: "Asia/Seoul", label: "서울 (GMT+9)" },
    { value: "Asia/Tokyo", label: "도쿄 (GMT+9)" },
    { value: "America/New_York", label: "뉴욕 (GMT-5)" },
    { value: "Europe/London", label: "런던 (GMT+0)" },
    { value: "Asia/Shanghai", label: "상하이 (GMT+8)" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-3 mb-6">
        <User className="h-6 w-6 text-blue-600" />
        <div>
          <h2 className="text-xl font-semibold text-gray-900">프로필 설정</h2>
          <p className="text-sm text-gray-600">
            개인 정보를 관리하고 업데이트하세요
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* 프로필 이미지 */}
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center overflow-hidden">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="프로필"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-2xl font-medium">
                  {profile.firstName.charAt(0)}
                </span>
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-lg cursor-pointer hover:bg-gray-50">
              <Camera className="h-4 w-4 text-gray-600" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">프로필 사진</h3>
            <p className="text-sm text-gray-500">JPG, PNG 파일 (최대 2MB)</p>
          </div>
        </div>

        {/* 기본 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              성 *
            </label>
            <input
              type="text"
              value={profile.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이름 *
            </label>
            <input
              type="text"
              value={profile.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            표시 이름
          </label>
          <input
            type="text"
            value={profile.displayName}
            onChange={(e) => handleInputChange("displayName", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="다른 사용자에게 표시될 이름"
          />
          <p className="text-sm text-gray-500 mt-1">
            상담 시 전문가에게 표시되는 이름입니다.
          </p>
        </div>

        {/* 연락처 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이메일 주소
            </label>
            <input
              type="email"
              value={profile.email}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
              disabled
            />
            <p className="text-sm text-gray-500 mt-1">
              이메일은 계정 설정에서 변경할 수 있습니다.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              전화번호
            </label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="010-0000-0000"
            />
          </div>
        </div>

        {/* 자기소개 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            자기소개
          </label>
          <textarea
            value={profile.bio}
            onChange={(e) => handleInputChange("bio", e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="간단한 자기소개를 작성해주세요"
            maxLength={500}
          />
          <div className="flex justify-between mt-1">
            <p className="text-sm text-gray-500">
              전문가에게 표시되는 간단한 소개입니다.
            </p>
            <span className="text-sm text-gray-400">
              {profile.bio.length}/500
            </span>
          </div>
        </div>

        {/* 위치 및 시간대 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              위치
            </label>
            <input
              type="text"
              value={profile.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="도시, 국가"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              시간대
            </label>
            <select
              value={profile.timezone}
              onChange={(e) => handleInputChange("timezone", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              {timezones.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 주의사항 */}
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">
                프로필 정보 안내
              </h3>
              <div className="mt-2 text-sm text-amber-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>프로필 정보는 전문가 매칭 시 활용됩니다</li>
                  <li>개인정보는 안전하게 암호화되어 저장됩니다</li>
                  <li>표시 이름과 자기소개는 전문가에게만 공개됩니다</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSave}
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
            <Save className="h-4 w-4" />
            <span>
              {saveStatus === "saving" && "저장 중..."}
              {saveStatus === "saved" && "저장 완료!"}
              {saveStatus === "error" && "저장 실패"}
              {saveStatus === "idle" && "프로필 저장"}
            </span>
          </button>
        </div>

        {/* 성공 메시지 */}
        {saveStatus === "saved" && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  프로필이 성공적으로 업데이트되었습니다.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;
