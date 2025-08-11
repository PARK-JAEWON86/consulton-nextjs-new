import { ChatHistory } from "@/components/chat/ChatHistory";
import { QuestionInput } from "@/components/chat/QuestionInput";
import { ChatQuotaBar } from "@/components/chat/ChatQuotaBar";

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">AI 상담</h1>
          <p className="text-gray-600">
            AI 전문가와 채팅을 통해 상담을 받아보세요.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <ChatQuotaBar />
          </div>

          <div className="h-96 overflow-y-auto p-4">
            <ChatHistory />
          </div>

          <div className="p-4 border-t">
            <QuestionInput />
          </div>
        </div>
      </div>
    </div>
  );
}
