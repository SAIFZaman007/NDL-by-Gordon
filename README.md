# Gordon IT Academy — Frontend

The public customer/student site: marketing pages (home, courses, pricing,
blog, about, contact) **and** the signed-in student portal (course player,
practice exams, progress, account). This is intentionally one app — see the
root `README.md` for why the student portal lives here and not in
`dashboard/`.

This app has no admin functionality. That lives entirely in `../dashboard`.

## Stack

React 19 · React Router 7 · Tailwind CSS 4 · Vite 8 · Axios

## Getting started

```bash
cp .env.example .env    # then edit if your backend runs somewhere else
npm install
npm run dev              # http://localhost:3000
```

Requires the backend running locally on `http://localhost:8000` (see
`../backend/README` — or just `uvicorn app.main:app --reload` from
`../backend`).

Demo accounts (from `backend/seed.py`):

| Email | Password | Plan |
|---|---|---|
| `free@gordon.com` | `user123` | Free |
| `premium@gordon.com` | `user123` | Premium |

## Project structure

```
src/
├── api/client.js          Single configured axios instance (auth header, VITE_API_BASE)
├── context/AuthContext.jsx Session state (localStorage-backed)
├── components/            Navbar, Footer, Layout, LoginModal, ProtectedRoute, ui/CourseCard
└── pages/                 One file per route
```

## Routes

| Path | Access | Notes |
|---|---|---|
| `/` | public | Home / marketing |
| `/courses` | public | Browse & search |
| `/courses/:id` | public | Lesson player; first lesson always free |
| `/practice-exam` | public | First 40 questions per category are free |
| `/pricing` | public | Wired to real Stripe Checkout when signed in |
| `/blog`, `/about`, `/contact` | public | |
| `/portal` | signed-in students | "My learning" — progress, attempts, account |
| `/payment/success`, `/payment/cancel` | — | Stripe redirect targets |

## Environment variables

See `.env.example`. `VITE_API_BASE` and `VITE_DASHBOARD_URL` are the only
two — both point at `localhost` for local dev. Production values are set as
CI variables at deploy time (see `.github/workflows/deploy.yml`), never
committed here.

## Build

```bash
npm run build   # outputs to dist/
npm run preview
```
