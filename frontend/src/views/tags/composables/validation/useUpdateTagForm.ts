import { useForm, useFormErrors } from "vee-validate";
import { updateTagSchema } from "./schemas/update.schema";
import type { IUpdateTag } from "../../types";

interface Emits {
  (e: "update:drawerIsVisible", value: boolean): void;
  (e: "submit", payload: IUpdateTag): void;
}

interface Props {
  emit: Emits;
}

export const useUpdateTagForm = ({ emit }: Props) => {
  const { handleSubmit, meta, defineField, resetForm } = useForm({
    validationSchema: updateTagSchema,
    initialValues: {
      title: "",
      color: "",
    } as IUpdateTag,
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

  const setForm = (initialValues: IUpdateTag) => {
    color.value = initialValues.color;
    title.value = initialValues.title;
  };

  return {
    meta,
    color,
    colorAttrs,
    title,
    titleAttrs,
    errors,
    resetForm,
    onSubmit,
    setForm,
  };
};
