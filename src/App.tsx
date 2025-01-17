import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import HomePage from "./pages/home";
import BillPage from "./pages/bills/BillPage";
import LoginPage from "./pages/auth/login";
import SignUpPage from "./pages/auth/signup";
import VerifyPage from "./pages/auth/verify";

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<p>Loading...</p>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/bills/:id" element={<BillPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/signup" element={<SignUpPage />} />
          <Route path="/auth/verify" element={<VerifyPage />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
