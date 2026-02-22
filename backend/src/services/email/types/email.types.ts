export type TEmailTemplate = "ResetPassword" | "VerifyEmail";

type TEmailTemplateVariablesMap = {
  ResetPassword: {
    firstName: string;
    resetLink: string;
  };

  VerifyEmail: {
    firstName: string;
    verificationCode: number;
  };
};

export type TEmailTemplateVariables<T extends TEmailTemplate> =
  TEmailTemplateVariablesMap[T];
