# 📊 Meeting Transcript Analysis App

A full-stack Next.js application that processes meeting transcripts and generates AI-powered insights such as action items, decisions, and sentiment analysis.

It stores previous transcripts, allows users to revisit results, and provides a clean UI for reviewing analysis outputs.


## 🚀 Features

- ✨ Paste meeting notes and analyse them instantly  
- 🧠 AI-generated:
  - Action items  
  - Decisions  
  - Overall meeting sentiment  
- 📁 Saves previous transcriptions in database
- 🔍 View full transcript + AI analysis for each saved entry
- 🧩 Clean React component structure
- 💾 Prisma + PostgreSQL backend
- ⏳ Skeleton loaders and polished UI
- 📱 Fully responsive



# 🗄️ Database Structure

The app uses **PostgreSQL** with Prisma.  

There are **two tables**:

## `Transcription`

Stores each uploaded meeting transcript.

| Field        | Type        | Description                              |
|--------------|-------------|------------------------------------------|
| `id`         | String (CUID) | Primary key                              |
| `text`       | String       | Raw meeting transcript                    |
| `createdAt`  | DateTime     | Timestamp                                 |
| `analysisId` | String (FK)  | Link to the analysis record               |

## `Analysis`

Stores the AI-generated results for a transcript.

| Field        | Type             | Description |
|--------------|------------------|-------------|
| `id`         | String (CUID)    | Primary key |
| `sentiment`  | String           | Positive / Negative / Neutral |
| `decisions`  | String[]         | List of decisions |
| `actionItems`| Json[]           | List of extracted action items |



# 🛠️ Setup & Installation

1. Clone the repo

2. Install dependecies

```
npm install
```

3. Configure environment variables (will send the values over email)

```
DATABASE_URL="...."
GEMINI_API_KEY="...."
```

4. Set up database
   
```
npx prisma migrate dev
```

5. Run the dev server

```
npm run dev
```

go to: http://localhost:3000

