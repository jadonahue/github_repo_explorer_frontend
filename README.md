# GitHub Repo Explorer — Frontend

A Next.js + React client allowing users to search GitHub users repositories, authenticate, and save favorites.

[Check out the backend Github Repo Explorer here](https://github.com/jadonahue/github_repo_explorer_backend)

---

## Live Demo

[View the deployed frontend on Vercel](https://github-repo-explorer-frontend-73qptgfj1.vercel.app/login)

---

## Features

-   User login/register (JWT-based auth)
-   Search GitHub repos by username
-   Save & remove favorites (persisted via backend)
-   Responsive UI with Tailwind CSS and dark mode support

---

## Tech Stack

-   **Next.js 15** (App Router)
-   **React** 19, **Tailwind CSS**
-   State management via React Context hooks
-   API interactions via `fetch` with `NEXT_PUBLIC_BACKEND_URL`
-   Deployment: Vercel

---

## Installation

```bash
git clone https://github.com/jadonahue/github_repo_explorer_frontend.git
cd github_repo_explorer_frontend

npm install
touch .env.local

Add .env.local:
npm run dev
```

## Usage

1. Register or login via /register and /login
2. Search for GitHub repos
3. Save favorites—and view them on /favorites

## Project Structure

-   src/app/: Next.js pages (Home, Login, Register, Favorites)
-   components/: Reusable UI (NavBar, RepoCard)
-   service/: authService.ts, repoService.ts for API
-   store/: Context providers for auth & repos
-   utils/: helper functions (e.g. markReposWithFavorites)
-   globals.css — Tailwind + custom styles

## Environment Variables

Use NEXT_PUBLIC_BACKEND_URL (required in .env.local and in Vercel) to point to your deployed backend.

## Learn More

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
