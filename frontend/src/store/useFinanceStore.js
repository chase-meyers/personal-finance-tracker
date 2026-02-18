import { create } from "zustand";
import { persist } from "zustand/middleware";

const DEFAULT_INCOME_CATEGORIES = ["Salary", "Freelance", "Investments", "Other"];

const DEFAULT_RECURRING_INCOME = [
  { id: 1, name: "Job", amount: 2500, category: "Salary" },
  { id: 2, name: "Freelance Retainer", amount: 600, category: "Freelance" },
  { id: 3, name: "Dividends", amount: 120, category: "Investments" },
];

export const useFinanceStore = create(
  persist(
    (set) => ({
      recurringIncome: DEFAULT_RECURRING_INCOME,
      recurringIncomeCategories: DEFAULT_INCOME_CATEGORIES,
      setRecurringIncome: (data) =>
        set((state) => {
          const newValue =
            typeof data === "function" ? data(state.recurringIncome) : data;
          return { recurringIncome: Array.isArray(newValue) ? newValue : [] };
        }),
      addRecurringIncomeCategory: (category) =>
        set((state) => {
          if (!category || typeof category !== "string") {
            return state;
          }
          const normalized = category.trim();
          if (!normalized || state.recurringIncomeCategories.includes(normalized)) {
            return state;
          }
          return {
            recurringIncomeCategories: [...state.recurringIncomeCategories, normalized],
          };
        }),
    }),
    {
      name: "finance-store",
    }
  )
);
