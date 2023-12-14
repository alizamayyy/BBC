import { Routes, Route } from "react-router-dom";
import Login from "./components/Login"; // Import the Login component
// import Home from "./components/Home";
import Profile from "./components/Profile";
import Posts from "./components/Posts";
import About from "./components/about";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Posts />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/posts" element={<Posts />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
};

export default AppRouter;
