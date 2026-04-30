# sangrammohapatra — Personal Portfolio Website

A modern, premium developer portfolio built with **React**, **Material UI (MUI)**, and **Framer Motion**.

---

## 🚀 Tech Stack

| Layer | Tech |
|---|---|
| UI Framework | React 18 |
| Component Library | MUI v5 |
| Animations | Framer Motion |
| Routing | React Router v6 |
| Typing Animation | react-type-animation |
| Email | EmailJS |
| Fonts | Syne + Plus Jakarta Sans (Google Fonts) |

---

## 📁 Project Structure

```
src/
├── components/         # One file per section
│   ├── Navbar.jsx
│   ├── Hero.jsx
│   ├── About.jsx
│   ├── Skills.jsx
│   ├── Experience.jsx
│   ├── Projects.jsx
│   ├── Education.jsx
│   ├── Roles.jsx
│   ├── Blog.jsx
│   ├── Testimonials.jsx
│   ├── Contact.jsx
│   ├── Footer.jsx
│   └── SectionWrapper.jsx
├── data/               # All content lives here — edit to update site
│   ├── profile.js      # Name, bio, social links
│   ├── skills.js       # Technical + soft skills
│   ├── experience.js   # Work history
│   ├── projects.js     # Portfolio projects
│   ├── education.js    # Education + certifications
│   ├── roles.js        # Leadership, clubs, volunteer
│   ├── blog.js         # Blog posts content
│   └── testimonials.js # Quotes from colleagues
├── hooks/
│   ├── useColorMode.js
│   └── useScrollAnimation.js
├── pages/
│   ├── Home.jsx        # / route
│   ├── BlogPost.jsx    # /blog/:slug route
│   └── NotFound.jsx    # 404 route
├── theme/
│   └── theme.js        # MUI theme — colors, fonts, components
└── utils/
    └── motionVariants.js
```

---

## ⚙️ Setup & Installation

### 1. Clone / extract the project

```bash
cd sangrammohapatra
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure EmailJS

```bash
cp .env.example .env
```

Open `.env` and replace the placeholder values:

```env
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx     # From EmailJS dashboard → Email Services
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx   # From EmailJS dashboard → Email Templates
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxx       # From EmailJS dashboard → Account → API Keys
```

**EmailJS setup steps:**
1. Create a free account at [emailjs.com](https://www.emailjs.com/)
2. Add an Email Service (Gmail recommended) — copy the Service ID
3. Create an Email Template with variables: `{{from_name}}`, `{{from_email}}`, `{{subject}}`, `{{message}}`
4. Go to Account → API Keys → copy your Public Key

### 4. Add your profile photo

Place your photo at:
```
public/profile.jpg
```
The Hero component uses `src="/profile.jpg"`. Any photo format (jpg, png, webp) works — just update the filename in `src/components/Hero.jsx` if different.

### 5. Add your resume PDF

Place your resume at:
```
public/Sangram_Mohapatra_Resume.pdf
```
Or update the path in `src/data/profile.js` → `resumeUrl`.

### 6. Run locally

```bash
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000)

### 7. Build for production

```bash
npm run build
```

Output goes to the `build/` folder — deploy to Netlify, Vercel, or GitHub Pages.

---

## ✏️ Customizing Content

All content is centralized in `src/data/`. You never need to touch component files to update content.

| File | What to edit |
|---|---|
| `profile.js` | Name, bio, email, phone, social links, resume URL |
| `skills.js` | Skill categories, names, proficiency % |
| `experience.js` | Jobs, projects, bullet points |
| `projects.js` | Portfolio projects, tech stack, links |
| `education.js` | Degree, university, certifications |
| `roles.js` | Leadership roles, clubs, hackathons |
| `blog.js` | Blog post titles, content, tags |
| `testimonials.js` | Quotes, names, roles |

---

## 🌐 Deployment

### Netlify (recommended)
1. Run `npm run build`
2. Drag the `build/` folder into [netlify.com/drop](https://app.netlify.com/drop)
3. Set environment variables in Netlify dashboard → Site Settings → Environment Variables

### Vercel
```bash
npm install -g vercel
vercel --prod
```
Set env vars in Vercel dashboard.

### GitHub Pages
```bash
npm install -g gh-pages
# Add "homepage": "https://yourusername.github.io/sangrammohapatra" to package.json
npm run build && gh-pages -d build
```

---

## 🎨 Theming

Edit `src/theme/theme.js` to change:
- Color palette (primary blue, secondary teal, backgrounds)
- Typography (font families)
- Component overrides

---

## 📝 Adding a Blog Post

In `src/data/blog.js`, add a new object to the `blogPosts` array:

```js
{
  id: 4,
  slug: "your-post-slug",           // URL: /blog/your-post-slug
  title: "Your Post Title",
  excerpt: "Short description...",
  date: "January 1, 2025",
  readTime: "5 min read",
  tags: ["React", "Tips"],
  coverColor: "#0066ff",
  content: `
## Your Heading

Your content here. Supports:
- **bold text**
- \`inline code\`
- > blockquotes
- Bullet lists
  `,
}
```

---

Built with ❤️ by Sangram Mohapatra
