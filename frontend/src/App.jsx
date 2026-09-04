// import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router';
import AppLayout from './pages/AppLayout';
import DailyPlanner from './pages/DailyPlanner';
import AddRecipe from './pages/AddRecipe';
import Profile from './pages/Profile';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import OnboardingPage from './pages/OnboardingPage';
import NotFound from './pages/NotFound';
import { AuthProvider } from './features/auth/context/AuthContext';
import './App.css';
import DefaultLayout from './pages/DefaultLayout';
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import PublicRoute from './features/auth/components/PublicRoute';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="" element={<DefaultLayout />}>
            <Route
              index
              element={
                <PublicRoute>
                  <Home />
                </PublicRoute>
              }
            />
            <Route
              path="login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="signup"
              element={
                <PublicRoute>
                  <SignUp />
                </PublicRoute>
              }
            />
            <Route
              path="about"
              element={
                <PublicRoute>
                  <About />
                </PublicRoute>
              }
            />
          </Route>
          <Route
            path=""
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
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
