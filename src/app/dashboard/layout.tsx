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
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        onToggle={handleSidebarToggle}
      />
      <div className="flex-1">{children}</div>
    </div>
  );
}
