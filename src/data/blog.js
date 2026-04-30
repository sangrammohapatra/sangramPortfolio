// ─── BLOG POSTS DATA ─────────────────────────────────────────────────────────
// Replace placeholder content with your actual articles.
// Each post has a unique `slug` used for the /blog/:slug route.

export const blogPosts = [
  {
    id: 1,
    slug: "react-state-management-redux-vs-context",
    title: "Redux vs Context API — When Should You Actually Use Redux?",
    excerpt: "After managing state in enterprise React apps for 2 years, here's the honest breakdown of when Redux earns its complexity and when Context API is all you need.",
    date: "November 10, 2024",
    readTime: "6 min read",
    tags: ["React", "Redux", "State Management"],
    coverColor: "#00ff87",
    content: `
## The Question Everyone Gets Wrong

When you're starting out with React, you'll inevitably hit the moment where your component tree gets deep enough that prop-drilling becomes painful. The internet will tell you to "just use Redux" or "Context API is enough." Both answers miss the point.

## When Context API Is Enough

Context is great for:
- **Theme toggling** — light/dark mode, color schemes
- **Authentication state** — user session, role, permissions
- **Locale/language** preferences
- Static or rarely-changing global state

The key insight: Context re-renders every consumer when the value changes. If your data updates frequently, that's a performance problem.

## When Redux Actually Earns Its Complexity

In the Sales Order Automation platform I built at Incture, we had:
- Order state syncing across 10+ components simultaneously
- Complex derived state (totals, validations, workflow steps)
- Time-travel debugging needs during QA
- Middleware for SAP API call orchestration

Redux Toolkit (RTK) was the right call. The predictability of a single store with actions/reducers made debugging production issues significantly easier.

## The Honest Rule

> Use Context for "who are you" and "what do you prefer." Use Redux for "what is happening in the app right now."

If your state has business logic, cross-component side effects, or needs middleware — Redux. Otherwise, Context + useReducer gets you 90% of the way there with zero boilerplate.

## Takeaway

Stop asking "which is better." Ask "what problem am I solving." The best state management solution is the one your future self can debug at 2am.
    `,
  },
  {
    id: 2,
    slug: "sap-btp-react-integration-lessons",
    title: "Lessons from Integrating React with SAP BTP in Production",
    excerpt: "Three things I wish someone told me before building React apps on SAP Business Technology Platform — authentication quirks, OData gotchas, and CORS nightmares.",
    date: "September 22, 2024",
    readTime: "8 min read",
    tags: ["SAP BTP", "React", "Enterprise", "Node.js"],
    coverColor: "#f0b429",
    content: `
## SAP BTP + React: The Unofficial Survival Guide

When our team at Incture started building the Sales Order Automation platform on SAP BTP, we assumed it would be like any other cloud platform. It wasn't. Here's what we learned.

## 1. Authentication Is Not Standard OAuth

SAP BTP uses XSUAA (Extended Services for User Account and Authentication). It's OAuth2-compliant, but the token structure and scopes are very SAP-specific. Your React app needs to handle:

- Token refresh flows carefully — SAP tokens have shorter-than-expected lifespans
- Scope-based authorization at the frontend (don't trust role checks to the UI alone)
- The xs-app.json routing config, which acts as a reverse proxy layer

**Lesson:** Abstract your auth layer early. We refactored our auth module twice before getting it right.

## 2. OData v4 Has Sharp Edges

SAP S/4HANA exposes APIs via OData v4. While modern, the spec is complex:

- \`$expand\` queries can return inconsistent shapes depending on the SAP backend configuration
- Batch requests (\`$batch\`) are powerful but tricky to implement with React Query or Redux Toolkit Query
- Error responses are XML by default — your Node.js middleware needs to normalize these

**Lesson:** Build a thin adapter layer in your Express.js backend. Never call OData directly from the React frontend.

## 3. CORS Is Manageable — If You Own the Middleware

Running React on BTP's HTML5 Application Repository means your API calls go through the Application Router. Direct calls to S/4HANA OData endpoints will fail with CORS errors.

The solution: route all API calls through your Node.js service on BTP, which handles SAP authentication and forwards requests server-side.

## Final Thought

SAP BTP is powerful but opinionated. The learning curve is real. Once you understand the routing architecture (App Router → Node.js Service → S/4HANA), everything clicks into place.
    `,
  },
  {
    id: 3,
    slug: "code-review-culture-small-teams",
    title: "Building a Code Review Culture in a Small Dev Team",
    excerpt: "How we turned code reviews from a bottleneck into the best part of our engineering culture — practical lessons from reviewing 500+ PRs on an enterprise product team.",
    date: "July 14, 2024",
    readTime: "5 min read",
    tags: ["Engineering Culture", "Code Review", "Mentorship", "Team"],
    coverColor: "#ff4d6d",
    content: `
## Code Reviews Shouldn't Hurt

When I started leading code reviews for our team, the process was slow, inconsistent, and sometimes demoralizing. Here's how we fixed it.

## The Three Dysfunctions We Had

**1. Reviews took too long.** PRs sat for days. Context was lost. Merge conflicts piled up.

**2. Comments were inconsistent.** Senior engineers would point out different things. Juniors didn't know what "good" looked like.

**3. It felt personal.** "This component is messy" reads as "you are messy."

## What We Changed

### Define What You're Actually Reviewing

We created a simple checklist:
- Does it work? (correctness)
- Is it readable? (clarity)
- Is it reusable? (architecture)
- Is it tested? (coverage)
- Does it follow our patterns? (consistency)

This made reviews objective. You're reviewing against criteria, not taste.

### 24-Hour SLA

Every PR gets at least one review comment within 24 business hours. This single rule eliminated 70% of the delay problem.

### Distinguish Blocking vs. Non-Blocking Comments

We adopted a prefix system:
- **[MUST]** — blocking, must change before merge
- **[NIT]** — non-blocking suggestion, author's call
- **[QUESTION]** — asking for understanding, not requesting change

Junior developers especially benefited from knowing which comments were mandatory.

## The Outcome

After 3 months: PR cycle time dropped from ~3 days to ~18 hours. Two junior developers told me code reviews became their primary learning mechanism. That's the real ROI.
    `,
  },
];
