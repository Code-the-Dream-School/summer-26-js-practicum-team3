// import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router';
import AppLayout from './pages/AppLayout';
import DailyPlanner from './pages/DailyPlanner';
import AddRecipe from './pages/AddRecipe/AddRecipe';
import Profile from './pages/Profile';
import About from './pages/About';

import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import OnboardingPage from './pages/OnboardingPage';
import NotFound from './pages/NotFound';
import { AuthProvider } from './features/auth/context/AuthContext';
import './App.css';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="about" element={<About />} />
            {/* <Route path="/contact" element={<Contact />} /> */}
            <Route path="login" element={<Login />} />
            <Route path="onboarding" element={<OnboardingPage />} />
            <Route path="daily-planner" element={<DailyPlanner />} />
            <Route path="add-recipe" element={<AddRecipe />} />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
