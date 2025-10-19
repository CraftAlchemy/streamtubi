# StreamTubi Production Deployment Workflow

This document outlines the step-by-step process for deploying the StreamTubi platform, from local code to a live, production-grade environment.

## Architecture Overview

-   **Backend**: Dockerized Node.js API on Google Cloud Run.
-   **Frontend**: Static React app on Vercel.
-   **Database**: Managed PostgreSQL on Google Cloud SQL.
-   **Media**: Video files served via Cloudflare Stream (or BunnyCDN).
-   **CI/CD**: Automated via GitHub Actions.

---

## Prerequisites

Before starting, ensure you have the following accounts and tools set up:

1.  **Google Cloud Platform (GCP) Account**: With billing enabled.
2.  **Vercel Account**: Linked to your GitHub account.
3.  **Cloudflare Account**: For media streaming services.
4.  **GitHub Repository**: Containing the entire project codebase.
5.  **Locally Installed Tools**:
    -   `gcloud` CLI (Google Cloud SDK)
    -   `docker` and `docker-compose`
    -   `node` and `npm`

---

## Step-by-Step Deployment Guide

### Step 1: Backend Deployment (Google Cloud Run)

The backend is a containerized application that will be deployed as a serverless service.

**1. Set up Google Cloud SQL (Database):**
-   Navigate to the Cloud SQL section in your GCP Console.
-   Create a new **PostgreSQL** instance. Choose a region, machine type, and storage size appropriate for your needs.
-   Once created, go to the instance details, create a new database (e.g., `streamtubi_prod`), and a new user (e.g., `streamtubi_user`) with a strong password.
-   **Important**: Note the **Connection name** of the instance (e.g., `project:region:instance-name`). This is needed to connect from Cloud Run.

**2. Configure Artifact Registry:**
-   Artifact Registry is where we will store our Docker images.
-   In the GCP Console, create a new Docker repository in Artifact Registry. Note the repository URL.

**3. Containerize the Backend:**
-   Ensure your backend application (e.g., `/backend`) has a `Dockerfile`.
-   This Dockerfile should build the application, install dependencies, and define the command to start the server.

**4. Deploy to Cloud Run:**
-   Build and push your Docker image to Artifact Registry:
    ```bash
    # Authenticate Docker with GCP
    gcloud auth configure-docker [YOUR_REGION]-docker.pkg.dev

    # Build the image
    docker build -t [ARTIFACT_REGISTRY_URL]/[PROJECT_ID]/[REPO_NAME]/streamtubi-backend:latest ./backend

    # Push the image
    docker push [ARTIFACT_REGISTRY_URL]/[PROJECT_ID]/[REPO_NAME]/streamtubi-backend:latest
    ```
-   Navigate to Cloud Run in the GCP Console and create a new service.
-   Select the Docker image you just pushed.
-   Under the **Connections** tab, add a **Cloud SQL connection** and select your PostgreSQL instance. This securely connects the service to the database.
-   Under the **Variables & Secrets** tab, add your environment variables:
    -   `DATABASE_URL`: `postgres://[USER]:[PASSWORD]@localhost/[DB_NAME]?host=/cloudsql/[CONNECTION_NAME]`
    -   `JWT_SECRET`: Your secret key for signing tokens.
    -   `STRIPE_SECRET_KEY`: Your Stripe API key.
    -   `CORS_ORIGIN`: Your frontend's production URL (e.g., `https://streamtubi.vercel.app`).
-   Configure other settings like memory allocation and concurrency, then click **Create**. Your API will be deployed and given a public URL.

### Step 2: Frontend Deployment (Vercel)

Vercel is ideal for deploying modern frontends with a global CDN and seamless Git integration.

1.  **Login to Vercel** with your GitHub account.
2.  Click **Add New...** > **Project**.
3.  **Import the Git Repository** for StreamTubi.
4.  Vercel will automatically detect that it's a Vite-based React project. Configure the settings:
    -   **Framework Preset**: Vite
    -   **Build Command**: `npm run build`
    -   **Output Directory**: `dist`
    -   **Root Directory**: `.` (or `/frontend` if you've structured it that way)
5.  Add your **Environment Variables**:
    -   `VITE_API_BASE_URL`: The URL of your deployed Google Cloud Run backend service.
    -   `VITE_GEMINI_API_KEY`: The API key for Google Gemini.
6.  Click **Deploy**. Vercel will build and deploy your site. Subsequent pushes to the `main` branch will automatically trigger new deployments.

### Step 3: Media File Serving (Cloudflare Stream)

Never serve large media files from your backend server. Use a dedicated service.

1.  In your Cloudflare dashboard, navigate to **Stream**.
2.  Upload your video files. Cloudflare will automatically encode them into multiple bitrates for adaptive streaming.
3.  For each video, Cloudflare will provide an **HLS Manifest URL** (`.m3u8`).
4.  In your application's database, the `videoUrl` for each video record should be this HLS Manifest URL. The frontend's video player (`react-player`, `video.js`) can then use this URL for efficient, adaptive streaming.

### Step 4: Setup CI/CD with GitHub Actions

Automate the deployment process so that a `git push` updates the live application.

1.  Create a `.github/workflows` directory in your project root.
2.  **Backend Deployment Workflow (`backend-deploy.yml`):**
    ```yaml
    name: Deploy Backend to Cloud Run

    on:
      push:
        branches: [ main ]
        paths:
          - 'backend/**' # Only run when backend code changes

    jobs:
      deploy:
        runs-on: ubuntu-latest
        steps:
          - name: Checkout
            uses: actions/checkout@v3

          - name: Authenticate to Google Cloud
            uses: 'google-github-actions/auth@v1'
            with:
              credentials_json: '${{ secrets.GCP_SA_KEY }}' # Add service account key to GitHub Secrets

          - name: Set up Cloud SDK
            uses: 'google-github-actions/setup-gcloud@v1'

          - name: Build and Push Docker Image
            run: |-
              gcloud auth configure-docker [YOUR_REGION]-docker.pkg.dev
              docker build -t [ARTIFACT_REGISTRY_URL]/[PROJECT_ID]/[REPO_NAME]/streamtubi-backend:latest ./backend
              docker push [ARTIFACT_REGISTRY_URL]/[PROJECT_ID]/[REPO_NAME]/streamtubi-backend:latest

          - name: Deploy to Cloud Run
            uses: 'google-github-actions/deploy-cloudrun@v1'
            with:
              service: 'streamtubi-backend' # Your Cloud Run service name
              region: '[YOUR_REGION]'
              image: '[ARTIFACT_REGISTRY_URL]/[PROJECT_ID]/[REPO_NAME]/streamtubi-backend:latest'
    ```
3.  **Frontend Deployment Workflow:**
    -   No file is needed! Vercel's GitHub integration automatically provides CI/CD. When you push to the `main` branch, Vercel will detect the changes and deploy the new version of the frontend.

---
