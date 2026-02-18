import { create } from "zustand";
import { persist } from "zustand/middleware";

const DEFAULT_INCOME_CATEGORIES = ["Salary", "Freelance", "Investments", "Other"];

const DEFAULT_RECURRING_INCOME = [
  { id: 1, name: "Job", amount: 2500, category: "Salary" },
  { id: 2, name: "Freelance Retainer", amount: 600, category: "Freelance" },
  { id: 3, name: "Dividends", amount: 120, category: "Investments" },
];

const sumRecurringIncome = (income) =>
  (Array.isArray(income) ? income : []).reduce(
    (total, item) => total + Number(item?.amount || 0),
    0
  );

export const useFinanceStore = create(
  persist(
    (set, get) => ({
      recurringIncome: DEFAULT_RECURRING_INCOME,
      recurringIncomeCategories: DEFAULT_INCOME_CATEGORIES,
      totalMonthlySpending: 0,
      setRecurringIncome: (data) =>
        set((state) => {
          const newValue =
            typeof data === "function" ? data(state.recurringIncome) : data;
          return { recurringIncome: Array.isArray(newValue) ? newValue : [] };
        }),
      setTotalMonthlySpending: (value) =>
        set((state) => {
          const next = Number(value) || 0;
          if (state.totalMonthlySpending === next) {
            return state;
          }
          return { totalMonthlySpending: next };
        }),
      getTotalMonthlyIncome: () => sumRecurringIncome(get().recurringIncome),
      getMonthlyNetIncome: () =>
        get().getTotalMonthlyIncome() - Number(get().totalMonthlySpending || 0),
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
