"use client";

import { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 사이드바 */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        onToggle={handleSidebarToggle}
      />

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col">
        {/* 페이지 콘텐츠 */}
        <main className="pt-16 lg:ml-64 flex-1">{children}</main>
      </div>
    </div>
  );
}
