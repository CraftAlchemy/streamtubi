# StreamTubi: Video Streaming Platform - Setup Guide

This document provides a comprehensive guide for setting up, running, and building the StreamTubi frontend and admin dashboard application.

## 1. Environment Configuration

Proper environment configuration is crucial for security and for ensuring the application runs correctly in different stages (local development, staging, production).

### How it Works

This project uses `.env` files to manage environment variables.

-   `.env.example`: A template file committed to the repository that lists all the required environment variables for the application to run.
-   `.env`: A local, untracked file where you store your actual secret keys and configuration values. **This file should never be committed to Git.**

### Setup Steps

1.  **Create a local environment file**: In the root of the project, make a copy of the example file and name it `.env`:
    ```bash
    cp .env.example .env
    ```

2.  **Add Your API Key**: Open the newly created `.env` file with a text editor. You will see the following line:
    ```
    API_KEY="YOUR_GEMINI_API_KEY_HERE"
    ```
    Replace `YOUR_GEMINI_API_KEY_HERE` with your actual Google Gemini API key, which is required for the AI-powered features. You can get a key from [Google AI Studio](https://aistudio.google.com/app/apikey).

---

## 2. Local Development Setup

Follow these steps to get the application running on your local machine.

### Prerequisites

-   Node.js (LTS version recommended)
-   npm (or yarn/pnpm)

### Installation & Running

1.  **Clone the Repository**:
    ```bash
    git clone https://your-repository-url.com/streamtubi.git
    cd streamtubi
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment**: Make sure you have completed the **Environment Configuration** steps above and your `.env` file is ready.

4.  **Run the Development Server**:
    The `package.json` `start` script is a placeholder. In a standard modern React setup (e.g., using Vite), you would run the application with:
    ```bash
    npm run dev
    ```
    This command will start the local development server, typically available at `http://localhost:5173`. The server supports hot-reloading, so changes you make to the code will be reflected in the browser instantly.

---

## 3. Production Build

When you are ready to deploy the application, you need to create an optimized, minified production build.

### Build Command

Run the following command in your terminal:

```bash
npm run build
```

This command will trigger the production build process (assuming a standard tool like Vite or Create React App). It bundles all the necessary files, optimizes assets, and outputs them into a `dist/` (or `build/`) directory. The contents of this directory are what you would deploy to a static hosting service like Vercel, Netlify, or AWS S3.

---

## 4. Database Migration (Backend Responsibility)

Database migrations are a critical part of the **backend service**, not the frontend application. This section is for informational purposes to explain how migrations fit into the overall project architecture.

### What are Migrations?

A database migration is a controlled and versioned way to make changes to your database schema (e.g., adding a table, altering a column). This ensures that all developers and all environments (development, production) have the same database structure.

### How it Works in the Backend

The backend team would manage migrations using an ORM tool like **Prisma** or **TypeORM**.

-   **Prisma**: The team would use `prisma migrate dev` to generate and apply new SQL migration files based on changes made to the `schema.prisma` file.
-   **TypeORM**: Developers would create new migration files in TypeScript and run them using the TypeORM CLI.

When the backend is deployed, the deployment pipeline would automatically run any new migrations against the production database before starting the API server. This ensures the database is always up-to-date with what the code expects.
