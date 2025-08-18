"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { 
  Star, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Calendar,
  Award,
  Users,
  CheckCircle,
  Globe,
  Phone,
  Mail,
  Video,
  ArrowLeft,
  Heart,
  Share2
} from "lucide-react";
import { useExpertProfileStore } from "@/stores/expertProfileStore";
import { initializeDummyExpertsToStore, dummyExperts, convertExpertItemToProfile } from "@/data/dummy/experts";
import { ExpertProfile } from "@/types";
import { calculateExpertLevel, getLevelBadgeStyles, getKoreanLevelName } from "@/utils/expertLevels";
import MatchedExpertsSection from "@/components/home/MatchedExpertsSection";

export default function ExpertProfilePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [expert, setExpert] = useState<ExpertProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'availability'>('overview');
  const [similarExperts, setSimilarExperts] = useState<ExpertProfile[]>([]);
  
  // 전문가 프로필 스토어 사용
  const { getProfile, getAllProfiles } = useExpertProfileStore();

  // 비슷한 전문가 찾기 함수 (검색 컨텍스트 고려)
  const findSimilarExperts = (currentExpert: ExpertProfile, allExperts: ExpertProfile[], searchContext?: any) => {
    // 먼저 동일한 specialty를 가진 전문가들을 찾기
    const sameSpecialtyExperts = allExperts.filter(expert => 
      expert.id !== currentExpert.id && expert.specialty === currentExpert.specialty
    );
    
    // 다른 specialty를 가진 전문가들
    const otherExperts = allExperts.filter(expert => 
      expert.id !== currentExpert.id && expert.specialty !== currentExpert.specialty
    );
    
    const scoreExpert = (expert: ExpertProfile) => {
      let score = 0;
      
      // 1. 같은 specialty (최우선 - 매우 높은 점수)
      if (expert.specialty === currentExpert.specialty) {
        score += 1000; // 매우 높은 기본 점수
      }
      
      // 2. 검색 컨텍스트 고려 (검색에서 온 경우 추가 가점)
      if (searchContext) {
        // 검색된 카테고리와 일치하는 경우
        if (searchContext.fromCategory && expert.specialty === currentExpert.specialty) {
          score += 100;
        }
        
        // 검색된 연령대와 일치하는 경우
        if (searchContext.fromAgeGroup) {
          const ageGroup = searchContext.fromAgeGroup;
          let ageMatch = false;
          
          if (ageGroup === "teen") {
            ageMatch = expert.targetAudience.some((target: string) => 
              target.includes("청소년") || target.includes("중학생") || target.includes("고등학생")
            );
          } else if (ageGroup === "student") {
            ageMatch = expert.targetAudience.some((target: string) => 
              target.includes("대학생") || target.includes("취준생") || target.includes("학생")
            );
          } else if (ageGroup === "adult") {
            ageMatch = expert.targetAudience.some((target: string) => 
              target.includes("성인") || target.includes("직장인") || target.includes("자영업자")
            );
          } else if (ageGroup === "senior") {
            ageMatch = expert.targetAudience.some((target: string) => 
              target.includes("시니어") || target.includes("은퇴")
            );
          }
          
          if (ageMatch) {
            score += 50;
          }
        }
      }
      
      // 3. 공통 태그 개수
      const commonTags = expert.tags.filter(tag => currentExpert.tags.includes(tag));
      score += commonTags.length * 20;
      
      // 4. 비슷한 평점 (±0.5 범위)
      if (Math.abs(expert.rating - currentExpert.rating) <= 0.5) {
        score += 30;
      }
      
      // 5. 비슷한 경력 (±3년 범위)
      if (Math.abs(expert.experience - currentExpert.experience) <= 3) {
        score += 25;
      }
      
      // 6. 공통 상담 방식
      const commonConsultationTypes = expert.consultationTypes.filter(type => 
        currentExpert.consultationTypes.includes(type)
      );
      score += commonConsultationTypes.length * 15;
      
      // 7. 공통 대상 고객
      const commonTargetAudience = expert.targetAudience.filter(audience => 
        currentExpert.targetAudience.includes(audience)
      );
      score += commonTargetAudience.length * 20;
      
      return score;
    };
    
    // 동일한 specialty 전문가들 점수 계산
    const scoredSameSpecialty = sameSpecialtyExperts.map(expert => ({
      ...expert,
      similarityScore: scoreExpert(expert)
    }));
    
    // 다른 specialty 전문가들 점수 계산
    const scoredOtherExperts = otherExperts.map(expert => ({
      ...expert,
      similarityScore: scoreExpert(expert)
    }));
    
    // 동일한 specialty 전문가만 추천 (우선 순위)
    if (scoredSameSpecialty.length > 0) {
      const result = scoredSameSpecialty
        .sort((a, b) => b.similarityScore - a.similarityScore);
      
      // 동일한 specialty가 6명 미만이면 그만큼만 반환
      return result.slice(0, Math.min(6, result.length));
    } else {
      // 동일한 specialty가 전혀 없는 경우에만 다른 specialty 포함
      const result = scoredOtherExperts
        .sort((a, b) => b.similarityScore - a.similarityScore)
        .slice(0, 6);
      return result;
    }
  };

  useEffect(() => {
    // 스토어 초기화 (한 번만 실행)
    const allProfiles = getAllProfiles();
    if (allProfiles.length === 0) {
      initializeDummyExpertsToStore();
    }
    
    const expertId = parseInt(params.id as string);
    let foundExpert = getProfile(expertId);
    
    // 스토어에서 찾을 수 없으면 더미 데이터에서 찾아서 변환
    if (!foundExpert) {
      const dummyExpert = dummyExperts.find(exp => exp.id === expertId);
      if (dummyExpert) {
        foundExpert = convertExpertItemToProfile(dummyExpert);
      }
    }
    
    if (foundExpert) {
      setExpert(foundExpert);
      
      // 검색 컨텍스트 추출
      const searchContext = {
        fromCategory: searchParams.get('fromCategory'),
        fromAgeGroup: searchParams.get('fromAgeGroup'),
        fromStartDate: searchParams.get('fromStartDate'),
        fromEndDate: searchParams.get('fromEndDate'),
      };
      
      // 모든 전문가 프로필 가져오기
      const allExpertProfiles = getAllProfiles();
      
      // 비슷한 전문가 찾기 (검색 컨텍스트 고려)
      const similar = findSimilarExperts(foundExpert, allExpertProfiles, searchContext);
      setSimilarExperts(similar);
    }
    setIsLoading(false);
  }, [params.id, searchParams, getProfile, getAllProfiles]);

  // 페이지 로드 완료 후 스크롤 리셋
  useEffect(() => {
    if (!isLoading) {
      // 약간의 지연을 두어 DOM이 완전히 렌더링된 후 스크롤
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant'
        });
      }, 0);
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">전문가 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!expert) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">전문가를 찾을 수 없습니다</h2>
          <p className="text-gray-600 mb-4">요청하신 전문가 정보가 존재하지 않습니다.</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            이전 페이지로
          </button>
        </div>
      </div>
    );
  }

  const handleConsultationRequest = () => {
    // 상담 신청 로직 (추후 구현)
    alert('상담 신청 기능은 준비 중입니다.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              이전으로
            </button>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-red-500">
                <Heart className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-blue-500">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 메인 컨텐츠 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 전문가 기본 정보 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                {/* 헤더: 왼쪽 프로필 사진, 오른쪽 모든 정보 */}
                <div className="flex items-start space-x-6">
                  {/* 왼쪽: 프로필 사진 */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-36 h-48 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-gray-100 shadow-md">
                        {expert.profileImage ? (
                          <img
                            src={expert.profileImage}
                            alt={expert.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-blue-600 text-4xl font-bold">
                            {expert.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      
                      {/* 전문가 레벨 배지 */}
                      {(() => {
                        // 실제 레벨 숫자 계산
                        const actualLevel = Math.min(
                          999,
                          Math.max(1, Math.floor(expert.totalSessions / 10) + Math.floor(expert.avgRating * 10))
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
                    {/* 상단: 이름과 온라인 상태 */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <h1 className="text-xl font-bold text-gray-900 truncate">{expert.name}</h1>
                      </div>
                      {expert.isOnline && (
                        <div className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs flex-shrink-0">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></div>
                          온라인
                        </div>
                      )}
                    </div>
                    
                    {/* 전문 분야 */}
                    <p className="text-base text-gray-600 font-medium">{expert.specialty}</p>
                    
                    {/* 평점 및 정보 */}
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-semibold text-gray-900 ml-1">{expert.rating}</span>
                        <span className="text-sm text-gray-500 ml-1">({expert.reviewCount}개 리뷰)</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Award className="h-4 w-4 mr-1" />
                        {expert.experience}년 경력
                      </div>
                    </div>

                    {/* 설명 */}
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                      {expert.description}
                    </p>

                    {/* 전문 분야 태그 */}
                    <div className="flex gap-1.5 overflow-hidden">
                      {expert.tags.slice(0, 4).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100 flex-shrink-0"
                        >
                          {tag}
                        </span>
                      ))}
                      {expert.tags.length > 4 && (
                        <span className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs rounded-full border border-gray-100 flex-shrink-0">
                          +{expert.tags.length - 4}
                        </span>
                      )}
                    </div>

                    {/* 상담 방식 및 답변 시간 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {expert.consultationTypes.map((type) => {
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
                        <span>{expert.responseTime}</span>
                      </div>
                    </div>

                    {/* 통계 정보 */}
                    <div className="flex items-center space-x-6 text-sm text-gray-600 pt-4 border-t border-gray-100">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{expert.totalSessions}회 상담</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span>{expert.completionRate}% 완료율</span>
                      </div>
                      <div className="flex items-center">
                        <Award className="h-4 w-4 mr-1" />
                        <span>{expert.repeatClients}명 재방문</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 탭 네비게이션 */}
              <div className="border-b border-gray-200 mb-6 px-6">
                <nav className="flex space-x-8">
                    {[
                      { id: 'overview', label: '개요' },
                      { id: 'reviews', label: '리뷰' },
                      { id: 'availability', label: '예약 가능 시간' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>

              {/* 탭 컨텐츠 */}
              <div className="px-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">소개</h3>
                      <p className="text-gray-700 leading-relaxed">{expert.description}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">전문 분야</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {expert.specialtyAreas.map((area, index) => (
                          <div key={index} className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            <span className="text-gray-700">{area}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">학력 및 자격</h3>
                      <div className="space-y-2">
                        {expert.education.map((edu, index) => (
                          <div key={index} className="flex items-center">
                            <Award className="h-4 w-4 text-blue-500 mr-2" />
                            <span className="text-gray-700">{edu}</span>
                          </div>
                        ))}
                        {expert.certifications.map((cert, index) => (
                          <div key={index} className="flex items-center">
                            <Award className="h-4 w-4 text-green-500 mr-2" />
                            <span className="text-gray-700">{cert}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {expert.portfolioItems && expert.portfolioItems.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">포트폴리오</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {expert.portfolioItems.map((item, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                              <h4 className="font-medium text-gray-900 mb-2">{item.title}</h4>
                              <p className="text-gray-600 text-sm">{item.description}</p>
                              <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                {item.type}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">리뷰 기능은 준비 중입니다.</p>
                  </div>
                )}

                {activeTab === 'availability' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">주간 예약 가능 시간</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                      {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                        const dayNames: { [key: string]: string } = {
                          monday: '월요일',
                          tuesday: '화요일', 
                          wednesday: '수요일',
                          thursday: '목요일',
                          friday: '금요일',
                          saturday: '토요일',
                          sunday: '일요일'
                        };
                        
                        const hours = expert.weeklyAvailability[day] || [];
                        
                        return (
                          <div key={day} className="text-center">
                            <div className="font-semibold text-gray-900 mb-3 py-2 bg-gray-50 rounded-lg">
                              {dayNames[day]}
                            </div>
                            <div className="space-y-2">
                              {hours.length > 0 ? (
                                hours.map((hour, index) => (
                                  <div 
                                    key={index} 
                                    className="px-2 py-1.5 bg-green-50 text-green-700 text-sm rounded border border-green-100 hover:bg-green-100 transition-colors"
                                  >
                                    {hour}
                                  </div>
                                ))
                              ) : (
                                <div className="px-2 py-1.5 bg-gray-50 text-gray-400 text-sm rounded border border-gray-100">
                                  휴무
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 상담 신청 카드 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="mb-4">
                {(() => {
                  const level = calculateExpertLevel(expert.totalSessions, expert.avgRating);
                  const creditsPerMinute = level.creditsPerMinute;
                  const actualLevel = Math.min(
                    999,
                    Math.max(1, Math.floor(expert.totalSessions / 10) + Math.floor(expert.avgRating * 10))
                  );
                  
                  return (
                    <>
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {creditsPerMinute}크레딧<span className="text-base font-normal text-gray-500">/분</span>
                      </div>
                      <p className="text-sm text-gray-600">평균 세션 시간: {expert.averageSessionDuration}분</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Lv.{actualLevel} 레벨 요금
                      </p>
                    </>
                  );
                })()}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">응답 시간</span>
                  <span className="font-medium text-gray-900">{expert.responseTime}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">완료율</span>
                  <span className="font-medium text-gray-900">{expert.completionRate}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">재방문 고객</span>
                  <span className="font-medium text-gray-900">{expert.repeatClients}명</span>
                </div>
              </div>

              <button
                onClick={handleConsultationRequest}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                상담 신청하기
              </button>

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  {expert.cancellationPolicy}
                </p>
              </div>
            </div>

            {/* 상담 방식 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">상담 방식</h3>
              <div className="space-y-3">
                {expert.consultationTypes.map((type, index) => (
                  <div key={index} className="flex items-center">
                    {type === 'video' && <Video className="h-4 w-4 text-blue-500 mr-3" />}
                    {type === 'chat' && <MessageCircle className="h-4 w-4 text-green-500 mr-3" />}
                    {type === 'voice' && <Phone className="h-4 w-4 text-orange-500 mr-3" />}
                    <span className="text-gray-700">
                      {type === 'video' && '화상 상담'}
                      {type === 'chat' && '채팅 상담'}
                      {type === 'voice' && '음성 상담'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 언어 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">구사 언어</h3>
              <div className="flex flex-wrap gap-2">
                {expert.languages.map((language, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>

            {/* 위치 정보 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">위치</h3>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-gray-700">{expert.location}</span>
              </div>
              <div className="flex items-center mt-2">
                <Clock className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-gray-700">{expert.timeZone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 비슷한 전문가 섹션 */}
        {similarExperts.length > 0 && (
          <div className="mt-12">
            <MatchedExpertsSection
              title={searchParams.get('fromCategory') ? "검색 조건에 맞는 다른 전문가" : "비슷한 전문가"}
              subtitle={
                searchParams.get('fromCategory') 
                  ? `검색하신 조건에 맞는 ${expert?.specialty} 분야의 다른 전문가들입니다.`
                  : `${expert?.specialty} 분야의 다른 전문가들을 확인해보세요.`
              }
              experts={similarExperts}
            />
          </div>
        )}
      </div>
    </div>
  );
}
