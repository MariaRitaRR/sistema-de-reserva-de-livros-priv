import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const ReservationContext = createContext();

export const useReservations = () => {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error('useReservations must be used within ReservationProvider');
  }
  return context;
};

export const ReservationProvider = ({ children }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Função para obter o token do usuário logado
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // fetchReservations com useCallback
  const fetchReservations = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/reservations/my-reservations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setReservations(data);
      }
    } catch (error) {
      console.error('Erro ao buscar reservas:', error);
    } finally {
      setLoading(false);
    }
  }, []); // Dependências vazias porque getToken e setReservations não mudam

  // Carregar reservas do backend ao iniciar
  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]); // Agora fetchReservations está na lista de dependências

  const addReservation = async (book) => {
    try {
      const token = getToken();
      if (!token) {
        alert('Faça login para reservar livros');
        return false;
      }

      const response = await fetch('http://localhost:5000/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ bookId: book.id })
      });

      // IMPORTANTE: Ler a resposta SEMPRE
      const data = await response.json();

      // Verificar status DEPOIS de ler o JSON
      if (response.ok) {
        setReservations(prev => [...prev, data]);
        alert('Reserva criada com sucesso!');
        return true;
      } else {
        // Mostrar erro do backend
        alert(data.error || 'Erro ao criar reserva');
        return false;
      }
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      alert('Erro ao conectar com o servidor');
      return false;
    }
  };

  const removeReservation = async (reservationId) => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(`http://localhost:5000/api/reservations/${reservationId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setReservations(prev => prev.filter(r => r.id !== reservationId));
        alert('Reserva cancelada com sucesso!');
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao cancelar reserva');
      }
    } catch (error) {
      console.error('Erro ao cancelar reserva:', error);
    }
  };

  const clearReservations = () => {
    setReservations([]);
  };

  return (
    <ReservationContext.Provider value={{ 
      reservations, 
      addReservation, 
      removeReservation,
      clearReservations,
      loading,
      refreshReservations: fetchReservations
    }}>
      {children}
    </ReservationContext.Provider>
  );
};