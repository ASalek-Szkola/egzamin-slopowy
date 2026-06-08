"use client";

import { useEffect, useState } from "react";
import { getAllQuestions } from "@/lib/questions";
import { getUserAnswer } from "@/lib/progress";
import { Prisma } from "@prisma/client";
import Image from "next/image";

export function CheatSheet() {
  const [questions, setQuestions] = useState<
    Prisma.QuestionGetPayload<object>[]
  >([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadQuestions() {
      try {
        const allQuestions = await getAllQuestions();
        setQuestions(allQuestions);
      } catch (err) {
        console.error("Error loading questions:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadQuestions();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-gray-400">Ładowanie pytań...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h2 className="mb-8 text-2xl font-bold">Wszystkie pytania</h2>

      <div className="space-y-3">
        {questions.map((q) => (
          <CheatSheetItem
            key={q.id}
            question={q}
            isExpanded={expanded === q.id}
            onToggle={() =>
              setExpanded(expanded === q.id ? null : q.id)
            }
          />
        ))}
      </div>
    </div>
  );
}

interface CheatSheetItemProps {
  question: Prisma.QuestionGetPayload<object>;
  isExpanded: boolean;
  onToggle: () => void;
}

function CheatSheetItem({
  question,
  isExpanded,
  onToggle,
}: CheatSheetItemProps) {
  const [userAnswer, setUserAnswer] = useState<
    Prisma.ProgressGetPayload<object> | null
  >(null);

  useEffect(() => {
    if (isExpanded) {
      getUserAnswer(question.id).then(setUserAnswer).catch(() => {});
    }
  }, [isExpanded, question.id]);

  const answers = {
    A: question.optionA,
    B: question.optionB,
    C: question.optionC,
    D: question.optionD,
  } as const;

  return (
    <button
      onClick={onToggle}
      className="w-full text-left"
    >
      <div className="rounded-lg border border-gray-800 bg-gray-900/50 px-6 py-4 transition hover:border-gray-700">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm text-gray-400">Pytanie {question.id}</div>
            <p className="font-medium">{question.questionText}</p>
          </div>
          <div className="ml-4 text-gray-400">
            {isExpanded ? "−" : "+"}
          </div>
        </div>

        {isExpanded && (
          <div className="mt-6 space-y-4 border-t border-gray-800 pt-6">
            {/* Media */}
            {question.mediaUrl && question.mediaType === "image" && (
              <div className="flex justify-center">
                <div className="relative h-48 w-full max-w-sm">
                  <Image
                    src={question.mediaUrl}
                    alt="Question media"
                    fill
                    className="rounded-lg object-contain"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>
              </div>
            )}

            {/* Answers */}
            <div className="space-y-2">
              {(["A", "B", "C", "D"] as const).map((option) => (
                <div
                  key={option}
                  className={`rounded-lg p-3 text-sm ${
                    option === question.correctAnswer
                      ? "border border-green-700 bg-green-900/20 font-medium text-green-300"
                      : "border border-gray-700 bg-gray-900/50"
                  }`}
                >
                  <span className="font-bold text-gray-400">{option}.</span>{" "}
                  <span>{answers[option]}</span>
                  {option === question.correctAnswer && (
                    <span className="ml-2">✓ Poprawna</span>
                  )}
                </div>
              ))}
            </div>

            {/* User Answer History */}
            {userAnswer && (
              <div className="border-t border-gray-800 pt-4 text-xs text-gray-400">
                Twoja odpowiedź:{" "}
                <span className={userAnswer.isCorrect ? "text-green-400" : "text-red-400"}>
                  {userAnswer.selectedAnswer}
                  {userAnswer.isCorrect ? " ✓" : " ✗"}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </button>
  );
}
