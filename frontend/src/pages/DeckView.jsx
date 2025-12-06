import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const DeckView = () => {
  const { id } = useParams();
  const { token, logout } = useAuth();
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newCardFront, setNewCardFront] = useState('');
  const [newCardBack, setNewCardBack] = useState('');
  const [editingCard, setEditingCard] = useState(null); // Stores the card being edited
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeckAndCards = async () => {
      try {
        const deckResponse = await axios.get(`http://localhost:8000/decks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDeck(deckResponse.data);

        const cardsResponse = await axios.get(`http://localhost:8000/decks/${id}/cards/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCards(cardsResponse.data);
      } catch (err) {
        setError('Failed to fetch deck or cards.');
        console.error('Fetch error:', err);
        if (err.response && err.response.status === 401) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    if (token && id) {
      fetchDeckAndCards();
    }
  }, [token, id, logout]);

  const handleAddCard = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(
        `http://localhost:8000/decks/${id}/cards/`,
        { front: newCardFront, back: newCardBack },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCards([...cards, response.data]);
      setNewCardFront('');
      setNewCardBack('');
    } catch (err) {
      setError('Failed to add card.');
      console.error('Add card error:', err);
      if (err.response && err.response.status === 401) {
        logout();
      }
    }
  };

  const handleEditCard = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.put(
        `http://localhost:8000/cards/${editingCard.id}`,
        { front: editingCard.front, back: editingCard.back },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCards(cards.map((card) => (card.id === editingCard.id ? response.data : card)));
      setEditingCard(null);
    } catch (err) {
      setError('Failed to update card.');
      console.error('Update card error:', err);
      if (err.response && err.response.status === 401) {
        logout();
      }
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      await axios.delete(`http://localhost:8000/cards/${cardId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCards(cards.filter((card) => card.id !== cardId));
    } catch (err) {
      setError('Failed to delete card.');
      console.error('Delete card error:', err);
      if (err.response && err.response.status === 401) {
        logout();
      }
    }
  };

  if (loading) {
    return <div>Loading deck...</div>;
  }

  if (!deck) {
    return <div>Deck not found.</div>;
  }

  return (
    <div className="deck-view">
      <header>
        <h1>{deck.title}</h1>
        <p>{deck.description}</p>
        <Link to="/dashboard" className="button secondary">Back to Dashboard</Link>
        <Link to={`/deck/${deck.id}/study`} className="button primary">Start Study</Link>
      </header>

      <section className="card-list">
        <h2>Cards</h2>
        {error && <p className="error-message">{error}</p>}
        {cards.length === 0 ? (
          <p>No cards in this deck yet.</p>
        ) : (
          <div className="cards-grid">
            {cards.map((card) => (
              <div key={card.id} className="card-item">
                {editingCard && editingCard.id === card.id ? (
                  <form onSubmit={handleEditCard}>
                    <input
                      type="text"
                      value={editingCard.front}
                      onChange={(e) => setEditingCard({ ...editingCard, front: e.target.value })}
                      required
                    />
                    <textarea
                      value={editingCard.back}
                      onChange={(e) => setEditingCard({ ...editingCard, back: e.target.value })}
                      required
                    ></textarea>
                    <button type="submit" className="button primary">Save</button>
                    <button type="button" onClick={() => setEditingCard(null)} className="button secondary">Cancel</button>
                  </form>
                ) : (
                  <>
                    <p><strong>Front:</strong> {card.front}</p>
                    <p><strong>Back:</strong> {card.back}</p>
                    <div className="card-actions">
                      <button onClick={() => setEditingCard(card)} className="button secondary">Edit</button>
                      <button onClick={() => handleDeleteCard(card.id)} className="button danger">Delete</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="add-card-form">
        <h2>Add New Card</h2>
        <form onSubmit={handleAddCard}>
          <div className="form-group">
            <label htmlFor="new-card-front">Front:</label>
            <input
              type="text"
              id="new-card-front"
              value={newCardFront}
              onChange={(e) => setNewCardFront(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="new-card-back">Back:</label>
            <textarea
              id="new-card-back"
              value={newCardBack}
              onChange={(e) => setNewCardBack(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit" className="button primary">Add Card</button>
        </form>
      </section>
    </div>
  );
};

export default DeckView;
