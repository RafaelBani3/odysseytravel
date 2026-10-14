# Odyssey Travel — React Trip Planner

Odyssey Travel is a React + Vite application for planning multi-city trips, stays and day trips, daily routes, trip budgets, and monthly savings goals.

## Requirements
- Node.js 20 or newer
- npm

## Run locally
1. Install dependencies: \`npm install\`
2. Start the development server: \`npm run dev\`
3. Create a production build: \`npm run build\`
4. Preview the production build: \`npm run preview\`

## Features
- Multi-country city selection, including manual destinations
- Per-city stay mode: overnight, day trip, or undecided
- Editable day-by-day itinerary with transport origin/destination, mode, duration and cost
- Leaflet map with CARTO basemap, city markers and Google Maps links
- Budget breakdown, contingency, trip cost per person, and monthly savings projection
- Browser localStorage for autosave and JSON export

## Deployment
GitHub Actions builds the Vite app and deploys the \`dist\` directory to GitHub Pages when the app source changes on \`main\`.

## Notes
- Timings, transit fares and routes are estimates until verified with the relevant transport provider.
- The map route line is a schematic city order, not rail geometry.
- Destination suggestions currently come from the curated in-repository list; no Gemini API secret is embedded in the browser. For AI recommendations, add a server-side API endpoint and keep credentials there.
- User trip data is stored in the current browser's localStorage and is not synchronized across devices.
