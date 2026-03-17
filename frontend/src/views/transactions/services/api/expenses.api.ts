export const ExpensesApi = {
  getAllExpenses: "/expenses",
  createExpense: "/expenses",
  getExpenseById: (id: number) => `/expenses/${id}`,
  updateExpense: (id: number) => `/expenses/${id}`,
  deleteExpense: (id: number) => `/expenses/${id}`,
};
