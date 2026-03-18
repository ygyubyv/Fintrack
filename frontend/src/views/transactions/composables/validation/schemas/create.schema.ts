import * as yup from "yup";
import type { TExpenseType, TPaymentType } from "../../../types";

const expenseTypes: TExpenseType[] = ["INCOME", "EXPENSE"];
const paymentTypes: TPaymentType[] = ["CARD", "CASH"];

export const createExpenseSchema = yup.object({
  value: yup
    .number()
    .typeError("Value must be a number")
    .required("Value is required")
    .moreThan(0, "Value must be greater than 0"),

  description: yup
    .string()
    .max(255, "Description must be at most 255 characters")
    .optional(),

  expenseType: yup
    .mixed<TExpenseType>()
    .oneOf(expenseTypes, "Invalid expense type")
    .required("Expense type is required"),

  paymentType: yup
    .mixed<TPaymentType>()
    .oneOf(paymentTypes, "Invalid payment type")
    .required("Payment type is required"),

  categoryId: yup
    .number()
    .nullable()
    .typeError("Category must be a number")
    .optional(),

  tagIds: yup
    .array()
    .of(yup.number().typeError("Tag id must be a number"))
    .default([]),

  createdAt: yup
    .string()
    .optional()
    .test("not-later-than-now", "Date cannot be later than now", (value) => {
      if (!value) {
        return true;
      }

      const date = new Date(value);
      return date <= new Date();
    }),
});
