# 🚐 Packie Presents: Our #VanLife Journey

Hey there, awesome internet human! 👋  
We’re Matt & Terra — creators, dreamers, builders, and code-tinkerers documenting our quirky, inclusive, and sometimes chaotic #VanLife adventure.

## 🌈 What We’re Doing

We’ve traded the 9–5 grind for something more meaningful. We're traveling the country full-time in our van, building tools, websites, and content that empower LGBTQ+ creators, small businesses, and tech misfits like us.

Our mission?  
- ✨ Promote trans visibility  
- 💻 Build accessible, open-source web tools  
- 📸 Share honest van life content  
- 🛠️ Tinker with code & creativity wherever WiFi reaches

## 💖 Why We Need Your Help

Living this dream isn’t always easy. Gas isn’t free, nor is mobile data or coffee (sadly). By supporting us, you help fund:

- 📦 Hosting & domain costs  
- 🔋 Power banks, mobile hotspots, and gear  
- 🎥 Content creation & editing tools  
- 🍜 Actual food — noodles are cool but variety is better  
- 🧠 Our peace of mind (priceless)

Even $1/month means the world to us.

## 💸 Support Options

We're accepting sponsors via GitHub & beyond:

[**🌟 Sponsor Us on GitHub**](https://github.com/sponsors/Mattjhagen)  
[Venmo](https:www.venmo.com/u/PackieMobile)

Every bit goes toward keeping us connected, caffeinated, and coding from our tiny home on wheels.  

---

Thanks for reading. Thanks for caring.  
We hope to see you on the road or in the terminal. 💻🚐

## 🧰 Build Your Own Site from a Resume (For Free!)

We created an AI-powered tool that turns your resume into a slick, professional one-page website — no coding required.

### 💡 Why It Matters

Your resume *isn't* just a PDF anymore. With a personal site:
- You **stand out** in hiring pipelines
- You look more **professional and modern**
- You’re easier to **Google**, share, and impress

### ⚙️ Features

- **Upload your resume (.pdf, .txt, .docx)**
- **Instantly generate** a personalized About Me site
- **Free subdomain** (like `yourname.pacmac.me`)
- **Optional domain purchase** with Google Workspace email
- You keep full control — **no logins or paywalls required**

### 💸 Bonus Perk

When someone buys a domain or adds Google Suite through your site, *you get a referral reward*. Spread the love, earn some digital coffee money ☕.

👉 Try it now on [PacMacMobile.com](https://pacmacmobile.com) under **“Build Your Digital Presence.”**

## 🧠 How It Works: AI-Powered Resume Parsing + Personality Themes

When you upload your resume, we don’t just slap your name on a template — we let AI **read it like a recruiter** and **build your personal brand** into the design.

### 📄 Parsing the Resume

Our backend uses AI to:
- Extract your **name**, **experience**, **skills**, and **education**
- Summarize your **background** into a clear, compelling intro
- Organize everything into a clean, web-ready layout

### 🎨 Matching Your Vibe

Instead of cookie-cutter templates, our system:
- Analyzes keywords and tone from your resume
- Applies a **theme that fits your personality** (e.g. minimalist for engineers, bold and bright for creatives)
- Lets you tweak colors, fonts, and layout if you want to fine-tune

### 🌐 Result?

A unique, mobile-friendly About Me page that feels *like you* — not just your résumé.

**Example:**  
Upload a resume that says *“ethical hacker + minimalist”*, and you'll get a dark-themed, terminal-style page.  
Upload one that screams *“creative marketer + traveler”*, and you’ll get bold fonts, vibrant colors, and maybe a 🌍 emoji or two.

### 🚀 What’s Next

We’re expanding to let users:
- Choose from AI-curated themes
- Link to their portfolios and socials
- Share their page with a free subdomain or custom domain

> *Because your story deserves more than a PDF.*

— Matt & Terra  
#VanLife | #TransTech

---

## Deploying to Render

This application is configured for easy deployment to [Render](https://render.com/).

### Deployment Methods

You can deploy this application in two ways:

#### 1. Automatic Deployment from GitHub (Recommended)

1.  **Fork this repository** to your own GitHub account.
2.  Go to the [Render Dashboard](https://dashboard.render.com/) and create a **New Blueprint Instance**.
3.  Connect your GitHub account and select your forked repository. Render will automatically detect the `render.yaml` file and configure the service.
4.  **Add Environment Variables:** Before the first deploy, go to the "Environment" tab for your new service in Render. Add the following as **Secret Files** or **Environment Variables**:
    *   `OPENAI_API_KEY`: Your secret key for the OpenAI API.
    *   `SUPABASE_URL`: Your project URL from your Supabase dashboard.
    *   `SUPABASE_KEY`: Your `anon` key from your Supabase dashboard.
5.  **Deploy:** Click "Create New Blueprint Instance". Render will pull your code, build it, and start the server. Any future pushes to your `main` branch will automatically trigger a new deployment.

#### 2. Manual Deployment

If you prefer not to use a blueprint, you can create a new **Web Service** on Render and configure it manually:

-   **Repository:** Connect your GitHub account and select the repository.
-   **Runtime:** `Node`
-   **Build Command:** `npm install`
-   **Start Command:** `node server.js`
-   **Environment Variables:** Add the `OPENAI_API_KEY`, `SUPABASE_URL`, and `SUPABASE_KEY` in the "Environment" tab.

### Accessing Your Application

Once deployed, Render will provide you with a public URL (e.g., `https://packie-presents.onrender.com`) where you can access your application.
