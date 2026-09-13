# OW Hero Pool

A small Angular dashboard for browsing Overwatch hero pick / win / ban rates, scraped from Blizzard's own rates data by a companion backend.

Filter by region, rank tier, and input type (PC/console), view the latest snapshot or pick a specific date, search by hero name, and sort by pick rate, win rate, ban rate, or name. A "Run scrape now" button can trigger a fresh scrape on the backend on demand.

## Tech stack

- [Angular 20](https://angular.dev/) (standalone components, signals, `httpResource`)
- TypeScript, SCSS
- Karma / Jasmine for unit tests

This is the frontend only. It expects a backend API (Spring-based, see the model comments in [`overwatch.models.ts`](src/app/core/models/overwatch.models.ts)) exposing:

- `GET /api/snapshots/latest` and `GET /api/snapshots/on` — hero snapshots, filterable by `region`, `tier`, `input`, and optionally `date`
- `POST /api/scrape/run` — triggers a new scrape

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS) and npm
- The [heropool backend](.) running locally on `http://localhost:8080` (see [`proxy.conf.json`](proxy.conf.json) — `ng serve` proxies `/api` requests there in development)

## Getting started

```bash
npm install
npm start
```

Then open `http://localhost:4200/`. The app will reload automatically as you edit source files.

## Available scripts

| Command         | Description                                      |
| --------------- | ------------------------------------------------- |
| `npm start`     | Runs `ng serve` with the dev proxy to the backend  |
| `npm run build` | Production build, output to `dist/`               |
| `npm run watch` | Development build that rebuilds on file changes   |
| `npm test`      | Runs unit tests with Karma                         |

## Project structure

```
src/app/
├── core/
│   ├── models/       # Shared types mirroring the backend's DTOs/enums
│   └── services/      # HTTP services
└── features/
    └── hero-dashboard/ # Filters, sorting, and the hero grid (by role)
```
