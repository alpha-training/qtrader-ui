import { useEffect } from "react";
import { useToastStore } from "../../store/toastStore";

export default function Toasts() {
  const { toasts, remove } = useToastStore();

  // Auto-remove after 3.5s
  useEffect(() => {
    const timers = toasts.map((t) =>
      setTimeout(() => remove(t.id), 3500)
    );
    return () => timers.forEach(clearTimeout);
  }, [toasts, remove]);

  // Color classes
  const color = {
    success: "bg-green-600 text-white",
    error: "bg-red-600 text-white",
    warning: "bg-amber-500 text-black",
    info: "bg-gray-700 text-white",
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 w-80">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`
            flex items-start justify-between px-3 py-2 rounded-sm shadow-md 
            text-xs animate-slideIn opacity-95 hover:opacity-100 transition
            ${color[t.type] ?? color.info}
          `}
        >
          {/* Message */}
          <span className="pr-3 leading-snug">{t.text}</span>

          {/* Close button */}
          <button
            onClick={() => remove(t.id)}
            className="text-black/50 hover:text-black ml-2
                       dark:text-white/70 dark:hover:text-white"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
