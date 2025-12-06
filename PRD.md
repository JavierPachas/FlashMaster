# Product Requirements Document (PRD)

**Project Name:** FlashMaster
**Version:** 1.2
**Status:** Architecture Frozen
**Platform:** Web Application (Responsive)
**Last Updated:** December 6, 2025

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
* **FR-11:** **Edit Deck Details:** Users can modify the title and description of an existing deck.
* **FR-12:** **Bulk Add Cards via CSV:** Users can upload a CSV file containing 'front' and 'back' columns to add multiple cards to a deck simultaneously.

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
| `/` | Public | `LandingPage` | Project intro and Call to Action. Redirects logged-in users to Dashboard. |
| `/login` | Public | `LoginPage` | Auth form to get token. |
| `/register` | Public | `RegisterPage` | Sign up form. |
| `/dashboard` | **Private** | `Dashboard` | Grid view of user's Decks, including a "Create New Deck" card. |
| `/create-deck` | **Private** | `CreateDeck` | Form to add a new deck. |
| `/deck/:id` | **Private** | `DeckView` | List view of cards in a specific deck. |
| `/deck/:id/study`| **Private** | `StudyMode` | Active flashcard session interface. |
| `*` | Public | `NotFound` | 404 Error handler. |

---

## 6. UI/UX Design System
The application now features a clean, minimalistic Notion-like layout with a refined blue-gray color palette and subtle interactive elements.

### 6.1 Color Palette
A clean, minimalistic Notion-inspired palette focusing on neutrals with a subtle blue accent.

| Color | Hex | Semantic Role | Usage |
| :--- | :--- | :--- | :--- |
| **Primary** | `#37352F` | **Dark Text / Elements** | Main text, primary headings. |
| **Accent** | `#228BE6` | **Accent / Links** | Links, primary buttons, active states. |
| **Accent Light** | `#74C0FC` | **Lighter Accent** | Subtle highlights, hover states. |
| **Background** | `#F7F7F7` | **Global Background** | Main application background. |
| **Surface** | `#FFFFFF` | **Card / Input Background** | Flashcard background, input fields, containers. |
| **Text Medium** | `#787774` | **Secondary Text** | Descriptions, less prominent text. |
| **Border** | `#E0E0E0` | **Subtle Borders** | Element separators, input borders. |
| **Error** | `#A05252` | **Subdued Error** | Error messages, danger actions. |

### 6.2 Typography
* **Primary Font:** Inter (Clean, legible, Notion-like).
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
* `PUT /decks/{id}` (Update deck)
* `GET /decks/{id}/cards` (Get cards for study)
* `POST /cards` (Create card)
* `PUT /cards/{id}/review` (Submit study result)