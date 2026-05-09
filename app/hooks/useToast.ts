import { useRef, useState } from "react";
import { useSettings } from "../context/SettingsContext";

type ToastType = "success" | "error" | "info";

interface ToastData {
  type: ToastType;
  text1: string;
  text2?: string;
}

interface ToastState extends ToastData {
  visible: boolean;
  id: number;
}

let externalShow: ((data: ToastData) => void) | null = null;
let externalShowModal: ((data: ToastData) => void) | null = null;

export function useToast(scope: "global" | "modal" = "global") {
  const { notification } = useSettings();
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    type: "success",
    text1: "",
    id: 0,
  });

  const show = (data: ToastData) => {
    setToast((prev) => {
      return { ...prev, visible: false };
    });
    setTimeout(() => {
      const next = { ...data, visible: true, id: Date.now() };
      console.log(next);
      if (next.type === "success" && !notification) return;
      setToast(next);
    }, 150);
  };

  const showRef = useRef(show);
  showRef.current = show;

  const stableShow = useRef((data: ToastData) => {
    showRef.current(data);
  }).current;

  const hide = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  if (scope === "modal") {
    externalShowModal = stableShow;
  } else {
    externalShow = stableShow;
  }

  return { toast, show: stableShow, hide };
}

export function showToast(data: ToastData) {
  externalShow?.(data);
}

export function showToastModal(data: ToastData) {
  externalShowModal?.(data);
}
