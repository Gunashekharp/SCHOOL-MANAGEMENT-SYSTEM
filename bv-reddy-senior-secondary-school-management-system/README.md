# Vertex AI Studio Frontend App with Node.js Backend

This repository contains a frontend and a Node.js backend, designed to run together.
The backend acts as a proxy, handling Google Cloud API calls.

This project is intended for demonstration and prototyping purposes only.
It is not intended for use in a production environment.

## Prerequisites

To run this application locally, you need:

*   **[Google Cloud SDK / gcloud CLI](https://cloud.google.com/sdk/docs/install)**: Follow the instructions to install the SDK.

*   **gcloud Initialization**:
    *   Initialize the gcloud CLI:
        ```bash
        gcloud init
        ```
    *   Authenticate for Application Default Credentials (needed to call Google Cloud APIs):
        ```bash
        gcloud auth application-default login
        ```

*   **Node.js and npm**: Ensure you have Node.js and its package manager, `npm`, installed on your machine.

## Project Structure

The project is organized into two main directories:

*   `frontend/`: Contains the Frontend application code.
*   `backend/`: Contains the Node.js/Express server code to proxy Google Cloud API calls.

## Backend Environment Variables

The `backend/.env.local` file is automatically generated when you download this application.
It contains essential Google Cloud environment variables pre-configured based on your project settings at the time of download.

The variables set in `backend/.env.local` are:
*   `API_BACKEND_PORT`: The port the backend API server listens on (e.g., `5000`).
*   `API_PAYLOAD_MAX_SIZE`: The maximum size of the request payload accepted by the backend server (e.g., `5mb`).
*   `GOOGLE_CLOUD_LOCATION`: The Google Cloud region associated with your project.
*   `GOOGLE_CLOUD_PROJECT`: Your Google Cloud Project ID.

**Note:** These variables are automatically populated during the download process.
You can modify the values in `backend/.env.local` if you need to change them.

## Installation and Running the App

To install dependencies and run your Google Cloud Vertex AI Studio App locally, execute the following command:

```bash
npm install && npm run dev
```

## Deploy backend to Vercel (Serverless)

The backend is now structured to support Vercel serverless functions.

- Vercel backend entry: `backend/api/index.js`
- Shared Express app: `backend/app.js`
- Local Node server (with WebSocket upgrade support): `backend/server.js`

### Vercel project settings

- Set project root directory to `backend`
- Vercel uses `backend/vercel.json` to route requests

### Required environment variables on Vercel

- `GOOGLE_CLOUD_PROJECT`
- `GOOGLE_CLOUD_LOCATION`
- `PROXY_HEADER` (optional; defaults to frontend shim value)
- `API_PAYLOAD_MAX_SIZE` (optional)

### Important limitation

`/ws-proxy` is not available in serverless mode and returns `501`.
If you need websocket proxying for live API traffic, deploy `backend/server.js` on a stateful Node host (VM/Render/Railway/etc.) instead of serverless.

## Deploy frontend to Vercel

### Vercel project settings

- Set project root directory to `frontend`
- Build command: `npm run build`
- Output directory: `dist`

### Required frontend environment variable

- `VITE_API_BASE_URL`
  - Set this to your deployed backend URL, for example: `https://your-backend.vercel.app`
  - Do not include a trailing slash

The frontend proxy shim reads `VITE_API_BASE_URL` and forwards `/api-proxy` and `/ws-proxy` requests to that backend origin.
