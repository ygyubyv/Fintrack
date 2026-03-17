import * as yup from "yup";
import type { TExpenseType, TPaymentType } from "../../../types";

const expenseTypes: TExpenseType[] = ["INCOME", "EXPENSE"];
const paymentTypes: TPaymentType[] = ["CARD", "CASH"];

export const updateExpenseSchema = yup.object({
  value: yup
    .number()
    .typeError("Value must be a number")
    .moreThan(0, "Value must be greater than 0")
    .required(),

  description: yup
    .string()
    .max(255, "Description must be at most 255 characters")
    .optional(),

  expenseType: yup
    .mixed<TExpenseType>()
    .oneOf(expenseTypes, "Invalid expense type")
    .required(),

  paymentType: yup
    .mixed<TPaymentType>()
    .oneOf(paymentTypes, "Invalid payment type")
    .required(),

  categoryId: yup
    .number()
    .nullable()
    .typeError("Category must be a number")
    .optional(),

  tagIds: yup
    .array()
    .of(yup.number().typeError("Tag id must be a number"))
    .default([]),
});
