import React from "react";
import { Routes, Route } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";

import NotFound from "./pages/not-found";
import Home from "./pages/Home";
import UserDashboard from "./pages/UserDashboard";
import UserSettings from "./pages/UserSettings";
import Connect from "./pages/Connect";
import ListingDetails from "./pages/ListingDetails";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";
import Contact from "./pages/Contact";

// Account Holder Pages (temporarily using these until we create unified versions)
import CreateSubscription from "./pages/account-holder/CreateSubscription";
import ManageMembers from "./pages/account-holder/ManageMembers";
import AccountHolderMessages from "./pages/account-holder/Messages";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import ServiceManagement from "./pages/admin/ServiceManagement";
import ServiceDetails from "./pages/admin/ServiceDetails";
import UserManagement from "./pages/admin/UserManagement";

import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { LoginForm } from "./components/auth/LoginForm";
import { RegisterForm } from "./components/auth/RegisterForm";
import Dashboard from "./pages/Dashboard";

function Router() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<RegisterForm />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/cookies" element={<Cookies />} />
      <Route path="/contact" element={<Contact />} />

      {/* Protected Routes - Unified User */}
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRoles={["UNIFIED", "ADMIN"]}>
          <UserDashboard />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute allowedRoles={["UNIFIED", "ADMIN"]}>
          <UserSettings />
        </ProtectedRoute>
      } />
      <Route path="/connect" element={
        <ProtectedRoute allowedRoles={["UNIFIED", "ADMIN"]}>
          <Connect />
        </ProtectedRoute>
      } />
      <Route path="/listing/:id" element={
        <ProtectedRoute allowedRoles={["UNIFIED", "ADMIN"]}>
          <ListingDetails />
        </ProtectedRoute>
      } />
      <Route path="/create-subscription" element={
        <ProtectedRoute allowedRoles={["UNIFIED", "ADMIN"]}>
          <CreateSubscription />
        </ProtectedRoute>
      } />
      <Route path="/manage-members" element={
        <ProtectedRoute allowedRoles={["UNIFIED", "ADMIN"]}>
          <ManageMembers />
        </ProtectedRoute>
      } />
      <Route path="/messages" element={
        <ProtectedRoute allowedRoles={["UNIFIED", "ADMIN"]}>
          <AccountHolderMessages />
        </ProtectedRoute>
      } />
      <Route path="/find-subscriptions" element={
        <ProtectedRoute allowedRoles={["UNIFIED", "ADMIN"]}>
          <Connect />
        </ProtectedRoute>
      } />
      <Route path="/my-subscriptions" element={
        <ProtectedRoute allowedRoles={["UNIFIED", "ADMIN"]}>
          <UserDashboard />
        </ProtectedRoute>
      } />

      {/* Protected Routes - Admin */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/services" element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <ServiceManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/service/:id" element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <ServiceDetails />
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <UserManagement />
        </ProtectedRoute>
      } />

      {/* 404 Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}



export default Router;
