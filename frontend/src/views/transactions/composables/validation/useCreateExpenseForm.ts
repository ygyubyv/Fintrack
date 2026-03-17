import { useForm, useFormErrors } from "vee-validate";
import { createExpenseSchema } from "./schemas/create.schema";
import type { ICreateExpense } from "../../types";

interface Emits {
  (e: "update:drawerIsVisible", value: boolean): void;
  (e: "submit", payload: ICreateExpense): void;
}

interface Props {
  emit: Emits;
}

export const useCreateExpenseForm = ({ emit }: Props) => {
  const { handleSubmit, meta, defineField, resetForm } = useForm({
    validationSchema: createExpenseSchema,
    initialValues: {
      value: null as unknown as number,
      expenseType: "EXPENSE",
      paymentType: "CASH",
      categoryId: null,
      tagIds: [],
    } as ICreateExpense,
  });

  const errors = useFormErrors();

  const [value, valueAttrs] = defineField("value");
  const [expenseType, expenseTypeAttrs] = defineField("expenseType");
  const [paymentType, paymentTypeAttrs] = defineField("paymentType");
  const [categoryId, categoryIdAttrs] = defineField("categoryId");
  const [tagIds, tagIdsAttrs] = defineField("tagIds");
  const [description, descriptionAttrs] = defineField("description");

  const onSubmit = handleSubmit((values) => {
    emit("submit", {
      value: values.value,
      categoryId: values.categoryId,
      expenseType: values.expenseType,
      paymentType: values.paymentType,
      tagIds: values.tagIds,
      description: values.description,
    });

    emit("update:drawerIsVisible", false);
  });

  return {
    meta,
    value,
    valueAttrs,
    expenseType,
    expenseTypeAttrs,
    paymentType,
    paymentTypeAttrs,
    categoryId,
    categoryIdAttrs,
    tagIds,
    tagIdsAttrs,
    description,
    descriptionAttrs,
    errors,
    resetForm,
    onSubmit,
  };
};
