import { ExpensesApi } from "./api/expenses.api";
import type { ICreateExpense, IImportExpenses, IUpdateExpense } from "../types";
import { useApi } from "@/composables/useApi";
import { downloadFile } from "@/utils";

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

  const exportExpenses = (successFn?: () => void) => {
    const { isLoading, $api } = useApi();

    const exportExpensesHandler = async () => {
      try {
        const file = await $api<File>({
          url: ExpensesApi.exportExpenses,
          method: "POST",
          responseType: "blob",
        });

        downloadFile("Expenses.csv", file);

        successFn?.();
      } catch (error) {
        console.error(error);
      }
    };

    return { isLoading, exportExpensesHandler };
  };

  const importExpenses = (successFn?: () => void) => {
    const { isLoading, $api } = useApi();

    const importExpensesHandler = async (payload: IImportExpenses) => {
      try {
        await $api({
          url: ExpensesApi.importExpenses,
          method: "POST",
          payload,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        successFn?.();
      } catch (error) {
        console.error(error);
      }
    };

    return { isLoading, importExpensesHandler };
  };

  return {
    createExpense,
    updateExpense,
    deleteExpense,
    exportExpenses,
    importExpenses,
  };
};
