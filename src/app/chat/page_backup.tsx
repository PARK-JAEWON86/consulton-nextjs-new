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
  History,
  Clock,
  Trash2,
  RefreshCw,
} from "lucide-react";
import QuestionInput from "@/components/chat/QuestionInput";
import ChatHistory from "@/components/chat/ChatHistory";
import ChatBubble from "@/components/chat/ChatBubble";
import ServiceLayout from "@/components/layout/ServiceLayout";
import { useAppStore } from "@/stores/appStore";
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

export default function ChatPage() {
  const { isAuthenticated } = useAppStore();
  
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            AI 상담 어시스턴트
          </h1>
          <p className="text-gray-600 mt-1">
            AI 상담을 통해 자신의 문제를 정리하고 적절한 전문가를 찾는 데 도움을 받으세요
          </p>
        </div>
      </div>
    </ServiceLayout>
  );
}
