"use client";

import Image from "next/image";
import { Prisma } from "@prisma/client";

interface QuestionCardProps {
  question: Prisma.QuestionGetPayload<object>;
  onSelectAnswer: (option: string) => void;
  selectedAnswer: string | null;
  isCorrect: boolean;
  answered: boolean;
}

export function QuestionCard({
  question,
  onSelectAnswer,
  selectedAnswer,
  isCorrect,
  answered,
}: QuestionCardProps) {
  const answers = {
    A: question.optionA,
    B: question.optionB,
    C: question.optionC,
    D: question.optionD,
  } as const;

  const getButtonClass = (option: string) => {
    const baseClass =
      "w-full p-4 rounded-lg border transition text-left font-medium";
    const defaultClass =
      "border-gray-700 bg-gray-900 hover:border-gray-600 cursor-pointer";
    const disabledClass = answered ? "cursor-not-allowed" : "";

    if (selectedAnswer === null) {
      return `${baseClass} ${defaultClass}`;
    }

    if (selectedAnswer === option) {
      if (isCorrect) {
        return `${baseClass} border-green-500 bg-green-900/20 shadow-lg shadow-green-500/50 ${disabledClass}`;
      } else {
        return `${baseClass} border-red-500 bg-red-900/20 shadow-lg shadow-red-500/50`;
      }
    }

    if (answered) {
      return `${baseClass} border-gray-700 bg-gray-900 opacity-50 ${disabledClass}`;
    }

    return `${baseClass} ${defaultClass}`;
  };

  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-8">
      {/* Question Number */}
      <div className="mb-4 text-sm text-gray-400">
        Pytanie {question.id}
      </div>

      {/* Question Text */}
      <h2 className="mb-8 text-2xl font-bold leading-tight">
        {question.questionText}
      </h2>

      {/* Media */}
      {question.mediaUrl && question.mediaType === "image" && (
        <div className="mb-8 flex justify-center">
          <div className="relative h-64 w-full max-w-md">
            <Image
              src={question.mediaUrl}
              alt="Question media"
              fill
              className="rounded-lg object-contain"
              sizes="(max-width: 768px) 100vw, 448px"
            />
          </div>
        </div>
      )}

      {question.mediaUrl && question.mediaType === "video" && (
        <div className="mb-8 flex justify-center">
          <video
            src={question.mediaUrl}
            controls
            className="max-h-64 max-w-full rounded-lg"
          />
        </div>
      )}

      {/* Answer Options */}
      <div className="space-y-3">
        {(["A", "B", "C", "D"] as const).map((option) => (
          <button
            key={option}
            onClick={() => !answered && onSelectAnswer(option)}
            disabled={answered}
            className={getButtonClass(option)}
          >
            <span className="mr-3 font-bold text-gray-400">{option}.</span>
            <span>{answers[option]}</span>
          </button>
        ))}
      </div>

    </div>
  );
}
