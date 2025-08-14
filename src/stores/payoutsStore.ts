import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PayoutRequest {
  id: number;
  amount: number; // credits
  fee: number; // credits deducted as fee
  requestedAt: string; // ISO
  status: "pending" | "paid" | "rejected";
}

interface PayoutsState {
  requests: PayoutRequest[];
  addRequest: (amount: number, fee: number) => void;
  markPaid: (id: number) => void;
  reject: (id: number) => void;
  clearAll: () => void;
}

export const usePayoutsStore = create<PayoutsState>()(
  persist(
    (set) => ({
      requests: [],
      addRequest: (amount, fee) =>
        set((state) => ({
          requests: [
            {
              id: Date.now(),
              amount,
              fee,
              requestedAt: new Date().toISOString(),
              status: "pending",
            },
            ...state.requests,
          ],
        })),
      markPaid: (id) =>
        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === id ? { ...r, status: "paid" } : r
          ),
        })),
      reject: (id) =>
        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === id ? { ...r, status: "rejected" } : r
          ),
        })),
      clearAll: () => set({ requests: [] }),
    }),
    { name: "consulton-payouts" }
  )
);
