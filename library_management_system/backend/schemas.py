from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class BookBase(BaseModel):
    title: str
    author: str
    category: Optional[str] = None
    isbn: Optional[str] = None


class BookCreate(BookBase):
    availability_status: str = "available"


class BookUpdate(BookBase):
    availability_status: Optional[str] = None


class BookResponse(BookBase):
    book_id: int
    availability_status: str

    model_config = {"from_attributes": True}


class BorrowerBase(BaseModel):
    borrower_name: str
    email: Optional[str] = None
    phone: Optional[str] = None


class BorrowerCreate(BorrowerBase):
    pass


class BorrowerUpdate(BorrowerBase):
    pass


class BorrowerResponse(BorrowerBase):
    borrower_id: int

    model_config = {"from_attributes": True}


class BorrowRequest(BaseModel):
    book_id: int
    borrower_id: int


class ReturnRequest(BaseModel):
    book_id: int


class TransactionResponse(BaseModel):
    transaction_id: int
    book_id: int
    borrower_id: int
    borrow_date: datetime
    return_date: Optional[datetime] = None
    book_title: Optional[str] = None
    borrower_name: Optional[str] = None

    model_config = {"from_attributes": True}
