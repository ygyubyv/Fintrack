import ejs from "ejs";
import path from "path";
import type {
  TEmailTemplate,
  TEmailTemplateVariables,
} from "../types/email.types";

const templatePath = (fileName: TEmailTemplate) =>
  path.join(
    process.cwd(),
    "src",
    "services",
    "email",
    "templates",
    `${fileName}.ejs`,
  );

export const renderTemplate = async <T extends TEmailTemplate>(
  template: T,
  variables: TEmailTemplateVariables<T>,
) => {
  return ejs.renderFile(templatePath(template), variables);
};
