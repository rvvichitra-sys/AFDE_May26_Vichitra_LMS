from sqlalchemy.orm import Session
from sqlalchemy import or_
from datetime import datetime
import models
import schemas


# ── Books ──────────────────────────────────────────────────────────────────────

def get_books(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Book).offset(skip).limit(limit).all()


def get_book(db: Session, book_id: int):
    return db.query(models.Book).filter(models.Book.book_id == book_id).first()


def create_book(db: Session, book: schemas.BookCreate):
    db_book = models.Book(**book.model_dump())
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book


def update_book(db: Session, book_id: int, book: schemas.BookUpdate):
    db_book = db.query(models.Book).filter(models.Book.book_id == book_id).first()
    if db_book:
        for key, value in book.model_dump(exclude_unset=True).items():
            setattr(db_book, key, value)
        db.commit()
        db.refresh(db_book)
    return db_book


def delete_book(db: Session, book_id: int):
    db_book = db.query(models.Book).filter(models.Book.book_id == book_id).first()
    if db_book:
        db.delete(db_book)
        db.commit()
    return db_book


def search_books(db: Session, query: str):
    return db.query(models.Book).filter(
        or_(
            models.Book.title.ilike(f"%{query}%"),
            models.Book.author.ilike(f"%{query}%"),
            models.Book.category.ilike(f"%{query}%"),
            models.Book.isbn.ilike(f"%{query}%"),
        )
    ).all()


# ── Borrowers ──────────────────────────────────────────────────────────────────

def get_borrowers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Borrower).offset(skip).limit(limit).all()


def get_borrower(db: Session, borrower_id: int):
    return db.query(models.Borrower).filter(models.Borrower.borrower_id == borrower_id).first()


def create_borrower(db: Session, borrower: schemas.BorrowerCreate):
    db_borrower = models.Borrower(**borrower.model_dump())
    db.add(db_borrower)
    db.commit()
    db.refresh(db_borrower)
    return db_borrower


def update_borrower(db: Session, borrower_id: int, borrower: schemas.BorrowerUpdate):
    db_borrower = db.query(models.Borrower).filter(models.Borrower.borrower_id == borrower_id).first()
    if db_borrower:
        for key, value in borrower.model_dump(exclude_unset=True).items():
            setattr(db_borrower, key, value)
        db.commit()
        db.refresh(db_borrower)
    return db_borrower


def delete_borrower(db: Session, borrower_id: int):
    db_borrower = db.query(models.Borrower).filter(models.Borrower.borrower_id == borrower_id).first()
    if db_borrower:
        db.delete(db_borrower)
        db.commit()
    return db_borrower


# ── Transactions ───────────────────────────────────────────────────────────────

def borrow_book(db: Session, borrow: schemas.BorrowRequest):
    book = db.query(models.Book).filter(models.Book.book_id == borrow.book_id).first()
    if not book or book.availability_status != "available":
        return None
    transaction = models.Transaction(
        book_id=borrow.book_id,
        borrower_id=borrow.borrower_id,
        borrow_date=datetime.utcnow(),
    )
    book.availability_status = "borrowed"
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction


def return_book(db: Session, return_req: schemas.ReturnRequest):
    transaction = (
        db.query(models.Transaction)
        .filter(
            models.Transaction.book_id == return_req.book_id,
            models.Transaction.return_date == None,  # noqa: E711
        )
        .first()
    )
    if not transaction:
        return None
    book = db.query(models.Book).filter(models.Book.book_id == return_req.book_id).first()
    if book:
        book.availability_status = "available"
    transaction.return_date = datetime.utcnow()
    db.commit()
    db.refresh(transaction)
    return transaction


def _serialize_transaction(t):
    return {
        "transaction_id": t.transaction_id,
        "book_id": t.book_id,
        "borrower_id": t.borrower_id,
        "borrow_date": t.borrow_date,
        "return_date": t.return_date,
        "book_title": t.book.title if t.book else None,
        "borrower_name": t.borrower.borrower_name if t.borrower else None,
    }


def get_transactions(db: Session, skip: int = 0, limit: int = 100):
    transactions = (
        db.query(models.Transaction)
        .order_by(models.Transaction.borrow_date.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return [_serialize_transaction(t) for t in transactions]


def get_dashboard_stats(db: Session):
    total_books = db.query(models.Book).count()
    available_books = db.query(models.Book).filter(models.Book.availability_status == "available").count()
    borrowed_books = db.query(models.Book).filter(models.Book.availability_status == "borrowed").count()
    total_borrowers = db.query(models.Borrower).count()
    recent = (
        db.query(models.Transaction)
        .order_by(models.Transaction.borrow_date.desc())
        .limit(5)
        .all()
    )
    return {
        "total_books": total_books,
        "available_books": available_books,
        "borrowed_books": borrowed_books,
        "total_borrowers": total_borrowers,
        "recent_transactions": [_serialize_transaction(t) for t in recent],
    }
