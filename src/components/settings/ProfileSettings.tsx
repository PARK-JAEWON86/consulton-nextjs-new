"use client";

import { useState } from 'react';
import { User, Camera, Save, AlertCircle, Check } from 'lucide-react';

interface Profile {
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  phone: string;
  bio: string;
  location: string;
  timezone: string;
  profileImage: File | null;
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

const ProfileSettings = () => {
  const [profile, setProfile] = useState<Profile>({
    firstName: '철수',
    lastName: '김',
    displayName: '김철수',
    email: 'user@example.com',
    phone: '010-1234-5678',
    bio: '안녕하세요! 다양한 분야의 전문가와 상담을 통해 문제를 해결하고 있습니다.',
    location: '서울, 대한민국',
    timezone: 'Asia/Seoul',
    profileImage: null
  });

  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (field: keyof Profile, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB 제한
        alert('이미지 크기는 2MB 이하여야 합니다.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
        setProfile(prev => ({
          ...prev,
          profileImage: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    
    try {
      // API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSaveStatus('saved');
      
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    }
  };

  const timezones = [
    { value: 'Asia/Seoul', label: '서울 (GMT+9)' },
    { value: 'Asia/Tokyo', label: '도쿄 (GMT+9)' },
    { value: 'America/New_York', label: '뉴욕 (GMT-5)' },
    { value: 'Europe/London', label: '런던 (GMT+0)' },
    { value: 'Asia/Shanghai', label: '상하이 (GMT+8)' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">프로필 설정</h2>
        <p className="text-gray-600 mb-6">개인 정보를 관리하고 업데이트하세요</p>
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">프로필 사진</h3>
              <p className="text-sm text-gray-600 mb-3">
                JPG, PNG 파일만 업로드 가능합니다. (최대 2MB)
              </p>
              <button
                onClick={() => document.querySelector('input[type="file"]')?.click()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                사진 변경
              </button>
            </div>
          </div>
        </div>

        {/* 기본 정보 */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">기본 정보</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                성
              </label>
              <input
                type="text"
                value={profile.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
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
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                표시 이름
              </label>
              <input
                type="text"
                value={profile.displayName}
                onChange={(e) => handleInputChange('displayName', e.target.value)}
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
                onChange={(e) => handleInputChange('phone', e.target.value)}
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
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 자기소개 */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">자기소개</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              자기소개
            </label>
            <textarea
              value={profile.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="자신에 대해 간단히 소개해주세요"
            />
          </div>
        </div>

        {/* 시간대 설정 */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">시간대 설정</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              시간대
            </label>
            <select
              value={profile.timezone}
              onChange={(e) => handleInputChange('timezone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {timezones.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {saveStatus === 'saving' ? (
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
        {saveStatus === 'saved' && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2 text-green-800">
              <Check className="h-5 w-5" />
              <span>프로필이 성공적으로 저장되었습니다.</span>
            </div>
          </div>
        )}

        {saveStatus === 'error' && (
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
