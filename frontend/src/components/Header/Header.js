import "./Header.css"

export default function Header({ showAuthButtons, showNavButtons, showBooksButton, showLogoutButton, navigate }) {
  
  const handleLogout = () => {
    // Remove token e dados do usuário
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Redireciona para home
    window.location.href = "/";
  };
  
  return (
    <header className="landing-header">
      <div className="header-content">
        <h1 className="bookle-logo">bookle</h1>

        {showNavButtons && (
          <nav className="nav-buttons">
            <button className="nav-button" onClick={() => navigate("/reservations")}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 12L6 8L10 4" stroke="#3b1424" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Minhas reservas
            </button>
            <button className="nav-button nav-button-logout" onClick={handleLogout}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 12L6 8L10 4" stroke="#3b1424" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Sair
            </button>
          </nav>
        )}

        {showBooksButton && (
          <nav className="nav-buttons">
            <button className="nav-button" onClick={() => navigate("/books")}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 12L6 8L10 4" stroke="#3b1424" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Biblioteca
            </button>
            <button className="nav-button nav-button-logout" onClick={handleLogout}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 12L6 8L10 4" stroke="#3b1424" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Sair
            </button>
          </nav>
        )}

        {showLogoutButton && (
          <nav className="nav-buttons">
            <button className="nav-button nav-button-logout" onClick={handleLogout}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 12L6 8L10 4" stroke="#3b1424" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Sair
            </button>
          </nav>
        )}

        {showAuthButtons && (
          <>
            <button onClick={() => navigate("/login")} className="header-btn login-btn">
              👤 Fazer login
            </button>

            <button onClick={() => navigate("/signup")} className="header-btn create-btn">
              ➕ Criar conta
            </button>
          </>
        )}
      </div>
    </header>
  )
}