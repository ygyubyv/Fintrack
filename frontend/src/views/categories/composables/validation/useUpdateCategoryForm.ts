import { useForm, useFormErrors } from "vee-validate";
import { updateCategorySchema } from "./schemas/update.schema";
import type { IUpdateCategory } from "../../types";

interface Emits {
  (e: "update:drawerIsVisible", value: boolean): void;
  (e: "submit", payload: IUpdateCategory): void;
}

interface Props {
  emit: Emits;
}

export const useUpdateCategoryForm = ({ emit }: Props) => {
  const { handleSubmit, meta, defineField, resetForm } = useForm({
    validationSchema: updateCategorySchema,
    initialValues: {
      title: "",
    } as IUpdateCategory,
  });

  const errors = useFormErrors();

  const [title, titleAttrs] = defineField("title");

  const onSubmit = handleSubmit((values) => {
    emit("submit", {
      title: values.title,
    });

    emit("update:drawerIsVisible", false);
  });

  const setForm = (initialValues: IUpdateCategory) => {
    title.value = initialValues.title;
  };

  return {
    meta,
    title,
    titleAttrs,
    errors,
    resetForm,
    onSubmit,
    setForm,
  };
};
