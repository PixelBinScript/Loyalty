import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Rewards from './pages/Rewards';
import Settings from './pages/Settings';
import LoyaltyWidget from './components/LoyaltyWidget';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="rewards" element={<Rewards />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
      <LoyaltyWidget />
    </BrowserRouter>
  );
}

export default App;