import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getConsultationsByExpert, type ConsultationRecord } from "@/data/dummy/consultationHistory";

export type ConsultationStatus = "completed" | "scheduled" | "canceled";

export interface ConsultationItem {
  id: number;
  date: string; // ISO string
  customer: string;
  topic: string;
  amount: number; // credits
  status: ConsultationStatus;
  method?: "chat" | "video" | "voice" | "call";
  duration?: number; // minutes
  summary?: string;
  notes?: string;
  issue?: {
    type: "refund" | "quality" | "other";
    reason: string;
    createdAt: string; // ISO
    status: "open" | "resolved" | "rejected";
  };
}

interface ConsultationsState {
  items: ConsultationItem[];
  currentConsultationId: number | null;
  addScheduled: (payload: {
    customer: string;
    topic: string;
    amount: number;
    date?: string;
    method?: "chat" | "video" | "voice" | "call";
    duration?: number;
    summary?: string;
  }) => number;
  completeCurrent: () => void;
  markCompleted: (id: number) => void;
  updateCurrent: (
    payload: Partial<
      Pick<
        ConsultationItem,
        "duration" | "summary" | "amount" | "method" | "date" | "topic"
      >
    >
  ) => void;
  updateById: (id: number, payload: Partial<ConsultationItem>) => void;
  clearCurrent: () => void;
  clearAll: () => void;
  loadExpertConsultations: (expertId: number) => void;
}

export const useConsultationsStore = create<ConsultationsState>()(
  persist(
    (set, get) => ({
      items: [],
      currentConsultationId: null,
      addScheduled: ({
        customer,
        topic,
        amount,
        date,
        method,
        duration,
        summary,
      }) => {
        const id = Date.now();
        const newItem: ConsultationItem = {
          id,
          date: date ?? new Date().toISOString(),
          customer,
          topic,
          amount,
          status: "scheduled",
          method,
          duration,
          summary,
        };
        set((state) => ({
          items: [newItem, ...state.items],
          currentConsultationId: id,
        }));
        return id;
      },
      updateCurrent: (payload) => {
        const id = get().currentConsultationId;
        if (!id) return;
        set((state) => ({
          items: state.items.map((it) =>
            it.id === id ? { ...it, ...payload } : it
          ),
        }));
      },
      updateById: (id, payload) => {
        set((state) => ({
          items: state.items.map((it) =>
            it.id === id ? { ...it, ...payload } : it
          ),
        }));
      },
      completeCurrent: () => {
        const id = get().currentConsultationId;
        if (!id) return;
        set((state) => ({
          items: state.items.map((it) =>
            it.id === id ? { ...it, status: "completed" } : it
          ),
          currentConsultationId: null,
        }));
      },
      markCompleted: (id: number) => {
        set((state) => ({
          items: state.items.map((it) =>
            it.id === id ? { ...it, status: "completed" } : it
          ),
        }));
      },
      clearCurrent: () => set({ currentConsultationId: null }),
      clearAll: () => set({ items: [], currentConsultationId: null }),
      
      // 전문가 상담 내역 로드
      loadExpertConsultations: (expertId: number) => {
        const consultations = getConsultationsByExpert(expertId);
        const items: ConsultationItem[] = consultations.map((consultation, index) => ({
          id: parseInt(consultation.id.replace(/\D/g, '')) || Date.now() + index,
          date: consultation.createdAt,
          customer: consultation.clientName,
          topic: consultation.topic,
          amount: Math.floor(consultation.expertGrossKrw / 10), // KRW to Credits
          status: consultation.status as ConsultationStatus,
          method: consultation.consultationType as "chat" | "video" | "voice",
          duration: consultation.durationMin,
          summary: consultation.review || `${consultation.durationMin}분 ${consultation.consultationType} 상담 완료`,
          notes: consultation.rating ? `평점: ${consultation.rating}⭐` : undefined
        }));
        
        set({ items, currentConsultationId: null });
        console.log(`✅ Loaded ${items.length} consultations for expert ${expertId}`);
      },
    }),
    {
      name: "consulton-consultations",
      partialize: (state) => ({
        items: state.items,
        currentConsultationId: state.currentConsultationId,
      }),
    }
  )
);
