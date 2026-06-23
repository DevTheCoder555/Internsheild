# InternShield AI

**AI-Powered Fake Internship, Fake Job Offer & Scam Recruiter Detection Platform**

Protect college students from scam internships, fraudulent recruiters, and fake job offers using advanced AI analysis.

![InternShield AI](https://img.shields.io/badge/AI-Powered-blue) ![Next.js](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![License](https://img.shields.io/badge/License-MIT-green)

---

## Features

### 1. Internship Advertisement Scanner
Paste any internship advertisement, WhatsApp/Telegram message, LinkedIn post, or email offer. Get instant AI-powered scam analysis with:
- Scam Score (0-100)
- Risk Level (Safe/Low/Medium/High/Critical)
- Detailed Red Flags
- AI Explanation
- Actionable Recommendations

### 2. Offer Letter Analyzer
Upload offer letters as images. The system extracts text via OCR and analyzes it for forgery indicators, missing details, and scam patterns.

### 3. Screenshot OCR Scanner
Upload screenshots from WhatsApp, Telegram, Email, or any platform. Advanced OCR (Tesseract.js) extracts text, then Gemini AI analyzes it.

### 4. Community Scam Reports
Report and browse scam companies, fake recruiters, and fraudulent internships. Community-driven database with upvotes and verification.

### 5. One-Click Verify
Upload any content (offer letter, screenshot, or text ad) and get a complete analysis in one click.

---

## Tech Stack

| Category | Technology | Cost |
|----------|-----------|------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS | Free |
| UI | ShadCN UI, Radix UI | Free |
| Backend | Next.js API Routes, Server Actions | Free |
| Database | Supabase (Free Tier) | Free |
| Auth | Supabase Auth | Free |
| AI | Google Gemini 2.5 Flash (Free Tier) | Free |
| OCR | Tesseract.js (Client-side) | Free |
| Deployment | Vercel (Free Tier) | Free |

**Total Monthly Cost: Rs. 0**

---

## Prerequisites

Before you begin, you'll need:

1. **Node.js 18+** - [Download here](https://nodejs.org/)
2. **Supabase Account** (Free) - [Sign up here](https://supabase.com/)
3. **Google AI Studio Account** (Free) - [Get API key here](https://aistudio.google.com/app/apikey)
4. **Vercel Account** (Free) - [Sign up here](https://vercel.com/)

---

## Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/internshield-ai.git
cd internshield-ai
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/)
2. Create a new project (note your project URL and anon key)
3. Go to **SQL Editor** in your Supabase dashboard
4. Copy the entire contents of `supabase/schema.sql`
5. Paste and run the SQL in the SQL Editor
6. Go to **Settings > API** and copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public key**
   - **service_role key** (found under Settings > API > Project API keys)

### Step 4: Get Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click **Create API Key**
3. Copy the key (starts with `AIza...`)

### Step 5: Configure Environment Variables

1. Copy the example env file:
```bash
cp .env.example .env.local
```

2. Open `.env.local` and fill in your values:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GEMINI_API_KEY=your-gemini-api-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 6: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment to Vercel

### One-Click Deploy

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/) and sign in with GitHub
3. Click **New Project** and import your repository
4. Add the following environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GEMINI_API_KEY`
   - `NEXT_PUBLIC_APP_URL` (set to your Vercel URL after first deploy)
5. Click **Deploy**

### Manual Deploy

```bash
npm install -g vercel
vercel
```

---

## Project Structure

```
internshield-ai/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout with Navbar & Footer
│   ├── page.tsx                 # Landing page
│   ├── globals.css              # Global styles
│   ├── scanner/page.tsx         # Text scanner page
│   ├── analyzer/page.tsx        # OCR analyzer page
│   ├── offer-letter/page.tsx    # Offer letter analyzer
│   ├── community/page.tsx       # Community reports
│   ├── dashboard/page.tsx       # User dashboard
│   ├── profile/page.tsx         # User profile
│   ├── login/page.tsx           # Login page
│   ├── register/page.tsx        # Registration page
│   └── api/                     # API routes
│       ├── scan/route.ts        # Text scan API
│       ├── ocr/route.ts         # OCR + AI analysis API
│       ├── community/route.ts   # Community reports API
│       └── auth/callback/route.ts # Auth callback
├── components/
│   ├── ui/                      # ShadCN UI components
│   ├── layout/                  # Navbar, Footer
│   ├── scanner/                 # Scan result display
│   ├── community/               # Report cards, forms
│   └── dashboard/               # Stats cards
├── actions/                     # Server Actions
│   ├── scan.ts                  # Scan-related actions
│   ├── auth.ts                  # Authentication actions
│   └── community.ts             # Community report actions
├── hooks/                       # React hooks
│   ├── useAuth.ts               # Auth state hook
│   └── useToast.ts              # Toast notification hook
├── lib/                         # Core libraries
│   ├── supabase/                # Supabase clients
│   │   ├── client.ts            # Browser client
│   │   ├── server.ts            # Server client
│   │   └── middleware.ts        # Session middleware
│   ├── gemini.ts                # Gemini AI integration
│   ├── ocr.ts                   # Tesseract.js OCR
│   └── utils.ts                 # Utility functions
├── types/                       # TypeScript types
│   └── index.ts                 # All type definitions
├── supabase/
│   └── schema.sql               # Database schema
├── public/                      # Static assets
├── docs/                        # Documentation
├── .env.example                 # Environment variables template
├── package.json                 # Dependencies
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
├── next.config.js               # Next.js configuration
└── middleware.ts                # Auth middleware
```

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `NEXT_PUBLIC_APP_URL` | Your app URL | Yes |

---

## How the AI Analysis Works

InternShield AI uses Google Gemini 2.5 Flash to analyze content for these scam indicators:

### Payment Scams
- Registration fees, training fees, security deposits
- Any request for money upfront

### Fake Recruiters
- Gmail/Yahoo recruiters instead of company domains
- Generic email domains
- Missing recruiter identity

### Psychological Manipulation
- Urgency ("act now", "limited time")
- Fear tactics, scarcity, pressure

### Unrealistic Claims
- Extremely high salary for simple work
- Guaranteed income without interview
- Instant hiring

### Missing Details
- No company website or address
- No HR contact information
- Vague job descriptions

The AI returns a structured JSON with scam score, risk level, red flags with evidence, detailed explanation, and recommendations.

---

## Troubleshooting

### "GEMINI_API_KEY is not configured"
- Make sure you added `GEMINI_API_KEY` to `.env.local`
- Verify your API key at [Google AI Studio](https://aistudio.google.com/app/apikey)

### "Supabase connection error"
- Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- Verify your Supabase project is active
- Make sure you ran the SQL schema in `supabase/schema.sql`

### "OCR not extracting text"
- Ensure the image is clear and not blurry
- Supported formats: JPEG, PNG, WebP, BMP
- Maximum file size: 10MB
- Tesseract.js works best with high-contrast images

### "Build fails on Vercel"
- Ensure all environment variables are set in Vercel dashboard
- Check that Node.js version is 18+
- Try `npm run build` locally first to catch errors

### "Authentication not working"
- Verify Supabase Auth is enabled in your Supabase project
- Check that the auth callback URL is configured: `your-app-url/api/auth/callback`
- Clear browser cookies and try again

---

## Security

- All inputs are sanitized with XSS prevention
- Server Actions with Zod validation
- Rate limiting on API routes
- Row Level Security (RLS) on all database tables
- Secure file upload validation
- Authentication middleware for protected routes

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## License

This project is licensed under the MIT License.

---

## Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [Google Gemini](https://ai.google.dev/) - AI API
- [Tesseract.js](https://tesseract.projectnaptha.com/) - OCR engine
- [ShadCN UI](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

---

Built with the mission of protecting students from internship scams. Every student deserves a safe path to their first professional experience.
