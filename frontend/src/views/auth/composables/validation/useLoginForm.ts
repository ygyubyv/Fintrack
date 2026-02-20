import { useForm, useFormErrors } from "vee-validate";
import { loginSchema } from "./schemas/login.schema";
import { useAuthStore } from "@/stores/auth/auth.store";
import type { ILoginPayload } from "../../types";
import { useRouter } from "vue-router";

export const useLoginForm = () => {
  const { login } = useAuthStore();

  const router = useRouter();

  const { handleSubmit, meta, defineField, resetForm } = useForm({
    validationSchema: loginSchema,
    initialValues: {
      email: "",
      password: "",
    } as ILoginPayload,
  });

  const errors = useFormErrors();

  const [email, emailAttrs] = defineField("email");
  const [password, passwordAttrs] = defineField("password");

  const onSubmit = handleSubmit(async (values) => {
    try {
      await login({
        email: values.email,
        password: values.password,
      });

      router.replace({
        name: "main",
      });
    } catch (error) {
      console.error(error);
    }
  });

  return {
    meta,
    email,
    emailAttrs,
    password,
    passwordAttrs,
    errors,
    resetForm,
    onSubmit,
  };
};
