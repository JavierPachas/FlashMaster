# Product Requirements Document (PRD)

**Project Name:** FlashMaster
**Version:** 1.2
**Status:** Architecture Frozen
**Platform:** Web Application (Responsive)
**Last Updated:** December 5, 2025

---

## 1. Executive Summary
FlashMaster is a web-based learning application designed to optimize information retention through digital flashcards. It utilizes a spaced-repetition system (SRS) to present cards at optimal intervals. The application is built on a modern containerized stack using React, Python, and PostgreSQL.

## 2. Problem Statement
* **The Problem:** Learners often struggle to organize study materials effectively and rely on inefficient "cramming" methods that lead to poor long-term retention.
* **The Solution:** A distraction-free, organized platform that manages the study schedule for the user, ensuring efficient review sessions.

## 3. User Personas
* **The Student:** Needs to rapidly create decks from lecture notes and review them on mobile devices.
* **The Professional:** Preparing for certification exams, requires strict organization and progress tracking.

---

## 4. Functional Requirements (MVP Scope)

### 4.1 User Authentication
* **FR-01:** **Registration:** User signs up with Email and Password.
* **FR-02:** **Login:** Authenticate credentials and receive a JWT (JSON Web Token).
* **FR-03:** **Route Protection:** Prevent access to Dashboard and Study modes without a valid token.
* **FR-04:** **Persistent Session:** Keep user logged in upon page refresh (until token expiry).

### 4.2 Deck Management
* **FR-05:** **Create Deck:** Users can create named collections of cards (e.g., "Spanish Vocabulary").
* **FR-06:** **Dashboard:** View a grid/list of all owned decks.
* **FR-07:** **Delete Deck:** Remove a deck and all associated cards.

### 4.3 Card Management
* **FR-08:** **Add Card:** Input "Front" (Question) and "Back" (Answer) text.
* **FR-09:** **Rich Text:** Support Markdown rendering for Bold, Italic, and Code blocks on cards.
* **FR-10:** **Edit/Delete:** Modify card content or remove cards from a deck.

### 4.4 Study Mode (The Core Loop)
* **FR-11:** **Review Interface:** User sees the Front -> Clicks to Reveal -> Sees the Back.
* **FR-12:** **Self-Grading:** User selects difficulty: "Again" (Failed), "Good" (Pass), "Easy" (Mastered).
* **FR-13:** **SRS Logic:** The backend calculates the next review date based on the grade selected.

---

## 5. Technical Architecture

### 5.1 Tech Stack
* **Frontend:** React (Vite/CRA)
* **Backend:** Python (FastAPI recommended for async/performance)
* **Database:** PostgreSQL
* **Infrastructure:** Docker & Docker Compose
* **Authentication:** OAuth2 with Password Flow (JWT)

### 5.2 Frontend Routes
The application uses client-side routing (React Router).

| Route Path | Access | Component | Description |
| :--- | :--- | :--- | :--- |
| `/` | Public | `LandingPage` | Project intro and Call to Action. |
| `/login` | Public | `LoginPage` | Auth form to get token. |
| `/register` | Public | `RegisterPage` | Sign up form. |
| `/dashboard` | **Private** | `Dashboard` | Grid view of user's Decks. |
| `/create-deck` | **Private** | `CreateDeck` | Form to add a new deck. |
| `/deck/:id` | **Private** | `DeckView` | List view of cards in a specific deck. |
| `/deck/:id/study`| **Private** | `StudyMode` | Active flashcard session interface. |
| `*` | Public | `NotFound` | 404 Error handler. |

---

## 6. UI/UX Design System

### 6.1 Color Palette
A warm, high-contrast palette designed for readability.

| Color | Hex | Semantic Role | Usage |
| :--- | :--- | :--- | :--- |
| **Cream** | `#FAF3E1` | **Background** | Global app background. |
| **Sand** | `#F5E7C6` | **Surface** | Flashcard background, input fields, containers. |
| **Orange** | `#FF6D1F` | **Primary / Accent** | Call-to-Action buttons, active links, highlights. |
| **Black** | `#222222` | **Text / Ink** | All typography and icons. |

### 6.2 Typography
* **Primary Font:** Inter, Roboto, or System Sans-Serif (Clean, legible).
* **Code Font:** Fira Code or Monospace (for code blocks inside flashcards).

---

## 7. Data Model (PostgreSQL Schema)

### `users`
* `id`: UUID (PK)
* `email`: VARCHAR (Unique)
* `password_hash`: VARCHAR
* `created_at`: TIMESTAMP

### `decks`
* `id`: SERIAL (PK)
* `user_id`: UUID (FK -> users.id)
* `title`: VARCHAR
* `description`: TEXT

### `cards`
* `id`: SERIAL (PK)
* `deck_id`: INT (FK -> decks.id)
* `front`: TEXT (Markdown allowed)
* `back`: TEXT (Markdown allowed)
* `next_review`: TIMESTAMP (Calculated via SRS)
* `interval`: INT (Days between reviews)

---

## 8. API Endpoints (Draft)

* `POST /auth/register`
* `POST /auth/login`
* `GET /decks` (List decks)
* `POST /decks` (Create deck)
* `GET /decks/{id}/cards` (Get cards for study)
* `POST /cards` (Create card)
* `PUT /cards/{id}/review` (Submit study result)