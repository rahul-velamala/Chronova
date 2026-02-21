# Productivity App

A simple, high-performance productivity website with a clean, modern, premium-looking UI.

## Features

- **Dynamic Real-Time Clock**: Accurate, `requestAnimationFrame`-based ticking clock.
- **Standalone To-Do List**:
  - Add, edit, and delete tasks.
  - Set Priorities (High, Medium, Low) and Due Times.
  - Filter by Status or Priority, and Sort by Date or Priority.
- **Calendar Integration**:
  - Monthly and Weekly views.
  - Tasks shown visually as colored dots on their scheduled dates.
  - Click any date on the calendar to instantly add a task for that day.
- **Premium UI/UX**:
  - Dark mode color palette with glassmorphism touches.
  - Fully responsive layout for desktop and mobile.
  - Fast, lightweight Vanilla CSS styling.

## Running Locally

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open the provided `localhost` URL in your browser.

### Building for Production

To create an optimized production build:
```bash
npm run build
```

Then to preview the built package:
```bash
npm run preview
```

## Architecture

- **React + TypeScript**: Built with strict types for maintainability.
- **Vite**: Ultra-fast module bundler.
- **Context API + LocalStorage**: Efficient state management that persists tasks locally without a backend.
- **Vanilla CSS**: Extensively using CSS Variables and Flexbox/Grid for layout, ensuring high performance without heavy UI libraries.
