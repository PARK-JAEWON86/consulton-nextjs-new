"use client";

<<<<<<< HEAD
import { useEffect, useState } from "react";
=======
import { useState, useEffect } from "react";
>>>>>>> 6615aeb (expert profile update)
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Notification } from "@/types";
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Clock, 
  MessageCircle, 
  Video, 
  Phone, 
  Star,
  AlertCircle,
  X,
  Filter
} from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string;
  role?: 'expert' | 'client' | 'admin';
  expertLevel?: string;
}

export default function NotificationsPage() {
<<<<<<< HEAD
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 로컬 스토리지에서 사용자 정보 로드
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('consulton-user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('사용자 정보 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  if (isLoading) {
    return (
      <ProtectedRoute requireAuth={true}>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const isExpert = user?.role === 'expert';

=======
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'consultation_request'>('all');
  const [unreadCount, setUnreadCount] = useState(0);

  // 알림 목록 로드
  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      
      // 임시 전문가 ID (실제로는 인증 시스템에서 가져와야 함)
      const expertId = 'expert_1';
      
      const response = await fetch(`/api/notifications?userId=${expertId}&limit=100`);
      const result = await response.json();
      
      if (result.success) {
        setNotifications(result.data.notifications);
        setUnreadCount(result.data.unreadCount);
      } else {
        console.error('알림 로드 실패:', result.error);
      }
    } catch (error) {
      console.error('알림 로드 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 알림 읽음 처리
  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId })
      });

      if (response.ok) {
        // 로컬 상태 업데이트
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, isRead: true, readAt: new Date() }
              : notification
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('알림 읽음 처리 오류:', error);
    }
  };

  // 모든 알림 읽음 처리
  const markAllAsRead = async () => {
    try {
      const expertId = 'expert_1';
      
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: expertId, markAllAsRead: true })
      });

      if (response.ok) {
        // 로컬 상태 업데이트
        setNotifications(prev => 
          prev.map(notification => 
            !notification.isRead 
              ? { ...notification, isRead: true, readAt: new Date() }
              : notification
          )
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('모든 알림 읽음 처리 오류:', error);
    }
  };

  // 알림 삭제
  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications?id=${notificationId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // 로컬 상태에서 제거
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        // 읽지 않은 알림이었다면 카운트 감소
        const deletedNotification = notifications.find(n => n.id === notificationId);
        if (deletedNotification && !deletedNotification.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error('알림 삭제 오류:', error);
    }
  };

  // 알림 타입별 아이콘
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'consultation_request':
        return <MessageCircle className="h-5 w-5 text-blue-500" />;
      case 'consultation_accepted':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'consultation_rejected':
        return <X className="h-5 w-5 text-red-500" />;
      case 'review_received':
        return <Star className="h-5 w-5 text-yellow-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  // 알림 타입별 색상
  const getNotificationColor = (type: string, priority: string) => {
    if (priority === 'urgent') return 'border-red-200 bg-red-50';
    if (priority === 'high') return 'border-orange-200 bg-orange-50';
    
    switch (type) {
      case 'consultation_request':
        return 'border-blue-200 bg-blue-50';
      case 'consultation_accepted':
        return 'border-green-200 bg-green-50';
      case 'consultation_rejected':
        return 'border-red-200 bg-red-50';
      case 'review_received':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  // 필터링된 알림 목록
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'consultation_request') return notification.type === 'consultation_request';
    return true;
  });

  useEffect(() => {
    loadNotifications();
  }, []);

>>>>>>> 6615aeb (expert profile update)
  return (
    <ProtectedRoute requireAuth={true}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 헤더 */}
          <div className="mb-6">
