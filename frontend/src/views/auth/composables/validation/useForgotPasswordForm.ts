import { forgotPasswordSchema } from "./schemas/forgot-password.schema";
import { useAuthStore } from "@/stores/auth/auth.store";
import type { IForgotPasswordPayload } from "../../types";

export const useForgotPasswordForm = () => {
  const { forgotPassword } = useAuthStore();
  const router = useRouter();

  const { handleSubmit, meta, defineField, resetForm } = useForm({
    validationSchema: forgotPasswordSchema,
    initialValues: {
      email: "",
    } as IForgotPasswordPayload,
  });

  const errors = useFormErrors();

  const [email, emailAttrs] = defineField("email");

  const onSubmit = handleSubmit(async (values) => {
    try {
      await forgotPassword({
        email: values.email,
      });

      router.replace({
        name: "auth",
      });
    } catch (error) {
      console.error(error);
    }
  });

  return {
    meta,
    email,
    emailAttrs,
    errors,
    resetForm,
    onSubmit,
  };
};
