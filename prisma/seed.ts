import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

interface QuestionData {
  id: number;
  question: string;
  answers: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correct: string;
  media?: {
    type: string;
    local_path: string;
  };
}

interface QuestionsFile {
  questions: QuestionData[];
}

async function main() {
  console.log("🌱 Starting database seed...");

  // Read pytania.json
  const pytaniaPath = path.join(__dirname, "..", "app", "pytania.json");
  const pytaniaContent = fs.readFileSync(pytaniaPath, "utf-8");
  const pytaniaData = JSON.parse(pytaniaContent) as QuestionsFile;

  console.log(`📚 Found ${pytaniaData.questions.length} questions`);

  // Clear existing questions (for idempotency)
  await prisma.progress.deleteMany({});
  await prisma.question.deleteMany({});

  // Insert questions
  for (const q of pytaniaData.questions) {
    let mediaUrl: string | null = null;
    
    if (q.media?.local_path) {
      // Extract filename from path (e.g., "media\\13.jpg" or "e14/13.jpg" -> "13.jpg")
      const filename = q.media.local_path.split(/[\\/]/).pop();
      mediaUrl = filename ? `/media/${filename}` : null;
    }
    
    await prisma.question.create({
      data: {
        id: q.id,
        questionText: q.question,
        optionA: q.answers.A,
        optionB: q.answers.B,
        optionC: q.answers.C,
        optionD: q.answers.D,
        correctAnswer: q.correct,
        mediaType: q.media?.type || null,
        mediaUrl,
      },
    });
  }

  console.log("✅ Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
