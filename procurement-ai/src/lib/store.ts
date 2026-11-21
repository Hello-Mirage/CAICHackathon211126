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

export interface ProcurementState {
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

  // Actions
  setSelectedProject: (proj: string) => void;
  setSelectedAsset: (asset: SelectedAsset | null) => void;
  setIsDrawerOpen: (open: boolean) => void;
  setActiveTab: (tab: "pipeline" | "data" | "comparative" | "recommendation") => void;
  setStep: (step: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (err: string | null) => void;
  setStep1Requirement: (data: any) => void;
  setStep2MatchedCodes: (data: any) => void;
  setStep3RFQ: (data: any) => void;
  setStep4NormalizedQuotes: (data: any[]) => void;
  setStep5Comparative: (data: any) => void;
  setStep6Recommendation: (data: any) => void;
  resetPipeline: () => void;
}

export const useProcurementStore = create<ProcurementState>((set) => ({
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

  setSelectedProject: (proj) => set({ selectedProject: proj }),
  setSelectedAsset: (asset) => set({ selectedAsset: asset, isDrawerOpen: !!asset }),
  setIsDrawerOpen: (open) => set({ isDrawerOpen: open }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setStep: (step) => set({ currentStep: step }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (err) => set({ error: err }),

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
