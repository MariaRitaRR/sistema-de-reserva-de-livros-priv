import React from 'react';
import './BookingSuccess.css';
import { useNavigate } from 'react-router-dom';

export default function BookingSuccess() {
  const navigate = useNavigate();

  const handleReturnToLibrary = () => {
    navigate('/books');
  };

  const handleExit = () => {
    navigate('/');
  };

  return (
    <div className="booking-success-container">
      <header className="booking-success-header">
        <div className="booking-success-logo">
          bookle
        </div>

        <button 
          className="booking-success-exit-btn"
          onClick={handleExit}
        >
          <span className="arrow-icon">‹</span>
          Sair
        </button>
      </header>

      <h1 className="booking-success-title">
        Reserva concluída com sucesso!
      </h1>

      <div className="booking-success-card">
        <p className="booking-success-message">
          Obrigado por escolher
          <br />
          bookle! Volte sempre :)
        </p>

        <button 
          className="booking-success-return-btn"
          onClick={handleReturnToLibrary}
        >
          <span className="arrow-icon">‹</span>
          Retornar à biblioteca
        </button>
      </div>

      <img
        src="/image/estante-de-livros.png"
        alt="Estante de livros"
        className="booking-success-img-large"
      />

      <img
        src="/image/escada-com-livro.png"
        alt="Escada com livros"
        className="booking-success-img-small"
      />
    </div>
  );
}