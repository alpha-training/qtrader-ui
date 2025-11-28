import { BrowserRouter, Routes, Route } from "react-router-dom";
import SidebarLayout from "./components/Sidebar/SidebarLayout";
import ControlPage from "./pages/ControlPage";

function App() {
  return (
    <BrowserRouter>
      <SidebarLayout>
        <Routes>
          <Route path="/" element={<ControlPage />} />
        </Routes>
      </SidebarLayout>
    </BrowserRouter>
  );
}

export default App;
