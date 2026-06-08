"use client";

import Link from "next/link";
import { ProgressBar } from "./ProgressBar";

interface DashboardProps {
  stats: {
    totalQuestions: number;
    answeredCount: number;
    correctAnswers: number;
    percentageAnswered: number;
    percentageCorrect: number;
  };
}

export function Dashboard({ stats }: DashboardProps) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {/* Stats Section */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Twoje statystyki</h2>

        <div className="space-y-6">
          {/* Answered Questions */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-gray-400">Pytania przejrzane</span>
              <span className="font-semibold">
                {stats.answeredCount} / {stats.totalQuestions}
              </span>
            </div>
            <ProgressBar value={stats.percentageAnswered} />
          </div>

          {/* Correct Answers */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-gray-400">Poprawne odpowiedzi</span>
              <span className="font-semibold">
                {stats.correctAnswers} / {stats.answeredCount}
              </span>
            </div>
            <ProgressBar
              value={stats.percentageCorrect}
              className="bg-green-900/30"
            />
          </div>
        </div>
      </div>

      {/* Study Modes */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Tryby nauki</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Sequential Mode */}
          <Link
            href="/quiz?mode=sequential"
            className="group rounded-lg border border-gray-800 bg-gray-900/50 p-6 transition hover:border-gray-700 hover:bg-gray-900"
          >
            <div className="mb-2 text-lg font-semibold">Po kolei</div>
            <p className="text-sm text-gray-400 group-hover:text-gray-300">
              Pytania posortowane po ID. Pomijamy te już poprawnie udzielone.
            </p>
          </Link>

          {/* Random Mode */}
          <Link
            href="/quiz?mode=random"
            className="group rounded-lg border border-gray-800 bg-gray-900/50 p-6 transition hover:border-gray-700 hover:bg-gray-900"
          >
            <div className="mb-2 text-lg font-semibold">Losowo</div>
            <p className="text-sm text-gray-400 group-hover:text-gray-300">
              Losowe pytania z priorytetem na niepoprawnie udzielone.
            </p>
          </Link>

          {/* Cheat Sheet */}
          <Link
            href="/cheatsheet"
            className="group rounded-lg border border-gray-800 bg-gray-900/50 p-6 transition hover:border-gray-700 hover:bg-gray-900"
          >
            <div className="mb-2 text-lg font-semibold">Ściągawka</div>
            <p className="text-sm text-gray-400 group-hover:text-gray-300">
              Lista wszystkich pytań z podświetloną poprawną odpowiedzią.
            </p>
          </Link>

          {/* Jump to Question */}
          <JumpToQuestion />
        </div>
      </div>
    </div>
  );
}

function JumpToQuestion() {
  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-6">
      <div className="mb-4">
        <div className="text-lg font-semibold">Konkretne pytanie</div>
        <p className="text-sm text-gray-400">Wpisz numer ID pytania</p>
      </div>
      <JumpForm />
    </div>
  );
}

function JumpForm() {
  const [id, setId] = useState("");
  const router = require("next/navigation").useRouter();

  function handleJump() {
    if (id.trim()) {
      router.push(`/quiz?mode=jump&id=${id}`);
    }
  }

  return (
    <div className="flex gap-2">
      <input
        type="number"
        value={id}
        onChange={(e) => setId(e.target.value)}
        placeholder="Nr pytania"
        className="flex-1 rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 transition focus:border-gray-600 focus:outline-none"
        onKeyDown={(e) => e.key === "Enter" && handleJump()}
      />
      <button
        onClick={handleJump}
        className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium transition hover:bg-gray-700"
      >
        Skocz
      </button>
    </div>
  );
}

function useState(initialValue: string) {
  return require("react").useState(initialValue);
}
