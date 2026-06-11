import React, { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

const HERO_OPTIONS = {
  fullScreen: { enable: false },
  fpsLimit: 60,
  interactivity: {
    events: {
      onHover: { enable: true, mode: "grab" },
      onClick: { enable: true, mode: "push" },
      resize: true,
    },
    modes: {
      grab: { distance: 180, links: { opacity: 0.9 } },
      push: { quantity: 5 },
    },
  },
  particles: {
    color: { value: ["#00ff87", "#f0b429", "#ffffff"] },
    links: {
      color: "#00ff87",
      distance: 160,
      enable: true,
      opacity: 0.35,
      width: 1.2,
    },
    move: {
      direction: "none",
      enable: true,
      outModes: { default: "bounce" },
      random: true,
      speed: 1.2,
      straight: false,
    },
    number: { density: { enable: true, area: 700 }, value: 120 },
    opacity: {
      value: { min: 0.3, max: 0.7 },
      animation: { enable: true, speed: 0.6, minimumValue: 0.4 },
    },
    shape: { type: "circle" },
    size: {
      value: { min: 2, max: 5 },
      animation: { enable: true, speed: 2, minimumValue: 1 },
    },
  },
  detectRetina: true,
};

const CONTACT_OPTIONS = {
  fullScreen: { enable: false },
  fpsLimit: 60,
  interactivity: {
    events: {
      onHover: { enable: true, mode: "repulse" },
      resize: true,
    },
    modes: {
      repulse: { distance: 100, duration: 0.4 },
    },
  },
  particles: {
    color: { value: ["#00ff87", "#f0b429"] },
    links: {
      color: "#f0b429",
      distance: 140,
      enable: true,
      opacity: 0.25,
      width: 1,
    },
    move: {
      direction: "none",
      enable: true,
      outModes: { default: "out" },
      random: true,
      speed: 0.8,
      straight: false,
    },
    number: { density: { enable: true, area: 900 }, value: 80 },
    opacity: {
      value: { min: 0.4, max: 0.75 },
      animation: { enable: true, speed: 0.5, minimumValue: 0.3 },
    },
    shape: { type: "circle" },
    size: { value: { min: 2, max: 4 } },
  },
  detectRetina: true,
};

export default function ParticlesBackground({ variant = "hero" }) {
  const init = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const options = variant === "contact" ? CONTACT_OPTIONS : HERO_OPTIONS;

  return (
    <Particles
      id={`tsparticles-${variant}`}
      init={init}
      options={options}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    />
  );
}
