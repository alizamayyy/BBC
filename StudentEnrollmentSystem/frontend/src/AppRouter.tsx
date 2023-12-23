import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import DashboardPage from "./App";
import About from "./About";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
};

export default AppRouter;
