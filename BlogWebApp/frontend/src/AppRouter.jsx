import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login'; // Import the Login component
import Home from './components/Home';
import Profile from './components/Profile';
import Posts from './components/Posts';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} /> {/* Set Login as the initial landing page */}
      <Route path="/home" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/posts" element={<Posts />} />
    </Routes>
  );
};

export default AppRouter;
