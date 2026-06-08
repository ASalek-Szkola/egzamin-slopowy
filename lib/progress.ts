"use server";

import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "./auth";

const prisma = new PrismaClient();

export async function submitAnswer(questionId: number, selectedAnswer: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  const question = await prisma.question.findUnique({
    where: { id: questionId },
  });

  if (!question) {
    throw new Error("Question not found");
  }

  const isCorrect = selectedAnswer === question.correctAnswer;

  // Update or create progress record
  const progress = await prisma.progress.upsert({
    where: {
      userId_questionId: {
        userId: user.id,
        questionId: questionId,
      },
    },
    update: {
      selectedAnswer,
      isCorrect,
      answeredAt: new Date(),
    },
    create: {
      userId: user.id,
      questionId: questionId,
      selectedAnswer,
      isCorrect,
    },
  });

  return {
    isCorrect,
    correctAnswer: question.correctAnswer,
    progress,
  };
}

export async function getUserStats() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  const totalQuestions = await prisma.question.count();
  const answeredQuestions = await prisma.progress.findMany({
    where: { userId: user.id },
    select: { isCorrect: true, questionId: true },
    distinct: ["questionId"],
  });

  const correctAnswers = answeredQuestions.filter(
    (p) => p.isCorrect
  ).length;
  const answeredCount = answeredQuestions.length;

  return {
    totalQuestions,
    answeredCount,
    correctAnswers,
    percentageAnswered: Math.round((answeredCount / totalQuestions) * 100),
    percentageCorrect:
      answeredCount > 0 ? Math.round((correctAnswers / answeredCount) * 100) : 0,
  };
}

export async function getUserAnswers() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  return await prisma.progress.findMany({
    where: { userId: user.id },
    include: { question: true },
    orderBy: { answeredAt: "desc" },
  });
}

export async function getUserAnswer(questionId: number) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  return await prisma.progress.findUnique({
    where: {
      userId_questionId: {
        userId: user.id,
        questionId: questionId,
      },
    },
  });
}
