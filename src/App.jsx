import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { useColorMode } from "./hooks/useColorMode";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import OpenToWorkBanner from "./components/OpenToWorkBanner";
import BackToTop from "./components/BackToTop";
import AIChatWidget from "./components/AIChatWidget";
import CursorSpotlight from "./components/CursorSpotlight";
import Home from "./pages/Home";
import BlogPost from "./pages/BlogPost";
import ProjectCaseStudy from "./pages/ProjectCaseStudy";
import NotFound from "./pages/NotFound";
import { profile } from "./data/profile";

export default function App() {
  const { mode, theme, toggleMode } = useColorMode();
  const bannerH = profile.openToWork ? 32 : 0;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <CursorSpotlight />
        <OpenToWorkBanner />
        <Navbar toggleMode={toggleMode} mode={mode} />
        <Box component="main" sx={{ pt: `${bannerH}px` }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/projects/:slug" element={<ProjectCaseStudy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Box>
        <Footer />
        <BackToTop />
        <AIChatWidget />
      </BrowserRouter>
    </ThemeProvider>
  );
}
