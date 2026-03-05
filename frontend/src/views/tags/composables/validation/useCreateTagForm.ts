import { useForm, useFormErrors } from "vee-validate";
import { createTagSchema } from "./schemas/create.schema";
import type { ICreateTag } from "../../types";

interface Emits {
  (e: "update:drawerIsVisible", value: boolean): void;
  (e: "submit", payload: ICreateTag): void;
}

interface Props {
  emit: Emits;
}

export const useCreateTagForm = ({ emit }: Props) => {
  const { handleSubmit, meta, defineField, resetForm } = useForm({
    validationSchema: createTagSchema,
    initialValues: {
      title: "",
      color: "",
    } as ICreateTag,
  });

  const errors = useFormErrors();

  const [color, colorAttrs] = defineField("color");
  const [title, titleAttrs] = defineField("title");

  const onSubmit = handleSubmit((values) => {
    emit("submit", {
      title: values.title,
      color: values.color,
    });

    emit("update:drawerIsVisible", false);
  });

  return {
    meta,
    color,
    colorAttrs,
    title,
    titleAttrs,
    errors,
    resetForm,
    onSubmit,
  };
};
