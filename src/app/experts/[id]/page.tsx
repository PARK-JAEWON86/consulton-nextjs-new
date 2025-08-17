"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { dummyExperts, type ExpertItem } from "@/data/dummy/experts";

export default function ExpertProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [expert, setExpert] = useState<ExpertItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'availability'>('overview');

  useEffect(() => {
    const expertId = parseInt(params.id as string);
    const foundExpert = dummyExperts.find(exp => exp.id === expertId);
    
    if (foundExpert) {
      setExpert(foundExpert);
    }
    setIsLoading(false);
  }, [params.id]);

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
              <div className="relative h-48 bg-gradient-to-br from-blue-100 to-indigo-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-3xl font-bold">
                      {expert.name.charAt(0)}
                    </span>
                  </div>
                </div>
                {expert.isOnline && (
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      온라인
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{expert.name}</h1>
                  <p className="text-lg text-gray-600 mb-3">{expert.specialty}</p>
                  
                  {/* 평점 및 리뷰 */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      <span className="ml-1 font-semibold text-gray-900">{expert.rating}</span>
                      <span className="ml-1 text-gray-500">({expert.reviewCount}개 리뷰)</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{expert.totalSessions}회 상담</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Award className="h-4 w-4 mr-1" />
                      <span>{expert.experience}년 경력</span>
                    </div>
                  </div>

                  {/* 전문 분야 태그 */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {expert.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 탭 네비게이션 */}
                <div className="border-b border-gray-200 mb-6">
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
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {expert.pricePerMinute}크레딧<span className="text-base font-normal text-gray-500">/분</span>
                </div>
                <p className="text-sm text-gray-600">평균 세션 시간: {expert.averageSessionDuration}분</p>
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
      </div>
    </div>
  );
}
