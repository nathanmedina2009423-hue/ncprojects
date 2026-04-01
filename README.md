# portfolio

a minimalist html project folder — powered by Vercel + Supabase.

## structure

```
portfolio/
├── index.html             ← public project listing
├── admin.html             ← password-protected upload panel
├── vercel.json            ← Vercel routing config
├── api/
│   ├── projects.js        ← GET list / POST new project
│   └── projects/
│       └── [id].js        ← GET content / DELETE by id
└── README.md
```

## deploying to Vercel

### 1. push to GitHub
Create a new GitHub repo and push this folder to it.

### 2. import into Vercel
- Go to vercel.com → New Project → Import your repo
- Vercel will auto-detect the `api/` folder

### 3. set environment variables
In your Vercel project → Settings → Environment Variables, add:

| Name                   | Value                                      |
|------------------------|--------------------------------------------|
| `SUPABASE_URL`         | `https://mpsqethcfuuiricysqrf.supabase.co` |
| `SUPABASE_SERVICE_KEY` | your Supabase **service_role** key         |

> Use the **service_role** key (not the anon key) for server-side API routes —
> it bypasses RLS so your serverless functions can always read/write.
> It is never exposed to the browser.

### 4. redeploy
After setting env vars, trigger a redeploy. The site is live.

## how it works

- **Project list + HTML content** → stored in Supabase, served via Vercel API routes
- **Everyone** who visits sees the same projects immediately
- **In-project localStorage** (scores, settings, etc.) stays per-user in their browser
- Projects open as Blob URLs in a new tab — fully isolated per user

## admin password

Defined in `admin.html` — search for `const PASSWORD =` to change it.