<<<<<<< HEAD
            <h1 className="text-2xl font-bold text-gray-900">알림</h1>
            <p className="text-gray-600 mt-1">
              {isExpert 
                ? "전문가 활동과 관련된 중요한 업데이트와 알림을 확인하세요."
                : "중요한 업데이트와 알림을 확인하세요."
              }
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            {isExpert ? (
              // 전문가 전용 알림 내용
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h3 className="font-medium text-gray-900">새로운 상담 요청</h3>
                  <p className="text-sm text-gray-600">김철수님이 상담을 요청했습니다.</p>
                  <p className="text-xs text-gray-500 mt-1">2시간 전</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <h3 className="font-medium text-gray-900">리뷰 등록</h3>
                  <p className="text-sm text-gray-600">이영희님이 상담 후 리뷰를 남겼습니다.</p>
                  <p className="text-xs text-gray-500 mt-1">1일 전</p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4 py-2">
                  <h3 className="font-medium text-gray-900">정산 완료</h3>
                  <p className="text-sm text-gray-600">이번 달 정산이 완료되었습니다.</p>
                  <p className="text-xs text-gray-500 mt-1">3일 전</p>
                </div>
              </div>
            ) : (
              // 일반 사용자 알림 내용
              <div className="text-center text-gray-500 py-8">
                <p>새로운 알림이 없습니다.</p>
              </div>
            )}
=======
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Bell className="h-6 w-6 mr-2" />
                  알림
                  {unreadCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </h1>
                <p className="text-gray-600 mt-1">
                  중요한 업데이트와 알림을 확인하세요.
                </p>
              </div>
              
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <CheckCheck className="h-4 w-4 mr-2" />
                  모두 읽음 처리
                </button>
              )}
            </div>
          </div>

          {/* 필터 */}
          <div className="mb-6">
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-500" />
              <div className="flex space-x-2">
                {[
                  { key: 'all', label: '전체' },
                  { key: 'unread', label: '읽지 않음' },
                  { key: 'consultation_request', label: '상담 신청' }
                ].map((filterOption) => (
                  <button
                    key={filterOption.key}
                    onClick={() => setFilter(filterOption.key as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === filterOption.key
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {filterOption.label}
                  </button>
                ))}
              </div>
            </div>
>>>>>>> 6615aeb (expert profile update)
          </div>

          {/* 알림 목록 */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="bg-white rounded-lg shadow p-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">알림을 불러오는 중...</p>
                </div>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8">
                <div className="text-center text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">
                    {filter === 'unread' ? '읽지 않은 알림이 없습니다' : 
                     filter === 'consultation_request' ? '상담 신청 알림이 없습니다' : 
                     '새로운 알림이 없습니다'}
                  </p>
                  <p className="text-sm">
                    {filter === 'all' ? '새로운 알림이 오면 여기에 표시됩니다.' : '다른 필터를 확인해보세요.'}
                  </p>
                </div>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white rounded-lg shadow border-l-4 p-6 transition-all hover:shadow-md ${
                    notification.isRead ? 'opacity-75' : ''
                  } ${getNotificationColor(notification.type, notification.priority)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {/* 아이콘 */}
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      {/* 내용 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className={`text-lg font-semibold ${
                            notification.isRead ? 'text-gray-600' : 'text-gray-900'
                          }`}>
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        
                        <p className={`text-sm mb-3 ${
                          notification.isRead ? 'text-gray-500' : 'text-gray-700'
                        }`}>
                          {notification.message}
                        </p>
                        
                        {/* 추가 정보 */}
                        {notification.data && (
                          <div className="text-xs text-gray-500 space-y-1">
                            {notification.data.clientName && (
                              <p>신청자: {notification.data.clientName}</p>
                            )}
                            {notification.data.consultationType && (
                              <p>상담 방식: {
                                notification.data.consultationType === 'video' ? '화상 상담' :
                                notification.data.consultationType === 'chat' ? '채팅 상담' :
                                '음성 상담'
                              }</p>
                            )}
                          </div>
                        )}
                        
                        {/* 시간 */}
                        <div className="flex items-center text-xs text-gray-400 mt-3">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(notification.createdAt).toLocaleString('ko-KR', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                    
                    {/* 액션 버튼들 */}
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="읽음 처리"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="삭제"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

