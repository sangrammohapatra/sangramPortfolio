// ─── EXPERIENCE DATA ─────────────────────────────────────────────────────────
import incture_technologies_logo from "../../public/incture_technologies_logo.jpg";
export const experiences = [
  {
    id: 1,
    company: "Incture Technologies",
    roles: [
      {
        title: "Software Engineer",
        duration: "July 2025 – Present",
      },
      {
        title: "Associate Software Engineer",
        duration: "October 2023 – June 2025",
      },
      {
        title: "Trainee Software Engineer",
        duration: "July 2023 – September 2023",
      },
      {
        title: "Intern",
        duration: "January 2023 – June 2023",
      },
    ],
    duration: "January 2023 – Present",
    location: "Bhubaneswar, Odisha, India",
    type: "Full-time",
    logo: incture_technologies_logo,
    color: "#00ff87",
    projects: [
      {
        name: "Sales Order Automation (SOA)",
        description:
          "Enterprise solution automating the Purchase Order → Sales Order lifecycle, integrated with SAP S/4HANA.",
        bullets: [
          "Architected the ReactJS frontend for an end-to-end PO→SO automation platform, reducing manual order processing effort by ~60% across 3 enterprise client deployments.",
          "Engineered RESTful Node.js/Express.js backend services handling order lifecycle events, document validation, and SAP BTP middleware integration for real-time data sync.",
          "Spearheaded client-facing rollouts and requirement workshops for 3 enterprise clients — zero critical post-go-live defects.",
          "Optimized frontend state management using Redux, cutting page load times by ~35%.",
        ],
        tech: [
          "ReactJS",
          "Javascript",
          "TypeScript",
          "Node.js",
          "Express.js",
          "Redux",
          "SAP S/4HANA",
          "SAP BTP",
        ],
      },
      {
        name: "Supplier Collaboration Portal (SCP)",
        description:
          "Product covering sourcing, supplier collaboration, production tracking, QC workflows, and operational dashboards.",
        bullets: [
          "Delivered key modules covering sourcing workflows, supplier onboarding, production tracking, QC dashboards, and operational reporting — 1 successful enterprise client go-live.",
          "Streamlined QC inspection workflows by building a configurable checklist engine in React, eliminating ~80% of manual quality logging.",
          "Collaborated with product and UX teams in Figma-driven design sprints, ensuring pixel-accurate implementation and consistent design system adherence.",
        ],
        tech: [
          "ReactJS",
          "Javascript",
          "TypeScript",
          "Redux",
          "SAP S/4HANA",
          "SAP BTP",
        ],
      },
      {
        name: "Intelligent Trade Management (ITM)",
        description:
          "Unified trade lifecycle platform built around a single 'Trading Order' source of truth, consolidating back-to-back trading, purchase-to-stock and sell-from-stock flows with SAP-integrated delivery, invoicing, and settlement.",
        bullets: [
          "Built the ReactJS Trading Order module consolidating purchase and sales data into a single source of truth, eliminating duplicate and inconsistent trade records across Back-to-Back Trading, Purchase-to-Stock, and Sell-from-Stock flows.",
          "Implemented order validation and release workflows with line-item level tracking, enforcing controlled execution across the trade lifecycle.",
          "Developed inbound/outbound delivery management with planned-vs-actual quantity tracking, driving invoice generation and supplier/customer settlement off actual delivered quantities.",
          "Built configurable dashboards with filtering, audit trail, and activity tracking, integrated with SAP for logistics and finance, plus event notifications for order release, delivery, and invoicing milestones.",
        ],
        tech: [
          "ReactJS",
          "Javascript",
          "TypeScript",
          "MFE",
          "SAAS",
          "SAP S/4HANA",
          "SAP BTP",
        ],
      },
    ],
    generalBullets: [
      "Led a team of 4 engineers in the development of enterprise-grade web applications, achieving 100% on-time delivery for 3 consecutive client projects.",
      "Collaborated with cross-functional teams including product, QA, and UX to integrate artefacts and deliver high-quality software solutions, resulting in a 15% increase in client satisfaction scores.",
      "Authored technical documentation and knowledge base articles, improving team knowledge sharing and reducing support queries by ~25%.",
      "Conducted structured code reviews for a team of 4–5 engineers, enforcing best practices.",
      "Mentored 2 junior developers on React architecture and Node.js design, reducing onboarding ramp-up by ~30%.",
    ],
  },
];
