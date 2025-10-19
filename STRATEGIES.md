# StreamTubi: Monetization & Scaling Strategies

This document outlines the strategies for generating revenue and ensuring the platform can scale to meet user demand.

## 1. Monetization Strategy

StreamTubi employs a hybrid "freemium" model, which is common among modern streaming services. This approach maximizes user acquisition with a free tier while creating a clear value proposition for a paid subscription.

### Ad-Based Free Tier

-   **Mechanism**: Unauthenticated or "Free" tier users are shown advertisements during video playback.
-   **Implementation**:
    -   **Pre-roll Ads**: A short ad plays before the main content begins.
    -   **Mid-roll Ads**: Ads are inserted at specific timestamps (`adBreaks`) during the video, which are managed by admins in the CMS.
    -   **Smart Ad Targeting (Simulated)**: The frontend currently simulates targeted ads by selecting an ad video based on the content's genre. In a production environment, this would be driven by a real ad server (like Google Ad Manager) that targets ads based on user demographics, viewing history, and content metadata.
-   **Revenue**: Generated via impressions (CPM) or clicks (CPC) from an integrated ad network.

### Premium Subscription Tier

-   **Mechanism**: Users can pay a recurring fee (e.g., monthly) for an enhanced viewing experience.
-   **Value Proposition**:
    -   **Ad-Free Viewing**: The primary benefit. The video player logic is already built to check a user's subscription status and bypass all ad-related code for "Premium" users.
    -   **Access to Exclusive Content (Future)**: The platform could later restrict certain high-value content to premium subscribers only.
-   **Implementation (Stripe Integration)**:
    1.  **Frontend**: The user clicks "Upgrade Now" on the `/subscribe` page. This should redirect them to a Stripe Checkout page.
    2.  **Backend**: The backend needs an endpoint to create a Stripe Checkout session.
    3.  **Webhook**: A dedicated webhook endpoint on the backend (`/webhooks/stripe`) listens for successful payment events from Stripe.
    4.  **Database Update**: Upon receiving a `checkout.session.completed` event, the webhook handler updates the user's `subscriptionPlan` in the database to "Premium".
    5.  **Frontend Update**: The next time the user's data is fetched, the frontend will reflect their new "Premium" status and automatically disable ads.

## 2. Scaling Strategy

The application is designed with a modern, decoupled architecture to allow each component to scale independently.

### Frontend (Vercel)

-   **Global CDN**: By deploying to Vercel, the static assets (HTML, CSS, JS) are automatically distributed across a global Edge Network. This ensures low latency for users anywhere in the world.
-   **Serverless Functions**: For any dynamic, server-side rendered pages or API routes needed in the future (e.g., a "Backend For Frontend" pattern), Vercel's serverless functions provide automatic scaling based on traffic.
-   **Image Optimization**: Vercel's built-in image optimization service can be used to serve properly sized and formatted images (like thumbnails) on the fly, reducing bandwidth and improving load times.

### Backend (Google Cloud Run)

-   **Serverless Auto-Scaling**: Cloud Run automatically scales the number of container instances up or down based on incoming request volume, from zero to thousands. This is highly cost-effective and handles traffic spikes without manual intervention.
-   **Stateless Services**: The backend API should be designed to be stateless. User session information is managed via JWTs, and all persistent data is stored in the database, allowing any container instance to handle any user's request.

### Database (Google Cloud SQL)

-   **Managed Service**: Cloud SQL handles patching, backups, and replication, reducing operational overhead.
-   **Vertical Scaling**: The CPU and memory of the database instance can be easily scaled up in the GCP console with minimal downtime.
-   **Read Replicas**: For read-heavy workloads (which is typical for a streaming site), read replicas can be created to distribute the load from `GET` requests, preserving the primary instance's resources for writes (`POST`, `PUT`, `DELETE`).

### Media Delivery (Cloudflare Stream / BunnyCDN)

-   **Dedicated Media CDN**: This is the most critical scaling component. Serving video from a specialized CDN offloads the vast majority of bandwidth from the backend servers.
-   **Adaptive Bitrate Streaming**: These services automatically encode videos into multiple quality levels. The player then intelligently requests the best quality stream based on the user's current network conditions, ensuring a smooth experience without buffering. This is handled via the HLS (`.m3u8`) manifest URL.
-   **Global Caching**: The video segments are cached on edge servers around the world, ensuring fast start times for viewers everywhere.
