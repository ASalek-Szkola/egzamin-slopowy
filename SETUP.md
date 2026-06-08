# Instrukcje Instalacji i Konfiguracji

## Wymagania

- Node.js 18.17+ lub wyżej
- npm, yarn, pnpm lub bun

## Instalacja Zależności

```bash
npm install
```

## Inicjalizacja Bazy Danych

### 1. Wygeneruj Prisma Client
```bash
npm run prisma:generate
```

### 2. Utwórz i zasilij bazę danych
```bash
npm run prisma:push
npm run seed
```

**Powyższe komendy:**
- `prisma:push` - Tworzy tabelę w SQLite (dev.db)
- `seed` - Wczytuje wszystkie pytania z `app/pytania.json` do bazy

## Dodawanie Mediów

Jeśli pytania zawierają odniesienia do obrazów/wideo:

1. Stwórz folder `public/media/` (jeśli nie istnieje)
2. Umieść pliki mediów tam (np. `public/media/13.jpg`)
3. Plik `prisma/seed.ts` automatycznie konwertuje ścieżki z `pytania.json`

Przykład struktury:
```
public/
  media/
    13.jpg
    14.jpg
    video1.mp4
```

## Uruchomienie Aplikacji

### Development Mode
```bash
npm run dev
```

Otwórz http://localhost:3000 w przeglądarce

### Production Build
```bash
npm run build
npm start
```

## Funkcjonalności

### 1. **Logowanie**
- Bez haseł, tylko nazwa użytkownika
- Ciasteczko sesyjne (user_id) przechowywane na 30 dni

### 2. **Dashboard**
- Widok statystyk (% przejrzanych pytań, % poprawnych odpowiedzi)
- Przyciski do uruchomienia trybów nauki

### 3. **Tryby Nauki**

#### Po Kolei
- Pytania posortowane po ID
- Pomija pytania już udzielone poprawnie
- URL: `/quiz?mode=sequential`

#### Losowo
- Losowe pytanie z priorytetem na niepoprawnie udzielone
- URL: `/quiz?mode=random`

#### Konkretne Pytanie
- Wpisz ID pytania (np. 13)
- URL: `/quiz?mode=jump&id=13`

#### Ściągawka
- Lista wszystkich pytań
- Rozwiń pytanie aby zobaczyć media i odpowiedzi
- Podświetlona poprawna odpowiedź
- Widok tylko do czytania
- URL: `/cheatsheet`

## Struktura Bazy Danych

### Tabela `users`
```
id         INT PRIMARY KEY
username   STRING UNIQUE
createdAt  DATETIME
```

### Tabela `questions`
```
id              INT PRIMARY KEY
questionText    STRING
optionA         STRING
optionB         STRING
optionC         STRING
optionD         STRING
correctAnswer   STRING (A, B, C, D)
mediaType       STRING (image, video, null)
mediaUrl        STRING (/media/13.jpg)
```

### Tabela `progress`
```
id              INT PRIMARY KEY
userId          INT FOREIGN KEY
questionId      INT FOREIGN KEY
selectedAnswer  STRING
isCorrect       BOOLEAN
answeredAt      DATETIME
UNIQUE(userId, questionId)
```

## Struktura Katalogów

```
.
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx
│   ├── (app)/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── quiz/
│   │   │   └── page.tsx
│   │   └── cheatsheet/
│   │       └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── pytania.json
├── components/
│   ├── LoginForm.tsx
│   ├── Dashboard.tsx
│   ├── QuizContainer.tsx
│   ├── QuestionCard.tsx
│   ├── CheatSheet.tsx
│   └── ProgressBar.tsx
├── lib/
│   ├── auth.ts
│   ├── questions.ts
│   └── progress.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   └── media/
│       └── (twoje media tutaj)
├── middleware.ts
├── .env.local
├── next.config.ts
└── package.json
```

## Rozwiązywanie Problemów

### Problem: "Brak bazy danych"
```bash
npm run prisma:push
```

### Problem: "Pytania nie są załadowane"
```bash
npm run seed
```

### Problem: "Zły typ pliku .db"
- Usuń `prisma/dev.db`
- Uruchom `npm run prisma:push`

### Problem: "Obrazy nie wyświetlają się"
- Sprawdź czy pliki są w `public/media/`
- Sprawdź czy ścieżka w `pytania.json` jest poprawna (np. `"local_path": "media/13.jpg"`)

## Notatki Techniczne

- **Framework:** Next.js 16 (App Router)
- **ORM:** Prisma v7
- **DB:** SQLite
- **Styling:** Tailwind CSS v4
- **Język:** TypeScript
- **Auth:** Server Actions + Cookies
- **Renderowanie:** Server + Client Components

## Plik pytania.json

Aplikacja automatycznie odczytuje z:
```json
{
  "questions": [
    {
      "id": 1,
      "question": "...",
      "answers": {
        "A": "...",
        "B": "...",
        "C": "...",
        "D": "..."
      },
      "correct": "C",
      "media": {
        "type": "image",
        "local_path": "media/13.jpg"
      }
    }
  ]
}
```

## Zaawansowane Komendy Prisma

```bash
# Otwórz Prisma Studio (GUI do edytowania bazy)
npx prisma studio

# Generuj Prisma Client
npm run prisma:generate

# Synchronizuj schemat z bazą
npm run prisma:push

# Reset bazy (usuwa wszystkie dane!)
npx prisma migrate reset
```

---

Powodzenia w nauce! 🚀
