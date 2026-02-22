import { createTransport } from "nodemailer";
import { EMAIL_CONFIG } from "../../config/email.config";
import { renderTemplate } from "./renderer/template.renderer";
import { TEmailTemplate, TEmailTemplateVariables } from "./types/email.types";
import { AppError } from "../../errors/AppError";

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_CONFIG.email,
    pass: EMAIL_CONFIG.password,
  },
});

export const EmailService = () => {
  const sendTextEmail = async (to: string, subject: string, text: string) => {
    try {
      await transporter.sendMail({
        from: EMAIL_CONFIG.senderEmail,
        to,
        subject,
        text,
      });
    } catch (error) {
      console.error(error);
      throw new AppError("EMAIL_SEND_FAILED", {
        error,
      });
    }
  };

  const sendTemplateEmail = async <T extends TEmailTemplate>(
    to: string,
    subject: string,
    template: T,
    variables: TEmailTemplateVariables<T>,
  ) => {
    try {
      await transporter.sendMail({
        from: EMAIL_CONFIG.senderEmail,
        to,
        subject,
        html: await renderTemplate(template, variables),
      });
    } catch (error) {
      console.error(error);
      throw new AppError("EMAIL_SEND_FAILED", {
        error,
      });
    }
  };

  return {
    sendTextEmail,
    sendTemplateEmail,
  };
};
