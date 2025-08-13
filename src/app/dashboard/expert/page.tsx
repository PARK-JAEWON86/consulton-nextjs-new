"use client";

import { useEffect, useState } from "react";
import ExpertProfile from "@/components/dashboard/ExpertProfile";

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
    } catch (e) {
      // ignore
    }
  }, []);

  const handleSave = (
    updated: ExpertProfileData & { isProfileComplete: boolean }
  ) => {
    try {
      localStorage.setItem("approvedExpertProfile", JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
    setInitialData(updated);
  };

  if (!initialData) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">전문가 프로필</h1>
          <p className="text-gray-600 mt-1">검수/등록 후 프로필을 완성해주세요.</p>
        </div>
        <ExpertProfile expertData={initialData} onSave={handleSave} />
      </div>
    </div>
  );
}


