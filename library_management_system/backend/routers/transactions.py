from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import crud
import schemas

router = APIRouter(tags=["transactions"])


@router.post("/borrow")
def borrow_book(borrow: schemas.BorrowRequest, db: Session = Depends(get_db)):
    transaction = crud.borrow_book(db, borrow)
    if not transaction:
        raise HTTPException(status_code=400, detail="Book is not available or does not exist")
    return transaction


@router.post("/return")
def return_book(return_req: schemas.ReturnRequest, db: Session = Depends(get_db)):
    transaction = crud.return_book(db, return_req)
    if not transaction:
        raise HTTPException(status_code=400, detail="No active borrowing found for this book")
    return transaction


@router.get("/transactions")
def get_transactions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_transactions(db, skip=skip, limit=limit)


@router.get("/dashboard")
def get_dashboard(db: Session = Depends(get_db)):
    return crud.get_dashboard_stats(db)


@router.get("/search")
def search_books(q: str, db: Session = Depends(get_db)):
    if not q or not q.strip():
        raise HTTPException(status_code=400, detail="Search query is required")
    return crud.search_books(db, q)
