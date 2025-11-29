import PageLayout from "../components/layout/PageLayout";
import ControlTable from "../components/control/ControlTable";
import Logs from "../components/control/Logs";

export default function ControlPage() {
  return (
    <PageLayout>
      <h1 className="text-2xl font-semibold mb-6">Control</h1>

      <ControlTable />

      <div className="mt-10">
        <Logs />
      </div>
    </PageLayout>
  );
}
