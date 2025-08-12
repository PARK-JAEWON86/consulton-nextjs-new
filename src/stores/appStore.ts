import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  // 서비스 진입 상태
  hasEnteredService: boolean;
  isAuthenticated: boolean;

  // UI 상태
  sidebarOpen: boolean;
  currentPage: string;

  // 사용자 정보
  user: {
    id: string | null;
    email: string | null;
    name: string | null;
    credits: number;
    expertLevel: string | null;
  } | null;

  // 액션들
  enterService: () => void;
  exitService: () => void;
  setAuthenticated: (status: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  setCurrentPage: (page: string) => void;
  setUser: (user: AppState["user"]) => void;
  updateCredits: (credits: number) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      hasEnteredService: false,
      isAuthenticated: false,
      sidebarOpen: false,
      currentPage: "/",
      user: null,

      // 액션들
      enterService: () => {
        set({ hasEnteredService: true });
        // 쿠키도 설정
        if (typeof document !== "undefined") {
          document.cookie = "hasEnteredService=true;path=/;max-age=604800"; // 7일
        }
      },

      exitService: () => {
        set({ hasEnteredService: false });
        // 쿠키 제거
        if (typeof document !== "undefined") {
          document.cookie =
            "hasEnteredService=;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC";
        }
      },

      setAuthenticated: (status: boolean) => {
        set({ isAuthenticated: status });
      },

      setSidebarOpen: (open: boolean) => {
        set({ sidebarOpen: open });
      },

      setCurrentPage: (page: string) => {
        set({ currentPage: page });
      },

      setUser: (user: AppState["user"]) => {
        set({ user });
      },

      updateCredits: (credits: number) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, credits } });
        }
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          hasEnteredService: false,
        });
        // 쿠키 제거
        if (typeof document !== "undefined") {
          document.cookie =
            "hasEnteredService=;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC";
        }
      },
    }),
    {
      name: "consulton-app-storage",
      partialize: (state) => ({
        hasEnteredService: state.hasEnteredService,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    },
  ),
);
