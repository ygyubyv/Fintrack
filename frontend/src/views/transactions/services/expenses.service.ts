import { ExpensesApi } from "./api/expenses.api";
import type { ICreateExpense, IUpdateExpense } from "../types";
import { useApi } from "@/composables/useApi";

export const ExpensesService = () => {
  const createExpense = (successFn?: () => void) => {
    const { isLoading, $api } = useApi();

    const createExpenseHandler = async (payload: ICreateExpense) => {
      try {
        await $api({
          url: ExpensesApi.createExpense,
          method: "POST",
          payload,
        });

        successFn?.();
      } catch (error) {
        console.error(error);
      }
    };

    return { isLoading, createExpenseHandler };
  };

  const updateExpense = (successFn?: () => void) => {
    const { isLoading, $api } = useApi();

    const updateExpenseHandler = async (
      id: number,
      payload: IUpdateExpense,
    ) => {
      try {
        await $api({
          method: "PATCH",
          url: ExpensesApi.updateExpense(id),
          payload,
        });

        successFn?.();
      } catch (error) {
        console.error(error);
      }
    };

    return { isLoading, updateExpenseHandler };
  };

  const deleteExpense = (successFn?: () => void) => {
    const { isLoading, $api } = useApi();

    const deleteExpenseHandler = async (id: number) => {
      try {
        await $api({
          method: "DELETE",
          url: ExpensesApi.deleteExpense(id),
        });

        successFn?.();
      } catch (error) {
        console.error(error);
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
