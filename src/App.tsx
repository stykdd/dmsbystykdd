import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DomainList from "./pages/DomainList";
import AddDomain from "./pages/AddDomain";
import TrashPage from "./pages/TrashPage";
import CheckAvailability from "./pages/CheckAvailability";
import ExpiredPage from "./pages/ExpiredPage";
import WhoisRefreshPage from "./pages/WhoisRefreshPage";
import SettingsPage from "./pages/SettingsPage";
import AdminPage from "./pages/AdminPage";
import HistoryPage from "./pages/HistoryPage";
import FavoritesPage from "./pages/FavoritesPage";
import SalesPage from "./pages/SalesPage";
import ProfilePage from "./pages/ProfilePage";
import ToDoListPage from "./pages/ToDoListPage";
import PasswordGeneratorPage from "./pages/PasswordGeneratorPage";
import EditDomain from "./pages/EditDomain";
import NotFound from "./pages/NotFound";
import Installation from "./pages/Installation";
import ImpersonationBanner from "./components/admin/ImpersonationBanner";
import AuthRedirectHandler from './components/auth/AuthRedirectHandler';
import InstallationCheck from './components/auth/InstallationCheck';

// Feature pages
import KeywordSearchCount from "./pages/features/KeywordSearchCount";
import BulkEmailVerification from "./pages/features/BulkEmailVerification";
import DomainAppraisal from "./pages/features/DomainAppraisal";
import WebsiteScraper from "./pages/features/WebsiteScraper";
import WishlistPage from "./pages/features/WishlistPage";
import StatsDashboard from "./pages/features/StatsDashboard";
import DomainTools from "./pages/DomainTools";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <BrowserRouter>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <AuthRedirectHandler />
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/install" element={<Installation />} />
                    
                    {/* App routes - require authentication */}
                    <Route element={<>
                      <ImpersonationBanner />
                      <InstallationCheck />
                      <Layout />
                    </>}>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/domains" element={<DomainList />} />
                      <Route path="/domains/add" element={<AddDomain />} />
                      <Route path="/domains/edit/:id" element={<EditDomain />} />
                      <Route path="/trash" element={<TrashPage />} />
                      <Route path="/check-availability" element={<CheckAvailability />} />
                      <Route path="/history" element={<HistoryPage />} />
                      <Route path="/favorites" element={<FavoritesPage />} />
                      <Route path="/expired" element={<ExpiredPage />} />
                      <Route path="/whois" element={<WhoisRefreshPage />} />
                      
                      {/* Feature routes */}
                      <Route path="/domain-tools" element={<DomainTools />} />
                      <Route path="/todo" element={<ToDoListPage />} />
                      <Route path="/password-generator" element={<PasswordGeneratorPage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                      <Route path="/admin" element={<AdminPage />} />
                      
                      {/* Wishlist and Stats routes */}
                      <Route path="/features/wishlist" element={<WishlistPage />} />
                      <Route path="/features/stats" element={<StatsDashboard />} />
                      
                      <Route path="*" element={<NotFound />} />
                    </Route>
                  </Routes>
                </TooltipProvider>
              </BrowserRouter>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
