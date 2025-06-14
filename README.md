# Mocktify

### About Mocktify
A website build with Next Js, using Tailwind CSS and Flowbite React. Utilize Supabase for the database. Let you keep track of your favorite song and make your own playlist just like spotify :)

### Setup Project
```
git clone
cd project
npm install

cp .env.example .env.local
```
In Supabase go to project overview to find your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, or click Connect then open tab App Frameworks to see your keys, then paste it into your .env.local

For spotify, go to [Spotify for Developer](https://developer.spotify.com/dashboard/), create app -> set 'Redirect URIs' to "https://oauth.pstmn.io/v1/browser-callback". Then copy and paste SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET to your .env.local
### Run The Project
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
