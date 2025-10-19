# StreamTubi - Production-Grade Video Streaming Platform

Welcome to StreamTubi, a feature-rich video streaming platform inspired by Tubi.tv. This repository contains the complete frontend and admin dashboard application, built with a modern, production-ready stack and architected for scalability, security, and a premium user experience.

## Key Features

-   **High-Quality Streaming**: Smooth, on-demand video playback with a custom player.
-   **Dynamic Content**: Hero banner, genre-based carousels, and personalized recommendations.
-   **User Management**: Full authentication flow, "My List" functionality, and persistent user sessions.
-   **Monetization Engine**:
    -   **Ad-Based System**: Simulated pre-roll and mid-roll ads for free users.
    -   **Premium Subscriptions**: An ad-free experience for subscribed users, with a clear upgrade path.
-   **Full Admin CMS**: A protected, multi-page dashboard for managing videos, users, and platform analytics.
-   **AI-Powered Tools**: Gemini API integration to intelligently generate video descriptions and tag metadata, streamlining content management.
-   **Modern UI/UX**: A sleek, responsive interface built with a ShadCN/UI-inspired design system, including a light/dark/system theme toggle.
-   **Secure & Scalable**: Architected with security best practices and containerized with Docker for consistent, reproducible deployments.

## Tech Stack

-   **Frontend**: React 19, TypeScript, Vite, TailwindCSS
-   **Routing**: React Router
-   **AI Integration**: Google Gemini API
-   **Containerization**: Docker & Docker Compose
-   **Web Server**: Nginx (in Docker)

---

## Project Structure

The project follows a standard Vite project structure with all source code located in the `/src` directory.

```
/src
├── App.tsx             # Main application component with routing
├── components/         # Reusable React components (Header, VideoCard, etc.)
│   └── ui/             # Core UI elements (Button, Card, Input, etc.)
├── context/            # Global state management (AppContext.tsx)
├── data/               # Mock data for local development
├── lib/                # Utility functions (cn, sanitization)
├── pages/              # Route-level components (views)
│   ├── _layouts/       # Main layout shells (MainLayout, AdminLayout)
│   ├── admin/          # Admin dashboard pages
│   └── user/           # User-facing pages
├── services/           # API interaction layer (apiService, geminiService)
└── types.ts            # Core TypeScript interfaces
```

---

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### 1. Prerequisites

-   Node.js (v18 or later)
-   npm or yarn
-   Docker and Docker Compose (for containerized setup)

### 2. Environment Configuration

The application requires an API key for the Google Gemini API.

1.  Create a file named `.env` in the root of the project.
2.  Copy the contents of `.env.example` into your new `.env` file.
3.  Add your Google Gemini API key:

    ```env
    # .env
    API_KEY=your_google_gemini_api_key_here
    ```

### 3. Installation & Local Development

This is the recommended method for active development.

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Run the development server:**
    ```bash
    npm run dev
    ```

3.  Open your browser and navigate to `http://localhost:5173`. The application will be running with hot-reloading enabled.

### 4. Running with Docker

This method is ideal for a stable, production-like environment.

1.  **Ensure Docker is running** on your machine.
2.  **Build and run the containers:**
    ```bash
    docker-compose up --build
    ```
3.  Open your browser and navigate to `http://localhost:8080`.

---

## Connecting to the Backend

The frontend is decoupled from the data source via a service layer. To connect to a real backend:

1.  Open `src/services/apiService.ts`.
2.  Replace the mock data calls and `setTimeout` delays with actual `fetch` or `axios` requests to your live REST API endpoints.
3.  No other part of the application needs to be changed.

---

## Security Best Practices

This application is built with security in mind. Here is a summary of the implemented and expected security measures:

-   **CORS (Cross-Origin Resource Sharing)**: The backend API must be configured to only accept requests from the deployed frontend's domain.
-   **JWT Refresh Tokens**: The frontend is architected to handle token expiration and refresh logic seamlessly, which should be implemented in the `apiService.ts` when connecting to the live backend.
-   **Rate Limiting**: The frontend gracefully handles `429 Too Many Requests` errors by displaying a non-intrusive toast notification. The backend is responsible for enforcing the rate limits.
-   **Input Sanitization**: Client-side sanitization is performed on form inputs to strip HTML tags as a first line of defense. The backend **must** perform its own rigorous validation and sanitization on all incoming data.
