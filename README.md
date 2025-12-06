# FlashMaster

FlashMaster is a powerful web application designed to optimize your learning and information retention through digital flashcards. It leverages a sophisticated Spaced Repetition System (SRS) to present cards at optimal intervals, ensuring maximum memory recall and efficient study sessions. Built with a modern tech stack, FlashMaster provides a clean, intuitive, and distraction-free environment for mastering any subject.

## Features

### Core Functionality
*   **User Authentication:** Secure registration and login using Email and Password, with JWT (JSON Web Token) for session management and route protection.
*   **Deck Management:** Create, view, edit, and delete personalized collections of flashcards (decks).
*   **Card Management:**
    *   Add individual flashcards with "Front" (Question) and "Back" (Answer) text.
    *   Edit and delete existing cards.
    *   **Bulk Card Upload via CSV:** Easily import multiple cards by uploading a CSV file with 'front' and 'back' columns.
*   **Spaced Repetition System (SRS):** An intelligent study mode that adapts to your learning, scheduling card reviews based on your performance ("Again", "Good", "Easy") to maximize long-term retention.
*   **Responsive Design:** A seamless learning experience across various devices, from desktop to mobile.

### UI/UX Design
*   **Notion-like Aesthetic:** A clean, minimalistic, and highly functional user interface inspired by Notion, featuring a refined blue-gray color palette.
*   **Intuitive Navigation:** Clear and consistent navigation elements for easy access to all features.
*   **Subtle Interactions:** Smooth transitions and subtle visual feedback for a polished user experience.

## Technologies Used

*   **Frontend:** React (Vite)
*   **Backend:** Python (FastAPI)
*   **Database:** PostgreSQL
*   **Containerization:** Docker & Docker Compose
*   **Authentication:** OAuth2 with JWT

## Getting Started

To run FlashMaster locally, ensure you have Docker and Docker Compose installed.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/JavierPachas/FlashMaster.git
    cd FlashMaster
    ```
2.  **Start the application services:**
    ```bash
    docker compose up --build -d
    ```
    This command will build the Docker images and start the `backend`, `frontend`, and `db` services in detached mode.

3.  **Access the application:**
    *   Open your web browser and go to: `http://localhost:3000`
    *   The backend API will be available at: `http://localhost:8000`

## Potential Future Features

*   **Rich Text Editor:** Enhance card content creation with a visual rich text editor (WYSIWYG) supporting Markdown.
*   **Progress Tracking & Analytics:** Detailed statistics and visualizations of learning progress, retention rates, and study streaks.
*   **Deck Sharing:** Ability to share custom-made decks with other FlashMaster users.
*   **Import/Export Formats:** Support for importing and exporting decks in various formats (e.g., Anki, JSON).
*   **Mobile Application:** Dedicated mobile apps for iOS and Android for on-the-go learning.
*   **Customizable Study Sessions:** Options to configure study sessions, such as the number of cards per session, specific tags to review, or review by difficulty.
*   **Tagging & Categorization:** Advanced organization of cards using tags and custom categories.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an Issue.

## Images

<img width="844" height="514" alt="image" src="https://github.com/user-attachments/assets/5f60fd9f-c5cb-4713-9fc2-85874aa4c401" />

<img width="867" height="527" alt="image" src="https://github.com/user-attachments/assets/e4414220-e128-4f0d-9d48-d1064f8920f5" />

<img width="844" height="508" alt="image" src="https://github.com/user-attachments/assets/e11ece14-9c13-490a-89fc-9b48f81b2a34" />

<img width="750" height="504" alt="image" src="https://github.com/user-attachments/assets/850af1dc-a465-41bd-bb4f-12b750251cd9" />

<img width="751" height="608" alt="image" src="https://github.com/user-attachments/assets/1e1275da-e8e5-4836-8f73-1971080ca4da" />


## License

This project is licensed under the MIT License.
