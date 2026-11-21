import { create } from "zustand";

export interface SelectedAsset {
  id: string;
  name: string;
  project: string;
  category: string;
  scope: string;
  status: "idle" | "pending" | "processing" | "quoted" | "approved";
  description: string;
  requirementsCount: number;
}

export type ThemeMode = "light" | "dark";

export interface ProcurementState {
  // Theme
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (t: ThemeMode) => void;

  // 3D & Selection
  selectedProject: string;
  selectedAsset: SelectedAsset | null;
  isDrawerOpen: boolean;
  activeTab: "pipeline" | "data" | "comparative" | "recommendation";

  // Pipeline execution
  currentStep: number;
  isLoading: boolean;
  error: string | null;

  // Pipeline Data outputs
  step1Requirement: any | null;
  step2MatchedCodes: any | null;
  step3RFQ: any | null;
  step4NormalizedQuotes: any[] | null;
  step5Comparative: any | null;
  step6Recommendation: any | null;
  rawInputDraft: string;

  // Actions
  setSelectedProject: (proj: string) => void;
  setSelectedAsset: (asset: SelectedAsset | null) => void;
  setIsDrawerOpen: (open: boolean) => void;
  setActiveTab: (tab: "pipeline" | "data" | "comparative" | "recommendation") => void;
  setStep: (step: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (err: string | null) => void;
  setRawInputDraft: (text: string) => void;
  setStep1Requirement: (data: any) => void;
  setStep2MatchedCodes: (data: any) => void;
  setStep3RFQ: (data: any) => void;
  setStep4NormalizedQuotes: (data: any[]) => void;
  setStep5Comparative: (data: any) => void;
  setStep6Recommendation: (data: any) => void;
  resetPipeline: () => void;
}

export const useProcurementStore = create<ProcurementState>((set) => ({
  // Default dark mode (slate & ocean blue palette: #1B262C, #0F4C75, #3282B8, #BBE1FA)
  theme: "dark",
  toggleTheme: () =>
    set((state) => {
      const nextTheme = state.theme === "dark" ? "light" : "dark";
      if (typeof window !== "undefined") {
        localStorage.setItem("vinayak_theme", nextTheme);
        if (nextTheme === "light") {
          document.documentElement.classList.add("light");
          document.documentElement.classList.remove("dark");
          document.documentElement.setAttribute("data-theme", "light");
        } else {
          document.documentElement.classList.add("dark");
          document.documentElement.classList.remove("light");
          document.documentElement.setAttribute("data-theme", "dark");
        }
      }
      return { theme: nextTheme };
    }),
  setTheme: (t) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("vinayak_theme", t);
      if (t === "light") {
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
        document.documentElement.setAttribute("data-theme", "light");
      } else {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
        document.documentElement.setAttribute("data-theme", "dark");
      }
    }
    set({ theme: t });
  },

  selectedProject: "Vinayak Amara",
  selectedAsset: null,
  isDrawerOpen: false,
  activeTab: "pipeline",

  currentStep: 1,
  isLoading: false,
  error: null,

  step1Requirement: null,
  step2MatchedCodes: null,
  step3RFQ: null,
  step4NormalizedQuotes: null,
  step5Comparative: null,
  step6Recommendation: null,
  rawInputDraft: "",

  setSelectedProject: (proj) => set({ selectedProject: proj }),
  setSelectedAsset: (asset) => set({ selectedAsset: asset, isDrawerOpen: !!asset }),
  setIsDrawerOpen: (open) => set({ isDrawerOpen: open }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setStep: (step) => set({ currentStep: step }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (err) => set({ error: err }),
  setRawInputDraft: (text) => set({ rawInputDraft: text }),

  setStep1Requirement: (data) => set({ step1Requirement: data }),
  setStep2MatchedCodes: (data) => set({ step2MatchedCodes: data }),
  setStep3RFQ: (data) => set({ step3RFQ: data }),
  setStep4NormalizedQuotes: (data) => set({ step4NormalizedQuotes: data }),
  setStep5Comparative: (data) => set({ step5Comparative: data }),
  setStep6Recommendation: (data) => set({ step6Recommendation: data }),

  resetPipeline: () =>
    set({
      currentStep: 1,
      isLoading: false,
      error: null,
      step1Requirement: null,
      step2MatchedCodes: null,
      step3RFQ: null,
      step4NormalizedQuotes: null,
      step5Comparative: null,
      step6Recommendation: null,
    }),
}));
