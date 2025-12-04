// src/pages/ControlPage.tsx
import { useState } from "react";
import ControlTable from "../components/control/ControlTable";
import Logs from "../components/control/Logs";

export default function ControlPage() {
  // The currently selected log tab (channel)
  const [selectedChannel, setSelectedChannel] = useState("All");

  return (
    <div>
      {/* Processes table */}
      <ControlTable
        selectedChannel={selectedChannel}
        onSelectChannel={setSelectedChannel}
      />

      {/* Logs viewer */}
      <Logs
        selectedChannel={selectedChannel}
        onChannelChange={setSelectedChannel}
      />
    </div>
  );
}
