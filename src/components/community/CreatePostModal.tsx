"use client";

import { useState } from "react";
import { X, Image, Link, Hash } from "lucide-react";

interface PostData {
  title: string;
  content: string;
  category: string;
  tags: string[];
}

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: PostData) => void;
}

const CreatePostModal = ({
  isOpen,
  onClose,
  onSubmit,
}: CreatePostModalProps) => {
  const [formData, setFormData] = useState<PostData>({
    title: "",
    content: "",
    category: "",
    tags: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    { value: "consultation", label: "상담요청" },
    { value: "review", label: "후기" },
    { value: "question", label: "질문" },
    { value: "tip", label: "팁" },
    { value: "discussion", label: "토론" },
  ];

  const handleInputChange = (field: keyof PostData, value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // 에러 클리어
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "제목을 입력해주세요.";
    }

    if (!formData.content.trim()) {
      newErrors.content = "내용을 입력해주세요.";
    }

    if (!formData.category) {
      newErrors.category = "카테고리를 선택해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const postData = {
      ...formData,
      tags: formData.tags
        .map((tag) => tag.trim())
        .filter((tag) => tag),
    };

    onSubmit && onSubmit(postData);
    setFormData({ title: "", content: "", category: "", tags: [] });
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setFormData({ title: "", content: "", category: "", tags: [] });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">새 게시글 작성</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* 폼 */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]"
        >
          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="게시글 제목을 입력하세요"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* 카테고리 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              카테고리 <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.category ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">카테고리를 선택하세요</option>
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
            )}
          </div>

          {/* 내용 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={8}
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              placeholder="게시글 내용을 입력하세요"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                errors.content ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content}</p>
            )}
          </div>

          {/* 태그 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              태그
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={formData.tags.join(", ")}
                onChange={(e) =>
                  handleInputChange("tags", e.target.value.split(",").map((tag) => tag.trim()))
                }
                placeholder="태그를 쉼표로 구분하여 입력하세요 (예: 상담후기, 스트레스관리)"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              태그는 다른 사용자들이 게시글을 찾는데 도움이 됩니다.
            </p>
          </div>

          {/* 첨부 기능 (향후 확장용) */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                disabled
              >
                <Image className="h-4 w-4" />
                <span className="text-sm">이미지 첨부</span>
              </button>
              <button
                type="button"
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                disabled
              >
                <Link className="h-4 w-4" />
                <span className="text-sm">링크 첨부</span>
              </button>
              <span className="text-xs text-gray-400 ml-auto">
                곧 출시 예정
              </span>
            </div>
          </div>
        </form>

        {/* 푸터 */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            게시하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
