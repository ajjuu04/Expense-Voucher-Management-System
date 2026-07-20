import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { ProtectedRoute, RoleRoute } from './ProtectedRoute';

import Login from './pages/Login';

import EmpDashboard from './pages/employee/Dashboard';
import CreateVoucher from './pages/employee/CreateVoucher';
import MyVouchers from './pages/employee/MyVouchers';
import EmpVoucherDetail from './pages/employee/VoucherDetail';
import EditVoucher from './pages/employee/EditVoucher';

import DirDashboard from './pages/director/Dashboard';
import PendingApprovals from './pages/director/PendingApprovals';
import DirAllVouchers from './pages/director/AllVouchers';
import DirVoucherDetail from './pages/director/VoucherDetail';

import AccDashboard from './pages/accounts/Dashboard';
import AccAllVouchers from './pages/accounts/AllVouchers';
import AccVoucherDetail from './pages/accounts/VoucherDetail';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Employee routes */}
          <Route path="/employee/dashboard" element={<RoleRoute role="EMPLOYEE"><EmpDashboard /></RoleRoute>} />
          <Route path="/employee/create" element={<RoleRoute role="EMPLOYEE"><CreateVoucher /></RoleRoute>} />
          <Route path="/employee/vouchers" element={<RoleRoute role="EMPLOYEE"><MyVouchers /></RoleRoute>} />
          <Route path="/employee/vouchers/:id" element={<RoleRoute role="EMPLOYEE"><EmpVoucherDetail /></RoleRoute>} />
          <Route path="/employee/vouchers/:id/edit" element={<RoleRoute role="EMPLOYEE"><EditVoucher /></RoleRoute>} />

          {/* Director routes */}
          <Route path="/director/dashboard" element={<RoleRoute role="DIRECTOR"><DirDashboard /></RoleRoute>} />
          <Route path="/director/pending" element={<RoleRoute role="DIRECTOR"><PendingApprovals /></RoleRoute>} />
          <Route path="/director/vouchers" element={<RoleRoute role="DIRECTOR"><DirAllVouchers /></RoleRoute>} />
          <Route path="/director/vouchers/:id" element={<RoleRoute role="DIRECTOR"><DirVoucherDetail /></RoleRoute>} />

          {/* Accounts routes */}
          <Route path="/accounts/dashboard" element={<RoleRoute role="ACCOUNTS"><AccDashboard /></RoleRoute>} />
          <Route path="/accounts/vouchers" element={<RoleRoute role="ACCOUNTS"><AccAllVouchers /></RoleRoute>} />
          <Route path="/accounts/vouchers/:id" element={<RoleRoute role="ACCOUNTS"><AccVoucherDetail /></RoleRoute>} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
