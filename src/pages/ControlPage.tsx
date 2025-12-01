import { useState } from "react";
import ControlTable from "../components/control/ControlTable";
import Logs from "../components/control/Logs";

export default function ControlPage() {
  const [selectedChannel, setSelectedChannel] = useState("rdb1");

  return (
    <>
      <ControlTable onSelectChannel={setSelectedChannel} />

      <Logs
        selectedChannel={selectedChannel}
        onChannelChange={setSelectedChannel}
      />
    </>
  );
}
