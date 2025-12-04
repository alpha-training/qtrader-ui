// src/pages/ControlPage.tsx
import { useState } from "react";
import ControlTable from "../components/control/ControlTable";
import Logs from "../components/control/Logs";

export default function ControlPage() {
  const [selectedChannel, setSelectedChannel] = useState<string>("All");

  return (
    <>
      <ControlTable
        selectedChannel={selectedChannel}
        onSelectChannel={setSelectedChannel}
      />
      <Logs
      />
    </>
  );
}
