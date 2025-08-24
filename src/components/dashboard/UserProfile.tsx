"use client";

import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit3,
  Save,
  X,
  Camera,
  Star,
  Target,
  TrendingUp,
  MessageCircle,
  Clock,
  CheckCircle,
} from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string;
  credits: number;
  expertLevel: string;
  role?: 'expert' | 'client' | 'admin';
  // 프로필 관련 추가 필드들
  phone?: string;
  location?: string;
  birthDate?: string;
  interests?: string[];
  bio?: string;
  profileImage?: string | null;
  totalConsultations?: number;
  favoriteExperts?: number;
  joinDate?: string;
}

interface AppState {
  isAuthenticated: boolean;
  user: User | null;
}

interface UserData {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  birthDate?: string;
  interests?: string[];
  bio?: string;
  profileImage?: string | null;
  totalConsultations?: number;
  favoriteExperts?: number;
  joinDate?: string;
}

interface UserProfileProps {
  userData?: UserData;
  onSave?: (data: UserData) => void;
}

const UserProfile = ({ userData, onSave }: UserProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle");
  const [appState, setAppState] = useState<AppState>({
    isAuthenticated: false,
    user: null
  });

  // 앱 상태 로드
  useEffect(() => {
    const loadAppState = async () => {
      try {
        const response = await fetch('/api/app-state');
        const result = await response.json();
        if (result.success) {
          setAppState({
            isAuthenticated: result.data.isAuthenticated,
            user: result.data.user
          });
        }
      } catch (error) {
        console.error('앱 상태 로드 실패:', error);
      }
    };

    loadAppState();
  }, []);

  // 사용자 프로필 데이터 로드
  useEffect(() => {
    const loadUserProfile = async () => {
      console.log('loadUserProfile 실행:', { 
        isAuthenticated: appState.isAuthenticated, 
        user: appState.user 
      });
      
      if (appState.isAuthenticated && appState.user) {
        try {
          // 실제로는 사용자 프로필 API 호출
          // const response = await fetch(`/api/users/${appState.user.id}/profile`);
          // const profileResult = await response.json();
          // if (profileResult.success) {
          //   setProfileData(prev => ({ ...prev, ...profileResult.data }));
          // }
          
          // 임시로 더미 데이터 사용 (실제 구현 시 제거)
          const dummyProfileData = {
            name: appState.user.name || "테스트 사용자",
            email: appState.user.email || "test@example.com",
            phone: "010-1234-5678",
            location: "서울특별시 강남구",
            birthDate: "1990-05-15",
            interests: ["심리상담", "진로상담", "창업상담"],
            bio: "전문가들과의 상담을 통해 개인적 성장을 추구합니다.",
            totalConsultations: 12,
            favoriteExperts: 5,
            joinDate: "2024-01-15"
          };
          
          console.log('설정할 프로필 데이터:', dummyProfileData);
          setProfileData(dummyProfileData);
        } catch (error) {
          console.error('사용자 프로필 로드 실패:', error);
        }
      }
    };

    loadUserProfile();
  }, [appState.isAuthenticated, appState.user]);
  
  const [profileData, setProfileData] = useState<UserData>({
    name: "사용자", // 기본값
    email: "user@example.com", // 기본값
    phone: "010-0000-0000", // 기본값
    location: "서울특별시", // 기본값
    birthDate: "1990-01-01", // 기본값
    interests: ["심리상담", "진로상담"], // 기본값
    bio: "전문가들과의 상담을 통해 성장하고 있습니다.",
    profileImage: null,
    totalConsultations: 0,
    favoriteExperts: 0,
    joinDate: new Date().toISOString().split('T')[0],
  });

  const handleInputChange = (field: keyof UserData, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setProfileData((prev) => ({
      ...prev,
      interests: prev.interests?.includes(interest)
        ? prev.interests.filter((i: string) => i !== interest)
        : [...(prev.interests || []), interest],
    }));
  };

  const handleSaveProfile = async () => {
    setSaveStatus("saving");
    try {
      // 실제 API 호출
      if (appState.user) {
        const response = await fetch(`/api/users/${appState.user.id}/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(profileData)
        });
        
        if (!response.ok) {
          throw new Error('프로필 저장 실패');
        }
        
        const result = await response.json();
        if (result.success) {
          onSave?.(profileData);
          setSaveStatus("success");
          setIsEditing(false);
          setTimeout(() => setSaveStatus("idle"), 2000);
        } else {
          throw new Error(result.message || '프로필 저장 실패');
        }
      }
    } catch (error) {
      console.error('프로필 저장 실패:', error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSaveStatus("idle");
    // 원래 데이터로 복원 - 실제 사용자 데이터 사용
    if (appState.user) {
      setProfileData({
        name: appState.user.name || "테스트 사용자",
        email: appState.user.email || "test@example.com",
        phone: "010-1234-5678",
        location: "서울특별시 강남구",
        birthDate: "1990-05-15",
        interests: ["심리상담", "진로상담", "창업상담"],
        bio: "전문가들과의 상담을 통해 개인적 성장을 추구합니다.",
        profileImage: null,
        totalConsultations: 12,
        favoriteExperts: 5,
        joinDate: "2024-01-15"
      });
    }
  };

  const availableInterests = [
    "진로상담",
    "심리상담",
    "재무상담",
    "법률상담",
    "건강상담",
    "교육상담",
    "부동산상담",
    "IT상담",
    "창업상담",
    "인간관계",
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR");
  };

  const calculateMembershipDuration = () => {
    const joinDate = new Date(profileData.joinDate || "");
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - joinDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays}일`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months}개월`;
    } else {
      const years = Math.floor(diffDays / 365);
      const months = Math.floor((diffDays % 365) / 30);
      return months > 0 ? `${years}년 ${months}개월` : `${years}년`;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <User className="h-5 w-5 text-blue-600 mr-2" />
            사용자 프로필
          </h3>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit3 className="h-4 w-4" />
              <span>편집</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <X className="h-4 w-4" />
                <span>취소</span>
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={saveStatus === "saving"}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{saveStatus === "saving" ? "저장 중..." : "저장"}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* 상태 메시지 */}
        {saveStatus === "success" && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800">
                프로필이 성공적으로 저장되었습니다!
              </span>
            </div>
          </div>
        )}

        {saveStatus === "error" && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <X className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-red-800">
                저장 중 오류가 발생했습니다. 다시 시도해주세요.
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽: 기본 정보 */}
          <div className="lg:col-span-2">
            {/* 프로필 사진 및 기본 정보 */}
            <div className="flex items-start space-x-6 mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                  {profileData.profileImage ? (
                    <img
                      src={profileData.profileImage}
                      alt="프로필"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        이름
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        자기소개
                      </label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) =>
                          handleInputChange("bio", e.target.value)
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {profileData.name}
                    </h2>
                    <p className="text-gray-600 mb-4">{profileData.bio}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        가입일: {formatDate(profileData.joinDate || "")} (
                        {calculateMembershipDuration()} 활동)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 연락처 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="h-4 w-4 inline mr-1" />
                  이메일
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="h-4 w-4 inline mr-1" />
                  전화번호
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  지역
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.location}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  생년월일
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={profileData.birthDate}
                    onChange={(e) =>
                      handleInputChange("birthDate", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">
                    {formatDate(profileData.birthDate || "")}
                  </p>
                )}
              </div>
            </div>

            {/* 관심 분야 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Target className="h-4 w-4 inline mr-1" />
                관심 분야
              </label>
              {isEditing ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableInterests.map((interest) => (
                    <label
                      key={interest}
                      className="flex items-center space-x-2 p-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={profileData.interests?.includes(interest)}
                        onChange={() => handleInterestToggle(interest)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{interest}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profileData.interests?.map((interest, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 오른쪽: 통계 정보 */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                활동 통계
              </h4>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">
                      총 상담 수
                    </span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {profileData.totalConsultations}회
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-700">
                      즐겨찾는 전문가
                    </span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {profileData.favoriteExperts}명
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">
                      활동 기간
                    </span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {calculateMembershipDuration()}
                  </span>
                </div>
              </div>

              {/* 레벨 시스템 제거 - 일반 사용자에게는 불필요 */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
