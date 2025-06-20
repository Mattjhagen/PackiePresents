# PacMac Mobile Resume Generator

Create beautiful one-page digital resumes with subdomain hosting, Google/LinkedIn OAuth, and optional domain + GSuite upgrades.

---

## 🚀 Features

- Upload a resume file (PDF, TXT, DOCX)
- AI-parsed About Me page via OpenAI
- Google OAuth (via Supabase Auth)
- LinkedIn OAuth (in progress)
- Subdomain routing (e.g., `username.pacmacmobile.com`)
- Stripe integration for premium domain/GSuite
- Auto-saving HTML to Supabase `resume_pages`
- Simple admin dashboard (WIP)

---

## 🔑 Environment Variables

Copy and rename `.env.example`:

```env
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
OPENAI_API_KEY=your-openai-key
STRIPE_SECRET_KEY=your-stripe-secret
PUBLIC_URL=https://your-production-url.com
```

---

## 🧠 Tech Stack

- **Frontend:** HTML/CSS + Vanilla JS (aboutme.js)
- **Backend:** Node.js + Express
- **Auth:** Supabase Auth (Google working, LinkedIn WIP)
- **AI Parsing:** OpenAI ChatGPT API
- **Hosting:** GitHub Pages + Render (or Vercel, optional Cloudflare DNS)
- **DB:** Supabase PostgreSQL
- **Payments:** Stripe Checkout API

---

## 📌 To-Do / Help Wanted

### 🔧 Backend
- [ ] ✅ Google OAuth (done)
- [ ] 🔄 LinkedIn OAuth → subdomain & resume page
- [ ] 💾 Auto-create domain entry on resume upload
- [ ] 📧 Email user on upload (Resend/Nodemailer)
- [ ] 🚫 Prevent duplicate domains

### 🎨 Frontend
- [ ] 💅 Clean UI + form state handling
- [ ] 📁 Drag & drop resume upload
- [ ] 🔗 Live view counters per page

### 📊 Admin
- [ ] 📋 Admin dashboard
- [ ] 📤 Export data (CSV)

---

## 🧪 First Contributor Task Suggestion

> Implement the LinkedIn OAuth login flow so that:
> - It authenticates the user
> - Extracts basic profile (name/email)
> - Generates a subdomain + calls resume parser
> - Stores resume to Supabase

OR let us know where you’d like to jump in!

---

## 🤝 How to Contribute

1. Fork the repo
2. Clone it locally
3. Run with `npm install && npm run dev`
4. Use your own API keys or request temporary ones
5. Submit a PR with your changes

---

## 🛠 Dev Scripts

```bash
npm run dev        # Start local server
npm run format     # Prettify code
```

---

## 📬 Contact / Questions

Feel free to DM [@PackieMobile](https://www.reddit.com/u/PackieAI/s/ttd2Had29W) or email `info@pacmacmobile.com`.

---

> Built with 💻 by Matt & Terra on the road 🚐
