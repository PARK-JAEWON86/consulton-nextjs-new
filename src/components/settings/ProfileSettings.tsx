"use client";

import { useState } from "react";
import { User, Camera, Save, AlertCircle, Check, Plus, X, Target, Brain, DollarSign, Scale, BookOpen, Heart, Users, Briefcase, Code, Palette, Languages, Music, Trophy, Plane, ChefHat, Scissors, PawPrint, Sprout, TrendingUp, Receipt, Building2, Baby, School, UserCheck } from "lucide-react";
import { getExtendedCategories } from "@/data/dummy/categories";

interface Profile {
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  phone: string;
  bio: string;
  location: string;
  profileImage: File | null;
  interestedCategories: string[];
}

type SaveStatus = "idle" | "saving" | "saved" | "error";

const ProfileSettings = () => {
  const [profile, setProfile] = useState<Profile>({
    firstName: "철수",
    lastName: "김",
    displayName: "김철수",
    email: "user@example.com",
    phone: "010-1234-5678",
    bio: "안녕하세요! 다양한 분야의 전문가와 상담을 통해 문제를 해결하고 있습니다.",
    location: "서울, 대한민국",
    profileImage: null,
    interestedCategories: ["psychology", "career", "finance"],
  });

  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [customCategory, setCustomCategory] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  // 확장된 카테고리 목록 (아이콘 포함)
  const extendedCategories = getExtendedCategories({
    Target, Brain, DollarSign, Scale, BookOpen, Heart, Users, Briefcase, 
    Code, Palette, Languages, Music, Trophy, Plane, ChefHat, Scissors, 
    PawPrint, Sprout, TrendingUp, Receipt, Building2, Baby, School, UserCheck
  });

  const handleInputChange = (field: keyof Profile, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 관심 카테고리 추가
  const handleAddCategory = (categoryId: string) => {
    if (!profile.interestedCategories.includes(categoryId)) {
      setProfile((prev) => ({
        ...prev,
        interestedCategories: [...prev.interestedCategories, categoryId],
      }));
    }
  };

  // 관심 카테고리 제거
  const handleRemoveCategory = (categoryId: string) => {
    setProfile((prev) => ({
      ...prev,
      interestedCategories: prev.interestedCategories.filter((id) => id !== categoryId),
    }));
  };

  // 커스텀 카테고리 추가
  const handleAddCustomCategory = () => {
    if (customCategory.trim() && !profile.interestedCategories.includes(customCategory.trim())) {
      setProfile((prev) => ({
        ...prev,
        interestedCategories: [...prev.interestedCategories, customCategory.trim()],
      }));
      setCustomCategory("");
      setShowCustomInput(false);
    }
  };

  // 카테고리 이름 가져오기 (확장 카테고리에서 찾거나 그대로 반환)
  const getCategoryName = (categoryId: string) => {
    const category = extendedCategories.find((c) => c.id === categoryId);
    return category ? category.name : categoryId;
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // 2MB 제한
        alert("이미지 크기는 2MB 이하여야 합니다.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
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



  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          프로필 설정
        </h2>
        <p className="text-gray-600 mb-6">
          개인 정보를 관리하고 업데이트하세요
        </p>
      </div>

      <div className="space-y-6">
        {/* 프로필 이미지 */}
        <div className="bg-gray-50 rounded-lg p-6">
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
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                <Camera className="h-4 w-4 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                프로필 사진
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                JPG, PNG 파일만 업로드 가능합니다. (최대 2MB)
              </p>
              <button
                onClick={() =>
                  (document.querySelector('input[type="file"]') as HTMLInputElement | null)?.click()
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                사진 변경
              </button>
            </div>
          </div>
        </div>

        {/* 기본 정보 및 자기소개 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 기본 정보 */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">기본 정보</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    성
                  </label>
                  <input
                    type="text"
                    value={profile.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이름
                  </label>
                  <input
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  onChange={(e) =>
                    handleInputChange("displayName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이메일
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  전화번호
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  위치
                </label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* 자기소개 */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">자기소개</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  자기소개
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="자신에 대해 간단히 소개해주세요"
                />
              </div>

              {/* 관심 상담분야 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  관심 상담분야
                </label>
                
                {/* 선택된 카테고리 배지 */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {profile.interestedCategories.map((categoryId) => {
                    return (
                      <span
                        key={categoryId}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {getCategoryName(categoryId)}
                        <button
                          onClick={() => handleRemoveCategory(categoryId)}
                          className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-200 text-blue-600 hover:bg-blue-300 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    );
                  })}
                  {profile.interestedCategories.length === 0 && (
                    <span className="text-sm text-gray-500">선택된 관심분야가 없습니다</span>
                  )}
                </div>

                {/* 카테고리 추가 드롭다운 */}
                <div className="space-y-3">
                  <select
                    onChange={(e) => {
                      if (e.target.value === "custom") {
                        setShowCustomInput(true);
                      } else if (e.target.value) {
                        handleAddCategory(e.target.value);
                        e.target.value = "";
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      관심분야 추가하기
                    </option>
                    {extendedCategories
                      .filter((category) => !profile.interestedCategories.includes(category.id))
                      .map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name} - {category.description}
                        </option>
                      ))}
                    <option value="custom">직접 입력하기</option>
                  </select>

                  {/* 직접 입력 필드 */}
                  {showCustomInput && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        placeholder="관심분야를 직접 입력하세요"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleAddCustomCategory();
                          }
                        }}
                      />
                      <button
                        onClick={handleAddCustomCategory}
                        className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setShowCustomInput(false);
                          setCustomCategory("");
                        }}
                        className="px-3 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors text-sm"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
                
                <p className="text-xs text-gray-500 mt-2">
                  관심 있는 상담분야를 선택하면 관련 전문가를 더 쉽게 찾을 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
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
                <span>저장</span>
              </>
            )}
          </button>
        </div>

        {/* 상태 메시지 */}
        {saveStatus === "saved" && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2 text-green-800">
              <Check className="h-5 w-5" />
              <span>프로필이 성공적으로 저장되었습니다.</span>
            </div>
          </div>
        )}

        {saveStatus === "error" && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <span>저장에 실패했습니다. 다시 시도해주세요.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;
