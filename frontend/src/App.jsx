import { Routes, Route } from 'react-router-dom'
import './App.css'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Dashboard from './pages/Dashboard'
import CreateDeck from './pages/CreateDeck'
import DeckView from './pages/DeckView'
import StudyMode from './pages/StudyMode'
import NotFound from './pages/NotFound'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-deck"
          element={
            <PrivateRoute>
              <CreateDeck />
            </PrivateRoute>
          }
        />
        <Route
          path="/deck/:id"
          element={
            <PrivateRoute>
              <DeckView />
            </PrivateRoute>
          }
        />
        <Route
          path="/deck/:id/study"
          element={
            <PrivateRoute>
              <StudyMode />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
