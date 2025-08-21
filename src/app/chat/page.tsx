"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  CheckCircle,
  Users,
  MessageSquare,
  ArrowRight,
  Sparkles,
  History,
  Clock,
  Trash2,
  RefreshCw,
  FileText,
  Download,
  BarChart3,
  Lightbulb,
} from "lucide-react";
import QuestionInput from "@/components/chat/QuestionInput";
import ChatBubble from "@/components/chat/ChatBubble";
import ServiceLayout from "@/components/layout/ServiceLayout";
import { AIChatMessage } from "@/types";
import Link from "next/link";
import AITokenUsageBar from "@/components/chat/AITokenUsageBar";

// 채팅 세션 타입 정의
interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  isActive: boolean;
  messageCount: number;
  summary?: string;
}

interface AppState {
  isAuthenticated: boolean;
  user: any;
}

export default function ChatPage() {
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

  const { isAuthenticated } = appState;
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: "1",
      type: "ai",
      content:
        "안녕하세요! 저는 컨설트온 AI 어시스턴트입니다. 어떤 고민이나 궁금한 점이 있으신지 자세히 알려주세요. 정확한 분석과 조언을 위해 구체적인 상황을 말씀해 주시면 도움이 됩니다.",
      timestamp: new Date(Date.now() - 10000),
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isConsultationComplete, setIsConsultationComplete] = useState(false);
  const [consultationSummary, setConsultationSummary] = useState("");
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [remainingPercent, setRemainingPercent] = useState(100);
  const [consultationStartTime] = useState(new Date());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isConsultationComplete) return;

    const userMessage: AIChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    setIsTyping(true);
    setMessageCount(prev => prev + 1);

    // AI 응답 시뮬레이션
    setTimeout(() => {
      const aiMessage: AIChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: `네, "${message}"에 대해 말씀해 주셨군요. 더 구체적으로 설명해 주시면 더 정확한 도움을 드릴 수 있습니다.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleEndConsultation = () => {
    const summary = "AI 상담이 완료되었습니다. 전문가와의 상담을 통해 더 구체적인 도움을 받아보세요.";
    setConsultationSummary(summary);
    setShowSummary(true);
    setIsConsultationComplete(true);
  };

  const handleResumeChat = () => {
    setShowSummary(false);
    setIsConsultationComplete(false);
  };

  const handleUseCredits = () => {
    // 크레딧 사용 로직
    console.log("크레딧 사용");
    setShowCreditModal(false);
  };

  const handleChargeCredits = () => {
    // 크레딧 충전 페이지로 이동
    window.location.href = "/credit-packages";
  };

  const handleShowStats = () => {
    setShowStats(!showStats);
  };

  const handleShowTips = () => {
    setShowTips(!showTips);
  };

  const handleClearHistory = () => {
    if (confirm("채팅 히스토리를 정리하시겠습니까? 첫 번째 AI 메시지만 남게 됩니다.")) {
      setMessages([messages[0]]);
      setMessageCount(0);
    }
  };

  const handleExportConsultation = () => {
    const content = messages.map(m => 
      `${m.type === 'user' ? '나' : 'AI'}: ${m.content}`
    ).join('\n\n');
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI상담_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleGoToExperts = () => {
    window.location.href = "/experts";
  };

  const handleGoToCommunity = () => {
    window.location.href = "/community";
  };

  const handleGoToSummary = () => {
    window.location.href = "/summary";
  };

  // 상담 통계 계산
  const consultationStats = {
    totalMessages: messages.length,
    userMessages: messages.filter(m => m.type === 'user').length,
    aiMessages: messages.filter(m => m.type === 'ai').length,
    duration: Math.floor((new Date().getTime() - consultationStartTime.getTime()) / 1000 / 60),
  };

  // 로그아웃 상태일 때 회원가입 안내 표시
  if (!isAuthenticated) {
    return (
      <ServiceLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
          <div className="text-center">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bot className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                AI 상담 어시스턴트
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                AI와 함께 문제를 정리하고 전문가를 찾아보세요
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8 max-w-2xl mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  🔒 로그인이 필요한 서비스입니다
                </h2>
                <p className="text-gray-600 mb-6">
                  AI 상담 서비스를 이용하시려면 회원가입 또는 로그인이 필요합니다.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth/register"
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md text-center"
                >
                  회원가입하고 시작하기
                </Link>
                <Link
                  href="/auth/login"
                  className="flex-1 bg-white text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors border border-gray-300 text-center"
                >
                  로그인
                </Link>
              </div>
            </div>
          </div>
        </div>
      </ServiceLayout>
    );
  }

  // 로그인된 사용자를 위한 메인 채팅 인터페이스
  return (
    <ServiceLayout>
      {/* 크레딧 사용 모달 */}
      {showCreditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  대화 연장하기
                </h2>
                <p className="text-gray-600">
                  크레딧을 사용하여 대화를 계속하시겠습니까?
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleUseCredits}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  크레딧 사용하기 (50크레딧)
                </button>

                <button
                  onClick={handleChargeCredits}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-pink-700 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  크레딧 충전하기
                </button>
              </div>

              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowCreditModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
        {/* 헤더 */}
        <div className="mb-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              AI 상담 어시스턴트
            </h1>
            <p className="text-gray-600 mt-1">
              AI 상담을 통해 자신의 문제를 정리하고 적절한 전문가를 찾는 데 도움을 받으세요
            </p>
          </div>
        </div>

        {/* 채팅 영역 */}
        <div className="flex gap-6" style={{ height: "calc(100vh - 380px)" }}>
          {/* 메인 채팅 영역 */}
          <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-full flex flex-col">
              {/* 메인 채팅 */}
              <div className="flex-1 flex flex-col h-full min-h-0">
                {/* 메시지 목록 */}
                <div
                  className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0"
                  style={{ maxHeight: "calc(100vh - 500px)" }}
                >
                  {messages.map((message) => (
                    <div id={`message-${message.id}`} key={message.id}>
                      <ChatBubble message={message} />
                    </div>
                  ))}

                  {/* AI 타이핑 인디케이터 */}
                  {isTyping && (
                    <div className="flex items-start space-x-3">
                      <div className="h-8 w-8 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-sm">
                        <Bot className="text-white w-4 h-4" />
                      </div>
                      <div className="bg-gradient-to-r from-cyan-50 via-blue-50 to-indigo-50 border border-cyan-200 rounded-lg px-4 py-2 shadow-sm">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                          <span className="text-xs text-cyan-700 font-medium">
                            AI가 답변을 생성하고 있습니다
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* 입력 영역 - 하단 고정 */}
                <div className="border-t border-gray-200 bg-white p-4 flex-shrink-0">
                  {isConsultationComplete ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      <div className="text-center py-4">
                        <div className="inline-flex items-center px-4 py-2 rounded-lg bg-green-50 border border-green-200 text-green-700 mb-2">
                          <CheckCircle className="w-5 h-5 mr-2" />
                          <span className="font-medium">
                            AI 상담이 완료되었습니다
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          전문가 매칭 또는 커뮤니티 글 작성을 통해 더 구체적인
                          도움을 받아보세요
                        </p>
                        <p className="text-xs text-blue-600">
                          "대화 종료" 버튼을 눌러 상담을 마무리하세요
                        </p>
                      </div>

                      {showSummary && (
                        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 rounded-lg p-6">
                          <div className="flex items-center mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mr-3">
                              <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              상담 요약
                            </h3>
                          </div>
                          <p className="text-gray-700">{consultationSummary}</p>
                        </div>
                      )}

                      <div className="flex space-x-3">
                        <button
                          onClick={handleResumeChat}
                          className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all duration-200"
                        >
                          대화 계속하기
                        </button>
                        <button
                          onClick={handleEndConsultation}
                          className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-600 transition-all duration-200"
                        >
                          대화 종료
                        </button>
                      </div>
                    </div>
                  ) : (
                    <QuestionInput
                      value={newMessage}
                      onChange={setNewMessage}
                      onSend={handleSendMessage}
                      placeholder="질문이나 고민을 자세히 적어주세요..."
                      disabled={isTyping}
                    />
                  )}
                </div>

                {/* AI 토큰 사용량 바와 상담 제어 버튼들 - 채팅방 하단으로 이동 */}
                <div className="border-t border-gray-200 bg-gray-50 p-4">
                  {/* AI 토큰 사용량 바 */}
                  <div className="mb-4">
                    <AITokenUsageBar userId="user_123" />
                  </div>

                  {/* 상담 제어 버튼들 */}
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={() => setIsConsultationComplete(false)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                        !isConsultationComplete
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4" />
                        <span>상담 시작</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setShowCreditModal(true)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm"
                    >
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4" />
                        <span>크레딧 사용</span>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        const summary = "AI 상담 요약: " + messages.map(m => m.content).join(" ");
                        setConsultationSummary(summary);
                        setShowSummary(true);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-sm"
                    >
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>상담 요약</span>
                      </div>
                    </button>

                    <button
                      onClick={handleGoToExperts}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors text-sm"
                    >
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>전문가 매칭</span>
                      </div>
                    </button>

                    <button
                      onClick={() => handleExportConsultation()}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors text-sm"
                    >
                      <div className="flex items-center space-x-2">
                        <Download className="w-4 h-4" />
                        <span>상담 내보내기</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 사이드바 - 채팅 히스토리 */}
          <div className="w-80 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-full flex flex-col">
              {/* 사이드바 헤더 */}
              <div className="border-b border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">채팅 히스토리</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleClearHistory}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      title="히스토리 정리"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => window.location.reload()}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      title="새로고침"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-600">
                  {messageCount}개 메시지
                </p>
              </div>

              {/* 채팅 히스토리 목록 */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-lg text-sm cursor-pointer transition-colors ${
                        message.type === 'user' 
                          ? 'bg-blue-50 text-blue-800 hover:bg-blue-100' 
                          : 'bg-gray-50 text-gray-800 hover:bg-gray-100'
                      }`}
                      onClick={() => {
                        // 메시지 선택 시 해당 위치로 스크롤
                        const element = document.getElementById(`message-${message.id}`);
                        element?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`w-2 h-2 rounded-full ${
                          message.type === 'user' ? 'bg-blue-500' : 'bg-green-500'
                        }`}></span>
                        <span className="font-medium text-xs">
                          {message.type === 'user' ? '나' : 'AI'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {message.timestamp.toLocaleTimeString('ko-KR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="line-clamp-2 text-xs">
                        {message.content.length > 50 
                          ? message.content.substring(0, 50) + '...' 
                          : message.content
                        }
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 사이드바 푸터 */}
              <div className="border-t border-gray-200 bg-gray-50 p-4">
                <div className="space-y-3">
                  <div className="text-center text-xs text-gray-500">
                    <p>AI 상담 진행 중</p>
                    <p className="mt-1">
                      {remainingPercent}% 크레딧 남음
                    </p>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={handleShowStats}
                      className="w-full px-3 py-2 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      📊 상담 통계
                    </button>
                    
                    <button
                      onClick={handleShowTips}
                      className="w-full px-3 py-2 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                    >
                      💡 상담 팁
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 상담 통계 모달 */}
        {showStats && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">📊 상담 통계</h2>
                  <button
                    onClick={handleShowStats}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>총 메시지:</span>
                    <span className="font-semibold">{consultationStats.totalMessages}개</span>
                  </div>
                  <div className="flex justify-between">
                    <span>사용자 질문:</span>
                    <span className="font-semibold">{consultationStats.userMessages}개</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AI 응답:</span>
                    <span className="font-semibold">{consultationStats.aiMessages}개</span>
                  </div>
                  <div className="flex justify-between">
                    <span>상담 시간:</span>
                    <span className="font-semibold">{consultationStats.duration}분</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 상담 팁 모달 */}
        {showTips && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">💡 상담 팁</h2>
                  <button
                    onClick={handleShowTips}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-500 font-bold">1.</span>
                    <span>구체적인 상황을 설명하세요</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-500 font-bold">2.</span>
                    <span>질문을 하나씩 해주세요</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-500 font-bold">3.</span>
                    <span>AI의 답변을 바탕으로 추가 질문하세요</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-500 font-bold">4.</span>
                    <span>상담 요약을 활용하세요</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ServiceLayout>
  );
}