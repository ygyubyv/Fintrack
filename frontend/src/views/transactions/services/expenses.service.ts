import axiosInstance from "@/plugins/axios.plugin";
import { ExpensesApi } from "./api/expenses.api";
import type { ICreateExpense, IUpdateExpense } from "../types";
import { ref } from "vue";

export const ExpensesService = () => {
  const createExpense = (successFn?: () => void) => {
    const isLoading = ref(false);

    const createExpenseHandler = async (payload: ICreateExpense) => {
      try {
        isLoading.value = true;
        await axiosInstance.post(ExpensesApi.createExpense, payload);

        successFn?.();
      } catch (error) {
        console.error(error);
      } finally {
        isLoading.value = false;
      }
    };

    return { isLoading, createExpenseHandler };
  };

  const updateExpense = (successFn?: () => void) => {
    const isLoading = ref(false);

    const updateExpenseHandler = async (id: number, payload: IUpdateExpense) => {
      try {
        isLoading.value = true;
        await axiosInstance.patch(ExpensesApi.updateExpense(id), payload);

        successFn?.();
      } catch (error) {
        console.error(error);
      } finally {
        isLoading.value = false;
      }
    };

    return { isLoading, updateExpenseHandler };
  };

  const deleteExpense = (successFn?: () => void) => {
    const isLoading = ref(false);

    const deleteExpenseHandler = async (id: number) => {
      try {
        isLoading.value = true;
        await axiosInstance.delete(ExpensesApi.deleteExpense(id));

        successFn?.();
      } catch (error) {
        console.error(error);
      } finally {
        isLoading.value = false;
      }
    };

    return { isLoading, deleteExpenseHandler };
  };

  return {
    createExpense,
    updateExpense,
    deleteExpense,
  };
};
