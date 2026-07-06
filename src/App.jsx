import React, { useState, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline, Box, CircularProgress } from "@mui/material";
import { Analytics } from "@vercel/analytics/react";
import { useColorMode } from "./hooks/useColorMode";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/admin/ProtectedRoute";

// Layout
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import OpenToWorkBanner from "./components/OpenToWorkBanner";
import BackToTop from "./components/BackToTop";
import AIChatWidget from "./components/AIChatWidget";
import RouteTransition from "./components/RouteTransition";
import ReadingProgress from "./components/ReadingProgress";

// Public pages
import Home from "./pages/Home";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";

import { profile } from "./data/profile";

// Case-study and admin pages are lazy — anonymous visitors browsing the
// homepage shouldn't pay for the admin dashboard/editor bundle (which drags
// in @uiw/react-md-editor) or the case-study page.
const ProjectCaseStudy = lazy(() => import("./pages/ProjectCaseStudy"));
const AdminLogin       = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard   = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminBlogList    = lazy(() => import("./pages/admin/AdminBlogList"));
const AdminBlogEditor  = lazy(() => import("./pages/admin/AdminBlogEditor"));

function RouteFallback() {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <CircularProgress size={28} />
    </Box>
  );
}

// Check if current path is an admin route
function isAdminRoute() {
  return window.location.pathname.startsWith("/admin");
}

function PublicLayout({ children, toggleMode, mode }) {
  const [visible, setVisible] = useState(profile.openToWork);
  const bannerH = visible ? 32 : 0;
  return (
    <>
      <ReadingProgress />
      <OpenToWorkBanner visible={visible} setVisible={setVisible} />
      <Navbar toggleMode={toggleMode} mode={mode} visible={visible} />
      <Box component="main" sx={{ pt: `${bannerH}px` }}>
        {children}
      </Box>
      <Footer />
      <BackToTop />
      <AIChatWidget />
    </>
  );
}

function AppRoutes() {
  const { mode, theme, toggleMode } = useColorMode();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <RouteTransition />
          <Suspense fallback={<RouteFallback />}>
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
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
      <Analytics />
    </ThemeProvider>
  );
}

export default function App() {
  return <AppRoutes />;
}
