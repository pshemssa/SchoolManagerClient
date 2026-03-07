import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FeePayment from './pages/FeePayment';
import Fees from './pages/Fees';
import Academics from './pages/academics/Academics';

function App() {
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/fee-payment" element={
          <ProtectedRoute>
            <FeePayment />
          </ProtectedRoute>
        } />
        <Route path="/fees" element={
          <ProtectedRoute>
            <Fees />
          </ProtectedRoute>
        } />
        <Route path="/academics" element={
          <ProtectedRoute>
            <Academics />
          </ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
