"use client";

import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface ServiceLayoutProps {
  children: React.ReactNode;
}

const ServiceLayout = ({ children }: ServiceLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* 네비게이션바 */}
      <Navbar />
      
      {/* 사이드바 */}
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        onToggle={toggleSidebar}
      />
      
      {/* 메인 콘텐츠 영역 */}
      <main className="pt-16 lg:pl-64">
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </main>
    </>
  );
};

export default ServiceLayout;
