# Online Library System – Backend

A robust backend API for an Online Library System, built with TypeScript, Express, and MongoDB. This service manages books, users, authentication, and borrowing operations, providing a secure and extensible foundation for a modern digital library.

---

## Features

- **User Authentication & Authorization**
  - Secure JWT-based authentication.
  - Role-based access control for different user roles.

- **Book Management**
  - Add, update, delete, and retrieve books.
  - Search and filter books by title, author, genre, and publication year.
  - Manage book availability and notify users when books become available.

- **Borrowing List Management**
  - Users can maintain a personal borrowing list.
  - Add, remove, and clear books from the borrowing list.
  - Automated email notifications on actions like adding a book.

- **RESTful API**
  - Well-structured endpoints under `/api` for authentication, books, and borrowing list.
  - Error handling and validation for robust operations.

- **CORS Security**
  - Customizable CORS setup for safe cross-origin requests.

---

## Technology Stack

- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT
- **Email Service**: Nodemailer (or similar, configurable)
- **Other**: dotenv, bcryptjs, CORS

---

## Getting Started

### Prerequisites

- **Node.js** (v18+ recommended)
- **MongoDB** instance (local or remote)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Shachiru/online-library-system--backend.git
   cd online-library-system--backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and update values as needed:
     ```
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     EMAIL_USER=your_email_address
     EMAIL_PASS=your_email_password
     ```

4. **Run the server:**
   ```bash
   npm run dev
   ```

   The server runs by default on `http://localhost:3000`.

---

## API Endpoints

### Authentication

- `POST /api/auth/register` – Register a new user
- `POST /api/auth/login` – Login and receive a JWT token

### Books

- `GET /api/books` – Get all books (auth required)
- `GET /api/books/:isbn` – Get book by ISBN
- `POST /api/books` – Add a new book (admin only)
- `PUT /api/books/:isbn` – Update book details
- `DELETE /api/books/:isbn` – Remove a book
- `GET /api/books/search?title=...` – Search by title
- `GET /api/books/search?author=...` – Search by author
- `GET /api/books/search?genre=...` – Search by genre

### Borrowing List

- `GET /api/borrowing-list` – Get current user's borrowing list
- `POST /api/borrowing-list` – Add a book by ISBN
- `DELETE /api/borrowing-list/:isbn` – Remove a book from the list
- `DELETE /api/borrowing-list` – Clear all books from the list

---

## Project Structure

```
src/
  controllers/     // Route logic for books, auth, borrowing
  services/        // Business logic and DB access
  model/           // Mongoose models
  middleware/      // Auth and role checking
  routes/          // Express route definitions
  dto/             // Data transfer objects (DTOs)
  app.ts           // Express app setup
```

---

## Security

- **Authentication**: Uses JWT for stateless user sessions.
- **Authorization**: Role-based checks for protected endpoints.
- **CORS**: Only allows whitelisted origins.

---

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

---

## License

This project is currently **private** and does not specify a license. Contact the repository owner for usage details.

---

## Author

**Shachiru**  
[GitHub Profile](https://github.com/Shachiru)
