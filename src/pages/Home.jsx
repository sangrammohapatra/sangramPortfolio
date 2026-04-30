import React from "react";
import { Box } from "@mui/material";
import Hero from "../components/Hero";
import TechMarquee from "../components/TechMarquee";
import About from "../components/About";
import MetricsCounter from "../components/MetricsCounter";
import Skills from "../components/Skills";
import Experience from "../components/Experience";
import Projects from "../components/Projects";
import Education from "../components/Education";
import Roles from "../components/Roles";
import Blog from "../components/Blog";
import Testimonials from "../components/Testimonials";
import Contact from "../components/Contact";

export default function Home() {
  return (
    <Box>
      <Hero />
      <TechMarquee />
      <About />
      <MetricsCounter />
      <Skills />
      <Experience />
      <Projects />
      <Education />
      <Roles />
      <Blog />
      <Testimonials />
      <Contact />
    </Box>
  );
}
