import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import Profile from './pages/profile/Profile';

const App = () => {
  return (
    <Routes>

      {/* ── Auth Routes ──────────────────────────── */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* ── Other Routes (add as you build) ─────── */}
      {/* <Route path="/dashboard" element={<Dashboard />} /> */}

      {/* ── Default Redirect ─────────────────────── */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
};

export default App;