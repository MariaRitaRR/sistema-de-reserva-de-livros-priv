import React, { useEffect } from "react";
import "./Reservations.css";
import Header from "../components/Header/Header";
import { useReservations } from "../contexts/ReservationContext";

export default function Reservations({ navigate }) {
    const { reservations, removeReservation, loading, refreshReservations } = useReservations();

    useEffect(() => {
        refreshReservations();
    }, [refreshReservations]); // ← CORREÇÃO AQUI

    const handleDelete = (id) => {
        if (window.confirm("Deseja cancelar esta reserva?")) {
            removeReservation(id);
        }
    };

    const handleFinalize = () => {
        if (reservations.length === 0) {
            alert("Não há reservas para finalizar!");
            return;
        }
        
        if (window.confirm(`Finalizar ${reservations.length} reserva(s)?`)) {
            alert("Reservas finalizadas com sucesso! Você pode retirar os livros na biblioteca.");
            navigate("/booking-success");
        }
    };

    if (loading) {
        return (
            <div className="reservations-page">
                <Header showBooksButton={true} navigate={navigate} />
                <div className="loading-message">
                    <p>Carregando suas reservas...</p>
                </div>
            </div>
        );
    }

    // Filtrar apenas reservas ativas para mostrar
    const activeReservations = reservations.filter(r => r.status === 'active');

    return (
        <div className="reservations-page">
            <Header showBooksButton={true} navigate={navigate} />

            <main className="reservations-content">
                <div className="reservations-left">
                    <h1 className="reservations-title">Você tem bom gosto!</h1>
                    <p className="reservations-subtitle">Algo mais por hoje?</p>
                </div>

                <div className="bookshelf-small">
                    <img src="/image/carrinho-de-livros.png" alt="Estante de livros" />
                </div>

                <div className="desk-illustration">
                    <img src="/image/mesa-de-livros.png" alt="Pessoa lendo na mesa" />
                </div>

                <div className="reservations-grid">
                    {activeReservations.length === 0 ? (
                        <div className="empty-message">
                            <p>Você ainda não tem reservas ativas.</p>
                            <button onClick={() => navigate("/books")} className="back-to-books-btn">
                                Ir para biblioteca
                            </button>
                        </div>
                    ) : (
                        <>
                            {Array.from({ length: Math.ceil(activeReservations.length / 2) }).map((_, rowIndex) => (
                                <div key={rowIndex} className="reservations-row">
                                    {activeReservations.slice(rowIndex * 2, rowIndex * 2 + 2).map((reservation) => (
                                        <div key={reservation.id} className="reservation-card">
                                            <div className="card-content">
                                                <img 
                                                    src={reservation.Book?.cover || "/image/livro-laranja.png"} 
                                                    alt={reservation.Book?.title} 
                                                    className="book-cover" 
                                                />
                                                <div className="card-info">
                                                    <h3 className="card-title">{reservation.Book?.title || 'Livro sem título'}</h3>
                                                    <p className="card-author">{reservation.Book?.author || 'Autor desconhecido'}</p>
                                                    <p className="card-genre">{reservation.Book?.genre || 'Gênero não especificado'}</p>
                                                    <p className="card-date">
                                                        Reservado em: {new Date(reservation.reservationDate).toLocaleDateString('pt-BR')}
                                                    </p>
                                                </div>
                                            </div>
                                            <button className="delete-button" onClick={() => handleDelete(reservation.id)}>
                                                Cancelar Reserva ⊗
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </>
                    )}
                </div>

                {activeReservations.length > 0 && (
                    <button className="finalize-button" onClick={handleFinalize}>
                        Finalizar Reserva
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 4L10 8L6 12" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                )}
            </main>
        </div>
    );
}