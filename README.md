# QueueFlow Interactive Demo

A safe, frontend-only queue management system demo designed for GitHub and Vercel deployment.

This repository contains **no client branding, no database, no backend credentials, no printer scripts, no local machine paths, and no real user data**. It is built as an interactive product preview using browser localStorage.

## Features

- Animated modern landing page
- Kiosk service selection
- Ticket generation
- Ticket preview / print mockup
- Staff queue console
- Live monitor display
- Admin demo panel
- Demo data reset
- Cross-tab demo sync using localStorage and BroadcastChannel

## Tech Stack

- Vite
- React
- CSS animations
- localStorage mock data

## Run Locally

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal.

## Deploy to Vercel

1. Push this project to a GitHub repository.
2. Go to Vercel.
3. Click **Add New Project**.
4. Import the GitHub repository.
5. Framework should be detected as **Vite**.
6. Build command: `npm run build`
7. Output directory: `dist`
8. Deploy.

## Demo Routes

- `/` - landing page
- `/demo` - demo launcher
- `/demo/kiosk` - kiosk ticket flow
- `/demo/staff` - staff console
- `/demo/monitor` - live display monitor
- `/demo/admin` - admin preview

## Safety Notes

This is a frontend-only product preview. It is not connected to a database or production backend. Data is stored only in the visitor's browser localStorage and can be reset anytime from the Admin Demo page.
