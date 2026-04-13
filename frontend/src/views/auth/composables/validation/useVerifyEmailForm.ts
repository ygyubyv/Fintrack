import { verifyEmailSchema } from "./schemas/verify-email.schema";
import { useAuthStore } from "@/stores/auth/auth.store";

export const useVerifyEmailForm = () => {
  const { verifyEmail } = useAuthStore();
  const router = useRouter();

  const { handleSubmit, meta, defineField, resetForm } = useForm({
    validationSchema: verifyEmailSchema,
  });

  const [code, codeAttrs] = defineField("code");

  const onSubmit = handleSubmit(async (values) => {
    try {
      await verifyEmail({
        code: Number(values.code),
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
    code,
    codeAttrs,
    resetForm,
    onSubmit,
  };
};
