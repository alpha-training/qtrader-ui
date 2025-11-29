import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageLayout from "./components/layout/PageLayout";
import ControlPage from "./pages/ControlPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PageLayout />}>
          <Route path="/" element={<ControlPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
