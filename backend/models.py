from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, ForeignKey, UUID, text
from sqlalchemy.orm import relationship
from database import Base
import uuid

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))

    decks = relationship("Deck", back_populates="owner")

class Deck(Base):
    __tablename__ = "decks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    title = Column(String, index=True)
    description = Column(Text)
    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP")) # Add created_at here

    owner = relationship("User", back_populates="decks")
    cards = relationship("Card", back_populates="deck")

class Card(Base):
    __tablename__ = "cards"

    id = Column(Integer, primary_key=True, index=True)
    deck_id = Column(Integer, ForeignKey("decks.id"))
    front = Column(Text)
    back = Column(Text)
    next_review = Column(TIMESTAMP)
    interval = Column(Integer)

    deck = relationship("Deck", back_populates="cards")
