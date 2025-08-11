import { useState } from "react";
import {
  User,
  Users,
  Briefcase,
  Star,
  Calendar,
  FileText,
  Upload,
  X,
  Plus,
  Save,
  Edit,
  Camera,
  Award,
  Clock,
  Phone,
  Mail,
  MapPin,
  Globe,
  CheckCircle,
  TrendingUp,
  Target,
  Video,
  MessageCircle,
} from "lucide-react";
import {
  calculateExpertLevel,
  getNextLevelProgress,
  getLevelBadgeStyles,
  getKoreanLevelName,
  calculateCreditsPerMinute,
} from "../../utils/expertLevels";

const ExpertProfile = ({ expertData, onSave }) => {
  const [isEditing, setIsEditing] = useState(!expertData?.isProfileComplete);
  const [profileData, setProfileData] = useState({
    name: expertData?.name || "",
    specialty: expertData?.specialty || "",
    experience: expertData?.experience || "",
    description: expertData?.description || "",
    education: expertData?.education || [""],
    certifications: expertData?.certifications || [""],
    specialties: expertData?.specialties || [""],
    consultationTypes: expertData?.consultationTypes || [],
    languages: expertData?.languages || ["한국어"],
    hourlyRate: expertData?.hourlyRate || "",
    // 레벨 관련 데이터
    totalSessions: expertData?.totalSessions || 0,
    avgRating: expertData?.avgRating || 0,
    availability: expertData?.availability || {
      monday: { available: false, hours: "09:00-18:00" },
      tuesday: { available: false, hours: "09:00-18:00" },
      wednesday: { available: false, hours: "09:00-18:00" },
      thursday: { available: false, hours: "09:00-18:00" },
      friday: { available: false, hours: "09:00-18:00" },
      saturday: { available: false, hours: "09:00-18:00" },
      sunday: { available: false, hours: "09:00-18:00" },
    },
    contactInfo: {
      phone: expertData?.contactInfo?.phone || "",
      email: expertData?.contactInfo?.email || "",
      location: expertData?.contactInfo?.location || "",
      website: expertData?.contactInfo?.website || "",
    },
    profileImage: expertData?.profileImage || null,
    portfolioFiles: expertData?.portfolioFiles || [],
  });

  // 현재 전문가의 레벨 정보 계산 (안전한 기본값 사용)
  const currentLevel = calculateExpertLevel(
    profileData.totalSessions || 0,
    profileData.avgRating || 0
  );
  const nextLevelProgress = getNextLevelProgress(
    profileData.totalSessions || 0,
    profileData.avgRating || 0
  );
  const levelBadgeStyles = getLevelBadgeStyles(currentLevel?.name || "Bronze");
  const creditsPerMinute = calculateCreditsPerMinute(profileData);

  const [dragActive, setDragActive] = useState(false);

  const dayNames = {
    monday: "월요일",
    tuesday: "화요일",
    wednesday: "수요일",
    thursday: "목요일",
    friday: "금요일",
    saturday: "토요일",
    sunday: "일요일",
  };

  const consultationTypeOptions = [
    { id: "video", label: "화상 상담", emoji: "📹" },
    { id: "chat", label: "채팅 상담", emoji: "💬" },
    { id: "voice", label: "음성 상담", emoji: "🎙️" },
  ];

  const handleInputChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setProfileData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setProfileData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleArrayChange = (field, index, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (field) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (field, index) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleConsultationTypeToggle = (typeId) => {
    setProfileData((prev) => ({
      ...prev,
      consultationTypes: prev.consultationTypes.includes(typeId)
        ? prev.consultationTypes.filter((id) => id !== typeId)
        : [...prev.consultationTypes, typeId],
    }));
  };

  const handleAvailabilityChange = (day, field, value) => {
    setProfileData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          [field]: value,
        },
      },
    }));
  };

  const handleFileUpload = (event, type) => {
    const files = Array.from(event.target.files);

    if (type === "profile") {
      const file = files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setProfileData((prev) => ({
            ...prev,
            profileImage: e.target.result,
          }));
        };
        reader.readAsDataURL(file);
      }
    } else if (type === "portfolio") {
      files.forEach((file) => {
        if (
          file.type.startsWith("image/") ||
          file.type === "application/pdf" ||
          file.type.startsWith("application/")
        ) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setProfileData((prev) => ({
              ...prev,
              portfolioFiles: [
                ...prev.portfolioFiles,
                {
                  id: Date.now() + Math.random(),
                  name: file.name,
                  type: file.type,
                  size: file.size,
                  data: e.target.result,
                },
              ],
            }));
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const removePortfolioFile = (fileId) => {
    setProfileData((prev) => ({
      ...prev,
      portfolioFiles: prev.portfolioFiles.filter((file) => file.id !== fileId),
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(
        { target: { files: e.dataTransfer.files } },
        "portfolio"
      );
    }
  };

  const handleSave = () => {
    const updatedData = {
      ...profileData,
      isProfileComplete: true,
    };
    onSave(updatedData);
    setIsEditing(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (!isEditing && expertData?.isProfileComplete) {
    // 프로필 보기 모드
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <User className="h-5 w-5 text-blue-600 mr-2" />
            전문가 프로필
          </h3>
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <Edit className="h-4 w-4 mr-1" />
            편집
          </button>
        </div>

        <div className="p-6">
          {/* 프로필 헤더 */}
          <div className="flex flex-col lg:flex-row lg:items-start space-y-4 lg:space-y-0 lg:space-x-6 mb-8">
            <div className="flex-shrink-0 self-center lg:self-start">
              {profileData.profileImage ? (
                <img
                  src={profileData.profileImage}
                  alt="프로필"
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 shadow-md"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center shadow-md">
                  <User className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>

            <div className="flex-1 text-center lg:text-left">
              {/* 이름과 레벨 배지 */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-3 space-y-2 lg:space-y-0 mb-3">
                <h4 className="text-2xl font-bold text-gray-900">
                  {profileData.name}
                </h4>
                <div
                  className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium self-center lg:self-auto ${levelBadgeStyles.background} ${levelBadgeStyles.textColor}`}
                >
                  <span>{levelBadgeStyles.icon}</span>
                  <span>{getKoreanLevelName(currentLevel.name)}</span>
                </div>
              </div>

              {/* 전문 분야 */}
              <p className="text-lg text-blue-600 font-semibold mb-4">
                {profileData.specialty}
              </p>

              {/* 통계 정보 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center justify-center lg:justify-start space-x-2 p-3 bg-gray-50 rounded-lg">
                  <Briefcase className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    경력 {profileData.experience}년
                  </span>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-2 p-3 bg-gray-50 rounded-lg">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-700">
                    평점 {(profileData.avgRating || 0).toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-2 p-3 bg-gray-50 rounded-lg">
                  <Users className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {profileData.totalSessions || 0}회 상담
                  </span>
                </div>
              </div>

              {/* 분당 요금 */}
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    분당 요금
                  </span>
                  <span className="text-lg font-bold text-blue-600">
                    {creditsPerMinute} 크레딧/분
                  </span>
                </div>
              </div>

              {/* 자기소개 */}
              <div className="text-left">
                <p className="text-gray-700 leading-relaxed">
                  {profileData.description}
                </p>
              </div>
            </div>
          </div>

          {/* 레벨 진행률 정보 */}
          {!nextLevelProgress.isMaxLevel && nextLevelProgress.nextLevel && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6">
              <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                다음 레벨까지의 진행률
              </h5>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    다음 레벨:{" "}
                    {getKoreanLevelName(nextLevelProgress.nextLevel.name)}
                  </span>
                  <span className="font-medium text-blue-600">
                    {Math.round(nextLevelProgress.progress)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${nextLevelProgress.progress}%` }}
                  ></div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Target className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-gray-600">
                      상담 {nextLevelProgress.sessionsNeeded}회 더 필요
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-gray-600">
                      평점 {(nextLevelProgress.ratingNeeded || 0).toFixed(1)} 더
                      필요
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 최고 레벨 달성 메시지 */}
          {nextLevelProgress.isMaxLevel && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 mb-6 border border-yellow-200">
              <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Award className="h-5 w-5 text-yellow-600 mr-2" />
                최고 레벨 달성! 🎉
              </h5>
              <p className="text-sm text-gray-700">
                축하합니다! 최고 레벨인{" "}
                <strong>{getKoreanLevelName(currentLevel.name)}</strong> 레벨에
                도달하셨습니다. 지속적인 우수한 서비스로 고객들에게 최고의
                상담을 제공해주세요.
              </p>
            </div>
          )}

          {/* 전문 정보 섹션 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 전문 분야 및 상담 방식 */}
            <div className="space-y-6">
              <div>
                <h5 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Star className="h-5 w-5 text-blue-600 mr-2" />
                  전문 분야
                </h5>
                <div className="flex flex-wrap gap-2">
                  {profileData.specialties
                    .filter((s) => s)
                    .map((specialty, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium"
                      >
                        {specialty}
                      </span>
                    ))}
                </div>
              </div>

              <div>
                <h5 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  상담 방식
                </h5>
                <div className="flex flex-wrap gap-2">
                  {profileData.consultationTypes.map((typeId) => {
                    const type = consultationTypeOptions.find(
                      (t) => t.id === typeId
                    );

                    // 아이콘 결정
                    let IconComponent;
                    if (typeId === "video") {
                      IconComponent = Video;
                    } else if (typeId === "chat") {
                      IconComponent = MessageCircle;
                    } else if (typeId === "voice") {
                      IconComponent = Phone;
                    }

                    return (
                      <span
                        key={typeId}
                        className="px-3 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium flex items-center"
                      >
                        {IconComponent && (
                          <IconComponent className="h-4 w-4 mr-2" />
                        )}
                        {type?.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 학력 및 자격증 */}
            <div className="space-y-6">
              {/* 학력 */}
              <div>
                <h5 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Award className="h-5 w-5 text-blue-600 mr-2" />
                  학력
                </h5>
                <div className="space-y-2">
                  {profileData.education
                    .filter((edu) => edu)
                    .map((edu, index) => (
                      <div
                        key={index}
                        className="flex items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <Award className="h-5 w-5 text-gray-500 mr-3" />
                        <span className="text-sm font-medium text-gray-700">
                          {edu}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* 자격증 및 인증 */}
              <div>
                <h5 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                  자격증 및 인증
                </h5>
                <div className="space-y-2">
                  {profileData.certifications
                    .filter((cert) => cert)
                    .map((cert, index) => (
                      <div
                        key={index}
                        className="flex items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-sm font-medium text-gray-700">
                          {cert}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* 포트폴리오 섹션 */}
          {profileData.portfolioFiles.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h5 className="font-semibold text-gray-900 mb-6 flex items-center">
                <FileText className="h-5 w-5 text-blue-600 mr-2" />
                포트폴리오 및 자료
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {profileData.portfolioFiles.map((file) => (
                  <div
                    key={file.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 bg-white"
                  >
                    <div className="text-center">
                      {file.type.startsWith("image/") ? (
                        <img
                          src={file.data}
                          alt={file.name}
                          className="w-full h-24 object-cover rounded-lg mb-3 shadow-sm"
                        />
                      ) : (
                        <div className="w-full h-24 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                          <FileText className="h-10 w-10 text-gray-400" />
                        </div>
                      )}
                      <p
                        className="text-sm text-gray-700 font-medium truncate mb-1"
                        title={file.name}
                      >
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 프로필 편집 모드
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <User className="h-5 w-5 text-blue-600 mr-2" />
          전문가 프로필 {expertData?.isProfileComplete ? "편집" : "등록"}
        </h3>
        <div className="flex space-x-2">
          {expertData?.isProfileComplete && (
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 text-sm border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors"
            >
              취소
            </button>
          )}
          <button
            onClick={handleSave}
            className="flex items-center px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <Save className="h-4 w-4 mr-1" />
            저장
          </button>
        </div>
      </div>

      <div className="p-6 max-h-[32rem] overflow-y-auto">
        <div className="space-y-8">
          {/* 기본 정보 */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 text-blue-600 mr-2" />
              기본 정보
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이름 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="전문가 이름을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  전문 분야 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={profileData.specialty}
                  onChange={(e) =>
                    handleInputChange("specialty", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="예: 심리상담, 법률상담 등"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  경력 (년) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={profileData.experience}
                  onChange={(e) =>
                    handleInputChange("experience", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="경력 년수"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  시간당 요금 (크레딧)
                </label>
                <input
                  type="number"
                  value={profileData.hourlyRate}
                  onChange={(e) =>
                    handleInputChange("hourlyRate", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="시간당 요금 (크레딧)"
                  min="0"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                자기소개 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={profileData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                placeholder="전문가로서의 경험, 상담 철학, 전문성 등을 소개해주세요"
              />
            </div>
          </div>

          {/* 프로필 사진 */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Camera className="h-5 w-5 text-blue-600 mr-2" />
              프로필 사진
            </h4>

            <div className="flex items-center space-x-4">
              {profileData.profileImage ? (
                <img
                  src={profileData.profileImage}
                  alt="프로필"
                  className="w-20 h-20 rounded-full object-cover border-4 border-gray-200"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-gray-400" />
                </div>
              )}

              <div>
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "profile")}
                  className="hidden"
                />
                <label
                  htmlFor="profileImage"
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  사진 업로드
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG 파일만 가능 (최대 5MB)
                </p>
              </div>
            </div>
          </div>

          {/* 전문 분야 */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Star className="h-5 w-5 text-blue-600 mr-2" />
              세부 전문 분야
            </h4>

            <div className="space-y-3">
              {profileData.specialties.map((specialty, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) =>
                      handleArrayChange("specialties", index, e.target.value)
                    }
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="전문 분야를 입력하세요"
                  />
                  {profileData.specialties.length > 1 && (
                    <button
                      onClick={() => removeArrayItem("specialties", index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => addArrayItem("specialties")}
              className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              <Plus className="h-4 w-4 mr-1" />
              전문 분야 추가
            </button>
          </div>

          {/* 상담 방식 */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              제공 가능한 상담 방식
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {consultationTypeOptions.map((option) => {
                const isSelected = profileData.consultationTypes.includes(
                  option.id
                );

                // 아이콘 결정
                let IconComponent;
                if (option.id === "video") {
                  IconComponent = Video;
                } else if (option.id === "chat") {
                  IconComponent = MessageCircle;
                } else if (option.id === "voice") {
                  IconComponent = Phone;
                }

                return (
                  <label
                    key={option.id}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleConsultationTypeToggle(option.id)}
                      className="sr-only"
                    />
                    {/* 선택되지 않은 경우 이모지, 선택된 경우 아이콘 */}
                    {isSelected ? (
                      IconComponent && (
                        <IconComponent className="h-6 w-6 text-blue-600 mr-4" />
                      )
                    ) : (
                      <span className="text-2xl mr-4">{option.emoji}</span>
                    )}
                    <div className="flex-1">
                      <span className="text-sm font-semibold text-gray-900">
                        {option.label}
                      </span>
                    </div>
                    {isSelected && (
                      <CheckCircle className="h-6 w-6 text-blue-500 ml-2" />
                    )}
                  </label>
                );
              })}
            </div>
          </div>

          {/* 학력 */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="h-5 w-5 text-blue-600 mr-2" />
              학력
            </h4>

            <div className="space-y-3">
              {profileData.education.map((edu, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={edu}
                    onChange={(e) =>
                      handleArrayChange("education", index, e.target.value)
                    }
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="예: 서울대학교 심리학과 학사"
                  />
                  {profileData.education.length > 1 && (
                    <button
                      onClick={() => removeArrayItem("education", index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => addArrayItem("education")}
              className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              <Plus className="h-4 w-4 mr-1" />
              학력 추가
            </button>
          </div>

          {/* 자격증 */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="h-5 w-5 text-blue-600 mr-2" />
              자격증 및 인증
            </h4>

            <div className="space-y-3">
              {profileData.certifications.map((cert, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={cert}
                    onChange={(e) =>
                      handleArrayChange("certifications", index, e.target.value)
                    }
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="예: 임상심리사 1급, 변호사 자격증 등"
                  />
                  {profileData.certifications.length > 1 && (
                    <button
                      onClick={() => removeArrayItem("certifications", index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => addArrayItem("certifications")}
              className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              <Plus className="h-4 w-4 mr-1" />
              자격증 추가
            </button>
          </div>

          {/* 포트폴리오 파일 업로드 */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 text-blue-600 mr-2" />
              포트폴리오 및 자료
            </h4>

            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <div className="space-y-2">
                <p className="text-gray-600">
                  파일을 드래그하여 업로드하거나 클릭하여 선택하세요
                </p>
                <p className="text-sm text-gray-500">
                  JPG, PNG, PDF 파일 지원 (파일당 최대 10MB)
                </p>
              </div>
              <input
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => handleFileUpload(e, "portfolio")}
                className="hidden"
                id="portfolioFiles"
              />
              <label
                htmlFor="portfolioFiles"
                className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
              >
                <Plus className="h-4 w-4 mr-2" />
                파일 선택
              </label>
            </div>

            {/* 업로드된 파일 목록 */}
            {profileData.portfolioFiles.length > 0 && (
              <div className="mt-4">
                <h5 className="font-medium text-gray-900 mb-3">
                  업로드된 파일
                </h5>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {profileData.portfolioFiles.map((file) => (
                    <div
                      key={file.id}
                      className="relative border border-gray-200 rounded-lg p-3 hover:bg-gray-50"
                    >
                      <button
                        onClick={() => removePortfolioFile(file.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>

                      <div className="text-center">
                        {file.type.startsWith("image/") ? (
                          <img
                            src={file.data}
                            alt={file.name}
                            className="w-full h-20 object-cover rounded mb-2"
                          />
                        ) : (
                          <div className="w-full h-20 bg-gray-100 rounded mb-2 flex items-center justify-center">
                            <FileText className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                        <p
                          className="text-xs text-gray-600 truncate"
                          title={file.name}
                        >
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertProfile;
