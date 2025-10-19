# StreamTubi API Documentation

This document outlines the REST API endpoints that the StreamTubi frontend application is designed to consume. It serves as a contract for the backend development team.

**Base URL**: The base URL for all endpoints should be configured in the frontend's environment variables (e.g., `https://api.streamtubi.com/v1`).

---

## Authentication

### `POST /auth/login`

Authenticates a user and returns a user object and access tokens.

-   **Request Body**:
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```
-   **Success Response (200 OK)**:
    ```json
    {
      "user": {
        "id": "2",
        "email": "user@streamtubi.com",
        "isAdmin": false,
        "myList": ["2"],
        "subscriptionPlan": "Free",
        "watchTimeMinutes": 320
      },
      "accessToken": "ey...",
      "refreshToken": "ey..."
    }
    ```
-   **Error Response (401 Unauthorized)**:
    ```json
    {
      "message": "Invalid credentials"
    }
    ```

---

## Videos

### `GET /videos`

Retrieves a list of all videos.

-   **Success Response (200 OK)**:
    ```json
    [
      {
        "id": "1",
        "title": "Cybernetic Revolution",
        "description": "...",
        "thumbnailUrl": "...",
        "videoUrl": "...",
        "duration": 596,
        "category": "Sci-Fi Movies",
        "tags": ["sci-fi", "action"],
        "ageRating": "PG-13",
        "cast": ["Keanu Reeves"],
        "adBreaks": [60, 180]
      }
    ]
    ```

### `POST /videos` (Admin Only)

Creates a new video.

-   **Request Body**: `Omit<Video, 'id'>`
-   **Success Response (201 Created)**: The full `Video` object, including the newly generated `id`.

### `PUT /videos/:id` (Admin Only)

Updates an existing video.

-   **Request Body**: The full `Video` object.
-   **Success Response (200 OK)**: The updated `Video` object.

### `DELETE /videos/:id` (Admin Only)

Deletes a video.

-   **Success Response (204 No Content)**

---

## Categories

### `GET /categories`

Retrieves a list of all video categories.

-   **Success Response (200 OK)**:
    ```json
    [
      { "id": "1", "name": "Trending Now" },
      { "id": "2", "name": "Action & Adventure" }
    ]
    ```

---

## Users

### `GET /users` (Admin Only)

Retrieves a list of all users. The backend should **never** send the password hash.

-   **Success Response (200 OK)**:
    ```json
    [
        {
            "id": "2",
            "email": "user@streamtubi.com",
            "isAdmin": false,
            "myList": ["2"],
            "subscriptionPlan": "Free",
            "watchTimeMinutes": 320
        }
    ]
    ```

### `PUT /users/:id/my-list`

Adds or removes a video from the current user's list.

-   **Request Body**:
    ```json
    {
      "videoId": "some-video-id",
      "action": "add" | "remove"
    }
    ```
-   **Success Response (200 OK)**: The updated user object.

### `POST /users/subscription/upgrade`

Upgrades the current user's subscription to 'Premium'. (This would be the webhook target for a payment provider like Stripe).

-   **Success Response (200 OK)**: The updated user object with `subscriptionPlan: "Premium"`.
