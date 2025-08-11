# GenSpec Frontend (MVP Stage 1)

A Vite + React + TypeScript app implementing the Stage 1 flows: Dashboard → Voice Intake → Template → Wishlist → Review, with a three-pane workspace and glassmorphism styling.

## Project structure

- src/
  - api/        API client and stores
  - components/ UI components (layout, primitives)
  - pages/      Route pages (dashboard, project stages, inbox)
  - routes/     Router configuration
  - styles/     Global CSS and modules
  - types/      Shared TypeScript models

## Configure API

The backend runs at http://0.0.0.0:8000 per your local docs. Create a `.env` file:

```
VITE_API_BASE=http://0.0.0.0:8000
```

## Scripts

- dev: start dev server
- build: typecheck and build
- preview: preview the production build

## Routes

- /dashboard
- /projects/:projectId/voice
- /projects/:projectId/template
- /projects/:projectId/wishlist
- /projects/:projectId/review
- /notifications

## Notes

This is a minimal scaffold wired to your design docs. Next up: connect real API endpoints, add component behaviors (recording, seeding, CRUD), and plug notifications.
