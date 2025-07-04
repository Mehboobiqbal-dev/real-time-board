# ... (all previous sections)

### Backend

*   **API**: Next.js API Routes. A single route, `/api/socket`, is used to initialize the Socket.IO server.
*   **WebSocket Server**: `Socket.IO` is attached to the Next.js HTTP server. It handles client connections and broadcasts events.
*   **Persistence**: The board state is stored in a **MongoDB** database. A singleton connection pattern is used for efficient database access in a serverless environment. The entire board is stored as a single document, which is updated on every change.

### Trade-offs & Decisions

*   **File-based DB vs. Real Database**: The project was upgraded from a simple `db.json` file to MongoDB. This provides a robust, scalable, and production-ready persistence layer that can safely handle concurrent operations from multiple users.

## Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/real-time-board.git
    cd real-time-board
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your Database:**
    *   This project requires a MongoDB database. You can use a local instance or a free cloud-hosted one from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
    *   Once set up, get your MongoDB Connection String (URI).

4.  **Configure Environment Variables:**
    *   In the root of the project, create a file named `.env.local`.
    *   Add your MongoDB connection details to this file:
        ```
        MONGODB_URI=your-mongodb-connection-string
        MONGODB_DB_NAME=your-database-name
        ```
    *   **Note:** The `.env.local` file is included in `.gitignore` and should never be committed to your repository.

5.  **Run the development server:**
    ```bash
    npm run dev
    ```

6.  Open your browser and navigate to `https://real-time-board-pi.vercel.app/`. The first time the application runs, it will automatically "seed" your database with initial sample data.

