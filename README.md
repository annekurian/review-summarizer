# 🎢 AI-Powered Product Review Summarizer

A full-stack TypeScript monorepo built with **Bun** :

1. **Review Summarizer** — automatically generates concise summaries of customer reviews for 5 electronics products using AI

> Built as a prototype project based on the _"Build AI-powered Apps"_ course by Mosh Hamedani.

---

## ✨ Features

- **Persistent MySQL backend** — product reviews and AI-generated summaries are stored in a MySQL database, not hardcoded in memory
- **Prisma ORM** — all database access goes through a typed Prisma client with a repository pattern, keeping data logic cleanly separated from route handlers
- **Cached summaries** — once a product's reviews are summarized, the result is persisted to the database; subsequent requests return the stored summary instead of calling the LLM again
- Covers 5 seeded electronics products with realistic review data

---

## 🏗️ Architecture

```
ChatBot-and-Review-Summarizer/
├── index.ts                        # Entry point — runs client & server concurrently
├── package.json                    # Root workspace config (Bun monorepo)
├── packages/
│   ├── client/                     # Frontend (TypeScript + CSS + HTML)
│   │   └── src/
|   |      |___components/
│   │             └── reviews/      # Review picker UI + summary display
│   └── server/                     # Backend API (TypeScript + Bun)
│       ├── controllers/            # Gateway - handle HTTP requests and responses
│       ├── services/               # Calls OpenAI model to generate response
│       ├── repositories/           # Fetches or stores data
│       └── prisma/
│       |   └── schema.prisma       # DB schema: Product, Review, Summary models
|       └── routes.ts               # API Endpoints
├── .husky/                         # Pre-commit hooks
└── .prettierrc                     # Code formatting config
```

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.com) v1.3.6 or later
- An OpenAI (or compatible) API key

### Installation

```bash
git clone https://github.com/annekurian/review-summarizer.git
cd review-summarizer
bun install
```

### Environment Variables

Create a `.env` file in `packages/server/` with variables mentioned in `.env.example`

### Running

```bash
bun run dev
```

This starts both the client and server concurrently via `concurrently`.

| Service | URL                   |
| ------- | --------------------- |
| Client  | http://localhost:5173 |
| Server  | http://localhost:3000 |

---

## 🛠️ Tech Stack

| Layer       | Technology                   |
| ----------- | ---------------------------- |
| Runtime     | [Bun](https://bun.com)       |
| Language    | TypeScript                   |
| Frontend    | React + Tailwind CSS         |
| Backend     | Express.js                   |
| HTTP Client | Axios                        |
| AI          | OpenAI API (GPT)             |
| Database    | MySQL                        |
| ORM         | Prisma                       |
| Dev tooling | Husky, lint-staged, Prettier |

---

## 🗺️ User Flow

```
[User selects a product from dropdown]
      ↓
[Client sends product reviews to /api/summarize]
      ↓
[Server prompts LLM: "Summarize these reviews..."]
      ↓
[LLM returns: pros / cons / overall verdict]
      ↓
[Summary card displayed to user]
```

---

## 🙏 Credits

Based on the _"Build AI-powered Apps"_ course by [Mosh Hamedani](https://codewithmosh.com).
