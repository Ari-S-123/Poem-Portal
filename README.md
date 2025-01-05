# [Poem Portal](https://poemportal.vercel.app/)

Uses the PoetryDB API (https://poetrydb.org/) to present a user with a random poem.

![alt text](https://github.com/user-attachments/assets/6b434867-96fb-4c75-ae6a-aae5b9d13e59)

## Future Features:

- [x] Loading Spinner

- [x] Persistence Layer using Postgres on Supabase to save favorite poems with Drizzle as the ORM and GitHub OAuth for
      Auth.

- [ ] Google OAuth.

## How to run the app

1. Clone the repo.

2. Make sure you are using Node 22 and have Docker and Supabase installed.

3. Run `npm install -g pnpm` to install pnpm.

4. Run `pnpm install` to install the dependencies.

5. With Docker running, run `supabase start`.

6. Create a `.env` with `DATABASE_URL`, `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`. The first three should be visible using the command `supabase status`. For the GitHub ones you would need to go into Developer Settings and create an OAuth App.

7. Run `pnpm run dev -- --open` to start the development server and open the app in a new browser tab.
