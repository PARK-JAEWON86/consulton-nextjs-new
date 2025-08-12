"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  Clock,
  User,
  Calendar,
  Search,
  Filter,
  Plus,
  Download,
  Share2,
} from "lucide-react";
import ServiceLayout from "@/components/layout/ServiceLayout";

interface ConsultationSummary {
  id: string;
  title: string;
  date: Date;
  duration: number;
  expert: {
    name: string;
    title: string;
  };
  status: "completed" | "processing" | "failed";
  creditsUsed: number;
  hasRecording: boolean;
  tags: string[];
}

export default function SummaryPage() {
  const router = useRouter();
  const [summaries, setSummaries] = useState<ConsultationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // 더미 상담 요약 데이터
  const mockSummaries: ConsultationSummary[] = [
    {
      id: "123",
      title: "온라인 쇼핑몰 마케팅 전략 상담",
      date: new Date("2024-01-15T14:30:00"),
      duration: 45,
      expert: {
        name: "이민수",
        title: "디지털 마케팅 전문가",
      },
      status: "completed",
      creditsUsed: 25,
      hasRecording: true,
      tags: ["마케팅", "디지털마케팅", "SNS"],
    },
    {
      id: "124",
      title: "창업 아이템 검증 및 사업계획 수립",
      date: new Date("2024-01-10T10:00:00"),
      duration: 60,
      expert: {
        name: "박영희",
        title: "창업 컨설턴트",
      },
      status: "completed",
      creditsUsed: 30,
      hasRecording: true,
      tags: ["창업", "사업계획", "검증"],
    },
    {
      id: "125",
      title: "개인 브랜딩 및 SNS 전략",
      date: new Date("2024-01-08T16:00:00"),
      duration: 30,
      expert: {
        name: "김지원",
        title: "브랜딩 전문가",
      },
      status: "processing",
      creditsUsed: 20,
      hasRecording: false,
      tags: ["브랜딩", "SNS", "개인마케팅"],
    },
    {
      id: "126",
      title: "투자 유치 전략 및 피칭 준비",
      date: new Date("2024-01-05T11:30:00"),
      duration: 90,
      expert: {
        name: "최동현",
        title: "투자 컨설턴트",
      },
      status: "completed",
      creditsUsed: 40,
      hasRecording: true,
      tags: ["투자", "피칭", "전략"],
    },
  ];

  useEffect(() => {
    // 실제로는 API에서 데이터 가져오기
    setLoading(true);
    setTimeout(() => {
      setSummaries(mockSummaries);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredSummaries = summaries.filter((summary) => {
    const matchesSearch =
      summary.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      summary.expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      summary.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus =
      statusFilter === "all" || summary.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "완료";
      case "processing":
        return "처리중";
      case "failed":
        return "실패";
      default:
        return "알 수 없음";
    }
  };

  const handleSummaryClick = (id: string) => {
    router.push(`/summary/${id}`);
  };

  if (loading) {
    return (
      <ServiceLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">
                상담 요약을 불러오고 있습니다...
              </p>
            </div>
          </div>
        </div>
      </ServiceLayout>
    );
  }

  return (
    <ServiceLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                상담 요약
              </h1>
              <p className="text-gray-600">
                상담 내용을 요약하고 액션 아이템을 확인하세요.
              </p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>새 상담 요약</span>
            </button>
          </div>

          {/* 검색 및 필터 */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="상담 제목, 전문가, 태그로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">전체 상태</option>
              <option value="completed">완료</option>
              <option value="processing">처리중</option>
              <option value="failed">실패</option>
            </select>
          </div>
        </div>

        {/* 상담 요약 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSummaries.map((summary) => (
            <div
              key={summary.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleSummaryClick(summary.id)}
            >
              <div className="p-6">
                {/* 헤더 */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {summary.title}
                    </h3>
                    <div className="flex items-center space-x-2 mb-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          summary.status
                        )}`}
                      >
                        {getStatusText(summary.status)}
                      </span>
                      {summary.hasRecording && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          녹화
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 전문가 정보 */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {summary.expert.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {summary.expert.title}
                    </div>
                  </div>
                </div>

                {/* 상담 정보 */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{summary.date.toLocaleDateString("ko-KR")}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{summary.duration}분</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    사용 크레딧: {summary.creditsUsed}
                  </div>
                </div>

                {/* 태그 */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {summary.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                  {summary.tags.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      +{summary.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* 액션 버튼 */}
                <div className="flex items-center space-x-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // 다운로드 로직
                    }}
                    className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>다운로드</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // 공유 로직
                    }}
                    className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>공유</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 빈 상태 */}
        {filteredSummaries.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              상담 요약이 없습니다
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== "all"
                ? "검색 조건에 맞는 상담 요약이 없습니다."
                : "아직 상담 요약이 생성되지 않았습니다."}
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              첫 상담 시작하기
            </button>
          </div>
        )}
      </div>
    </ServiceLayout>
  );
}
