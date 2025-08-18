import { useState } from "react";
import type React from "react";
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

type ConsultationType = "video" | "chat" | "voice";

interface ExpertProfileData {
  isProfileComplete?: boolean;
  name: string;
  specialty: string;
  experience: number | string;
  description: string;
  education: string[];
  certifications: string[];
  specialties: string[];
  consultationTypes: ConsultationType[];
  languages: string[];
  hourlyRate: number | string;
  totalSessions: number;
  avgRating: number;
  availability: Record<
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday",
    { available: boolean; hours: string }
  >;
  holidayPolicy?: string; // 공휴일 정책 추가
  contactInfo: {
    phone: string;
    email: string;
    location: string;
    website: string;
  };
  profileImage: string | null;
  portfolioFiles: Array<{
    id: number;
    name: string;
    type: string;
    size: number;
    data: string;
  }>;
}

interface ExpertProfileProps {
  expertData?: Partial<ExpertProfileData> & { isProfileComplete?: boolean };
  onSave: (updated: ExpertProfileData & { isProfileComplete: boolean }) => void;
  isEditing?: boolean;
  onEditingChange?: (editing: boolean) => void;
}

const ExpertProfile = ({ expertData, onSave, isEditing: externalIsEditing, onEditingChange }: ExpertProfileProps) => {
  const [internalIsEditing, setInternalIsEditing] = useState(!expertData?.isProfileComplete);
  const isEditing = externalIsEditing !== undefined ? externalIsEditing : internalIsEditing;
  const setIsEditing = onEditingChange || setInternalIsEditing;
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
    holidayPolicy: expertData?.holidayPolicy || "", // 공휴일 정책 추가
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
  const creditsPerMinute = currentLevel.creditsPerMinute;

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

  const daysOrder: (
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday"
  )[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const consultationTypeOptions = [
    { id: "video", label: "화상 상담", emoji: "📹" },
    { id: "chat", label: "채팅 상담", emoji: "💬" },
    { id: "voice", label: "음성 상담", emoji: "🎙️" },
  ];

  const handleInputChange = (field: string, value: unknown) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".") as [
        "contactInfo",
        keyof ExpertProfileData["contactInfo"] & string,
      ];
      if (parent === "contactInfo") {
        setProfileData((prev) => ({
          ...prev,
          contactInfo: {
            ...prev.contactInfo,
            [child]: value as string,
          },
        }));
        return;
      }
    }
    {
      setProfileData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleArrayChange = (
    field: "education" | "certifications" | "specialties",
    index: number,
    value: string
  ) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (
    field: "education" | "certifications" | "specialties"
  ) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (
    field: "education" | "certifications" | "specialties",
    index: number
  ) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleConsultationTypeToggle = (typeId: ConsultationType) => {
    setProfileData((prev) => ({
      ...prev,
      consultationTypes: prev.consultationTypes.includes(typeId)
        ? prev.consultationTypes.filter((id) => id !== typeId)
        : [...prev.consultationTypes, typeId],
    }));
  };

  const handleAvailabilityChange = (
    day:
      | "monday"
      | "tuesday"
      | "wednesday"
      | "thursday"
      | "friday"
      | "saturday"
      | "sunday",
    field: "available" | "hours",
    value: boolean | string
  ) => {
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



  const handleFileUpload = (
    event: { target: { files: FileList | null } },
    type: "profile" | "portfolio"
  ) => {
    const files = Array.from(event.target.files ?? []);

    if (type === "profile") {
      const file = files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result;
          const dataUrl = typeof result === "string" ? result : null;
          setProfileData((prev) => ({
            ...prev,
            profileImage: dataUrl,
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
            const result = e.target?.result;
            const dataUrl = typeof result === "string" ? result : "";
            setProfileData((prev) => ({
              ...prev,
              portfolioFiles: [
                ...prev.portfolioFiles,
                {
                  id: Date.now() + Math.random(),
                  name: file.name,
                  type: file.type,
                  size: file.size,
                  data: dataUrl,
                },
              ],
            }));
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const removePortfolioFile = (fileId: number) => {
    setProfileData((prev) => ({
      ...prev,
      portfolioFiles: prev.portfolioFiles.filter((file) => file.id !== fileId),
    }));
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (!isEditing && expertData?.isProfileComplete) {
    // 프로필 보기 모드 - 사용자 페이지와 비슷한 구성
    return (
      <div>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 메인 컨텐츠 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 전문가 기본 정보 - 카드와 비슷한 레이아웃 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
                  {/* 헤더: 왼쪽 프로필 사진, 오른쪽 모든 정보 */}
                  <div className="flex items-start space-x-6">
                    {/* 왼쪽: 프로필 사진 */}
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="w-36 h-48 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-gray-100 shadow-md">
              {profileData.profileImage ? (
                <img
                  src={profileData.profileImage}
                              alt={profileData.name}
                              className="w-full h-full object-cover"
                />
              ) : (
                            <span className="text-blue-600 text-4xl font-bold">
                              {profileData.name.charAt(0)}
                            </span>
              )}
            </div>

                        {/* 전문가 레벨 배지 */}
                        {(() => {
                          // 실제 레벨 숫자 계산
                          const actualLevel = Math.min(
                            999,
                            Math.max(1, Math.floor((profileData.totalSessions || 0) / 10) + Math.floor((profileData.avgRating || 0) * 10))
                          );

                          // 색상 결정
                          let bgColor = "bg-blue-500";
                          if (actualLevel >= 800) bgColor = "bg-purple-500";
                          else if (actualLevel >= 600) bgColor = "bg-red-500";
                          else if (actualLevel >= 400) bgColor = "bg-orange-500";
                          else if (actualLevel >= 200) bgColor = "bg-yellow-500";
                          else if (actualLevel >= 100) bgColor = "bg-green-500";

                          return (
                            <div className={`absolute -bottom-2 -right-2 border-2 border-white rounded-full shadow-sm flex items-center justify-center ${
                              actualLevel >= 100 ? "w-14 h-7 px-2" : "w-12 h-7 px-1"
                            } ${bgColor}`}>
                              <span className="text-xs font-bold text-white">
                                Lv.{actualLevel}
                  </span>
                </div>
                          );
                        })()}
                </div>
              </div>

                    {/* 오른쪽: 모든 정보 */}
                    <div className="flex-1 min-w-0 space-y-4">
                      {/* 상단: 이름과 활성 상태 */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <h1 className="text-xl font-bold text-gray-900 truncate">{profileData.name}</h1>
                        </div>
                        <div className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs flex-shrink-0">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></div>
                          활성화됨
                </div>
              </div>

                      {/* 전문 분야 */}
                      <p className="text-base text-gray-600 font-medium">{profileData.specialty}</p>
                      
                      {/* 평점 및 정보 */}
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-semibold text-gray-900 ml-1">{(profileData.avgRating || 0).toFixed(1)}</span>
                          <span className="text-sm text-gray-500 ml-1">(리뷰 시스템 준비중)</span>
              </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Award className="h-4 w-4 mr-1" />
                          {profileData.experience}년 경력
            </div>
          </div>

                      {/* 설명 */}
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {profileData.description}
                      </p>

                      {/* 전문 분야 태그 */}
                      <div className="flex gap-1.5 overflow-hidden">
                        {profileData.specialties.filter(s => s).slice(0, 4).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100 flex-shrink-0"
                          >
                            {tag}
                  </span>
                        ))}
                        {profileData.specialties.filter(s => s).length > 4 && (
                          <span className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs rounded-full border border-gray-100 flex-shrink-0">
                            +{profileData.specialties.filter(s => s).length - 4}
                  </span>
                        )}
                </div>

                      {/* 상담 방식 및 답변 시간 */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {profileData.consultationTypes.map((type) => {
                            let Icon = MessageCircle;
                            let label = "채팅";
                            
                            if (type === "video") {
                              Icon = Video;
                              label = "화상";
                            } else if (type === "voice") {
                              Icon = Phone;
                              label = "음성";
                            }

                            return (
                              <div
                                key={type}
                                className="flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded"
                                title={`${label} 상담`}
                              >
                                <Icon className="h-3 w-3 mr-1" />
                                {label}
                </div>
                            );
                          })}
                        </div>

                        {/* 답변 시간 표시 */}
                        <div className="flex items-center space-x-1 text-xs text-gray-600">
                          <Clock className="h-3 w-3 text-green-500" />
                          <span>{"2시간 내"}</span>
                        </div>
                      </div>

                      {/* 통계 정보 */}
                      <div className="flex items-center space-x-6 text-sm text-gray-600 pt-4 border-t border-gray-100">
                  <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{profileData.totalSessions || 0}회 상담</span>
                  </div>
                  <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          <span>95% 완료율</span>
                  </div>
                        <div className="flex items-center">
                          <Award className="h-4 w-4 mr-1" />
                          <span>재방문 고객</span>
                </div>
              </div>
            </div>
            </div>
                </div>
              </div>

              {/* 전문 분야 및 자격 정보 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* 전문 분야 */}
              <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      전문 분야
                    </h3>
                    <div className="space-y-2">
                      {profileData.specialties.filter(s => s).map((specialty, index) => (
                        <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
                          <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                          <span className="text-sm font-medium text-gray-700">{specialty}</span>
                        </div>
                    ))}
                </div>
              </div>

                  {/* 상담 방식 */}
              <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <MessageCircle className="h-5 w-5 text-blue-600 mr-2" />
                      상담 방식
                    </h3>
                    <div className="space-y-2">
                      {profileData.consultationTypes.map((type) => {
                        let IconComponent = MessageCircle;
                        let label = "채팅 상담";
                        
                        if (type === "video") {
                      IconComponent = Video;
                          label = "화상 상담";
                        } else if (type === "voice") {
                      IconComponent = Phone;
                          label = "음성 상담";
                    }

                    return (
                          <div key={type} className="flex items-center p-3 bg-green-50 rounded-lg">
                            <IconComponent className="h-4 w-4 text-green-500 mr-2" />
                            <span className="text-sm font-medium text-gray-700">{label}</span>
                          </div>
                    );
                  })}
                </div>
              </div>
            </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              {/* 학력 */}
              <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Award className="h-5 w-5 text-blue-600 mr-2" />
                  학력
                    </h3>
                <div className="space-y-2">
                      {profileData.education.filter(edu => edu).map((edu, index) => (
                        <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <Award className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm font-medium text-gray-700">{edu}</span>
                      </div>
                    ))}
                </div>
              </div>

                  {/* 자격증 */}
              <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                  자격증 및 인증
                    </h3>
                <div className="space-y-2">
                      {profileData.certifications.filter(cert => cert).map((cert, index) => (
                        <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm font-medium text-gray-700">{cert}</span>
                      </div>
                    ))}
                    </div>
                </div>
              </div>
            </div>
          </div>

            {/* 사이드바 */}
            <div className="space-y-6">
              {/* 레벨 및 요금 정보 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="mb-4">
                  {(() => {
                    const actualLevel = Math.min(
                      999,
                      Math.max(1, Math.floor((profileData.totalSessions || 0) / 10) + Math.floor((profileData.avgRating || 0) * 10))
                    );
                    
                    return (
                      <>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                          {creditsPerMinute} 크레딧<span className="text-base font-normal text-gray-500">/분</span>
                        </div>
                        <p className="text-sm text-gray-600">내 전문가 레벨 요금</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Lv.{actualLevel} 레벨 요금
                        </p>
                      </>
                    );
                  })()}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">총 상담 횟수</span>
                    <span className="font-medium text-gray-900">{profileData.totalSessions || 0}회</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">평균 평점</span>
                    <span className="font-medium text-gray-900">{(profileData.avgRating || 0).toFixed(1)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">경력</span>
                    <span className="font-medium text-gray-900">{profileData.experience}년</span>
                  </div>
                </div>
              </div>

              {/* 레벨 진행률 정보 */}
              {!nextLevelProgress.isMaxTier && nextLevelProgress.nextTier && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                    다음 레벨까지의 진행률
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        다음 티어: {nextLevelProgress.nextTier.name}
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
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center">
                        <Target className="h-4 w-4 text-green-600 mr-1" />
                        <span>다음 티어까지 레벨 {nextLevelProgress.levelsNeeded} 필요</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 최고 레벨 달성 메시지 */}
              {nextLevelProgress.isMaxTier && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Award className="h-5 w-5 text-yellow-600 mr-2" />
                    최고 레벨 달성! 🎉
                  </h3>
                  <p className="text-sm text-gray-700">
                    축하합니다! 최고 티어인{" "}
                    <strong>{currentLevel.name}</strong>에
                    도달하셨습니다.
                  </p>
                </div>
              )}

              {/* 상담 가능 시간 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                    상담 가능 요일
                  </h3>
                  {profileData.holidayPolicy && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-orange-500" />
                      <span className="text-sm text-orange-600 bg-orange-50 px-2 py-1 rounded-full border border-orange-100">
                        {profileData.holidayPolicy}
                      </span>
                    </div>
                  )}
                </div>

                {/* 상담 가능 요일 간단 표시 */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(profileData.availability).map((day) => {
                      const dayNames: { [key: string]: string } = {
                        monday: "월",
                        tuesday: "화",
                        wednesday: "수",
                        thursday: "목",
                        friday: "금",
                        saturday: "토",
                        sunday: "일",
                      };
                      
                      const isAvailable = profileData.availability[day as keyof typeof profileData.availability]?.available;
                      
                      return isAvailable ? (
                        <span
                          key={day}
                          className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-800 text-sm font-medium rounded-full border border-green-200"
                        >
                          {dayNames[day]}요일
                        </span>
                      ) : null;
                    })}
                  </div>
                  {!Object.keys(profileData.availability).some((day) => 
                    profileData.availability[day as keyof typeof profileData.availability]?.available
                  ) && (
                    <p className="text-sm text-gray-500">등록된 상담 가능 요일이 없습니다.</p>
                  )}
                </div>
                
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>참고:</strong> 상담 가능 요일에는 일반적으로 오전 9시부터 오후 6시까지 상담이 가능합니다.
                    구체적인 예약 시간은 고객과 직접 조율하여 결정하세요.
                  </p>
                </div>

                {/* 공휴일 정책 안내 */}
                {profileData.holidayPolicy && (
                  <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-100">
                    <div className="flex items-start space-x-3">
                      <Calendar className="h-4 w-4 text-orange-500 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-orange-800 mb-1">공휴일 안내</h4>
                        <p className="text-sm text-orange-700">
                          {profileData.holidayPolicy === "공휴일 휴무" && "공휴일에는 상담을 진행하지 않습니다."}
                          {profileData.holidayPolicy === "공휴일 정상 운영" && "공휴일에도 평소와 동일하게 상담이 가능합니다."}
                          {profileData.holidayPolicy === "공휴일 오전만 운영" && "공휴일에는 오전 시간대만 상담이 가능합니다."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 포트폴리오 섹션 */}
          {profileData.portfolioFiles.length > 0 && (
            <div className="max-w-6xl mx-auto py-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <FileText className="h-5 w-5 text-blue-600 mr-2" />
                포트폴리오 및 자료
                </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {profileData.portfolioFiles.map((file) => (
                  <div
                    key={file.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 bg-gray-50"
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

      <div className="p-6">
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
                  option.id as ConsultationType
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
                      onChange={() =>
                        handleConsultationTypeToggle(
                          option.id as ConsultationType
                        )
                      }
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

          {/* 상담 가능 시간 설정 */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 text-blue-600 mr-2" />
              상담 가능 시간
            </h4>
            
            {/* 공휴일 정책 선택 */}
            <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h5 className="text-sm font-medium text-orange-800 mb-3 flex items-center">
                <Calendar className="h-4 w-4 text-orange-600 mr-2" />
                공휴일 상담 정책
              </h5>
              <div className="space-y-2">
                {[
                  { value: "", label: "정책 없음 (기본)" },
                  { value: "공휴일 휴무", label: "공휴일 휴무" },
                  { value: "공휴일 정상 운영", label: "공휴일 정상 운영" },
                  { value: "공휴일 오전만 운영", label: "공휴일 오전만 운영" }
                ].map((option) => (
                  <label key={option.value} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="holidayPolicy"
                      value={option.value}
                      checked={profileData.holidayPolicy === option.value}
                      onChange={(e) => handleInputChange("holidayPolicy", e.target.value)}
                      className="mr-3 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-orange-600 mt-2">
                선택한 정책은 고객에게 표시되어 공휴일 상담 가능 여부를 알려줍니다.
              </p>
            </div>

            {/* 간단한 요일별 상담 가능 설정 */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h5 className="text-sm font-medium text-gray-800 mb-4">주간 상담 가능 요일</h5>
              
              {/* 요일 선택 그리드 */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {daysOrder.map((day) => {
                  const isAvailable = profileData.availability[day]?.available;
                  
                  return (
                    <div key={day} className="text-center">
                      <label className="flex flex-col items-center cursor-pointer">
                        <div className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
                          isAvailable 
                            ? "border-green-500 bg-green-50 text-green-800" 
                            : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
                        }`}>
                          <div className="text-sm font-medium mb-2">
                            {dayNames[day]}
                          </div>
                          <input
                            type="checkbox"
                            className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            checked={!!isAvailable}
                            onChange={() => {
                              const newAvailable = !isAvailable;
                              handleAvailabilityChange(day, "available", newAvailable);
                              // 활성화할 때 기본 시간 설정, 비활성화할 때 시간 초기화
                              if (newAvailable) {
                                handleAvailabilityChange(day, "hours", "09:00-18:00");
                              } else {
                                handleAvailabilityChange(day, "hours", "");
                              }
                            }}
                          />
                        </div>
                        <span className={`mt-2 text-xs font-medium ${
                          isAvailable ? "text-green-600" : "text-gray-500"
                        }`}>
                          {isAvailable ? "상담 가능" : "상담 불가"}
                        </span>
                      </label>
                    </div>
                  );
                })}
              </div>

              {/* 설명 */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>사용법:</strong> 
                  상담을 제공하고 싶은 요일을 선택하세요. 선택된 요일에는 기본적으로 오전 9시부터 오후 6시까지 상담이 가능한 것으로 설정됩니다.
                </p>
              </div>
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
