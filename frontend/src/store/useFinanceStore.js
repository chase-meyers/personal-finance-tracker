import { create } from "zustand";

export const useFinanceStore = create((set) => ({
  recurringIncome: [],
  setRecurringIncome: (data) => set((state) => {
    const newValue = typeof data === 'function' ? data(state.recurringIncome) : data;
    return { recurringIncome: Array.isArray(newValue) ? newValue : [] };
  }),
}));