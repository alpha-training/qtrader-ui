// src/components/UI/WsBanner.tsx
import { useWsStore } from "../../store/wsStore";

const WS_ENABLED = import.meta.env.VITE_WS_ENABLED !== "false";

export default function WsBanner() {
  // If WS is disabled (polling mode), don't show "Connection lost"
  if (!WS_ENABLED) return null;

  const status = useWsStore((s) => s.status);

  if (status === "connected") return null;

  const text =
    status === "connecting"
      ? "Connecting..."
      : status === "reconnecting"
      ? "Reconnecting..."
      : "Connection lost";

  return (
    <div className="w-full bg-orange-700 text-center text-xs py-1 text-white fixed top-0 z-50">
      {text}
    </div>
  );
}
