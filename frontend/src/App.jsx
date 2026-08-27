// import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router';
import AppLayout from './pages/AppLayout';
import DailyPlanner from './pages/DailyPlanner';
import AddRecipe from './pages/AddRecipe';
import Profile from './pages/Profile';
import About from './pages/About';
import Contact from './pages/Contact';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import OnboardingPage from './pages/OnboardingPage';
import NotFound from './pages/NotFound';
import { AuthProvider } from './features/auth/context/AuthContext';
import './App.css';
import DefaultLayout from './pages/DefaultLayout';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="signup" element={<SignUp />} />
          <Route path="login" element={<Login />} />
          <Route path="" element={<DefaultLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
          </Route>
          <Route path="" element={<AppLayout />}>
            <Route path="onboarding" element={<OnboardingPage />} />
            <Route path="daily-planner" element={<DailyPlanner />} />
            <Route path="add-recipe" element={<AddRecipe />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
