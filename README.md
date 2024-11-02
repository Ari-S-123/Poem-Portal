# [Poem Portal](https://poemportal.vercel.app/)

Uses the PoetryDB API (https://poetrydb.org/) to present a user with a random poem.

![alt text](https://github.com/user-attachments/assets/6b434867-96fb-4c75-ae6a-aae5b9d13e59)

## Future Features:

- [x] Loading Spinner

- [ ] Persistence Layer using Postgres on Vercel to save favorite poems with Drizzle as the ORM and Google OAuth for
      Auth.

## How to run the app

1. Clone the repo.

2. Make sure you are using Node 20.

3. Run `npm install -g pnpm` to install pnpm.

4. Run `pnpm install` to install the dependencies.

5. Run `pnpm run dev -- --open` to start the development server and open the app in a new browser tab.
