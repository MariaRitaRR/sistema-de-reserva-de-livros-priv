# 📚 Bookle - Sistema de Reserva de Livros

![Node.js](https://img.shields.io/badge/Node.js-18.x%20%7C%2020.x-green)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Tests](https://img.shields.io/badge/tests-passing-brightgreen)

Sistema completo de gerenciamento e reserva de livros desenvolvido com React e Node.js, incluindo autenticação JWT, persistência de dados e testes automatizados.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Instalação](#instalação)
- [Uso](#uso)
- [Testes](#testes)
- [API Documentation](#api-documentation)
- [CI/CD](#cicd)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

## 🎯 Sobre o Projeto

**Bookle** é uma plataforma moderna para gerenciamento de bibliotecas pessoais e reservas de livros. O sistema permite que usuários naveguem por um catálogo de livros, façam reservas, gerenciem suas leituras e acompanhem seu histórico.

### ✨ Destaques

- 🔐 **Autenticação JWT** completa e segura
- 💾 **Persistência de dados** com PostgreSQL/MySQL
- 🎨 **Interface responsiva** e moderna
- 🧪 **Cobertura de testes** unitários e de integração
- 🚀 **CI/CD automatizado** 
- 📊 **Relatórios detalhados** de testes

## 🚀 Funcionalidades

### Para Usuários

- ✅ Cadastro e login de usuários
- ✅ Navegação por catálogo de livros
- ✅ Sistema de reservas de livros
- ✅ Visualização de reservas ativas
- ✅ Finalização de reservas (marcar como concluído)
- ✅ Histórico de leituras
- ✅ Perfil de usuário

### Funcionalidades Técnicas

- ✅ Autenticação com JWT tokens
- ✅ Vinculação automática de reservas ao usuário logado
- ✅ Persistência de reservas após logout
- ✅ Validações de negócio (impede duplicatas)
- ✅ Relacionamentos de banco de dados (User → Reservation → Book)
- ✅ Isolamento de dados entre usuários
- ✅ Middleware de proteção de rotas

## 🛠️ Tecnologias

### Backend

- **Node.js** 18.x / 20.x
- **Express.js** - Framework web
- **Sequelize** - ORM para banco de dados
- **PostgreSQL/MySQL** - Banco de dados relacional
- **JWT** - Autenticação
- **Bcrypt** - Hash de senhas
- **Jest** - Testes unitários
- **Supertest** - Testes de API

### Frontend

- **React** 18.2.0
- **React Router** - Navegação SPA
- **Context API** - Gerenciamento de estado
- **Axios** - Cliente HTTP
- **CSS Modules** - Estilização

### DevOps

- **CI/CD**
- **Codecov** - Cobertura de código
- **ESLint** - Linting
- **Jest** - Testes automatizados

## 🏗️ Arquitetura

```
projectC14/
├── backend/
│   ├── config/          # Configurações (database, env)
│   ├── controllers/     # Lógica de negócio
│   ├── middlewares/     # Middlewares (auth, validação)
│   ├── models/          # Modelos Sequelize
│   ├── routes/          # Definição de rotas
│   ├── tests/           # Testes unitários
│   └── server.js        # Entry point
│
├── frontend/
│   ├── public/          # Arquivos estáticos
│   ├── src/
│   │   ├── components/  # Componentes reutilizáveis
│   │   ├── contexts/    # Context API (estado global)
│   │   ├── pages/       # Páginas da aplicação
│   │   └── App.js       # Componente principal
│   └── package.json
│
└── .github/
    └── workflows/       # CI/CD
```

### Fluxo de Dados

```
┌─────────────┐      ┌──────────────┐      ┌──────────────┐
│   Frontend  │─────▶│   Backend    │─────▶│   Database   │
│   (React)   │      │  (Express)   │      │  (Postgres)  │
└─────────────┘      └──────────────┘      └──────────────┘
      │                      │
      │                      │
      ▼                      ▼
  ReservationContext    JWT Middleware
  (Estado Global)       (Autenticação)
```

## 📦 Instalação

### Pré-requisitos

- Node.js 18.x ou 20.x
- PostgreSQL ou MySQL
- npm ou yarn

### 1. Clone o repositório

```bash
git clone https://github.com/C14-2025/sistema-de-reserva-de-livros.git
cd sistema-de-reserva-de-livros
```

### 2. Configure o Backend

```bash
cd backend
npm install
```

Crie um arquivo `.env`:

```env
PORT=3001
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=bookle_db
DB_DIALECT=postgres
JWT_SECRET=seu_secret_super_seguro
```

Execute as migrations:

```bash
npx sequelize-cli db:migrate
```

Popule o banco com dados iniciais (opcional):

```bash
npm run seed
```
Para que os livros apareçam automaticamente na biblioteca, execute o comando abaixo **no terminal local do computador**:

```bash
Invoke-RestMethod -Uri "http://localhost:5000/api/books/seed" -Method POST
```
>💡 Obs.: Caso você execute o seed mais de uma vez e acabe criando duplicatas, você pode limpar o banco de dados com:

```bash
Invoke-RestMethod -Uri "http://localhost:5000/api/books" -Method GET
```
E depois rode novamente o comando de seed.

Inicie o servidor:

```bash
npm start
```

O backend estará rodando em `http://localhost:3001`

### 3. Configure o Frontend

```bash
cd ../frontend
npm install
```

Crie um arquivo `.env`:

```env
REACT_APP_API_URL=http://localhost:3001
```

Inicie o frontend:

```bash
npm start
```

O frontend estará rodando em `http://localhost:3000`

## 💻 Uso

### 1. Cadastro de Usuário

Acesse `/signup` e crie uma conta com:
- Nome completo
- Email
- Senha (mínimo 6 caracteres)

### 2. Login

Entre com suas credenciais em `/login`

### 3. Navegar Livros

- Acesse `/books` para ver o catálogo
- Use filtros por gênero ou busca por título/autor

### 4. Fazer Reserva

- Clique em "Reservar" no card do livro desejado
- A reserva fica vinculada ao seu usuário

### 5. Gerenciar Reservas

- Acesse `/reservations` para ver suas reservas ativas
- Marque como concluído ou cancele reservas

## 🧪 Testes

### Backend

```bash
cd backend

# Rodar todos os testes
npm test

# Testes em modo watch
npm run test:watch

# Gerar relatório de cobertura
npm run test:coverage

# Rodar testes no CI
npm run test:ci
```

### Cobertura de Testes

O projeto possui **25+ testes** cobrindo:

| Categoria | Testes | Status |
|-----------|--------|--------|
| 🔐 Autenticação | 4 testes | ✅ |
| 📚 Reservas - GET | 4 testes | ✅ |
| 📚 Reservas - POST | 5 testes | ✅ |
| 📚 Reservas - DELETE | 3 testes | ✅ |
| 📚 Reservas - Finalize | 3 testes | ✅ |
| 💾 Persistência | 2 testes | ✅ |
| 🛡️ Autorização | 2 testes | ✅ |

### Frontend

```bash
cd frontend

# Rodar testes
npm test

# Verificar build de produção
npm run build
```

## 📡 API Documentation

### Autenticação

#### POST `/api/auth/register`
Registra um novo usuário.

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com"
  }
}
```

#### POST `/api/auth/login`
Faz login de usuário existente.

**Body:**
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

### Reservas (Autenticação Obrigatória)

#### GET `/api/reservations`
Lista reservas ativas do usuário logado.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": 1,
    "bookId": 5,
    "status": "active",
    "reservationDate": "2025-11-28T00:00:00.000Z",
    "book": {
      "id": 5,
      "title": "1984",
      "author": "George Orwell",
      "genre": "Ficção Científica",
      "cover": "/image/livro-laranja.png"
    }
  }
]
```

#### POST `/api/reservations`
Cria nova reserva de livro.

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "bookId": 5
}
```

#### DELETE `/api/reservations/:id`
Remove uma reserva.

**Headers:**
```
Authorization: Bearer {token}
```

#### POST `/api/reservations/finalize`
Finaliza todas as reservas ativas (marca como concluído).

**Headers:**
```
Authorization: Bearer {token}
```

### Livros

#### GET `/api/books`
Lista todos os livros disponíveis.

**Query Params:**
- `genre` (opcional) - Filtrar por gênero
- `search` (opcional) - Buscar por título/autor

## 🔄 CI/CD

O projeto possui pipeline automatizado que executa:

### Workflow de CI/CD

1. **Setup** - Instala dependências com cache
2. **Tests** - Executa testes em Node.js 18.x e 20.x
3. **Coverage** - Gera relatório de cobertura
4. **Audit** - Verifica vulnerabilidades
5. **Package** - Gera artefato para deploy
6. **Notify** - Envia email com status

### Visualizar Relatórios

1. Acesse **Actions** no GitHub
2. Selecione o workflow executado
3. Clique em **Summary** para ver relatório completo
4. Baixe artefatos em **Artifacts** (coverage report)

### Badges

Os badges no topo do README são atualizados automaticamente:
- ✅ Status dos testes
- 📊 Cobertura de código
- 🔢 Versão do Node.js

### Padrão de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `test:` Testes
- `refactor:` Refatoração de código
- `style:` Formatação
- `chore:` Tarefas diversas

### Code Review

Todos os PRs passam por:
- ✅ Code review
- ✅ Testes automatizados
- ✅ Verificação de cobertura
- ✅ Análise de código estático

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Equipe

Desenvolvido por   
| Nome | Curso / Turma |
|------|----------------|
| **Maria Rita Raposo Rosa** | GEC 2019, Turma B |
| **Lavinia Vitória Ribeiro Amaral** | GES 514, Turma A |
| **Julia Alves Alvarenga Pereira** | GEC 2036, Turma B |

---

