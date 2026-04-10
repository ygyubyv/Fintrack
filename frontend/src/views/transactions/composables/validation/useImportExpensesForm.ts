import { useForm, useFormErrors } from "vee-validate";
import { importExpensesSchema } from "./schemas/import.schema";
import type { IImportExpenses } from "../../types";
import { computed } from "vue";

interface Emits {
  (e: "update:dialogIsVisible", value: boolean): void;
  (e: "submit", payload: IImportExpenses): void;
}

interface Props {
  emit: Emits;
}

export const useImportExpensesForm = ({ emit }: Props) => {
  const { handleSubmit, meta, defineField, resetForm } = useForm({
    validationSchema: importExpensesSchema,
    initialValues: {
      file: null as unknown as File,
    } as IImportExpenses,
  });

  const isFormValid = computed(() => {
    return meta.value.valid && meta.value.dirty;
  });

  const errors = useFormErrors();

  const [file, fileAttrs] = defineField("file");

  const onSubmit = handleSubmit((values) => {
    emit("submit", {
      file: values.file,
    });

    emit("update:dialogIsVisible", false);
  });

  const onClose = () => {
    emit("update:dialogIsVisible", false);
  };

  return {
    meta,
    file,
    fileAttrs,
    errors,
    isFormValid,
    resetForm,
    onSubmit,
    onClose,
  };
};
