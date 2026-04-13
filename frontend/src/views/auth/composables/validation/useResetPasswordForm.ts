import { useAuthStore } from "@/stores/auth/auth.store";
import type { IResetPasswordPayload } from "../../types";
import { useRouteQuery } from "@vueuse/router";
import { resetPasswordSchema } from "./schemas/reset-password.schema";

export const useResetPasswordForm = () => {
  const { resetPassword } = useAuthStore();

  const router = useRouter();
  const token = useRouteQuery<string>("token");

  const { handleSubmit, meta, defineField, resetForm } = useForm({
    validationSchema: resetPasswordSchema,
    initialValues: {
      password: "",
      token: token.value,
    } as IResetPasswordPayload,
  });

  const errors = useFormErrors();

  const [password, passwordAttrs] = defineField("password");

  const onSubmit = handleSubmit(async (values) => {
    try {
      await resetPassword({
        password: values.password,
        token: token.value,
      });

      router.replace({
        name: "auth",
        query: {
          mode: "login",
        },
      });
    } catch (error) {
      console.error(error);
    }
  });

  return {
    meta,
    password,
    passwordAttrs,
    errors,
    resetForm,
    onSubmit,
  };
};
