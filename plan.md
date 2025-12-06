# FlashMaster Implementation Plan

This document outlines the plan to implement the FlashMaster web application as described in the PRD.

## 1. Project Setup

- **Initialize Git Repository:**
  ```bash
  git init
  ```
- **Create Project Structure:**
  ```
  /
  ├── backend/
  ├── frontend/
  └── docker-compose.yml
  ```
- **Setup Docker Compose:**
  - Create a `docker-compose.yml` file to define the three services:
    - `backend`: Python/FastAPI application.
    - `frontend`: React application.
    - `db`: PostgreSQL database.
  - Configure networking between the services.

## 2. Backend Development (Python/FastAPI)

- **Initialize FastAPI Project:**
  - Create a `backend/` directory.
  - Set up a virtual environment.
  - Install FastAPI, Uvicorn, SQLAlchemy, and other dependencies.
- **Database Modeling (SQLAlchemy):**
  - Create `models.py` to define the `User`, `Deck`, and `Card` tables.
  - Use Alembic for database migrations.
- **API Endpoints:**
  - **Authentication (`/auth`):**
    - `POST /auth/register`: Create a new user.
    - `POST /auth/login`: Authenticate and return a JWT.
  - **Decks (`/decks`):**
    - `GET /decks`: List all decks for the authenticated user.
    - `POST /decks`: Create a new deck.
    - `DELETE /decks/{id}`: Delete a deck.
  - **Cards (`/cards`):**
    - `GET /decks/{id}/cards`: Get all cards for a specific deck.
    - `POST /cards`: Create a new card.
    - `PUT /cards/{id}`: Update a card.
    - `DELETE /cards/{id}`: Delete a card.
  - **Study (`/review`):**
    - `PUT /cards/{id}/review`: Submit a self-grade and update the card's `next_review` date based on a simple SRS algorithm.
- **SRS Logic:**
  - Implement a function to calculate the next review date based on the user's self-reported difficulty ("Again", "Good", "Easy").

## 3. Frontend Development (React)

- **Initialize React Project:**
  - Use Vite to create a new React project in the `frontend/` directory.
  - `npm create vite@latest frontend -- --template react`
- **Install Dependencies:**
  - `react-router-dom` for routing.
  - `axios` for API requests.
  - A state management library like Zustand or Redux Toolkit.
- **UI Components:**
  - Create reusable components for buttons, inputs, cards, etc., based on the design system in the PRD.
- **Routing (React Router):**
  - Set up the following routes:
    - `/`: `LandingPage`
    - `/login`: `LoginPage`
    - `/register`: `RegisterPage`
    - `/dashboard`: `Dashboard` (Private)
    - `/create-deck`: `CreateDeck` (Private)
    - `/deck/:id`: `DeckView` (Private)
    - `/deck/:id/study`: `StudyMode` (Private)
    - `*`: `NotFound`
- **Page Implementation:**
  - **Authentication:**
    - Create login and registration forms.
    - Implement logic to store the JWT in local storage and manage the user's authentication state.
  - **Dashboard:**
    - Fetch and display a list of the user's decks.
  - **Deck View:**
    - Fetch and display the cards for a specific deck.
    - Allow adding, editing, and deleting cards.
  - **Study Mode:**
    - Fetch cards for a study session.
    - Implement the flashcard reveal and self-grading UI.
    - Send review results to the backend.
- **Styling:**
  - Use CSS Modules or a CSS-in-JS library to style the application according to the PRD's color palette and typography.

## 4. Testing

- **Backend:**
  - Write unit tests for the API endpoints and business logic using `pytest`.
- **Frontend:**
  - Write component tests using `jest` and `react-testing-library`.

## 5. Deployment

- **Containerize Applications:**
  - Create `Dockerfile` for both the `backend` and `frontend` services.
- **Production Configuration:**
  - Update `docker-compose.yml` for production deployment.
  - Use a production-ready web server for the FastAPI app (e.g., Gunicorn).
- **Build and Run:**
  - Use `docker-compose up --build` to build and run the entire application stack.
