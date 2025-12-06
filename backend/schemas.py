from pydantic import BaseModel, EmailStr
import uuid
from datetime import datetime
from typing import Optional, List

class CardBase(BaseModel):
    front: str
    back: str

class CardCreate(CardBase):
    pass

class Card(CardBase):
    id: int
    deck_id: int
    next_review: Optional[datetime] = None
    interval: Optional[int] = None

    class Config:
        from_attributes = True

class DeckBase(BaseModel):
    title: str
    description: Optional[str] = None

class DeckCreate(DeckBase):
    pass

class Deck(DeckBase):
    id: int
    user_id: uuid.UUID
    cards: List[Card] = []

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: uuid.UUID
    email: EmailStr
    created_at: datetime
    decks: List[Deck] = []

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class Review(BaseModel):
    grade: str # "Again", "Good", "Easy"
