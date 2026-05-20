import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import ProtectedRoute from "./ProtectedRoute";

type Props = {
  theme: string;
  toggleTheme: () => void;
};

export default function AppRouter({ theme, toggleTheme }: Props) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage theme={theme} toggleTheme={toggleTheme} /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}