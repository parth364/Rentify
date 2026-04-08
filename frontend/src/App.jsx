import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ItemDetails from './pages/ItemDetails';
import CreateItem from './pages/CreateItem';
import RentalRequests from './pages/RentalRequests';
import Chat from './pages/Chat';
import Profile from './pages/Profile';

/**
 * Root App component — sets up routing and auth context.
 */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/items/:id" element={<ItemDetails />} />

          {/* Protected routes */}
          <Route path="/items/new" element={<ProtectedRoute><CreateItem /></ProtectedRoute>} />
          <Route path="/rentals" element={<ProtectedRoute><RentalRequests /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
