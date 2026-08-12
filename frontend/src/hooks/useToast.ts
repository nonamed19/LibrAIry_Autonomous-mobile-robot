import { useToastContext } from "../context/ToastContext";

export const useToast = () => {
  const { showToast, toasts } = useToastContext();
  return { showToast, toasts };
};
