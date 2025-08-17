"use client";

import { useState } from "react";
import { TrendingUp, User, MessageCircle, Heart, Edit3, ChevronDown, ChevronUp, UserCheck, Briefcase } from "lucide-react";

interface Category {
  id: string;
  name: string;
  count: number;
}

interface CategorySidebarProps {
  categories: Category[];
  activeTab: string;
  onTabChange: (categoryId: string) => void;
  popularTags?: string[];
  onTagClick?: (tag: string) => void;
}

const CategorySidebar = ({
  categories,
  activeTab,
  onTabChange,
  popularTags = [],
  onTagClick,
}: CategorySidebarProps) => {
  const [showAllCategories, setShowAllCategories] = useState(false);
  
  // 상위 7개 카테고리 (전체 포함)
  const visibleCategories = showAllCategories ? categories : categories.slice(0, 7);
  const hasMoreCategories = categories.length > 7;

  return (
    <div className="w-72 flex-shrink-0 space-y-4">
      {/* 개인 프로필 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
            김
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">김철수</h3>
            <p className="text-sm text-gray-500">활성 멤버</p>
          </div>
          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            <Edit3 className="h-4 w-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-50 rounded-lg mx-auto mb-1">
              <MessageCircle className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-xs font-medium text-gray-900">23</p>
            <p className="text-xs text-gray-500">게시글</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-red-50 rounded-lg mx-auto mb-1">
              <Heart className="h-4 w-4 text-red-600" />
            </div>
            <p className="text-xs font-medium text-gray-900">156</p>
            <p className="text-xs text-gray-500">받은 좋아요</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-green-50 rounded-lg mx-auto mb-1">
              <User className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-xs font-medium text-gray-900">89</p>
            <p className="text-xs text-gray-500">팔로워</p>
          </div>
        </div>
        

        <button className="w-full bg-blue-500 text-white py-2.5 px-4 rounded-lg font-medium text-sm hover:bg-blue-600 transition-colors duration-200 shadow-sm">
          새 글 작성하기
        </button>
      </div>

      {/* 카테고리 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-4">카테고리</h3>
        <div className="space-y-2">
          {visibleCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => onTabChange(category.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === category.id
                  ? "bg-blue-50 text-blue-600 border border-blue-200"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span>{category.name}</span>
              <span className="text-sm text-gray-400">{category.count}</span>
            </button>
          ))}
          
          {/* 더보기/접기 버튼 */}
          {hasMoreCategories && (
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="w-full flex items-center justify-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
            >
              <span className="mr-1">
                {showAllCategories ? "접기" : `더보기 (+${categories.length - 7})`}
              </span>
              {showAllCategories ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* 인기 태그 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-orange-500" />
          <h3 className="font-semibold text-gray-900">인기 태그</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagClick && onTagClick(tag)}
              className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-sm hover:bg-blue-100 hover:text-blue-600 transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* 커뮤니티 통계 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-4">커뮤니티 현황</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">전체 게시글</span>
            <span className="text-sm font-medium text-gray-900">1,247</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">활성 사용자</span>
            <span className="text-sm font-medium text-gray-900">324</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">오늘 새글</span>
            <span className="text-sm font-medium text-blue-600">12</span>
          </div>
        </div>
      </div>

      {/* 커뮤니티 규칙 */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
        <h4 className="font-medium text-blue-900 mb-2">커뮤니티 규칙</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• 서로를 존중하며 예의를 지켜주세요</li>
          <li>• 개인정보 공유를 금지합니다</li>
          <li>• 광고성 게시글은 삭제됩니다</li>
          <li>• 전문적인 조언은 자격을 갖춘 전문가에게</li>
        </ul>
      </div>
    </div>
  );
};

export default CategorySidebar;
