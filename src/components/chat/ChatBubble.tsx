"use client";

import { useState } from "react";
import {
  Copy,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
  User,
  Bot,
} from "lucide-react";

interface ExpertInfo {
  name: string;
  avatar?: string;
  title?: string;
}

interface Message {
  id: string;
  type: "user" | "expert" | "ai" | "system";
  content: string;
  timestamp: Date;
  expertInfo?: ExpertInfo;
}

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble = ({ message }: ChatBubbleProps) => {
  const [showActions, setShowActions] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  const isUser = message.type === "user";
  const isExpert = message.type === "expert";
  const isAI = message.type === "ai";
  const isSystem = message.type === "system";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    // 복사 완료 알림 표시
    console.log("Message copied to clipboard");
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (isDisliked) setIsDisliked(false);
    // API 호출하여 피드백 전송
  };

  const handleDislike = () => {
    setIsDisliked(!isDisliked);
    if (isLiked) setIsLiked(false);
    // API 호출하여 피드백 전송
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-full">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div
        className={`flex ${
          isUser ? "flex-row-reverse" : "flex-row"
        } items-start space-x-3 max-w-[70%]`}
      >
        {/* 아바타 */}
        {!isUser && (
          <div className="flex-shrink-0">
            {isAI ? (
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-sm">
                <Bot className="text-white w-4 h-4" />
              </div>
            ) : message.expertInfo?.avatar ? (
              <img
                src={message.expertInfo.avatar}
                alt={message.expertInfo.name}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {message.expertInfo?.name?.charAt(0) || "E"}
                </span>
              </div>
            )}
          </div>
        )}

        {/* 메시지 내용 */}
        <div
          className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
        >
          {/* 발신자 정보 */}
          {!isUser && (
            <div className="flex items-center space-x-2 mb-1">
              {isAI ? (
                <>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-medium text-gray-900">
                      AI 어시스턴트
                    </span>
                  </div>
                  <span className="text-xs text-cyan-600">컨설트온 AI</span>
                </>
              ) : (
                message.expertInfo && (
                  <>
                    <span className="text-sm font-medium text-gray-900">
                      {message.expertInfo.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {message.expertInfo.title}
                    </span>
                  </>
                )
              )}
              <span className="text-xs text-gray-400">
                {formatTime(message.timestamp)}
              </span>
            </div>
          )}

          {/* 메시지 버블 */}
          <div className="relative group">
            <div
              className={`px-4 py-2 rounded-2xl relative ${
                isUser
                  ? "bg-blue-600 text-white"
                  : isAI
                    ? "bg-gradient-to-r from-cyan-50 via-blue-50 to-indigo-50 text-gray-900 border border-cyan-200"
                    : "bg-white text-gray-900 border border-gray-200"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap break-words">
                {message.content}
              </p>
            </div>

            {/* 사용자 메시지 시간 */}
            {isUser && (
              <div className="text-xs text-gray-500 mt-1 text-right">
                {formatTime(message.timestamp)}
              </div>
            )}

            {/* 액션 버튼들 */}
            {showActions && (
              <div
                className={`absolute top-0 ${
                  isUser ? "right-full mr-2" : "left-full ml-2"
                } flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity`}
              >
                {/* 복사 버튼 */}
                <button
                  onClick={handleCopy}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  title="복사"
                >
                  <Copy className="h-4 w-4" />
                </button>

                {/* 전문가 메시지에만 피드백 버튼 표시 */}
                {!isUser && (
                  <>
                    <button
                      onClick={handleLike}
                      className={`p-1 rounded transition-colors ${
                        isLiked
                          ? "text-green-600 bg-green-100"
                          : "text-gray-400 hover:text-green-600 hover:bg-green-100"
                      }`}
                      title="도움이 됨"
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </button>

                    <button
                      onClick={handleDislike}
                      className={`p-1 rounded transition-colors ${
                        isDisliked
                          ? "text-red-600 bg-red-100"
                          : "text-gray-400 hover:text-red-600 hover:bg-red-100"
                      }`}
                      title="개선 필요"
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </button>
                  </>
                )}

                {/* 더보기 버튼 */}
                <button
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  title="더보기"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
