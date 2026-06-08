"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getNextUnansweredQuestion,
  getRandomQuestion,
  jumpToQuestion,
  getAllQuestions,
} from "@/lib/questions";
import { submitAnswer } from "@/lib/progress";
import { QuestionCard } from "./QuestionCard";
import { Prisma } from "@prisma/client";

interface QuizContainerProps {
  mode: string;
  jumpId?: string;
}

export function QuizContainer({ mode, jumpId }: QuizContainerProps) {
  const [question, setQuestion] = useState<
    Prisma.QuestionGetPayload<object> | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadQuestion();
  }, [mode, jumpId]);

  async function loadQuestion() {
    setIsLoading(true);
    setError(null);
    setAnswered(false);
    setSelectedAnswer(null);

    try {
      let nextQuestion;

      if (mode === "random") {
        nextQuestion = await getRandomQuestion();
      } else if (mode === "jump" && jumpId) {
        nextQuestion = await jumpToQuestion(parseInt(jumpId));
      } else {
        nextQuestion = await getNextUnansweredQuestion();
      }

      if (!nextQuestion) {
        setError(
          "Brak więcej pytań do przejścia! Wszystkie pytania zostały ukończone."
        );
        setQuestion(null);
      } else {
        setQuestion(nextQuestion);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd przy ładowaniu");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSelectAnswer(option: string) {
    if (answered || !question) return;

    setSelectedAnswer(option);
    setAnswered(true);

    try {
      const result = await submitAnswer(question.id, option);
      setIsCorrect(result.isCorrect);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd przy zapisie");
    }
  }

  if (error && !question) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="text-lg text-gray-400">{error}</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-6 rounded-lg bg-white px-6 py-3 font-medium text-black transition hover:bg-gray-200"
        >
          Powrót do Dashboard
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-gray-400">Ładowanie pytania...</div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="text-lg text-gray-400">Brak więcej pytań</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <QuestionCard
        question={question}
        onSelectAnswer={handleSelectAnswer}
        selectedAnswer={selectedAnswer}
        isCorrect={isCorrect}
        answered={answered}
      />

      {answered && (
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => {
              setSelectedAnswer(null);
              setAnswered(false);
            }}
            className="flex-1 rounded-lg border border-gray-700 py-3 font-medium transition hover:bg-gray-900"
          >
            Spróbuj ponownie
          </button>
          <button
            onClick={loadQuestion}
            className="flex-1 rounded-lg bg-white py-3 font-medium text-black transition hover:bg-gray-200"
          >
            Następne pytanie
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="flex-1 rounded-lg border border-gray-700 py-3 font-medium transition hover:bg-gray-900"
          >
            Powrót
          </button>
        </div>
      )}

      {selectedAnswer && !answered && (
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => setSelectedAnswer(null)}
            className="flex-1 rounded-lg bg-white py-3 font-medium text-black transition hover:bg-gray-200"
          >
            Spróbuj ponownie
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="flex-1 rounded-lg border border-gray-700 py-3 font-medium transition hover:bg-gray-900"
          >
            Powrót
          </button>
        </div>
      )}
    </div>
  );
}
