# Inner Child — Day 1 (Auth + Onboarding)

What's built so far:
- Magic-link email login (no passwords)
- Onboarding: pick interest tags -> choose cadence -> optional childhood memory
- A working /today page that pulls a real prompt matching your tags from the database
- DB schema + Row Level Security so users only ever see their own data
- PWA manifest so it can be installed to a phone home screen

Not built yet (Day 2/3): capture (photo + note), streak logic, cadence-aware
scheduling, the AI-personalized Day-1 prompt, weekly recap card, settings page.

---

## 1. Create your Supabase project (~5 min)    FightBacck111#

1. Go to https://supabase.com -> sign up (free) -> New project.
2. Pick any name/region, set a database password (save it somewhere), wait ~2 min for it to provision.
3. In the left sidebar: Settings -> API. Copy:
   - Project URL --- https://rczoilnqbwqjzfeubgjp.supabase.co
   - anon public key --- sb_publishable_6GRAClFNj-Fnl5HSEDKhSw_UJ7tGD_L
4. In the left sidebar: SQL Editor -> New query. Paste the entire contents of supabase/schema.sql from this project and click Run.
5. New query again -> paste supabase/seed_prompts.sql -> Run. This loads ~30 starter prompts so the app has something to show.
6. Authentication -> Providers: Email should already be enabled by default. That's all you need for magic links.
7. Authentication -> URL Configuration: add your site URL once you have it (see step 4 below) -- you can come back to this after deploying. (PENDING)

## 2. Configure your local environment

    cp .env.local.example .env.local

Open .env.local and paste in your Supabase Project URL and anon key from step 1.3.

## 3. Run it locally

    npm install
    npm run dev

Open http://localhost:3000 -- you should land on /login. Enter your email,
check your inbox, click the magic link, and you'll be walked through
onboarding into /today.

## 4. Deploy to Vercel (~5 min)

1. Push this project to a new GitHub repo (git init, commit, push).
2. Go to https://vercel.com -> sign up (free, use your GitHub account) -> Add New Project -> import your repo.
3. Before deploying, add environment variables (same two from .env.local):
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
4. Click Deploy. You'll get a live URL like https://your-app.vercel.app
5. Back in Supabase -> Authentication -> URL Configuration: set Site URL to your Vercel URL, and add https://your-app.vercel.app/auth/callback under Redirect URLs. Without this step, magic links will redirect to localhost and fail for real users.

That's it -- you have a real, live, shareable link you can send to your 10 users.

## Project structure

    app/
      login/page.tsx           magic-link sign-in form
      auth/callback/route.ts   exchanges the email link for a session
      onboarding/page.tsx      tags -> cadence -> memory, 3-step flow
      today/page.tsx           shows a tag-matched prompt (real DB query)
      page.tsx                 root: routes to login / onboarding / today
    lib/
      supabase/client.ts       browser Supabase client
      supabase/server.ts       server Supabase client (Server Components)
      supabase/middleware.ts   session refresh + route protection
      constants.ts             TAGS and CADENCE_OPTIONS (single source of truth)
    supabase/
      schema.sql               run once in Supabase SQL editor
      seed_prompts.sql         starter prompt library, ~30 prompts

## Next up (Day 2)

- Capture flow: photo upload (Supabase Storage bucket "session-photos" is already set up in schema.sql) + one-line note, writing to the sessions table
- Streak logic using the streaks table (session-based, not calendar-based)
- Cadence-aware scheduling: only surface a new prompt when it's actually the user's turn, and stop repeating prompts they've already done
- One Anthropic API call at onboarding for the personalized Day-1 welcome prompt (needs ANTHROPIC_API_KEY in .env.local, called from a server-side app/api/ route -- never from the client)
