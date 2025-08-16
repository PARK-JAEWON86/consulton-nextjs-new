"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { ko } from "date-fns/locale/ko";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  FileText,
  User,
  Video,
  MessageCircle,
  Phone,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useConsultationsStore } from "@/stores/consultationsStore";

type DetailItem = {
  id: number;
  date: string;
  customer: string;
  topic: string;
  amount: number;
  status: "completed" | "scheduled" | "canceled";
  method?: "chat" | "video" | "voice" | "call";
  duration?: number;
  summary?: string;
  notes?: string;
  issue?: {
    type: "refund" | "quality" | "other";
    reason: string;
    createdAt: string; // ISO
    status: "open" | "resolved" | "rejected";
  };
};

function formatCredits(amount: number) {
  return `${amount.toLocaleString()} 크레딧`;
}

function getMethodLabel(method?: string) {
  if (!method) return "-";
  if (method === "video") return "화상 상담";
  if (method === "chat") return "채팅 상담";
  if (method === "voice" || method === "call") return "음성 상담";
  return method;
}

export default function ExpertConsultationDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const items = useConsultationsStore((s) => s.items);
  const updateById = useConsultationsStore((s) => s.updateById);

  const id = Number(params?.id);

  const fallbackItems: DetailItem[] = useMemo(
    () => [
      {
        id: 3000,
        date: "2024-05-09T10:00:00Z",
        customer: "김민수",
        topic: "진로 상담",
        amount: 80,
        status: "completed",
        method: "chat",
        duration: 40,
        summary: "진로 방향 설정 및 목표 수립에 대한 상담을 진행했습니다.",
      },
      {
        id: 3001,
        date: "2024-05-05T08:00:00Z",
        customer: "박지영",
        topic: "심리 상담",
        amount: 299,
        status: "completed",
        method: "video",
        duration: 60,
        summary: "스트레스 관리와 일상 루틴 개선 방안을 논의했습니다.",
      },
    ],
    []
  );

  const record: DetailItem | undefined = useMemo(() => {
    const fromStore = items.find((it) => it.id === id);
    if (fromStore) return fromStore;
    return fallbackItems.find((it) => it.id === id);
  }, [items, id, fallbackItems]);

  if (!record) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-gray-700 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> 뒤로가기
          </button>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center text-gray-600">
            해당 상담 내역을 찾을 수 없습니다.
          </div>
        </div>
      </div>
    );
  }

  const StatusBadge = () => {
    const base =
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    if (record.status === "completed")
      return (
        <span className={`${base} bg-green-100 text-green-800`}>완료</span>
      );
    if (record.status === "scheduled")
      return (
        <span className={`${base} bg-blue-100 text-blue-800`}>예약됨</span>
      );
    return <span className={`${base} bg-gray-100 text-gray-800`}>취소됨</span>;
  };

  const MethodIcon = () => {
    if (record.method === "video")
      return <Video className="h-4 w-4 mr-2 text-gray-400" />;
    if (record.method === "chat")
      return <MessageCircle className="h-4 w-4 mr-2 text-gray-400" />;
    if (record.method === "voice" || record.method === "call")
      return <Phone className="h-4 w-4 mr-2 text-gray-400" />;
    return <FileText className="h-4 w-4 mr-2 text-gray-400" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-gray-700 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> 뒤로가기
        </button>

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            상담 상세 #{record.id}
          </h1>
          <StatusBadge />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="p-6 border-b md:border-b-0 md:border-r">
              <div className="text-xs text-gray-500 mb-1">고객</div>
              <div className="flex items-center text-gray-900">
                <User className="h-4 w-4 mr-2 text-gray-400" />{" "}
                {record.customer}
              </div>
            </div>
            <div className="p-6 border-b">
              <div className="text-xs text-gray-500 mb-1">상담 일자</div>
              <div className="flex items-center text-gray-900">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                {format(new Date(record.date), "PPP p", { locale: ko })}
              </div>
            </div>
            <div className="p-6 border-b md:border-b-0 md:border-r">
              <div className="text-xs text-gray-500 mb-1">상담 방법</div>
              <div className="flex items-center text-gray-900">
                <MethodIcon /> {getMethodLabel(record.method)}
              </div>
            </div>
            <div className="p-6 border-b">
              <div className="text-xs text-gray-500 mb-1">상담 시간</div>
              <div className="text-gray-900">
                {record.duration ? `${record.duration}분` : "-"}
              </div>
            </div>
            <div className="p-6 border-b md:border-b-0 md:border-r">
              <div className="text-xs text-gray-500 mb-1">정산 크레딧</div>
              <div className="flex items-center text-gray-900">
                <CreditCard className="h-4 w-4 mr-2 text-gray-400" />{" "}
                {formatCredits(record.amount)}
              </div>
            </div>
            <div className="p-6">
              <div className="text-xs text-gray-500 mb-1">상담 주제</div>
              <div className="flex items-center text-gray-900">
                <FileText className="h-4 w-4 mr-2 text-gray-400" />{" "}
                {record.topic}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            상담 요약
          </h2>
          <div className="text-sm text-gray-700 whitespace-pre-line">
            {record.summary || "상담 요약 정보가 아직 등록되지 않았습니다."}
          </div>
        </div>

        {/* 노트 작성 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">전문가 노트</h2>
            <button
              onClick={() => {
                const area = document.getElementById(
                  "expert-notes"
                ) as HTMLTextAreaElement | null;
                const next = area?.value ?? "";
                updateById(id, { notes: next });
                alert("노트가 저장되었습니다.");
              }}
              className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
            >
              저장
            </button>
          </div>
          <textarea
            id="expert-notes"
            defaultValue={record.notes ?? ""}
            placeholder="상담 중 메모, 후속조치, 고객과의 합의사항 등을 기록하세요"
            className="w-full min-h-32 border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        {/* 환불/이슈 처리 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">환불/이슈</h2>
            <div className="flex gap-2">
              {/* 고객이 환불 요청(Refund 이슈)을 올린 경우에만 승인/거절 버튼 노출 */}
              {record.issue?.type === "refund" &&
              record.issue.status === "open" ? (
                <>
                  <button
                    onClick={() => {
                      updateById(id, {
                        issue: {
                          ...(record.issue as any),
                          status: "resolved",
                        },
                      });
                      alert("환불이 승인되었습니다.");
                    }}
                    className="inline-flex items-center px-3 py-1.5 rounded-md border text-sm text-green-700 border-green-300 hover:bg-green-50"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" /> 환불 승인
                  </button>
                  <button
                    onClick={() => {
                      const reason = prompt("거절 사유를 입력해주세요.") ?? "";
                      updateById(id, {
                        issue: {
                          ...(record.issue as any),
                          status: "rejected",
                          reason: reason || (record.issue?.reason ?? ""),
                        },
                      });
                      alert("환불이 거절되었습니다.");
                    }}
                    className="inline-flex items-center px-3 py-1.5 rounded-md border text-sm text-red-700 border-red-300 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4 mr-1" /> 환불 거절
                  </button>
                </>
              ) : (
                // 일반 이슈는 전문가가 등록 가능
                <button
                  onClick={() => {
                    const reason = prompt("이슈 내용을 입력해주세요.");
                    if (!reason) return;
                    updateById(id, {
                      issue: {
                        type: "quality",
                        reason,
                        createdAt: new Date().toISOString(),
                        status: "open",
                      },
                    });
                    alert("이슈가 등록되었습니다.");
                  }}
                  className="inline-flex items-center px-3 py-1.5 rounded-md border text-sm text-amber-700 border-amber-300 hover:bg-amber-50"
                >
                  <AlertTriangle className="h-4 w-4 mr-1" /> 이슈 등록
                </button>
              )}
            </div>
          </div>

          {record.issue && (
            <div className="mt-4 border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-gray-900">등록된 이슈</div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    record.issue.status === "open"
                      ? "bg-amber-100 text-amber-800"
                      : record.issue.status === "resolved"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {record.issue.status}
                </span>
              </div>
              <div className="text-sm text-gray-700 whitespace-pre-line mb-2">
                {record.issue.reason}
              </div>
              <div className="text-xs text-gray-500">
                등록일:{" "}
                {format(new Date(record.issue.createdAt), "PPP p", {
                  locale: ko,
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
