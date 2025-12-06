from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
from database import SessionLocal, engine
import models, schemas, auth
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:3000",  # Frontend URL
    "http://localhost",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token: str = Depends(auth.oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    email = auth.verify_token(token, credentials_exception)
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

@app.post("/auth/register", response_model=schemas.UserOut)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(email=user.email, password_hash=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/auth/login", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me/", response_model=schemas.UserOut)
async def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@app.post("/decks/", response_model=schemas.Deck)
def create_deck(deck: schemas.DeckCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_deck = models.Deck(**deck.dict(), user_id=current_user.id)
    db.add(db_deck)
    db.commit()
    db.refresh(db_deck)
    return db_deck

@app.get("/decks/", response_model=List[schemas.Deck])
def read_decks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    decks = db.query(models.Deck).filter(models.Deck.user_id == current_user.id).offset(skip).limit(limit).all()
    return decks

@app.get("/decks/{deck_id}", response_model=schemas.Deck)
def read_deck(deck_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_deck = db.query(models.Deck).filter(models.Deck.id == deck_id, models.Deck.user_id == current_user.id).first()
    if db_deck is None:
        raise HTTPException(status_code=404, detail="Deck not found")
    return db_deck

@app.delete("/decks/{deck_id}", response_model=schemas.Deck)
def delete_deck(deck_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_deck = db.query(models.Deck).filter(models.Deck.id == deck_id, models.Deck.user_id == current_user.id).first()
    if db_deck is None:
        raise HTTPException(status_code=404, detail="Deck not found")
    db.delete(db_deck)
    db.commit()
    return db_deck

@app.post("/decks/{deck_id}/cards/", response_model=schemas.Card)
def create_card_for_deck(deck_id: int, card: schemas.CardCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_deck = db.query(models.Deck).filter(models.Deck.id == deck_id, models.Deck.user_id == current_user.id).first()
    if db_deck is None:
        raise HTTPException(status_code=404, detail="Deck not found")
    db_card = models.Card(**card.dict(), deck_id=deck_id, next_review=None, interval=1)
    db.add(db_card)
    db.commit()
    db.refresh(db_card)
    return db_card

@app.get("/decks/{deck_id}/cards/", response_model=List[schemas.Card])
def read_cards_for_deck(deck_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_deck = db.query(models.Deck).filter(models.Deck.id == deck_id, models.Deck.user_id == current_user.id).first()
    if db_deck is None:
        raise HTTPException(status_code=404, detail="Deck not found")
    cards = db.query(models.Card).filter(models.Card.deck_id == deck_id).offset(skip).limit(limit).all()
    return cards

@app.put("/cards/{card_id}", response_model=schemas.Card)
def update_card(card_id: int, card: schemas.CardCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_card = db.query(models.Card).filter(models.Card.id == card_id).first()
    if db_card is None:
        raise HTTPException(status_code=404, detail="Card not found")
    db_deck = db.query(models.Deck).filter(models.Deck.id == db_card.deck_id, models.Deck.user_id == current_user.id).first()
    if db_deck is None:
        raise HTTPException(status_code=403, detail="Not authorized to update this card")
    for key, value in card.dict().items():
        setattr(db_card, key, value)
    db.commit()
    db.refresh(db_card)
    return db_card

@app.delete("/cards/{card_id}", response_model=schemas.Card)
def delete_card(card_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_card = db.query(models.Card).filter(models.Card.id == card_id).first()
    if db_card is None:
        raise HTTPException(status_code=404, detail="Card not found")
    db_deck = db.query(models.Deck).filter(models.Deck.id == db_card.deck_id, models.Deck.user_id == current_user.id).first()
    if db_deck is None:
        raise HTTPException(status_code=403, detail="Not authorized to delete this card")
    db.delete(db_card)
    db.commit()
    return db_card

@app.put("/cards/{card_id}/review", response_model=schemas.Card)
def review_card(card_id: int, review: schemas.Review, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_card = db.query(models.Card).filter(models.Card.id == card_id).first()
    if db_card is None:
        raise HTTPException(status_code=404, detail="Card not found")
    db_deck = db.query(models.Deck).filter(models.Deck.id == db_card.deck_id, models.Deck.user_id == current_user.id).first()
    if db_deck is None:
        raise HTTPException(status_code=403, detail="Not authorized to review this card")

    if db_card.interval is None:
        db_card.interval = 1

    if review.grade == "Again":
        db_card.interval = 1
    elif review.grade == "Good":
        db_card.interval = db_card.interval * 2
    elif review.grade == "Easy":
        db_card.interval = db_card.interval * 3
    else:
        raise HTTPException(status_code=400, detail="Invalid grade. Must be 'Again', 'Good', or 'Easy'.")

    db_card.next_review = datetime.now() + timedelta(days=db_card.interval)
    db.commit()
    db.refresh(db_card)
    return db_card

