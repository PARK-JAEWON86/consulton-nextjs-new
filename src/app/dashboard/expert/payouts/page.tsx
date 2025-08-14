"use client";

import { useMemo, useState } from "react";
import { useConsultationsStore } from "@/stores/consultationsStore";
import { usePayoutsStore } from "@/stores/payoutsStore";

function formatCredits(n: number) {
  return `${n.toLocaleString()} 크레딧`;
}

const CREDIT_TO_KRW = 10; // 1 크레딧 = 10원
function formatKRW(n: number) {
  return `${n.toLocaleString()}원`;
}

export default function PayoutsPage() {
  const items = useConsultationsStore((s) => s.items);
  const { requests, addRequest } = usePayoutsStore();
  const [feeRate] = useState(0.1); // 10% 수수료 (예시)

  const completed = useMemo(
    () => items.filter((it) => it.status === "completed"),
    [items]
  );
  const gross = completed.reduce((acc, v) => acc + (v.amount || 0), 0);
  const totalFees = Math.round(gross * feeRate);
  const net = Math.max(0, gross - totalFees);

  const pendingAmount = useMemo(() => {
    const pendingSum = requests
      .filter((r) => r.status === "pending")
      .reduce((acc, r) => acc + (r.amount || 0), 0);
    return Math.max(0, net - pendingSum);
  }, [net, requests]);

  // 월별 집계 (전문가 매출/수수료/순수입)
  const currentYear = new Date().getFullYear();

  const months = useMemo(() => {
    const toDate = (d: string | Date | undefined) =>
      d ? new Date(d) : new Date(0);

    const completedThisYear = completed.filter((it) => {
      const d = toDate((it as any).date);
      return d.getFullYear() === currentYear;
    });

    const sums: number[] = Array.from({ length: 12 }, () => 0);
    completedThisYear.forEach((it) => {
      const d = toDate((it as any).date);
      const m = d.getMonth(); // 0~11
      sums[m] += (it as any).amount || 0;
    });

    const feeOf = (v: number) => Math.round(v * feeRate);
    const netOf = (v: number) => Math.max(0, v - feeOf(v));

    return sums.map((grossM, idx) => ({
      month: idx + 1,
      label: `${currentYear}년 ${idx + 1}월`,
      gross: grossM,
      fee: feeOf(grossM),
      net: netOf(grossM),
    }));
  }, [completed, currentYear, feeRate]);

  const incomeTaxWindow = useMemo(() => {
    // 종합소득세 신고/납부 기간: 통상 5/1 - 5/31
    // 2025년은 5/31이 토요일 → 익영업일인 6/2(월)까지 연장
    if (currentYear === 2025) return "5/1 - 6/2";
    return "5/1 - 5/31";
  }, [currentYear]);

  const handleRequestPayout = () => {
    if (pendingAmount <= 0) return;
    const fee = Math.round(pendingAmount * feeRate);
    addRequest(pendingAmount, fee);
    alert("출금 요청이 접수되었습니다.");
  };

  const downloadCSV = () => {
    const headers = ["id", "date", "customer", "topic", "amount", "status"];
    const rows = completed.map((c) => [
      c.id,
      c.date,
      c.customer,
      c.topic,
      c.amount,
      c.status,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `settlements.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadReceipt = (id: number) => {
    const content = `영수증\n요청 ID: ${id}\n발행일: ${new Date().toLocaleString()}\n액수: ${formatCredits(
      (requests.find((r) => r.id === id)?.amount || 0) as number
    )}`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt_${id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">정산/출금</h1>
            <p className="text-gray-600 mt-1">
              완료된 상담 기준 정산 내역과 출금 요청을 관리합니다.
            </p>
          </div>
          <button
            onClick={downloadCSV}
            className="h-10 px-4 rounded-md border text-sm hover:bg-gray-50"
          >
            CSV 다운로드
          </button>
        </div>

        {/* 요약 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border rounded-lg p-4">
            <div className="text-xs text-gray-500 mb-1">총 정산액(완료)</div>
            <div className="text-xl font-bold text-gray-900">
              {formatCredits(gross)}
            </div>
          </div>
          <div className="bg-white border rounded-lg p-4">
            <div className="text-xs text-gray-500 mb-1">수수료(예: 10%)</div>
            <div className="text-xl font-bold text-gray-900">
              {formatCredits(totalFees)}
            </div>
          </div>
          <div className="bg-white border rounded-lg p-4">
            <div className="text-xs text-gray-500 mb-1">출금 가능액</div>
            <div className="text-xl font-bold text-gray-900">
              {formatCredits(net)}
            </div>
          </div>
        </div>

        {/* 출금 요청 */}
        <div className="bg-white border rounded-lg p-4 mb-8">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-medium text-gray-900">출금 요청</div>
              <div className="text-xs text-gray-500">
                대기 중 요청을 제외한 잔여 가능액:{" "}
                {formatCredits(pendingAmount)}
              </div>
            </div>
            <button
              onClick={handleRequestPayout}
              disabled={pendingAmount <= 0}
              className={`h-10 px-4 rounded-md text-sm font-medium border ${
                pendingAmount > 0
                  ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                  : "bg-gray-200 text-gray-500 border-gray-200 cursor-not-allowed"
              }`}
            >
              출금 요청하기
            </button>
          </div>
        </div>

        {/* 요청 이력 */}
        <div className="bg-white border rounded-lg mb-8">
          <div className="px-4 py-3 border-b font-medium text-gray-900">
            요청 이력
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500">
                  <th className="px-4 py-2">요청ID</th>
                  <th className="px-4 py-2">요청일</th>
                  <th className="px-4 py-2">액수</th>
                  <th className="px-4 py-2">수수료</th>
                  <th className="px-4 py-2">상태</th>
                  <th className="px-4 py-2 text-right">영수증</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y">
                {requests.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      요청 이력이 없습니다.
                    </td>
                  </tr>
                )}
                {requests.map((r) => (
                  <tr key={r.id}>
                    <td className="px-4 py-2">{r.id}</td>
                    <td className="px-4 py-2">
                      {new Date(r.requestedAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">{formatCredits(r.amount)}</td>
                    <td className="px-4 py-2">{formatCredits(r.fee)}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          r.status === "pending"
                            ? "bg-amber-100 text-amber-800"
                            : r.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right">
                      <button
                        onClick={() => downloadReceipt(r.id)}
                        className="h-8 px-3 border rounded-md text-xs hover:bg-gray-50"
                      >
                        영수증 다운로드
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 세무 안내 (개인 프리랜서용) */}
        <div className="bg-white border rounded-lg p-4 mb-8">
          <div className="mb-3">
            <div className="font-medium text-gray-900">
              세무 안내 (개인 프리랜서)
            </div>
            <div className="text-xs text-gray-500 mt-1">
              분기별 완료된 상담 기준으로 매출 합계를 집계했습니다. 일반과세자
              기준 부가세 신고 일정이며, 신고 기준과 공제 가능 비용은 사업 유형
              및 세무 처리 방식에 따라 상이할 수 있습니다.
            </div>
          </div>
          <div className="rounded-md border bg-amber-50 text-amber-800 text-sm p-3 mb-3">
            <span className="font-medium">
              {currentYear}년 종합소득세 신고/납부 기간:
            </span>
            <span className="ml-2">{incomeTaxWindow}</span>
            {currentYear === 2025 && (
              <span className="ml-1 text-[12px]">
                (5/31 토요일 → 익영업일 6/2 월요일까지)
              </span>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500">
                  <th className="px-4 py-2">월</th>
                  <th className="px-4 py-2">매출 합계</th>
                  <th className="px-4 py-2">
                    수수료(예: {Math.round(feeRate * 100)}%)
                  </th>
                  <th className="px-4 py-2">순수입(참고)</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y">
                {months.map((m) => (
                  <tr key={m.month}>
                    <td className="px-4 py-2">{m.label}</td>
                    <td className="px-4 py-2">{formatCredits(m.gross)}</td>
                    <td className="px-4 py-2">{formatCredits(m.fee)}</td>
                    <td className="px-4 py-2">{`${formatKRW(
                      m.net * CREDIT_TO_KRW
                    )} (${formatCredits(m.net)})`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-[11px] text-gray-500 mt-2">
            참고: 실무상 신고 대상 금액(공급가액)은 플랫폼 수수료 차감 전 매출을
            기준으로 판단될 수 있으며, 수수료는 비용 처리 대상이 될 수 있습니다.
            정확한 신고는 세무 전문가와 상담하세요.
          </div>
        </div>
      </div>
    </div>
  );
}
