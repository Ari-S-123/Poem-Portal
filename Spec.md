I want to build a webapp that uses the PoetryDB API (https://poetrydb.org/) to present a user with a random poem.

This is purely meant to be a personal educational project that will give me an excuse to learn SvelteKit. This will be
primarily be an SPA using whatever mix of CSR and SSR is appropriate. The tech stack will be the SvelteKit
meta-framework, Tailwind CSS, Vitest for unit testing, TypeScript, and it will probably be deployed on
Vercel.

MVP:

The landing page will have a single button in the center: "Read A Poem". In the top right, there will be a button with a
lightbulb icon that switches between dark mode and light mode, with a color change from black to yellow to convey it.
The webapp will be mostly monochromatic, only using black, white, and maybe gray for borders. I will probably use either
the Geist or Inter font-family.

The "Read A Poem" button will make an API call to https://poetrydb.org/random as a GET request. Then the app will render
the "title", "author", and the "lines" on the page. The "Read A Poem" will then be renamed "Read Another" and be moved
to the top, but it will retain its functionality.

Future Feature Additions:

Add a persistence layer using Postgres probably on Vercel too, and Drizzle as the ORM. This will contain just a single
table with a favoriteId, userId (Google ID), author, and a title as the columns.

Add a "Log In" button with the Google logo to the top right next to the theme switcher. When the "Log In" button is
clicked, the user will be prompted to log in via Google. After this, the page would re-render to display the name of the
user instead of the "Log In" button.

If the user is logged in, then there will be an additional button called "Favorites" and the user's name would be
displayed Welcome, ${name} instead of the "Log In" button. If a poem is currently being displayed then, then the user
will have an option to favorite or unfavorite it by clicking a star-shaped button that will change color from yellow to
black.

The "Favorites" button when clicked will render a vertical list of rectangular boxes with rounded corners, with each
displaying a "title" and an "author". The "Read A Poem" and "Favorites" buttons will be moved to the top as the
favorites list is rendered. If a favorite is clicked, the app will make an API call
to https://poetrydb.org/author,title/${author};${title} as a GET request.
