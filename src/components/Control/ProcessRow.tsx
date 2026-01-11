import { useEffect, useMemo, useState } from "react";
import type { MouseEvent } from "react";
import type { Process } from "../../types/Process";
import { FileText, Loader2, RotateCcw } from "lucide-react";
import { useProcessStore } from "../../store/processStore";

type ProcessRowProps = {
  process: Process;
  isSelected: boolean;
  onSelect: (name: string) => void;
  onStart: (name: string) => void;
  onStop: (name: string) => void;
};

const MIN_START_SPINNER_MS = 450;
const RETRY_COOLDOWN_MS = 3000;

export default function ProcessRow({
  process,
  isSelected,
  onSelect,
  onStart,
  onStop,
}: ProcessRowProps) {
  const pending = useProcessStore((s) => s.pending[process.name]);
  const stuck = useProcessStore((s) => s.stuck?.[process.name] ?? false);
  const clearStuck = useProcessStore((s) => s.clearStuck);

  const running = process.status === "up";

  // Spinner only for START
  const [showStartSpinner, setShowStartSpinner] = useState(false);

  // Retry cooldown (prevents spamming backend)
  const [cooldownUntil, setCooldownUntil] = useState<number>(0);
  const [now, setNow] = useState<number>(() => Date.now());

  const isStartPending = pending === "start";
  const inCooldown = now < cooldownUntil;
  const disableStart = isStartPending || inCooldown;

  const retrySecondsLeft = useMemo(() => {
    if (!inCooldown) return 0;
    const msLeft = cooldownUntil - now;
    return Math.max(1, Math.ceil(msLeft / 1000));
  }, [cooldownUntil, inCooldown, now]);

  // keep "now" ticking only while cooldown is active
  useEffect(() => {
    if (!inCooldown) return;
    const id = window.setInterval(() => setNow(Date.now()), 200);
    return () => window.clearInterval(id);
  }, [inCooldown]);

  // Helpful secondary text for stuck/bad starts
  const stuckHint = useMemo(() => {
    if (!stuck) return null;

    const bits: string[] = [];
    if (typeof process.attempts === "number") bits.push(`attempts: ${process.attempts}`);
    if (process.goal) bits.push(`goal: ${process.goal}`);
    return bits.length ? bits.join(" • ") : "start didn’t complete";
  }, [stuck, process.attempts, process.goal]);

  useEffect(() => {
    let t: number | undefined;

    if (isStartPending) {
      setShowStartSpinner(true);

      // Ensure spinner visible long enough (prevents blink)
      t = window.setTimeout(() => {
        // Only hide if start is no longer pending
        if (useProcessStore.getState().pending[process.name] !== "start") {
          setShowStartSpinner(false);
        }
      }, MIN_START_SPINNER_MS);
    } else {
      setShowStartSpinner(false);
    }

    return () => {
      if (t) window.clearTimeout(t);
    };
  }, [isStartPending, process.name]);

  const handleRowClick = () => onSelect(process.name);

  const handleStart = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (disableStart) return;

    // if it was stuck, clear the stuck banner before retry
    clearStuck(process.name);
    onStart(process.name);
  };

  const handleStop = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onStop(process.name);
  };

  const handleRetry = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (disableStart) return;

    clearStuck(process.name);
    // start cooldown immediately to prevent spam-clicks
    setCooldownUntil(Date.now() + RETRY_COOLDOWN_MS);
    setNow(Date.now());

    onStart(process.name);
  };

  const handleLogClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onSelect(process.name);
  };

  return (
    <tr
      className={`
        cursor-pointer border-t border-gray-800
        ${isSelected ? "bg-[#141b23]" : "hover:bg-[#10151b]"}
      `}
      onClick={handleRowClick}
    >
      <td className="px-3 py-1.5">{process.name}</td>
      <td className="px-3 py-1.5">{process.host}</td>
      <td className="px-3 py-1.5">{process.port}</td>

      <td className="px-3 py-1.5">
        <span
          className={`
            inline-flex items-center gap-1
            ${running ? "text-green-400" : "text-red-400"}
          `}
        >
          <span
            className={`
              inline-block w-2 h-2 rounded-full
              ${running ? "bg-green-500" : "bg-red-500"}
            `}
          />
          {running ? "up" : "down"}
        </span>
      </td>

      <td className="px-3 py-1.5">{process.pid ?? "-"}</td>
      <td className="px-3 py-1.5">{process.mem ?? "-"}</td>

      <td className="px-3 py-1.5">
        <button
          onClick={handleLogClick}
          className="text-gray-400 hover:text-blue-400 transition"
          title="Show logs for this process"
        >
          <FileText size={16} />
        </button>
      </td>

      <td className="px-3 py-1.5">
        {/* Fixed width prevents table shake */}
        <div className="min-w-[140px] flex flex-col items-start gap-1">
          {showStartSpinner ? (
            <button
              disabled
              className="px-2 py-0.5 text-xs rounded-sm border border-gray-600 text-gray-400 opacity-60 cursor-not-allowed flex items-center gap-1"
            >
              <Loader2 size={14} className="animate-spin" />
              Starting...
            </button>
          ) : stuck && !running ? (
            <>
              <button
                onClick={handleRetry}
                disabled={disableStart}
                className={`
                  px-2 py-0.5 text-xs rounded-sm border flex items-center gap-1 transition
                  ${
                    disableStart
                      ? "border-gray-600 text-gray-400 opacity-60 cursor-not-allowed"
                      : "border-yellow-600 text-yellow-300 hover:bg-yellow-600 hover:text-black"
                  }
                `}
                title={
                  disableStart
                    ? isStartPending
                      ? "Start already in progress"
                      : "Retry cooldown"
                    : "Start got stuck — retry"
                }
              >
                <RotateCcw size={14} />
                {inCooldown ? `Retry (${retrySecondsLeft}s)` : "Retry"}
              </button>

              {stuckHint ? (
                <div className="text-[10px] text-gray-500">{stuckHint}</div>
              ) : null}
            </>
          ) : running ? (
            <button
              onClick={handleStop}
              className="px-2 py-0.5 text-xs rounded-sm border border-orange-600 text-orange-400 hover:bg-orange-600 hover:text-black"
            >
              Stop
            </button>
          ) : (
            <button
              onClick={handleStart}
              disabled={disableStart}
              className={`
                px-2 py-0.5 text-xs rounded-sm border transition
                ${
                  disableStart
                    ? "border-gray-600 text-gray-400 opacity-60 cursor-not-allowed"
                    : "border-green-600 text-green-400 hover:bg-green-600 hover:text-black"
                }
              `}
              title={
                disableStart
                  ? isStartPending
                    ? "Start already in progress"
                    : "Retry cooldown"
                  : "Start process"
              }
            >
              {inCooldown ? `Start (${retrySecondsLeft}s)` : "Start"}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
