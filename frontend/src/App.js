import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { ReservationProvider } from "./contexts/ReservationContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Books from "./pages/Books";
import Reservations from "./pages/Reservations";
import BookingSuccess from './pages/BookingSuccess';
import "./App.css";

function AppContent() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<Home navigate={navigate} />} />
      <Route path="/login" element={<Login navigate={navigate} />} />
      <Route path="/signup" element={<SignUp navigate={navigate} />} />
      <Route path="/books" element={<Books navigate={navigate} />} />
      <Route path="/reservations" element={<Reservations navigate={navigate} />} />
      <Route path="/booking-success" element={<BookingSuccess />} /> 
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <ReservationProvider>
        <AppContent />
      </ReservationProvider>
    </Router>
  );
}

export default App;