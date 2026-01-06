# Monera Trading App

Dieses Projekt ist eine **Paper-Trading-Applikation**, die im Rahmen einer Abschlussarbeit entwickelt wird.

---

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- PostgreSQL (Docker)
- Prisma ORM (v7)
- ESLint & Prettier

---

## Voraussetzungen

Folgende Tools müssen installiert sein:

- Node.js (>= 18)
- Docker & Docker Compose
- npm

---

## Lokales Setup

### 1. Repository klonen
```bash
git clone git@github.com:Ch0mpCh0mp/monera-trading-app.git
cd monera-trading-app
```

### 2. Dependencies Installieren
```bash
npm install
```

### 3. Umgebungs Variable
```bash
cp .env.example .env.local
```

### 4. Database starten
```bash
docker compose up -d
```

### 5. Database migrations laufen lassen
```bash
npx prisma migrate dev
```

### 6. Server starten
```bash
npm run dev
```

## Nützliche Commands 

# Start database 
docker compose up -d 

# Stop database 
docker compose down 

# Öffne Prisma Studio 
npx prisma studio