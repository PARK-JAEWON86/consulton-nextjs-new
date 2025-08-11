"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Paperclip,
  Smile,
  Bot,
  CheckCircle,
  Users,
  MessageSquare,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import QuestionInput from "@/components/chat/QuestionInput";
import ChatHistory from "@/components/chat/ChatHistory";
import ChatBubble from "@/components/chat/ChatBubble";
import ChatQuotaBar from "@/components/chat/ChatQuotaBar";

interface Message {
  id: string;
  type: "ai" | "user";
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
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
  const [showQuickChatModal, setShowQuickChatModal] = useState(false);
  const [messageCount, setMessageCount] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // 메시지가 2개 이상일 때만 자동 스크롤 (초기 로드 시에는 스크롤하지 않음)
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages]);

  // 사이드바의 Quick AI 상담 버튼 클릭 감지
  useEffect(() => {
    // sessionStorage에서 quick-chat 플래그 확인
    const shouldShowQuickChat = sessionStorage.getItem("showQuickChatModal");
    if (shouldShowQuickChat === "true") {
      setShowQuickChatModal(true);
      sessionStorage.removeItem("showQuickChatModal");
    }
  }, []);

  const generateAIResponse = (userMessage: string, currentMessageCount: number) => {
    // AI 응답 시나리오 (실제로는 AI API를 호출)
    const responses = [
      "말씀해주신 상황을 잘 이해했습니다. 더 구체적인 정보를 알려주시면 더 정확한 조언을 드릴 수 있어요.",
      "흥미로운 케이스네요! 이런 상황에서는 몇 가지 접근 방법이 있습니다. 어떤 부분이 가장 우선순위인지 알려주세요.",
      "지금까지 말씀해주신 내용을 종합해보면, 핵심 이슈가 명확해지고 있습니다. 추가로 궁금한 점이 있으실까요?",
      "네, 충분한 정보를 주셨습니다. 이제 구체적인 해결책과 실행 방안을 제시해드릴 수 있을 것 같습니다.",
    ];

    if (currentMessageCount >= 7) {
      return {
        content:
          "지금까지의 상담 내용을 바탕으로 종합적인 분석과 조언을 정리해드렸습니다. 더 전문적인 도움이 필요하시다면 전문가 매칭을 받으시거나, 커뮤니티에 상세한 상담 내용을 공유하여 전문가들의 추가 조언을 받아보시는 것을 추천드립니다.",
        isComplete: true,
      };
    }

    return {
      content:
        responses[Math.min(currentMessageCount - 2, responses.length - 1)],
      isComplete: false,
    };
  };

  const generateConsultationSummary = () => {
    // 실제로는 AI가 대화 내용을 분석하여 요약 생성
    return `【상담 주제】 온라인 비즈니스 마케팅 전략
【주요 고민】 고객 유치 및 매출 증대 방안
【핵심 이슈】 타겟 고객 설정, 마케팅 채널 선택, 예산 배분
【추천 솔루션】 SNS 마케팅 강화, 콘텐츠 마케팅 도입, 데이터 분석 기반 최적화
【예상 투입 시간】 3-6개월 장기 프로젝트`;
  };

  const handleSendMessage = (message: string) => {
    if (!message.trim() || isConsultationComplete) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: message,
      timestamp: new Date(),
    };

    const newMessageCount = messageCount + 1;
    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    setMessageCount(newMessageCount);

    // AI 응답 시뮬레이션
    setIsTyping(true);
    setTimeout(() => {
      const aiResponseData = generateAIResponse(message, newMessageCount);
      const aiResponse: Message = {
        id: Date.now().toString() + 1,
        type: "ai",
        content: aiResponseData.content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);

      if (aiResponseData.isComplete) {
        setIsConsultationComplete(true);
        const summary = generateConsultationSummary();
        setConsultationSummary(summary);
      }
    }, 800 + Math.random() * 400);
  };

  const handleExpertMatching = () => {
    // 상담 요약에서 주제 추출
    const summary = consultationSummary || generateConsultationSummary();

    // 요약에서 주제 추출 (첫 번째 줄의 주제 부분)
    const lines = summary.split("\n");
    let topic = "";

    // 주제 추출 로직
    for (const line of lines) {
      if (line.includes("【상담 주제】")) {
        topic = line.replace("【상담 주제】", "").trim();
        break;
      }
    }

    // 주제가 없으면 기본값 설정
    if (!topic) {
      topic = "비즈니스 컨설팅";
    }

    // 전문가 찾기 페이지로 이동 (주제와 요약 모두 전달)
    const params = new URLSearchParams({
      topic: topic,
      summary: summary,
      fromChat: "true",
    });

    window.location.href = `/experts?${params.toString()}`;
  };

  const handleCommunityPost = () => {
    // 커뮤니티 글 작성 페이지로 이동 (임시로 alert 표시)
    alert(
      "커뮤니티 글 작성 기능이 구현될 예정입니다.\n\n상담 요약 내용:\n" +
        consultationSummary
    );
  };

  const handleContinueWithCredits = () => {
    // 크레딧 모달 표시
    setShowCreditModal(true);
  };

  const handleUseCredits = () => {
    // 크레딧 사용 처리
    alert("50크레딧을 사용하여 대화를 연장합니다.");
    setShowCreditModal(false);
  };

  const handleChargeCredits = () => {
    // 크레딧 충전 페이지로 이동
    window.location.href = "/credit-packages";
  };

  const handleQuickChat = () => {
    // Quick AI 상담 모달 표시
    setShowQuickChatModal(true);
  };

  const handleStartNewChat = () => {
    // 새로운 채팅 시작 - 현재 페이지를 새로고침하여 초기화
    window.location.reload();
  };

  const handleEndConsultation = () => {
    // 대화 종료 처리 - 요약 표시
    const summary = generateConsultationSummary();
    setConsultationSummary(summary);
    setShowSummary(true);
    setIsConsultationComplete(true);
  };

  const handleResumeChat = () => {
    // 무료 채팅이 남아있으면 채팅창으로 돌아가기
    if (messageCount < 8) {
      setShowSummary(false);
      setIsConsultationComplete(false);
    } else {
      // 무료 채팅을 모두 사용한 경우 완료 상태 유지
      alert(
        "무료 채팅을 모두 사용하셨습니다. 크레딧을 사용하여 대화를 연장하거나 새로운 상담을 시작해주세요."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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

              {/* 크레딧 정보 */}
              <div className="bg-gradient-to-r from-cyan-50 via-blue-50 to-indigo-50 p-4 rounded-lg border border-cyan-200 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-cyan-900">필요 크레딧</h3>
                    <p className="text-sm text-cyan-700">50크레딧</p>
                  </div>
                  <div className="text-right">
                    <h3 className="font-medium text-cyan-900">보유 크레딧</h3>
                    <p className="text-sm text-cyan-700">30크레딧</p>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                  <p className="text-xs text-red-600 mt-1">
                    크레딧이 부족합니다
                  </p>
                </div>
              </div>

              {/* 버튼들 */}
              <div className="space-y-3">
                <button
                  onClick={handleUseCredits}
                  disabled={true}
                  className="w-full bg-gray-300 text-gray-500 py-3 px-4 rounded-lg font-medium cursor-not-allowed"
                >
                  크레딧 사용하기 (50크레딧)
                </button>

                <button
                  onClick={handleChargeCredits}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  크레딧 충전하기
                </button>
              </div>

              {/* 취소 버튼 */}
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

      {/* Quick AI 상담 모달 */}
      {showQuickChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  새로운 AI 상담 시작
                </h2>
                <p className="text-gray-600">
                  새로운 AI 상담을 시작하시겠습니까?
                </p>
              </div>

              {/* 현재 상태 정보 */}
              <div className="bg-gradient-to-r from-cyan-50 via-blue-50 to-indigo-50 p-4 rounded-lg border border-cyan-200 mb-6">
                <h3 className="font-medium text-cyan-900 mb-3">현재 상태</h3>
                <div className="space-y-3 text-sm text-cyan-700">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>무료 채팅 사용량</span>
                      <span className="font-medium">
                        {Math.round((messageCount / 8) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          messageCount <= 4
                            ? "bg-green-500"
                            : messageCount <= 6
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${(messageCount / 8) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-green-600">
                        사용: {Math.round((messageCount / 8) * 100)}%
                      </span>
                      <span className="text-blue-600">
                        남음: {Math.round(((8 - messageCount) / 8) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span>상담 상태:</span>
                    <span className="font-medium">
                      {isConsultationComplete ? "완료" : "진행 중"}
                    </span>
                  </div>
                </div>
                {!isConsultationComplete && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-xs text-yellow-800">
                      ⚠️ 현재 상담이 진행 중입니다. 새로운 채팅을 시작하면 현재
                      사용량({messageCount}/8)이 그대로 적용됩니다.
                    </p>
                  </div>
                )}
              </div>

              {/* 버튼들 */}
              <div className="space-y-3">
                <button
                  onClick={handleStartNewChat}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  새로운 채팅 시작하기
                </button>
              </div>

              {/* 취소 버튼 */}
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowQuickChatModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  AI 상담 어시스턴트
                </h1>
                <p className="text-gray-600 mt-2">
                  컨설트온 AI • 24시간 상담 가능
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 채팅 영역 */}
        <div
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          style={{ height: "calc(100vh - 300px)" }}
        >
          <div className="h-full flex">
            {/* 메인 채팅 */}
            <div className="flex-1 flex flex-col h-full">
              {/* 메시지 목록 */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <ChatBubble key={message.id} message={message} />
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
                  <div className="space-y-4">
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
                        <div className="text-sm text-gray-700 whitespace-pre-line mb-6">
                          {consultationSummary}
                        </div>

                        <div className="flex space-x-3">
                          <button
                            onClick={handleExpertMatching}
                            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
                          >
                            <div className="flex items-center justify-center">
                              <Users className="w-4 h-4 mr-2" />
                              전문가 찾기
                            </div>
                          </button>

                          <button
                            onClick={handleCommunityPost}
                            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md"
                          >
                            <div className="flex items-center justify-center">
                              <MessageSquare className="w-4 h-4 mr-2" />
                              커뮤니티에 상담요청글 올리기
                            </div>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <QuestionInput
                    value={newMessage}
                    onChange={setNewMessage}
                    onSend={handleSendMessage}
                    placeholder="AI 어시스턴트에게 질문하거나 고민을 자세히 설명해주세요..."
                  />
                )}
              </div>
            </div>

            {/* 사이드바 */}
            <div className="w-64 bg-white border-l border-gray-200 h-full overflow-hidden flex flex-col">
              <div className="p-4 flex-1">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  AI 상담 정보
                </h3>

                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-cyan-50 via-blue-50 to-indigo-50 p-4 rounded-lg border border-cyan-200">
                    <h4 className="font-medium text-cyan-900">상담 상태</h4>
                    <div className="mt-3">
                      <ChatQuotaBar usedMessages={messageCount} />
                    </div>
                  </div>

                  {/* AI 어시스턴트 팁 */}
                  <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 p-4 rounded-lg border border-amber-200">
                    <div className="flex items-center mb-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mr-2">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                      <h4 className="font-medium text-amber-900">
                        {isConsultationComplete
                          ? "다음 단계 안내"
                          : "AI 어시스턴트 팁"}
                      </h4>
                    </div>
                    <div className="space-y-2 text-sm text-amber-800">
                      {isConsultationComplete ? (
                        <>
                          <div className="flex items-start">
                            <span className="text-amber-600 mr-2">•</span>
                            <span>
                              전문가 매칭으로 구체적인 솔루션을 받아보세요
                            </span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-amber-600 mr-2">•</span>
                            <span>
                              커뮤니티에 상담 요청글을 올려 추가 조언을 받으세요
                            </span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-amber-600 mr-2">•</span>
                            <span>
                              새로운 AI 상담을 시작하여 다른 관점에서
                              접근해보세요
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-start">
                            <span className="text-amber-600 mr-2">•</span>
                            <span>구체적인 상황을 설명해주세요</span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-amber-600 mr-2">•</span>
                            <span>
                              예산이나 시간 제약이 있다면 언급해주세요
                            </span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-amber-600 mr-2">•</span>
                            <span>이미 시도해본 방법이 있다면 알려주세요</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 액션 버튼들 - 하단 고정 */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="space-y-3">
                  <button
                    onClick={handleQuickChat}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <div className="text-center">
                      <div>새로운 AI상담시작</div>
                      <div className="text-xs opacity-80 mt-1">
                        새로운 상담 시작
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={handleContinueWithCredits}
                    className="w-full bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-cyan-500 hover:via-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <div className="text-center">
                      <div>대화 연장하기</div>
                      <div className="text-xs opacity-80 mt-1">+50크레딧</div>
                    </div>
                  </button>

                  <button
                    onClick={
                      showSummary ? handleResumeChat : handleEndConsultation
                    }
                    className={`w-full bg-gradient-to-r from-red-500 to-rose-600 text-white py-3 px-4 rounded-lg font-medium hover:from-red-600 hover:to-rose-700 transition-all duration-200 shadow-sm hover:shadow-md ${
                      isConsultationComplete && !showSummary
                        ? "animate-pulse"
                        : ""
                    }`}
                  >
                    <div className="text-center">
                      <div>
                        {showSummary ? "채팅으로 돌아가기" : "대화 종료"}
                      </div>
                      <div className="text-xs opacity-80 mt-1">
                        {showSummary
                          ? messageCount < 8
                            ? "채팅 계속하기"
                            : "AI 상담이 완료되었습니다"
                          : "요약본으로 전문가 찾기"}
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
