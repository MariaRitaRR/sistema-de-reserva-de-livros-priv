import React from "react";
import "./BookCard.css";
import { useReservations } from "../../contexts/ReservationContext";

export default function BookCard({ book }) {
  const { addReservation } = useReservations();

  const handleReserve = async () => { 
    const success = await addReservation(book); 
    
  
    if (success) {
      console.log(`"${book.title}" reservado com sucesso`);

    }
  };

  return (
    <div className="book-card">
      <div className="book-info">
        <div className="info-item">
          <span className="info-icon">▶</span>
          <span className="info-text">{book.title}</span>
        </div>
        <div className="info-item">
          <span className="info-icon">◎</span>
          <span className="info-text">{book.author}</span>
        </div>
        <div className="info-item">
          <span className="info-icon">◐</span>
          <span className="info-text">{book.genre}</span>
        </div>
      </div>
      
      <button className="reserve-button" onClick={handleReserve}>
        Reservar
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 4L10 8L6 12" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}