"use client";

import { useState, useRef } from "react";
import { Send, Paperclip, Smile, Mic, MicOff } from "lucide-react";

interface QuestionInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const QuestionInput = ({
  value,
  onChange,
  onSend,
  placeholder = "질문을 입력하세요...",
  disabled = false,
}: QuestionInputProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const emojis = ["😊", "👍", "❤️", "😄", "🤔", "👌", "🙏", "💡", "🎉", "😅"];

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (value.trim() && !disabled) {
      onSend(value.trim());
      onChange("");
      setShowEmojiPicker(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // 파일 업로드 처리
      console.log("Files selected:", files);
      // 실제로는 파일을 서버에 업로드하고 메시지에 첨부
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    onChange(value + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // 음성 녹음 시작
      console.log("Start recording");
    } else {
      // 음성 녹음 중지
      console.log("Stop recording");
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
    }
  };

  return (
    <div className="relative">
      {/* 이모지 피커 */}
      {showEmojiPicker && (
        <div className="absolute bottom-full mb-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10">
          <div className="grid grid-cols-5 gap-2">
            {emojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleEmojiSelect(emoji)}
                className="p-2 hover:bg-gray-100 rounded text-lg transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 메인 입력 영역 */}
      <div className="flex items-end space-x-3 bg-white border border-gray-300 rounded-lg p-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
        {/* 파일 첨부 버튼 */}
        <button
          onClick={() => !disabled && fileInputRef.current?.click()}
          disabled={disabled}
          className={`flex-shrink-0 p-2 transition-colors rounded-lg ${
            disabled
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          }`}
          title="파일 첨부"
        >
          <Paperclip className="h-5 w-5" />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileUpload}
          className="hidden"
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
        />

        {/* 텍스트 입력 영역 */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              if (!disabled) {
                onChange(e.target.value);
                adjustTextareaHeight();
              }
            }}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full resize-none border-0 outline-none focus:ring-0 text-sm placeholder-gray-500 bg-transparent ${
              disabled ? "cursor-not-allowed text-gray-400" : ""
            }`}
            rows={1}
            style={{ minHeight: "24px", maxHeight: "120px" }}
          />
        </div>

        {/* 우측 버튼들 */}
        <div className="flex items-center space-x-2">
          {/* 이모지 버튼 */}
          <button
            onClick={() => !disabled && setShowEmojiPicker(!showEmojiPicker)}
            disabled={disabled}
            className={`flex-shrink-0 p-2 transition-colors rounded-lg ${
              disabled
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            }`}
            title="이모지"
          >
            <Smile className="h-5 w-5" />
          </button>

          {/* 음성 녹음 버튼 */}
          <button
            onClick={() => !disabled && toggleRecording()}
            disabled={disabled}
            className={`flex-shrink-0 p-2 transition-colors rounded-lg ${
              disabled
                ? "text-gray-300 cursor-not-allowed"
                : isRecording
                  ? "text-red-600 bg-red-50 hover:bg-red-100"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            }`}
            title={isRecording ? "녹음 중지" : "음성 녹음"}
          >
            {isRecording ? (
              <MicOff className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </button>

          {/* 전송 버튼 */}
          <button
            onClick={handleSend}
            disabled={!value.trim() || disabled}
            className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
              value.trim() && !disabled
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
            title="전송 (Enter)"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* 녹음 상태 표시 */}
      {isRecording && (
        <div className="absolute -top-12 left-0 right-0 bg-red-50 border border-red-200 rounded-lg p-2 flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-red-700 font-medium">
            음성 녹음 중...
          </span>
          <button
            onClick={toggleRecording}
            className="text-sm text-red-600 hover:text-red-800 font-medium"
          >
            중지
          </button>
        </div>
      )}

      {/* 도움말 텍스트 */}
      <div className="mt-2 flex justify-between text-xs text-gray-500">
        <span>Enter로 전송, Shift+Enter로 줄바꿈</span>
        <span>{value.length}/2000</span>
      </div>
    </div>
  );
};

export default QuestionInput;
