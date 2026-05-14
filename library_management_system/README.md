# Library Management System — Phase 1

A full-stack web application for managing books, borrowers, and library transactions.

**Stack:** React · FastAPI · SQLite · SQLAlchemy

---

## Project Structure

```
library_management_system/
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── crud.py
│   ├── routers/
│   │   ├── books.py
│   │   ├── borrowers.py
│   │   └── transactions.py
│   └── requirements.txt
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   ├── Navbar.js
        │   └── Navbar.css
        ├── pages/
        │   ├── Dashboard.js
        │   ├── Books.js
        │   ├── Borrowers.js
        │   ├── BorrowReturn.js
        │   └── Search.js
        ├── App.js
        ├── App.css
        ├── api.js
        └── index.js
```

---

## Setup & Installation

### Backend

**Requirements:** Python 3.9+

```bash
cd library_management_system/backend

# Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`  
Interactive API docs: `http://localhost:8000/docs`

---

### Frontend

**Requirements:** Node.js 16+

```bash
cd library_management_system/frontend

# Install dependencies
npm install

# Start the dev server
npm start
```

The app will open at `http://localhost:3000`

---

## API Reference

### Books

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/books/` | List all books |
| GET | `/books/{id}` | Get book by ID |
| POST | `/books/` | Add new book |
| PUT | `/books/{id}` | Update book |
| DELETE | `/books/{id}` | Delete book |

### Borrowers

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/borrowers/` | List all borrowers |
| POST | `/borrowers/` | Add borrower |
| PUT | `/borrowers/{id}` | Update borrower |
| DELETE | `/borrowers/{id}` | Delete borrower |

### Transactions

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/borrow` | Borrow a book |
| POST | `/return` | Return a book |
| GET | `/transactions` | View all transactions |
| GET | `/dashboard` | Dashboard statistics |

### Search

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/search?q=<query>` | Search books by title, author, category, or ISBN |

---

## Features

- **Dashboard** — Total books, available/borrowed counts, recent transactions
- **Book Management** — Add, edit, delete, and view all books with availability status
- **Borrower Management** — Add, edit, delete, and view all borrowers
- **Borrow / Return** — Borrow available books, return borrowed books, view all transactions
- **Search** — Keyword search across title, author, category, and ISBN
- **Responsive UI** — Works on desktop and mobile
