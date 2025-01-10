import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/home";
import BillPage from "./pages/bills/BillPage";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/bills/:id" element={<BillPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
