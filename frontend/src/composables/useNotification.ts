import { useToast } from "vue-toast-notification";

interface Props {
  message: string;
  type: "success" | "warning" | "info" | "error";
  duration?: number; // seconds
}

export const useNotification = () => {
  const { open } = useToast();

  const notify = ({ message, type, duration = 3 }: Props) => {
    open({
      message,
      type,
      duration: duration * 1000,
      position: "top-right",
    });
  };

  return { notify };
};
