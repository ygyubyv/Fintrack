import { useForm, useFormErrors } from "vee-validate";
import { createCategorySchema } from "./schemas/create.schema";
import type { ICreateCategory } from "../../types";

interface Emits {
  (e: "update:drawerIsVisible", value: boolean): void;
  (e: "submit", payload: ICreateCategory): void;
}

interface Props {
  emit: Emits;
}

export const useCreateCategoryForm = ({ emit }: Props) => {
  const { handleSubmit, meta, defineField, resetForm } = useForm({
    validationSchema: createCategorySchema,
    initialValues: {
      title: "",
    } as ICreateCategory,
  });

  const errors = useFormErrors();

  const [title, titleAttrs] = defineField("title");

  const onSubmit = handleSubmit((values) => {
    emit("submit", {
      title: values.title,
    });

    emit("update:drawerIsVisible", false);
  });

  return {
    meta,
    title,
    titleAttrs,
    errors,
    resetForm,
    onSubmit,
  };
};
