import { useForm, useFormErrors } from "vee-validate";
import { loginSchema } from "./schemas/login.schema";
import type { ISignupPayload } from "../../types";
import { useAuthStore } from "@/stores/auth/auth.store";
import { useRouter } from "vue-router";
import type { CredentialResponse } from "vue3-google-signin";

export const useSignupForm = () => {
  const { signup, googleAuth } = useAuthStore();

  const router = useRouter();

  const { handleSubmit, meta, defineField, resetForm } = useForm({
    validationSchema: loginSchema,
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    } as ISignupPayload,
  });

  const errors = useFormErrors();

  const [email, emailAttrs] = defineField("email");
  const [firstName, firstNameAttrs] = defineField("firstName");
  const [lastName, lastNameAttrs] = defineField("lastName");
  const [password, passwordAttrs] = defineField("password");

  const onSubmit = handleSubmit(async (values) => {
    try {
      await signup({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      });

      router.replace({
        name: "auth",
        query: {
          mode: "verify-email",
        },
      });
    } catch (error) {
      console.error(error);
    }
  });

  const handleGoogleAuth = async (payload: CredentialResponse) => {
    try {
      await googleAuth(payload);

      router.replace({
        name: "main",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return {
    meta,
    firstName,
    firstNameAttrs,
    lastName,
    lastNameAttrs,
    email,
    emailAttrs,
    password,
    passwordAttrs,
    errors,
    resetForm,
    onSubmit,
    handleGoogleAuth,
  };
};
