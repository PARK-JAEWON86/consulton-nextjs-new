"use client";

import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  AlertCircle,
  Clock,
  UserCheck,
} from "lucide-react";

interface Post {
  id: string;
  author: string;
  authorAvatar: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  isExpert?: boolean;
  isConsultationRequest?: boolean;
  urgency?: string;
  preferredMethod?: string;
  likes: number;
  comments: number;
}

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onExpertContact?: (postId: string) => void;
}

const PostCard = ({
  post,
  onLike,
  onComment,
  onShare,
  onExpertContact,
}: PostCardProps) => {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "높음":
        return "text-red-600 bg-red-50 border-red-200";
      case "보통":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "낮음":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow ${
        post.isConsultationRequest
          ? "border-blue-200 bg-blue-50/30"
          : "border-gray-200"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-medium">
            {post.authorAvatar}
          </span>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-gray-900">{post.author}</span>
            {post.isExpert && (
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                전문가
              </span>
            )}
            <span className="text-gray-500 text-sm">•</span>
            <span className="text-gray-500 text-sm">{post.createdAt}</span>
            <span
              className={`px-2 py-0.5 text-xs rounded-full ml-2 ${
                post.isConsultationRequest
                  ? "bg-orange-100 text-orange-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {post.category}
            </span>
            {post.isConsultationRequest && post.urgency && (
              <span
                className={`px-2 py-0.5 text-xs rounded-full border ${getUrgencyColor(
                  post.urgency,
                )}`}
              >
                {post.urgency}
              </span>
            )}
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2 cursor-pointer hover:text-blue-600 text-left">
            {post.title}
          </h3>

          <p className="text-gray-600 mb-3 line-clamp-2 text-left">
            {post.content}
          </p>

          <div className="flex flex-wrap gap-1 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-blue-600 hover:underline cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* 상담요청 전용 정보 */}
          {post.isConsultationRequest && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-4 text-sm">
                {post.preferredMethod && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-blue-700">
                      선호: {post.preferredMethod}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-700">전문가 상담 요청</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => onLike && onLike(post.id)}
                className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors"
              >
                <Heart className="h-4 w-4" />
                <span className="text-sm">{post.likes}</span>
              </button>
              <button
                onClick={() => onComment && onComment(post.id)}
                className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm">{post.comments}</span>
              </button>
              <button
                onClick={() => onShare && onShare(post.id)}
                className="flex items-center gap-1 text-gray-500 hover:text-green-500 transition-colors"
              >
                <Share2 className="h-4 w-4" />
                <span className="text-sm">공유</span>
              </button>

              {/* 상담요청 게시글의 전문가 컨택 버튼 */}
              {post.isConsultationRequest && (
                <button
                  onClick={() => onExpertContact && onExpertContact(post.id)}
                  className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <UserCheck className="h-4 w-4" />
                  <span>상담 제안</span>
                </button>
              )}
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
