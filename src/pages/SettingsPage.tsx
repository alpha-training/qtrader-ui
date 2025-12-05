// src/pages/SettingsPage.tsx
import { usePrefs } from "../hooks/usePrefs";

export default function SettingsPage() {
  const {
    confirmStart,
    confirmStop,
    confirmStartAll,
    confirmStopAll,
    setPrefs,
  } = usePrefs();

  const prefs = {
    confirmStart,
    confirmStop,
    confirmStartAll,
    confirmStopAll,
  };

  const settings = [
    { key: "confirmStart", label: "Show confirmation when starting a process" },
    { key: "confirmStop", label: "Show confirmation when stopping a process" },
    { key: "confirmStartAll", label: "Show confirmation for Start All" },
    { key: "confirmStopAll", label: "Show confirmation for Stop All" },
  ] as const;

  return (
    <div className="max-w-md space-y-4 p-3">
      <h1 className="text-lg font-semibold mb-2">Preferences</h1>

      {settings.map(({ key, label }) => (
        <label key={key} className="flex items-center justify-between text-sm py-1">
          <span>{label}</span>

          {/* Toggle Switch */}
          <button
            onClick={() => setPrefs({ [key]: !prefs[key] })}
            className={`
              relative w-10 h-5 rounded-full transition
              ${prefs[key] ? "bg-blue-500" : "bg-gray-600"}
            `}
          >
            <span
              className={`
                absolute w-4 h-4 bg-white rounded-full top-0.5 transition
                ${prefs[key] ? "left-5" : "left-0.5"}
              `}
            />
          </button>
        </label>
      ))}
    </div>
  );
}
