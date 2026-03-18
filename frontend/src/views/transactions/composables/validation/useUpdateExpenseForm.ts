import { useForm, useFormErrors } from "vee-validate";
import { updateExpenseSchema } from "./schemas/update.schema";
import type { IUpdateExpense } from "../../types";

interface Emits {
  (e: "update:drawerIsVisible", value: boolean): void;
  (e: "submit", payload: IUpdateExpense): void;
}

interface Props {
  emit: Emits;
}

export const useUpdateExpenseForm = ({ emit }: Props) => {
  const { handleSubmit, meta, defineField, resetForm } = useForm({
    validationSchema: updateExpenseSchema,
    initialValues: {
      value: 0,
      expenseType: "EXPENSE",
      paymentType: "CASH",
      categoryId: null,
      tagIds: [],
    } as IUpdateExpense,
  });

  const errors = useFormErrors();

  const [value, valueAttrs] = defineField("value");
  const [expenseType, expenseTypeAttrs] = defineField("expenseType");
  const [paymentType, paymentTypeAttrs] = defineField("paymentType");
  const [categoryId, categoryIdAttrs] = defineField("categoryId");
  const [tagIds, tagIdsAttrs] = defineField("tagIds");
  const [description, descriptionAttrs] = defineField("description");
  const [createdAt, createdAtAttrs] = defineField("createdAt");

  const onSubmit = handleSubmit((values) => {
    emit("submit", {
      value: values.value,
      categoryId: values.categoryId,
      expenseType: values.expenseType,
      paymentType: values.paymentType,
      tagIds: values.tagIds,
      description: values.description,
      createdAt: values.createdAt ?? undefined,
    });

    emit("update:drawerIsVisible", false);
  });

  const setForm = (initialValues: IUpdateExpense) => {
    value.value = initialValues.value;
    expenseType.value = initialValues.expenseType;
    paymentType.value = initialValues.paymentType;
    categoryId.value = initialValues.categoryId;
    tagIds.value = initialValues.tagIds;
    description.value = initialValues.description;
    createdAt.value = initialValues.createdAt;
  };

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
    createdAt,
    createdAtAttrs,
    errors,
    resetForm,
    onSubmit,
    setForm,
  };
};
