"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Star, MessageCircle, Filter, Search, ChevronDown, Calendar, User, Video, Phone, Edit2, Save, X } from "lucide-react";
import ExpertProtectedRoute from "@/components/auth/ExpertProtectedRoute";

import { Review } from "@/types";

interface User {
  id: string;
  email: string;
  name: string;
  credits: number;
  expertLevel: string;
  role?: 'expert' | 'client' | 'admin';
}

interface AppState {
  isAuthenticated: boolean;
  user: User | null;
}

interface ConsultationItem {
  id: string;
  userId: string;
  expertId: string;
  title: string;
  description: string;
  category: string;
  status: string;
  scheduledAt: string;
  duration: number;
  sessionType: 'video' | 'voice' | 'chat';
  price: number;
  createdAt: string;
  updatedAt: string;
}

type SortOption = "latest" | "oldest" | "highest" | "lowest";
type FilterOption = "all" | "replied" | "unreplied" | "5" | "4" | "3" | "2" | "1";

export default function ExpertReviewsPage() {
  const searchParams = useSearchParams();
  const highlightReviewId = searchParams.get("highlight");
  const [appState, setAppState] = useState<AppState>({
    isAuthenticated: false,
    user: null
  });
  const [consultations, setConsultations] = useState<ConsultationItem[]>([]);
  
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

  // 상담 기록 로드
  useEffect(() => {
    const loadConsultations = async () => {
      try {
        const response = await fetch('/api/consultations');
        const result = await response.json();
        if (result.success) {
          setConsultations(result.data.items || []);
        }
      } catch (error) {
        console.error('상담 기록 로드 실패:', error);
      }
    };

    loadConsultations();
  }, []);

  const { user } = appState;
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");
  const [replyText, setReplyText] = useState<{ [key: number]: string }>({});
  const [showReplyForm, setShowReplyForm] = useState<number | null>(null);
  const [editingReply, setEditingReply] = useState<number | null>(null);
  const [editReplyText, setEditReplyText] = useState<{ [key: number]: string }>({});
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);
  
  // 페이징 상태 추가
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5; // 페이지당 리뷰 개수

  // 전문가 리뷰 로드
  const loadExpertReviews = useCallback(async () => {
    try {
      // 현재 로그인한 전문가의 리뷰를 API에서 조회
      const response = await fetch(`/api/reviews?expertId=${user?.id}&isPublic=true`);
      const result = await response.json();
      
      if (result.success) {
        // API 응답을 Review 타입에 맞게 변환
        const transformedReviews = result.data.reviews.map((apiReview: any) => ({
          id: parseInt(apiReview.id),
          userId: apiReview.userId,
          userName: apiReview.userName,
          userAvatar: apiReview.userAvatar,
          rating: apiReview.rating,
          comment: apiReview.content,
          consultationTopic: apiReview.category,
          consultationType: 'video' as const,
          createdAt: apiReview.date,
          isVerified: apiReview.isVerified,
          expertReply: apiReview.expertReply || null
        }));
        
        setReviews(transformedReviews);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error('전문가 리뷰 로드 실패:', error);
      setReviews([]);
    }
  }, [user]);

  // 로그인한 전문가의 리뷰만 로드
  useEffect(() => {
    if (user && user.role === 'expert') {
      loadExpertReviews();
    }
  }, [user, loadExpertReviews]);

  // 리뷰 통계 계산
  const stats = useMemo(() => {
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
      : 0;
    
    const ratingDistribution = {
      5: reviews.filter(review => review.rating === 5).length,
      4: reviews.filter(review => review.rating === 4).length,
      3: reviews.filter(review => review.rating === 3).length,
      2: reviews.filter(review => review.rating === 2).length,
      1: reviews.filter(review => review.rating === 1).length
    };
    
    const repliedReviews = reviews.filter(review => review.expertReply).length;
    const replyRate = totalReviews > 0 ? (repliedReviews / totalReviews) * 100 : 0;
    
    const verifiedReviews = reviews.filter(review => review.isVerified).length;
    const verificationRate = totalReviews > 0 ? (verifiedReviews / totalReviews) * 100 : 0;
    
    return {
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingDistribution,
      repliedReviews,
      replyRate: Math.round(replyRate),
      verifiedReviews,
      verificationRate: Math.round(verificationRate)
    };
  }, [reviews]);

  // 필터링 및 정렬된 리뷰
  const filteredAndSortedReviews = useMemo(() => {
    let filtered = reviews;

    // 검색 필터
    if (searchTerm) {
      filtered = filtered.filter(
        review =>
          review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.consultationTopic.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 상태 필터
    if (filterBy === "replied") {
      filtered = filtered.filter(review => review.expertReply);
    } else if (filterBy === "unreplied") {
      filtered = filtered.filter(review => !review.expertReply);
    } else if (["1", "2", "3", "4", "5"].includes(filterBy)) {
      filtered = filtered.filter(review => review.rating === parseInt(filterBy));
    }

    // 정렬
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "latest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "highest":
          return b.rating - a.rating;
        case "lowest":
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

    return filtered;
  }, [reviews, searchTerm, sortBy, filterBy]);

  // 페이징된 리뷰 계산
  const paginatedReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * reviewsPerPage;
    const endIndex = startIndex + reviewsPerPage;
    return filteredAndSortedReviews.slice(startIndex, endIndex);
  }, [filteredAndSortedReviews, currentPage, reviewsPerPage]);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(filteredAndSortedReviews.length / reviewsPerPage);

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // 필터나 검색이 변경될 때 첫 페이지로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterBy, sortBy]);

  // 알림 표시 함수
  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // 별점 렌더링
  const renderStars = (rating: number, size = "w-4 h-4") => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`${size} ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  // 상담 타입 아이콘
  const getConsultationIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-4 h-4 text-blue-500" />;
      case "voice":
        return <Phone className="w-4 h-4 text-green-500" />;
      case "chat":
        return <MessageCircle className="w-4 h-4 text-purple-500" />;
      default:
        return <MessageCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <ExpertProtectedRoute>
      <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">리뷰 관리</h1>
              <p className="text-gray-600 mt-1">
                고객들이 남긴 리뷰를 확인하고 답글을 작성하세요.
              </p>
            </div>
            <button
              onClick={loadExpertReviews}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              새로고침
            </button>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <div className="flex items-center">
              <Star className="h-6 w-6 md:h-8 md:w-8 text-blue-500 mr-2 md:mr-3" />
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">전체 리뷰</p>
                <p className="text-lg md:text-2xl font-bold text-gray-900">
                  {stats.totalReviews}개
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <div className="flex items-center">
              <Star className="h-6 w-6 md:h-8 md:w-8 text-yellow-500 mr-2 md:mr-3" />
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">평균 평점</p>
                <p className="text-lg md:text-2xl font-bold text-gray-900">
                  {stats.averageRating}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <div className="flex items-center">
              <MessageCircle className="h-6 w-6 md:h-8 md:w-8 text-orange-500 mr-2 md:mr-3" />
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">미답글 리뷰</p>
                <p className="text-lg md:text-2xl font-bold text-gray-900">
                  {stats.totalReviews - stats.repliedReviews}개
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <div className="flex items-center">
              <svg className="h-6 w-6 md:h-8 md:w-8 text-purple-500 mr-2 md:mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">검증된 리뷰</p>
                <p className="text-lg md:text-2xl font-bold text-gray-900">
                  {stats.verifiedReviews}개
                </p>
                <p className="text-xs text-gray-500">
                  ({stats.verificationRate}%)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 알림 토스트 */}
        {notification && (
          <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
            <div className={`rounded-lg p-4 shadow-lg border-l-4 ${
              notification.type === "success" 
                ? "bg-green-50 border-green-400 text-green-800" 
                : "bg-red-50 border-red-400 text-red-800"
            }`}>
              <div className="flex items-center">
                <span className="font-medium">{notification.message}</span>
              </div>
            </div>
          </div>
        )}

        {/* 검색 및 필터 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* 검색 */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="리뷰 내용, 사용자명, 상담 주제로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* 필터 */}
            <div className="flex gap-2">
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as FilterOption)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">전체</option>
                <option value="replied">답글 완료</option>
                <option value="unreplied">답글 미완료</option>
                <option value="5">5점</option>
                <option value="4">4점</option>
                <option value="3">3점</option>
                <option value="2">2점</option>
                <option value="1">1점</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="latest">최신순</option>
                <option value="oldest">오래된순</option>
                <option value="highest">높은 평점순</option>
                <option value="lowest">낮은 평점순</option>
              </select>
            </div>
          </div>
        </div>

        {/* 리뷰 목록 */}
        <div className="space-y-6">
          {filteredAndSortedReviews.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">조건에 맞는 리뷰가 없습니다.</p>
            </div>
          ) : (
            <>
              {paginatedReviews.map((review) => (
                <div 
                  key={review.id} 
                  id={`review-${review.id}`} 
                  className={`rounded-xl shadow-sm border p-6 ${
                    !review.expertReply 
                      ? 'bg-gradient-to-b from-orange-50 to-orange-100/50 border-orange-200' 
                      : 'bg-white border-gray-200'
                  }`}
                >
                  {/* 리뷰 헤더 */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-600" />
                      </div>
                      <div className="ml-3">
                        <div className="flex items-center">
                          <p className="font-medium text-gray-900">{review.userName}</p>
                          {review.isVerified && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              인증됨
                            </span>
                          )}
                        </div>
                        <div className="flex items-center mt-1">
                          {renderStars(review.rating)}
                          <span className="ml-2 text-sm text-gray-500">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      {getConsultationIcon(review.consultationType)}
                      <span className="ml-1">{review.consultationTopic}</span>
                    </div>
                  </div>

                  {/* 리뷰 내용 */}
                  <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  </div>

                  {/* 전문가 답글 */}
                  {review.expertReply ? (
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <div className="flex items-start">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex items-center mb-1">
                            <p className="font-medium text-blue-900">전문가 답글</p>
                            <span className="ml-2 text-xs text-blue-600">
                              {formatDate(review.expertReply.createdAt)}
                            </span>
                          </div>
                          <p className="text-blue-800">{review.expertReply.message}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 p-4 bg-gradient-to-r from-orange-100/70 to-orange-50/70 border border-orange-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <MessageCircle className="w-4 h-4 text-white" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-orange-800">답글이 필요한 리뷰입니다</p>
                            <p className="text-xs text-orange-600">고객의 소중한 후기에 답글을 작성해주세요</p>
                          </div>
                        </div>
                        <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors border border-orange-700">
                          <Edit2 className="w-4 h-4 mr-2" />
                          답글 작성
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* 페이징 컨트롤 */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 mt-8">
                  {/* 이전 페이지 버튼 */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      currentPage === 1
                        ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                        : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    이전
                  </button>

                  {/* 페이지 번호들 */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  {/* 다음 페이지 버튼 */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      currentPage === totalPages
                        ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                        : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    다음
                  </button>
                </div>
              )}

              {/* 페이지 정보 표시 */}
              {totalPages > 1 && (
                <div className="text-center text-sm text-gray-500 mt-4">
                  {currentPage} / {totalPages} 페이지
                  <span className="ml-2">
                    (총 {filteredAndSortedReviews.length}개 리뷰 중 {(currentPage - 1) * reviewsPerPage + 1}-{Math.min(currentPage * reviewsPerPage, filteredAndSortedReviews.length)}번째)
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      </div>
    </ExpertProtectedRoute>
  );
}