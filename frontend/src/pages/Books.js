import { useState, useEffect } from "react";
import "./Books.css";
import Header from "../components/Header/Header";
import BookCard from "../components/BookCard/BookCard";

export default function Books({ navigate }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      
      if (!token) {
        // REMOVA ESTA LINHA: setError("Usuário não autenticado");
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:5000/api/books", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const booksList = Array.isArray(data) ? data : (data.books || []);
      setBooks(booksList);
      
    } catch (error) {
      console.error("Erro ao buscar livros:", error);
      // REMOVA ESTA LINHA: setError("Erro ao carregar livros: " + error.message);
      setBooks([
        { id: 1, title: "Dom Casmurro", author: "Machado de Assis", genre: "Romance", cover: "/image/livro-azul.png" },
        { id: 2, title: "1984", author: "George Orwell", genre: "Ficção", cover: "/image/livro-laranja.png" },
        { id: 3, title: "O Hobbit", author: "J.R.R. Tolkien", genre: "Fantasia", cover: "/image/livro-vermelho.png" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="books-page">
      <Header showNavButtons={true} navigate={navigate} />

      <main className="books-content">
        <div className="books-left">
          <h1 className="books-title">O que vamos ler hoje?</h1>
          <p className="books-subtitle">Encontre o livro perfeito</p>

          <div className="books-list">
            {books.map((book) => (
              <BookCard key={book.id} book={book} onUpdateBooks={fetchBooks} />
            ))}
          </div>
        </div>

        <div className="books-right">
          <img src="/image/estante.svg" alt="Estante de livros" className="books-image" />
        </div>
      </main>
    </div>
  );
}