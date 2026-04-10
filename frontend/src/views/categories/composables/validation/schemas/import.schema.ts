import * as yup from "yup";

export const importCategoriesSchema = yup.object({
  file: yup
    .mixed<File>()
    .required()
    .test("fileType", "Only CSV files are allowed", (value) => {
      if (!value) {
        return false;
      }

      return value.name.endsWith(".csv");
    }),
});
