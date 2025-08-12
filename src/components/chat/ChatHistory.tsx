"use client";

import { useState, useEffect } from "react";
import { Clock, User, Search, Filter } from "lucide-react";

interface Expert {
  name: string;
  title: string;
  avatar: string | null;
}

interface ChatSession {
  id: number;
  title: string;
  expert: Expert;
  lastMessage: string;
  timestamp: Date;
  duration: number;
  status: string;
  messageCount: number;
  creditsUsed: number;
}

const ChatHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all"); // all, today, week, month
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);

  // 더미 채팅 세션 데이터
  const mockChatSessions = [
    {
      id: 1,
      title: "마케팅 전략 상담",
      expert: {
        name: "이민수",
        title: "마케팅 전문가",
        avatar: null,
      },
      lastMessage: "네, 인스타그램 마케팅에 대해 더 자세히 알려드릴게요.",
      timestamp: new Date("2024-01-15T14:30:00"),
      duration: 45,
      status: "completed",
      messageCount: 23,
      creditsUsed: 25,
    },
    {
      id: 2,
      title: "비즈니스 모델 검토",
      expert: {
        name: "박비즈니스",
        title: "사업 전략 컨설턴트",
        avatar: null,
      },
      lastMessage: "다음 단계로 투자 유치 계획을 세워보시는 것을 추천드립니다.",
      timestamp: new Date("2024-01-12T10:15:00"),
      duration: 60,
      status: "completed",
      messageCount: 31,
      creditsUsed: 30,
    },
    {
      id: 3,
      title: "기술 아키텍처 상담",
      expert: {
        name: "이테크니컬",
        title: "풀스택 개발자",
        avatar: null,
      },
      lastMessage: "마이크로서비스 아키텍처 적용을 고려해보세요.",
      timestamp: new Date("2024-01-10T16:45:00"),
      duration: 35,
      status: "completed",
      messageCount: 18,
      creditsUsed: 20,
    },
    {
      id: 4,
      title: "사용자 경험 개선",
      expert: {
        name: "최디자인",
        title: "UX/UI 디자이너",
        avatar: null,
      },
      lastMessage: "사용자 테스트 결과를 보고 개선점을 찾아보겠습니다.",
      timestamp: new Date("2024-01-08T13:20:00"),
      duration: 40,
      status: "completed",
      messageCount: 26,
      creditsUsed: 22,
    },
  ];

  useEffect(() => {
    // 실제로는 API에서 채팅 히스토리 가져오기
    setTimeout(() => {
      setChatSessions(mockChatSessions);
      setLoading(false);
    }, 1000);
  }, []);

  const filterSessions = (sessions: ChatSession[]) => {
    let filtered = sessions;

    // 검색어 필터링
    if (searchTerm) {
      filtered = filtered.filter(
        (session) =>
          session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          session.expert.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          session.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // 날짜 필터링
    const now = new Date();
    switch (selectedFilter) {
      case "today":
        filtered = filtered.filter((session) => {
          const sessionDate = new Date(session.timestamp);
          return sessionDate.toDateString() === now.toDateString();
        });
        break;
      case "week":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter((session) => session.timestamp >= weekAgo);
        break;
      case "month":
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter((session) => session.timestamp >= monthAgo);
        break;
      default:
        break;
    }

    return filtered.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  };

  const handleSessionClick = (sessionId: number) => {
    // 해당 세션으로 이동
    console.log("Navigate to session:", sessionId);
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 30) return `${days}일 전`;
    return date.toLocaleDateString("ko-KR");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "완료";
      case "in_progress":
        return "진행 중";
      case "pending":
        return "대기 중";
      default:
        return "알 수 없음";
    }
  };

  const filteredSessions = filterSessions(chatSessions);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg p-3 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              <div className="h-3 bg-gray-300 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 검색 및 필터 */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="상담 내역 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">전체</option>
            <option value="today">오늘</option>
            <option value="week">이번 주</option>
            <option value="month">이번 달</option>
          </select>
        </div>
      </div>

      {/* 채팅 세션 목록 */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredSessions.length > 0 ? (
          filteredSessions.map((session) => (
            <div
              key={session.id}
              onClick={() => handleSessionClick(session.id)}
              className="bg-white border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">
                    {session.title}
                  </h4>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <User className="h-3 w-3" />
                    <span>{session.expert.name}</span>
                    <span>•</span>
                    <Clock className="h-3 w-3" />
                    <span>{session.duration}분</span>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    session.status,
                  )}`}
                >
                  {getStatusText(session.status)}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {session.lastMessage}
              </p>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-3">
                  <span>{getRelativeTime(session.timestamp)}</span>
                  <span>{session.messageCount}개 메시지</span>
                </div>
                <span className="font-medium">
                  {session.creditsUsed} 크레딧
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <Search className="h-8 w-8 mx-auto" />
            </div>
            <p className="text-sm text-gray-500">
              {searchTerm ? "검색 결과가 없습니다" : "상담 내역이 없습니다"}
            </p>
          </div>
        )}
      </div>

      {/* 전체 보기 버튼 */}
      {filteredSessions.length > 0 && (
        <div className="pt-2 border-t">
          <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-2">
            전체 상담 내역 보기
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatHistory;
