# Seven Wonders Atlas

An interactive web atlas for exploring the New Seven Wonders of the World. The app combines a rotatable 3D globe, location pins, monument detail pages, image galleries, historical facts, and embedded maps.

**Live site:** [sevenworldwonders.netlify.app](https://sevenworldwonders.netlify.app/)

<video width="100%" autoplay loop muted playsinline controls>
  <source src="https://github.com/Sarajlich/seven-world-wonders-atlas/raw/main/seven-world-wonders-atlas-home.mp4" type="video/mp4">
</video>

## What I built

I built a map-first discovery experience that turns a list of landmarks into an explorable interface. Visitors can rotate the globe, select a destination, and move into a focused guide with location, history, imagery, and practical map context.

**Features**
  - Interactive Three.js globe with clickable pins for each wonder
  - Detail pages for all seven wonders
  - Historical summaries, key facts, location data, and construction periods
  - High-resolution monument images from Wikimedia Commons
  - Embedded Google Maps views for each location
  - Client-side navigation with clean wonder-specific URLs
  - Netlify Functions API for serving wonder data
  - Responsive layout for desktop and mobile screens

**Tech Stack**
  - HTML
  - CSS
  - JavaScript
  - Node.js
  - Three.js

## Project structure

```text
public/                 # Frontend assets and the atlas interface
netlify/functions/      # Serverless API for wonder data
server.js               # Local development server
netlify.toml            # Netlify build and route configuration
```

## Run locally

Requirements: Node.js 18 or newer.

```bash
git clone https://github.com/Sarajlich/seven-world-wonders-atlas.git
cd seven-world-wonders-atlas
npm install
npm run dev
```

Open `http://localhost:8888` (or the local URL printed by the server).

## Notes

- Landmark imagery is sourced from Wikimedia Commons where noted in the application.
- Google Maps embeds may depend on browser privacy settings and network availability.
- The live deployment is configured for Netlify Functions and single-page routing.
