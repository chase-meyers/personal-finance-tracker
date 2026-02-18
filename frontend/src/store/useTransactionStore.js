import { create } from "zustand";
import { DEFAULT_TRANSACTION_CATEGORIES } from "../transactions/transactionCategories";
import { useFinanceStore } from "./useFinanceStore";

const API_URL = "http://127.0.0.1:5000/api/transactions";

const normalizeCategory = (value) => {
  if (!value || typeof value !== "string") {
    return "Other";
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : "Other";
};

const isCurrentMonthDate = (value) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return false;
  }

  const now = new Date();
  return (
    parsed.getFullYear() === now.getFullYear() &&
    parsed.getMonth() === now.getMonth()
  );
};

const sumCurrentMonthSpending = (transactions) =>
  (Array.isArray(transactions) ? transactions : []).reduce((total, transaction) => {
    if (!isCurrentMonthDate(transaction?.date)) {
      return total;
    }
    return total + Number(transaction?.amount || 0);
  }, 0);

export const useTransactionStore = create((set, get) => ({
  transactions: [],
  categories: DEFAULT_TRANSACTION_CATEGORIES,
  isLoading: false,
  error: null,

  fetchTransactions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Failed to load transactions.");
      }

      const data = await response.json();
      const transactions = Array.isArray(data.transactions) ? data.transactions : [];

      const existingCategories = new Set(DEFAULT_TRANSACTION_CATEGORIES);
      transactions.forEach((transaction) => {
        existingCategories.add(normalizeCategory(transaction.category));
      });

      set({
        transactions,
        categories: Array.from(existingCategories),
        isLoading: false,
      });
      useFinanceStore
        .getState()
        .setTotalMonthlySpending(sumCurrentMonthSpending(transactions));
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Unknown error.",
      });
    }
  },

  addCategory: (category) => {
    const normalized = normalizeCategory(category);
    set((state) => {
      if (state.categories.includes(normalized)) {
        return state;
      }
      return { categories: [...state.categories, normalized] };
    });
  },

  addTransaction: async (transactionInput) => {
    set({ error: null });
    try {
      const payload = {
        amount: Number(transactionInput.amount),
        category: normalizeCategory(transactionInput.category),
        date: transactionInput.date,
        description: transactionInput.description || "",
      };

      if (!payload.date || Number.isNaN(payload.amount)) {
        throw new Error("Amount and date are required.");
      }

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create transaction.");
      }

      get().addCategory(payload.category);
      await get().fetchTransactions();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create transaction.";
      set({ error: message });
      throw error;
    }
  },

  updateTransactionCategory: async (id, category) => {
    set({ error: null });
    const normalized = normalizeCategory(category);
    try {
      const response = await fetch(`${API_URL}/${id}/category`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: normalized }),
      });

      if (!response.ok) {
        throw new Error("Failed to update category.");
      }

      get().addCategory(normalized);
      set((state) => {
        const nextTransactions = state.transactions.map((transaction) =>
          transaction.id === id ? { ...transaction, category: normalized } : transaction
        );
        useFinanceStore
          .getState()
          .setTotalMonthlySpending(sumCurrentMonthSpending(nextTransactions));
        return {
          transactions: nextTransactions,
        };
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update category.";
      set({ error: message });
      throw error;
    }
  },

  getCurrentMonthSpending: () => sumCurrentMonthSpending(get().transactions),
}));
