import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import NotesPage from './pages/NotesPage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/notes" element={<NotesPage />} />
    </Routes>
  );
}

export default App;