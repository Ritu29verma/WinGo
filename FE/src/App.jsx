import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminSignup from './pages/AdminSignup';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home';
import WinGo from "./pages/WinGo";
import DepositPage from './pages/DepositPage';
import Withdraw from './pages/Withdraw';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './components/ProtectedRoute';
import PaymentManage from './pages/Adminpayment';
import RechargeTransactionsTable from './pages/PendingRecharge';
import NonPendingTransactionsTable from './pages/ApprovedRecharge';
import PendingWithdrawalsTable from './pages/PendingWithdrawl';
import NonPendingWithdrawalsTable from './pages/ApprovedWithdrawal';
import DepositHistory from './pages/DepositHistory';
import WithdrawalHistory from "./pages/WithdrawalHistory";
import PrivateRouteUser from "./components/ProtectedRouteUser";
import UsersTable from './components/AllUsers';
import UserGameHistory from './components/UserGameHistory';
import BetsData from './pages/betsData';
import LoginWingo from './pages/LoginGoldenCMA';
import Loader from './components/Loader';
import AdminDashboard2 from './pages/AdminDashboard2';
import AdminDashboard3 from './pages/AdminDashboard3';
import AdminDashboard4 from './pages/AdminDashboard4';

function App() {
  return (
    <>
      <ToastContainer  autoClose={600} />
      <BrowserRouter>
        <Routes>
          <Route path="/loader" element={<Loader />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/dashboard2" element={<ProtectedRoute><AdminDashboard2 /></ProtectedRoute>} />
          <Route path="/admin/dashboard4" element={<ProtectedRoute><AdminDashboard4 /></ProtectedRoute>} />
          <Route path="/admin/dashboard3" element={<ProtectedRoute><AdminDashboard3 /></ProtectedRoute>} />
          <Route path="/admin/paymentmanage" element={<ProtectedRoute><PaymentManage /></ProtectedRoute>} />
          <Route path="/admin/pendingrecharge" element={<ProtectedRoute><RechargeTransactionsTable /></ProtectedRoute>} />
          <Route path="/admin/approvedrecharge" element={<ProtectedRoute><NonPendingTransactionsTable /></ProtectedRoute>} />
          <Route path="/admin/pendingwithdrawl" element={<ProtectedRoute><PendingWithdrawalsTable /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute><UsersTable /></ProtectedRoute>} />
          <Route path="/user-game-history/:userId" element={<UserGameHistory />} />
          <Route path="/admin/betsData" element={<ProtectedRoute><BetsData /></ProtectedRoute>} />
          <Route path="/admin/approvedwithdrawl" element={<ProtectedRoute><NonPendingWithdrawalsTable /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login-wingo" element={<LoginWingo />} />
          <Route path="/admin/register" element={<AdminSignup />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/" element={<PrivateRouteUser><WinGo /></PrivateRouteUser>} />
          <Route path="/wingo/deposit" element={<PrivateRouteUser><DepositPage /></PrivateRouteUser>} />
          <Route path="/wingo/withdraw" element={<PrivateRouteUser><Withdraw /></PrivateRouteUser>} />
          <Route path="/withdrawal-history" element={<PrivateRouteUser><WithdrawalHistory /></PrivateRouteUser>} />
          <Route path="/deposit-history" element={<PrivateRouteUser><DepositHistory /></PrivateRouteUser>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
