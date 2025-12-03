// src/pages/ControlPage.tsx
import { useState } from "react";
import ControlTable from "../components/control/ControlTable";
import Logs from "../components/control/Logs";
import { useProcesses } from "../context/ProcessContext";

export default function ControlPage() {
  const [selectedChannel, setSelectedChannel] = useState<string>("All");
  const { processes } = useProcesses();

  return (
    <>
      <ControlTable
        selectedChannel={selectedChannel}
        onSelectChannel={setSelectedChannel}
      />
      <Logs
        selectedChannel={selectedChannel}
        onChannelChange={setSelectedChannel}
        processes={processes}
      />
    </>
  );
}
