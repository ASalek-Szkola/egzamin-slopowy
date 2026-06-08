"use server";

import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "./auth";

const prisma = new PrismaClient();

export async function getAllQuestions() {
  return await prisma.question.findMany({
    orderBy: { id: "asc" },
  });
}

export async function getQuestionById(id: number) {
  return await prisma.question.findUnique({
    where: { id },
  });
}

export async function getNextUnansweredQuestion() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  // Get all questions
  const allQuestions = await prisma.question.findMany({
    orderBy: { id: "asc" },
  });

  // Get answered questions
  const answeredQuestions = await prisma.progress.findMany({
    where: {
      userId: user.id,
      isCorrect: true,
    },
    select: { questionId: true },
  });

  const answeredIds = new Set(answeredQuestions.map((p) => p.questionId));

  // Return first unanswered question
  const nextQuestion = allQuestions.find((q) => !answeredIds.has(q.id));
  return nextQuestion || null;
}

export async function getRandomQuestion() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  // Get answered questions
  const answeredQuestions = await prisma.progress.findMany({
    where: {
      userId: user.id,
      isCorrect: true,
    },
    select: { questionId: true },
  });

  const answeredIds = new Set(answeredQuestions.map((p) => p.questionId));

  // Get all questions
  const allQuestions = await prisma.question.findMany();

  // Filter unanswered or incorrectly answered
  const availableQuestions = allQuestions.filter(
    (q) => !answeredIds.has(q.id)
  );

  if (availableQuestions.length === 0) {
    return null;
  }

  // Return random question
  const randomIndex = Math.floor(Math.random() * availableQuestions.length);
  return availableQuestions[randomIndex];
}

export async function jumpToQuestion(id: number) {
  const question = await prisma.question.findUnique({
    where: { id },
  });

  if (!question) {
    throw new Error("Question not found");
  }

  return question;
}
