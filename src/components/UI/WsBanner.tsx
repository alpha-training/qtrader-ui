// src/components/UI/WsBanner.tsx
import { useWsStore } from "../../store/wsStore";

export default function WsBanner() {
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
