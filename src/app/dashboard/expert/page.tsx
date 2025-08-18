"use client";

import { useEffect, useMemo, useState } from "react";
import { useConsultationsStore } from "@/stores/consultationsStore";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
// 전문가 프로필은 전용 라우트에서 관리합니다

type ConsultationType = "video" | "chat" | "voice";

type Availability = Record<
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday",
  { available: boolean; hours: string }
>;

type PortfolioFile = {
  id: number;
  name: string;
  type: string;
  size: number;
  data: string;
};

type ExpertProfileData = {
  isProfileComplete?: boolean;
  name: string;
  specialty: string;
  experience: number | string;
  description: string;
  education: string[];
  certifications: string[];
  specialties: string[];
  consultationTypes: ConsultationType[];
  languages: string[];
  hourlyRate: number | string;
  totalSessions: number;
  avgRating: number;
  availability: Availability;
  contactInfo: {
    phone: string;
    email: string;
    location: string;
    website: string;
  };
  profileImage: string | null;
  portfolioFiles: PortfolioFile[];
};

export default function ExpertDashboardProfilePage() {
  const [initialData, setInitialData] = useState<
    Partial<ExpertProfileData> & { isProfileComplete?: boolean }
  >();
  const items = useConsultationsStore((s) => s.items);
  const router = useRouter();

  type PeriodKey = "today" | "last7" | "last30" | "thisMonth" | "lastWeek";
  const [period, setPeriod] = useState<PeriodKey>("lastWeek");

  const getRange = (key: PeriodKey): { start: Date; end: Date } => {
    const now = new Date();
    if (key === "today") {
      const d = new Date();
      return {
        start: new Date(d.getFullYear(), d.getMonth(), d.getDate()),
        end: d,
      };
    }
    if (key === "last7") {
      const end = now;
      const start = new Date();
      start.setDate(end.getDate() - 6);
      return { start, end };
    }
    if (key === "last30") {
      const end = now;
      const start = new Date();
      start.setDate(end.getDate() - 29);
      return { start, end };
    }
    if (key === "thisMonth") {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return { start, end };
    }
    // lastWeek: Monday~Sunday of the previous week (approx using 7 days window ending yesterday)
    const end = new Date(now);
    end.setDate(now.getDate() - 1);
    const start = new Date(end);
    start.setDate(end.getDate() - 6);
    return { start, end };
  };

  const { start: currentStart, end: currentEnd } = getRange(period);
  const windowDays = Math.max(
    1,
    Math.round(
      (currentEnd.getTime() - currentStart.getTime()) / (24 * 60 * 60 * 1000)
    ) + 1
  );
  const { prevStart, prevEnd } = useMemo(() => {
    const pStart = new Date(currentStart);
    const pEnd = new Date(currentStart);
    pStart.setDate(currentStart.getDate() - windowDays);
    pEnd.setDate(currentStart.getDate() - 1);
    return { prevStart: pStart, prevEnd: pEnd };
  }, [currentStart, windowDays]);

  function inRange(dateISO: string, start: Date, end: Date) {
    const ts = new Date(dateISO).getTime();
    return ts >= new Date(start).getTime() && ts <= new Date(end).getTime();
  }

  const completedInRange = useMemo(
    () =>
      items.filter(
        (it) =>
          it.status === "completed" &&
          inRange(it.date, currentStart, currentEnd)
      ),
    [items, currentStart, currentEnd]
  );
  const completedPrevRange = useMemo(
    () =>
      items.filter(
        (it) =>
          it.status === "completed" && inRange(it.date, prevStart, prevEnd)
      ),
    [items, prevStart, prevEnd]
  );

  const sum = (arr: { amount: number }[]) =>
    arr.reduce((acc, v) => acc + (v.amount || 0), 0);
  const totalRevenue = sum(completedInRange);
  const prevRevenue = sum(completedPrevRange);
  const avgOrder =
    completedInRange.length > 0
      ? Math.round(totalRevenue / completedInRange.length)
      : 0;
  const prevAvgOrder =
    completedPrevRange.length > 0
      ? Math.round(prevRevenue / completedPrevRange.length)
      : 0;
  const sold = completedInRange.length;
  const prevSold = completedPrevRange.length;

  const percentChange = (curr: number, prev: number) => {
    if (prev === 0) return curr > 0 ? 100 : 0;
    return Math.round(((curr - prev) / prev) * 1000) / 10; // 0.1 단위 반올림
  };

  const changeRevenue = percentChange(totalRevenue, prevRevenue);
  const changeAvg = percentChange(avgOrder, prevAvgOrder);
  const changeSold = percentChange(sold, prevSold);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("approvedExpertProfile");
      if (stored) {
        const parsed = JSON.parse(stored);
        setInitialData({
          ...parsed,
          isProfileComplete: Boolean(parsed?.isProfileComplete),
        });
      } else {
        // 기본 빈 상태
        setInitialData({
          name: "",
          specialty: "",
          experience: 0,
          description: "",
          education: [""],
          certifications: [""],
          specialties: [""],
          consultationTypes: [],
          languages: ["한국어"],
          hourlyRate: "",
          totalSessions: 0,
          avgRating: 0,
          availability: {
            monday: { available: false, hours: "09:00-18:00" },
            tuesday: { available: false, hours: "09:00-18:00" },
            wednesday: { available: false, hours: "09:00-18:00" },
            thursday: { available: false, hours: "09:00-18:00" },
            friday: { available: false, hours: "09:00-18:00" },
            saturday: { available: false, hours: "09:00-18:00" },
            sunday: { available: false, hours: "09:00-18:00" },
          },
          contactInfo: { phone: "", email: "", location: "", website: "" },
          profileImage: null,
          portfolioFiles: [],
          isProfileComplete: false,
        });
      }
    } catch {
      // ignore
    }
  }, []);

  // 프로필 편집은 전용 페이지에서 처리합니다.

  if (!initialData) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 오버뷰 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              안녕하세요, {initialData?.name || "전문가"}님
            </h1>
            <p className="text-gray-600 mt-1">전문가 대시보드</p>
          </div>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as PeriodKey)}
            className="h-9 px-3 border border-gray-300 rounded-md text-sm bg-white"
          >
            <option value="lastWeek">지난주</option>
            <option value="today">오늘</option>
            <option value="last7">최근 7일</option>
            <option value="last30">최근 30일</option>
            <option value="thisMonth">이번 달</option>
          </select>
        </div>

        {/* KPI 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* 총 정산액 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="text-sm text-gray-600 mb-2">총 정산액</div>
            <div className="text-2xl font-bold text-gray-900">
              {totalRevenue.toLocaleString()} 크레딧
            </div>
            <div
              className={`mt-2 text-xs inline-flex items-center px-2 py-0.5 rounded-full font-medium ${
                changeRevenue >= 0
                  ? "bg-green-100 text-green-700"
                  : "bg-rose-100 text-rose-700"
              }`}
            >
              {changeRevenue >= 0 ? "+" : ""}
              {changeRevenue}%{" "}
              <span className="ml-1 text-gray-500">이전 기간 대비</span>
            </div>
          </div>

          {/* 평균 정산액 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="text-sm text-gray-600 mb-2">평균 정산액</div>
            <div className="text-2xl font-bold text-gray-900">
              {avgOrder.toLocaleString()} 크레딧
            </div>
            <div
              className={`mt-2 text-xs inline-flex items-center px-2 py-0.5 rounded-full font-medium ${
                changeAvg >= 0
                  ? "bg-green-100 text-green-700"
                  : "bg-rose-100 text-rose-700"
              }`}
            >
              {changeAvg >= 0 ? "+" : ""}
              {changeAvg}%{" "}
              <span className="ml-1 text-gray-500">이전 기간 대비</span>
            </div>
          </div>

          {/* 완료된 상담 수 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="text-sm text-gray-600 mb-2">완료된 상담</div>
            <div className="text-2xl font-bold text-gray-900">
              {sold.toLocaleString()} 건
            </div>
            <div
              className={`mt-2 text-xs inline-flex items-center px-2 py-0.5 rounded-full font-medium ${
                changeSold >= 0
                  ? "bg-green-100 text-green-700"
                  : "bg-rose-100 text-rose-700"
              }`}
            >
              {changeSold >= 0 ? "+" : ""}
              {changeSold}%{" "}
              <span className="ml-1 text-gray-500">이전 기간 대비</span>
            </div>
          </div>

          {/* 기간 표시 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="text-sm text-gray-600 mb-2">선택된 기간</div>
            <div className="text-2xl font-bold text-gray-900">
              {format(currentStart, "yyyy-MM-dd")} ~{" "}
              {format(currentEnd, "yyyy-MM-dd")}
            </div>
            <div className="mt-2 text-xs text-gray-500">총 {windowDays}일</div>
          </div>
        </div>

        {/* 오늘/다가오는 일정 요약 + 알림 요약 */}
        {(() => {
          const now = new Date();
          const upcoming = items
            .filter(
              (it) =>
                it.status === "scheduled" &&
                new Date(it.date).getTime() >= now.getTime()
            )
            .sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
            )
            .slice(0, 5);
          const openIssues = items.filter(
            (it) => it.issue && it.issue.status === "open"
          );
          const openRefunds = openIssues.filter(
            (it) => it.issue?.type === "refund"
          );

          return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
              {/* 일정 요약 */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    다가오는 일정
                  </h3>
                  <span className="text-sm text-gray-500">최대 5개 표시</span>
                </div>
                {upcoming.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {upcoming.map((u) => (
                      <li
                        key={u.id}
                        className="py-3 flex items-center justify-between"
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {u.customer} · {u.topic}
                          </div>
                          <div className="text-xs text-gray-500">
                            {format(new Date(u.date), "yyyy-MM-dd HH:mm")}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-800">
                            {u.amount.toLocaleString()} 크레딧
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-gray-500">
                    예정된 일정이 없습니다.
                  </div>
                )}
              </div>

              {/* 알림/이슈 요약 */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  알림 요약
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">미해결 이슈</span>
                    <span className="font-semibold text-gray-900">
                      {openIssues.length}건
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">환불 요청</span>
                    <span className="font-semibold text-gray-900">
                      {openRefunds.length}건
                    </span>
                  </div>
                  <div className="pt-2 border-t text-xs text-gray-500">
                    상세 처리는 이슈/환불 페이지에서 진행하세요.
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* 목표 진행률 */}
        {(() => {
          // 간단한 목표(변경 필요 시 별도 페이지에서 관리)
          const goalRevenue = 1000; // 크레딧 목표
          const minPayoutCredits = 1000; // 최소 정산 기준
          const goalSold = 10; // 건수 목표
          const revenuePct = Math.min(
            100,
            Math.round((totalRevenue / goalRevenue) * 100)
          );
          const soldPct = Math.min(100, Math.round((sold / goalSold) * 100));
          const canPayout = totalRevenue >= minPayoutCredits;
          return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      정산 목표 진행률
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      최소 정산기준 {minPayoutCredits.toLocaleString()} 크레딧
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">
                    목표 {goalRevenue.toLocaleString()} 크레딧
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${revenuePct}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    {revenuePct}% 달성
                  </div>
                  <button
                    disabled={!canPayout}
                    onClick={() => {
                      if (!canPayout) return;
                      router.push("/dashboard/expert/payouts");
                    }}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors border ${
                      canPayout
                        ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                        : "bg-gray-200 text-gray-500 border-gray-200 cursor-not-allowed"
                    }`}
                  >
                    정산하러 가기
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    완료 건수 목표
                  </h3>
                  <span className="text-sm text-gray-500">
                    목표 {goalSold} 건
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${soldPct}%` }}
                  />
                </div>
                <div className="mt-2 text-sm text-gray-700">
                  {soldPct}% 달성
                </div>
              </div>
            </div>
          );
        })()}

        {/* 최근 활동 타임라인 & 주제별 성과 */}
        {(() => {
          const activities = [
            ...items
              .filter((it) => it.status === "completed")
              .map((it) => ({
                ts: new Date(it.date).getTime(),
                label: `상담 완료 · ${it.customer} · ${it.topic}`,
              })),
            ...items
              .filter((it) => it.status === "scheduled")
              .map((it) => ({
                ts: new Date(it.date).getTime(),
                label: `상담 예약 · ${it.customer} · ${it.topic}`,
              })),
          ]
            .sort((a, b) => b.ts - a.ts)
            .slice(0, 8);

          const topicMap = new Map<
            string,
            { revenue: number; count: number }
          >();
          items.forEach((it) => {
            const key = (it.topic || "기타").split(" ")[0];
            const entry = topicMap.get(key) || { revenue: 0, count: 0 };
            entry.revenue += it.amount || 0;
            entry.count += 1;
            topicMap.set(key, entry);
          });
          const topTopics = Array.from(topicMap.entries())
            .sort((a, b) => b[1].revenue - a[1].revenue)
            .slice(0, 3);

          return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-5 lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  최근 활동
                </h3>
                {activities.length > 0 ? (
                  <ul className="space-y-3 text-sm">
                    {activities.map((a, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-gray-800 flex-1 truncate">
                          {a.label}
                        </span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(a.ts), "MM/dd HH:mm")}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-gray-500">
                    최근 활동이 없습니다.
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  주제별 성과
                </h3>
                {topTopics.length > 0 ? (
                  <div className="space-y-4">
                    {topTopics.map(([name, v]) => {
                      const pct =
                        totalRevenue > 0
                          ? Math.round((v.revenue / totalRevenue) * 100)
                          : 0;
                      return (
                        <div key={name}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-700">{name}</span>
                            <span className="text-gray-900 font-medium">
                              {v.revenue.toLocaleString()} 크레딧
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-600 h-2 rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    데이터가 충분하지 않습니다.
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* 분석 리포트 섹션 */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">분석 리포트</h2>
            <p className="text-gray-600 mt-1">
              상담 통계와 분석 데이터를 확인하세요.
            </p>
          </div>

          {/* 분석 통계 카드들 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* 총 상담 수 */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    총 상담 수
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">24</p>
                </div>
              </div>
            </div>

            {/* 총 상담 시간 */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    총 상담 시간
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    18.5시간
                  </p>
                </div>
              </div>
            </div>

            {/* 상담 전문가 */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    상담 전문가
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">8명</p>
                </div>
              </div>
            </div>
          </div>

          {/* 차트 영역 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 월별 상담 통계 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                월별 상담 통계
              </h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">차트가 여기에 표시됩니다</p>
              </div>
            </div>

            {/* 전문가별 상담 분포 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                전문가별 상담 분포
              </h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">차트가 여기에 표시됩니다</p>
              </div>
            </div>
          </div>
        </div>

        {/* 전문가 프로필 섹션 제거: 전용 페이지로 분리됨 */}
      </div>
    </div>
  );
}
