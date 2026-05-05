import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { Analytics } from "@vercel/analytics/react";
import { useColorMode } from "./hooks/useColorMode";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/admin/ProtectedRoute";

// Layout
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import OpenToWorkBanner from "./components/OpenToWorkBanner";
import BackToTop from "./components/BackToTop";
import CursorSpotlight from "./components/CursorSpotlight";
import AIChatWidget from "./components/AIChatWidget";

// Public pages
import Home from "./pages/Home";
import BlogPost from "./pages/BlogPost";
import ProjectCaseStudy from "./pages/ProjectCaseStudy";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBlogList from "./pages/admin/AdminBlogList";
import AdminBlogEditor from "./pages/admin/AdminBlogEditor";

import { profile } from "./data/profile";

// Check if current path is an admin route
function isAdminRoute() {
  return window.location.pathname.startsWith("/admin");
}

function PublicLayout({ children, toggleMode, mode }) {
  const bannerH = profile.openToWork ? 32 : 0;
  const [visible, setVisible] = useState(true);
  return (
    <>
      <CursorSpotlight />
      <OpenToWorkBanner visible={visible} setVisible={setVisible} />
      <Navbar toggleMode={toggleMode} mode={mode} />
      <Box component="main" sx={{ pt: `${bannerH}px` }}>
        {children}
      </Box>
      <Footer />
      <BackToTop />
      <AIChatWidget />
    </>
  );
}

export default function App() {
  const { mode, theme, toggleMode } = useColorMode();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* ── Public routes ── */}
            <Route path="/" element={
              <PublicLayout toggleMode={toggleMode} mode={mode}>
                <Home />
              </PublicLayout>
            } />
            <Route path="/blog/:slug" element={
              <PublicLayout toggleMode={toggleMode} mode={mode}>
                <BlogPost />
              </PublicLayout>
            } />
            <Route path="/projects/:slug" element={
              <PublicLayout toggleMode={toggleMode} mode={mode}>
                <ProjectCaseStudy />
              </PublicLayout>
            } />

            {/* ── Admin routes ── */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="/admin/blogs" element={
              <ProtectedRoute><AdminBlogList /></ProtectedRoute>
            } />
            <Route path="/admin/blog/new" element={
              <ProtectedRoute><AdminBlogEditor /></ProtectedRoute>
            } />
            <Route path="/admin/blog/edit/:id" element={
              <ProtectedRoute><AdminBlogEditor /></ProtectedRoute>
            } />

            {/* ── 404 ── */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      <Analytics />
    </ThemeProvider>
  );
}
