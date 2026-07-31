import { useEffect, useState } from 'react';

import { BrowserRouter as Router, Route, Routes } from 'react-router';
import AppLayout from './pages/AppLayout';
import DailyPlanner from './pages/DailyPlanner';
import Goals from './pages/Goals';
import AddRecipe from './pages/AddRecipe/AddRecipe';
import Profile from './pages/Profile';
import Home from './pages/Home';

import './App.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="daily-planner" element={<DailyPlanner />} />
          <Route path="goals" element={<Goals />} />
          <Route path="add-recipe" element={<AddRecipe />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}
