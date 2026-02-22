export type TEmailTemplate = "ResetPassword";

type TEmailTemplateVariablesMap = {
  ResetPassword: {
    firstName: string;
    resetLink: string;
  };
};

export type TEmailTemplateVariables<T extends TEmailTemplate> =
  TEmailTemplateVariablesMap[T];
