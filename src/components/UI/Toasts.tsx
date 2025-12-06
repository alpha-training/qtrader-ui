import { useEffect } from "react";
import { useToastStore } from "../../store/toastStore";

export default function Toasts() {
  const { toasts, remove } = useToastStore();

  useEffect(() => {
    const timers = toasts.map((t) =>
      setTimeout(() => remove(t.id), 3000)
    );
    return () => timers.forEach(clearTimeout);
  }, [toasts, remove]);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`
            px-3 py-2 rounded-md text-sm shadow-md border
            ${
              t.type === "success"
                ? "bg-green-600/20 border-green-500 text-green-300"
                : t.type === "error"
                ? "bg-red-600/20 border-red-500 text-red-300"
                : "bg-blue-600/20 border-blue-500 text-blue-300"
            }
          `}
        >
          {t.text}
        </div>
      ))}
    </div>
  );
}
