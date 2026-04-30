// ─── PROJECTS DATA ───────────────────────────────────────────────────────────

export const projects = [
  {
    id: 1,
    slug: "sales-order-automation",
    title: "Sales Order Automation",
    subtitle: "Enterprise SAP-Integrated Platform",
    description:
      "End-to-end Purchase Order → Sales Order automation platform integrated with SAP S/4HANA. Reduced manual order processing by 60% across 3 enterprise client deployments.",
    tech: [
      "ReactJS",
      "TypeScript",
      "Redux",
      "Node.js",
      "Express.js",
      "SAP S/4HANA",
      "SAP BTP",
    ],
    category: "Enterprise",
    featured: true,
    liveUrl: null,
    githubUrl: null,
    color: "#00ff87",
    image: null,
    // ── Case study content ──
    caseStudy: {
      overview:
        "Sales Order Automation (SOA) is an enterprise product built at Incture Technologies that automates the full Purchase Order → Sales Order lifecycle for large manufacturing and distribution companies, integrated directly with SAP S/4HANA.",
      problem:
        "Enterprise procurement teams were manually processing hundreds of purchase orders daily — copying data between systems, chasing approvals over email, and logging updates in spreadsheets. Each order took 20–30 minutes of manual effort. Errors caused downstream delays and customer escalations.",
      solution:
        "We built a unified ReactJS frontend that gives procurement teams a single dashboard to track every order's lifecycle in real time. A Node.js/Express.js backend handles business logic and integrates with SAP S/4HANA via SAP BTP middleware, syncing data bidirectionally. Automated validations and workflow rules replace manual checks.",
      impact: [
        "~60% reduction in manual order processing effort across 3 enterprise clients",
        "Average order processing time dropped from 25 minutes to under 10 minutes",
        "Zero critical post-go-live defects across all 3 client rollouts",
        "Reduced data entry errors by ~75% through automated validations",
        "Onboarded 3 enterprise clients within 8 months of product launch",
      ],
      role: "I architected the ReactJS frontend, built the Redux state management layer, and engineered several Node.js/Express.js backend services. I also led all 3 client-facing rollouts — from requirement workshops to go-live support.",
      duration: "Jan 2023 – Present",
      team: "4 engineers + 1 product manager",
    },
  },
  {
    id: 2,
    slug: "supplier-collaboration-portal",
    title: "Supplier Collaboration Portal",
    subtitle: "Procurement & Quality Management",
    description:
      "Multi-module portal covering sourcing, supplier onboarding, production tracking, QC workflows, and operational dashboards. Eliminated 80% of manual QC logging.",
    tech: ["ReactJS", "Node.js", "MongoDB", "Express.js", "Figma", "SAP BTP"],
    category: "Enterprise",
    featured: true,
    liveUrl: null,
    githubUrl: null,
    color: "#f0b429",
    image: null,
    caseStudy: {
      overview:
        "Supplier Collaboration Portal (SCP) is a multi-module enterprise product that digitises the entire supplier relationship lifecycle — from sourcing and onboarding through to production tracking, quality control, and operational reporting.",
      problem:
        "Supply chain teams were managing supplier relationships across disconnected tools — emails for RFQs, Excel sheets for production tracking, paper checklists for QC inspections. There was no single source of truth, and operations managers had zero real-time visibility into production status or quality issues.",
      solution:
        "SCP consolidates every supplier touchpoint into one portal. Procurement teams can issue RFQs, compare quotes, and onboard suppliers digitally. Production managers track order progress against milestones. Quality teams run digital inspection checklists with configurable pass/fail criteria. Dashboards surface KPIs in real time.",
      impact: [
        "~80% reduction in manual QC logging through digital inspection workflows",
        "Supplier onboarding time reduced from 2 weeks to 3 days",
        "Real-time production visibility eliminated weekly status-update calls",
        "1 successful enterprise client go-live with measurable operational savings",
        "Operations team saved an estimated 15+ hours/week on manual reporting",
      ],
      role: "I built the QC inspection module (configurable checklist engine in React), sourcing workflow UI, and several operational dashboard components. I collaborated closely with UX in Figma design sprints to ensure pixel-accurate implementation.",
      duration: "Mid 2023 – Present",
      team: "5 engineers + 1 designer + 1 product manager",
    },
  },
  {
    id: 3,
    slug: "taskflow",
    title: "TaskFlow",
    subtitle: "Full-Stack Project Management App",
    description:
      "Full-stack project management application with real-time task boards, JWT authentication, and role-based access control. Built with MERN stack and Redux, deployed with 50+ active test users.",
    tech: ["ReactJS", "Node.js", "MongoDB", "Express.js", "Redux", "JWT"],
    category: "Personal",
    featured: false,
    liveUrl: "#",
    githubUrl: "#",
    color: "#ff4d6d",
    image: null,
    caseStudy: {
      overview:
        "TaskFlow is a personal project — a full-stack project management tool inspired by Trello and Linear, built to deepen my MERN stack skills and explore real-time UI patterns.",
      problem:
        "Wanted hands-on experience building a complete product from scratch — auth, data modelling, REST API design, and a polished drag-and-drop frontend — without the constraints of enterprise client requirements.",
      solution:
        "Built a ReactJS frontend with Redux state management and drag-and-drop task reordering. Node.js/Express.js REST API with MongoDB for persistence. JWT-based auth with role-based access (admin, member, viewer). Fully responsive.",
      impact: [
        "50+ active test users during beta",
        "Sub-100ms average API response times",
        "Implemented full CRUD for projects, tasks, and user profiles",
        "Deepened understanding of JWT auth flows and RBAC patterns",
      ],
      role: "Solo project — designed, built, and deployed end-to-end.",
      duration: "Personal project · 2023",
      team: "Solo",
    },
  },
];
