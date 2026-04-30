// ─── EXPERIENCE DATA ─────────────────────────────────────────────────────────

export const experiences = [
  {
    id: 1,
    company: "Incture Technologies",
    role: "Software Engineer",
    duration: "January 2023 – Present",
    location: "Bhubaneswar, Odisha, India",
    type: "Full-time",
    logo: null, // Add logo URL or import if available
    color: "#00ff87",
    projects: [
      {
        name: "Sales Order Automation (SOA)",
        description: "Enterprise solution automating the Purchase Order → Sales Order lifecycle, integrated with SAP S/4HANA.",
        bullets: [
          "Architected the ReactJS frontend for an end-to-end PO→SO automation platform, reducing manual order processing effort by ~60% across 3 enterprise client deployments.",
          "Engineered RESTful Node.js/Express.js backend services handling order lifecycle events, document validation, and SAP BTP middleware integration for real-time data sync.",
          "Spearheaded client-facing rollouts and requirement workshops for 3 enterprise clients — zero critical post-go-live defects.",
          "Optimized frontend state management using Redux, cutting page load times by ~35%.",
        ],
        tech: ["ReactJS", "TypeScript", "Redux", "Node.js", "Express.js", "SAP S/4HANA", "SAP BTP"],
      },
      {
        name: "Supplier Collaboration Portal (SCP)",
        description: "Product covering sourcing, supplier collaboration, production tracking, QC workflows, and operational dashboards.",
        bullets: [
          "Delivered key modules covering sourcing workflows, supplier onboarding, production tracking, QC dashboards, and operational reporting — 1 successful enterprise client go-live.",
          "Streamlined QC inspection workflows by building a configurable checklist engine in React, eliminating ~80% of manual quality logging.",
          "Collaborated with product and UX teams in Figma-driven design sprints, ensuring pixel-accurate implementation and consistent design system adherence.",
        ],
        tech: ["ReactJS", "Node.js", "MongoDB", "Figma", "SAP BTP"],
      },
    ],
    generalBullets: [
      "Conducted structured code reviews for a team of 4–5 engineers, enforcing best practices.",
      "Mentored 2 junior developers on React architecture and Node.js design, reducing onboarding ramp-up by ~30%.",
    ],
  },
];
