import { importCategoriesSchema } from "./schemas/import.schema";
import type { IImportCategories } from "../../types";

interface Emits {
  (e: "update:dialogIsVisible", value: boolean): void;
  (e: "submit", payload: IImportCategories): void;
}

interface Props {
  emit: Emits;
}

export const useImportCategoriesForm = ({ emit }: Props) => {
  const { handleSubmit, meta, defineField, resetForm } = useForm({
    validationSchema: importCategoriesSchema,
    initialValues: {
      file: null as unknown as File,
    } as IImportCategories,
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
