"use client";

import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  AlertCircle,
  Clock,
  UserCheck,
  Bot,
  Sparkles,
  HelpCircle,
  Star,
  Award,
  MessageSquare,
} from "lucide-react";
import { maskPostAuthor, ProfileVisibility } from "@/utils/nameMasking";

interface Post {
  id: string;
  author: string;
  authorAvatar: string | null;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  postType: "consultation_request" | "consultation_review" | "expert_intro" | "general";
  isExpert?: boolean;
  isAISummary?: boolean;
  urgency?: string;
  preferredMethod?: string;
  likes: number;
  comments: number;
  profileVisibility?: ProfileVisibility;
  // 상담후기 관련 추가 필드
  consultationTopic?: string;
  rating?: number;
  expertName?: string;
  isVerified?: boolean;
  hasExpertReply?: boolean;
}

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onPostClick?: (postId: string) => void;
}

const PostCard = ({
  post,
  onLike,
  onComment,
  onShare,
  onPostClick,
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

  const getPostTypeInfo = (postType: string, isAISummary?: boolean) => {
    switch (postType) {
      case "consultation_request":
        if (isAISummary) {
          return {
            label: "AI 상담요약",
            icon: Bot,
            bgColor: "bg-purple-100",
            textColor: "text-purple-700",
            borderColor: "border-purple-200",
            cardBg: "bg-gradient-to-r from-purple-50/50 to-orange-50/50"
          };
        }
        return {
          label: "상담요청",
          icon: HelpCircle,
          bgColor: "bg-orange-100",
          textColor: "text-orange-700",
          borderColor: "border-orange-200",
          cardBg: "bg-orange-50/30"
        };
      case "consultation_review":
        return {
          label: "상담후기",
          icon: Star,
          bgColor: "bg-green-100",
          textColor: "text-green-700",
          borderColor: "border-green-200",
          cardBg: "bg-green-50/30"
        };
      case "expert_intro":
        return {
          label: "전문가소개",
          icon: Award,
          bgColor: "bg-blue-100",
          textColor: "text-blue-700",
          borderColor: "border-blue-200",
          cardBg: "bg-blue-50/30"
        };
      default:
        return {
          label: "일반글",
          icon: MessageSquare,
          bgColor: "bg-gray-100",
          textColor: "text-gray-700",
          borderColor: "border-gray-200",
          cardBg: "bg-white"
        };
    }
  };

  const postTypeInfo = getPostTypeInfo(post.postType, post.isAISummary);

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer ${postTypeInfo.borderColor} ${postTypeInfo.cardBg}`}
      onClick={() => onPostClick && onPostClick(post.id)}
    >
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          post.isAISummary
            ? "bg-gradient-to-r from-purple-500 to-blue-500" 
            : post.postType === "expert_intro"
            ? "bg-gradient-to-r from-blue-500 to-indigo-600"
            : "bg-blue-600"
        }`}>
          {post.isAISummary ? (
            <Bot className="h-5 w-5 text-white" />
          ) : (
            <span className="text-white text-sm font-medium">
              {post.authorAvatar || post.author.charAt(0)}
            </span>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-gray-900">
              {maskPostAuthor(
                post.author, 
                post.profileVisibility || "experts",
                false // TODO: 현재 사용자가 전문가인지 확인하는 로직 필요
              )}
            </span>
            {post.isExpert && (
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                전문가
              </span>
            )}
            
            {/* 게시글 타입 배지 */}
            <span className={`px-2 py-0.5 text-xs rounded-full flex items-center gap-1 ${postTypeInfo.bgColor} ${postTypeInfo.textColor}`}>
              <postTypeInfo.icon className="h-3 w-3" />
              {postTypeInfo.label}
            </span>
            
            <span className="text-gray-500 text-sm">•</span>
            <span className="text-gray-500 text-sm">{post.createdAt}</span>
            <span className={`px-2 py-0.5 text-xs rounded-full ml-2 ${postTypeInfo.bgColor} ${postTypeInfo.textColor}`}>
              {post.category}
            </span>
            {post.postType === "consultation_request" && post.urgency && (
              <span
                className={`px-2 py-0.5 text-xs rounded-full border ${getUrgencyColor(
                  post.urgency,
                )}`}
              >
                {post.urgency}
              </span>
            )}
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 text-left">
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

          {/* 게시글 타입별 전용 정보 */}
          {post.postType === "consultation_request" && (
            <div className={`${postTypeInfo.cardBg} border ${postTypeInfo.borderColor} rounded-lg p-3 mb-4`}>
              <div className="flex items-center gap-4 text-sm">
                {post.preferredMethod && (
                  <div className="flex items-center gap-1">
                    <Clock className={`h-4 w-4 ${postTypeInfo.textColor.replace('text-', 'text-').replace('-700', '-600')}`} />
                    <span className={postTypeInfo.textColor}>
                      선호: {post.preferredMethod}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <HelpCircle className={`h-4 w-4 ${postTypeInfo.textColor.replace('text-', 'text-').replace('-700', '-600')}`} />
                  <span className={postTypeInfo.textColor}>전문가 상담 요청</span>
                </div>
              </div>
            </div>
          )}

          {post.isAISummary && (
            <div className={`${postTypeInfo.cardBg} border ${postTypeInfo.borderColor} rounded-lg p-3 mb-4`}>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Bot className="h-4 w-4 text-purple-600" />
                  <span className="text-purple-700">AI 채팅상담으로 생성된 요약</span>
                </div>
                <div className="flex items-center gap-1">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  <span className="text-purple-700">자동 익명화 처리</span>
                </div>
              </div>
            </div>
          )}

          {post.postType === "expert_intro" && (
            <div className={`${postTypeInfo.cardBg} border ${postTypeInfo.borderColor} rounded-lg p-3 mb-4`}>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Award className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-700">전문가 프로필</span>
                </div>
                <div className="flex items-center gap-1">
                  <UserCheck className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-700">인증된 전문가</span>
                </div>
              </div>
            </div>
          )}

          {post.postType === "consultation_review" && (
            <div className={`${postTypeInfo.cardBg} border ${postTypeInfo.borderColor} rounded-lg p-3 mb-4`}>
              <div className="flex items-center gap-4 text-sm">
                {post.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-600 fill-current" />
                    <span className="text-green-700 font-medium">{post.rating}.0점</span>
                  </div>
                )}
                {post.expertName && (
                  <div className="flex items-center gap-1">
                    <UserCheck className="h-4 w-4 text-green-600" />
                    <span className="text-green-700">전문가: {post.expertName}</span>
                  </div>
                )}
                {post.isVerified && (
                  <div className="flex items-center gap-1">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <span className="text-blue-700">검증된 리뷰</span>
                  </div>
                )}
                {post.hasExpertReply && (
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4 text-purple-600" />
                    <span className="text-purple-700">전문가 답글</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLike && onLike(post.id);
                }}
                className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors"
              >
                <Heart className="h-4 w-4" />
                <span className="text-sm">{post.likes}</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onComment && onComment(post.id);
                }}
                className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm">{post.comments}</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShare && onShare(post.id);
                }}
                className="flex items-center gap-1 text-gray-500 hover:text-green-500 transition-colors"
              >
                <Share2 className="h-4 w-4" />
                <span className="text-sm">공유</span>
              </button>
            </div>
            <button 
              onClick={(e) => e.stopPropagation()}
              className="text-gray-400 hover:text-gray-600"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
