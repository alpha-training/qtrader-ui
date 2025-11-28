import { BrowserRouter, Routes, Route } from "react-router-dom";
import ControlPage from "./pages/ControlPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route goes to Control */}
        <Route path="/" element={<ControlPage />} />
        {/* You can add more routes later */}
        {/* <Route path="/strats" element={<StratsPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;