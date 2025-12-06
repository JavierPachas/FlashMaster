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
  const [csvFile, setCsvFile] = useState(null);
  const [isEditingDeck, setIsEditingDeck] = useState(false);
  const [editedDeckTitle, setEditedDeckTitle] = useState('');
  const [editedDeckDescription, setEditedDeckDescription] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeckAndCards = async () => {
      try {
        const deckResponse = await axios.get(`http://localhost:8000/decks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDeck(deckResponse.data);
        setEditedDeckTitle(deckResponse.data.title);
        setEditedDeckDescription(deckResponse.data.description);

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

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleUploadCsv = async (e) => {
    e.preventDefault();
    setError('');
    if (!csvFile) {
      setError('Please select a CSV file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      const response = await axios.post(
        `http://localhost:8000/decks/${id}/cards/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setCards([...cards, ...response.data]);
      setCsvFile(null);
      alert('Cards uploaded successfully!');
    } catch (err) {
      setError('Failed to upload CSV file.');
      console.error('Upload CSV error:', err);
      if (err.response && err.response.status === 401) {
        logout();
      }
    }
  };

  const handleUpdateDeck = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.put(
        `http://localhost:8000/decks/${id}`,
        { title: editedDeckTitle, description: editedDeckDescription },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDeck(response.data);
      setIsEditingDeck(false);
    } catch (err) {
      setError('Failed to update deck.');
      console.error('Update deck error:', err);
      if (err.response && err.response.status === 401) {
        logout();
      }
    }
  };

  if (loading) {
    return <div className="page-container">Loading deck...</div>;
  }

  if (!deck) {
    return <div className="page-container">Deck not found.</div>;
  }

  return (
    <div className="page-container deck-view">
      <header>
        {isEditingDeck ? (
          <form onSubmit={handleUpdateDeck} className="edit-deck-form">
            <div className="form-group">
              <label htmlFor="edit-deck-title">Title:</label>
              <input
                type="text"
                id="edit-deck-title"
                value={editedDeckTitle}
                onChange={(e) => setEditedDeckTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-deck-description">Description:</label>
              <textarea
                id="edit-deck-description"
                value={editedDeckDescription}
                onChange={(e) => setEditedDeckDescription(e.target.value)}
              ></textarea>
            </div>
            <button type="submit" className="button primary">Save Changes</button>
            <button type="button" onClick={() => setIsEditingDeck(false)} className="button secondary">Cancel</button>
          </form>
        ) : (
          <>
            <h1>{deck.title}</h1>
            <p>{deck.description}</p>
            <p className="deck-created-at">Created: {new Date(deck.created_at).toLocaleDateString()}</p>
            <button onClick={() => setIsEditingDeck(true)} className="button secondary">Edit Deck</button>
          </>
        )}
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
        <h2>Add New Card Manually</h2>
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

      <section className="upload-csv-section">
        <h2>Upload Cards from CSV</h2>
        <form onSubmit={handleUploadCsv}>
          <div className="form-group">
            <label htmlFor="csv-file">Select CSV File:</label>
            <input
              type="file"
              id="csv-file"
              accept=".csv"
              onChange={handleFileChange}
            />
          </div>
          <button type="submit" className="button primary" disabled={!csvFile}>Upload CSV</button>
        </form>
        <p>CSV file should have two columns: "front" and "back".</p>
      </section>
    </div>
  );
};

export default DeckView;
