import { Metadata } from "next";
import { requireAuth } from "@/lib/auth";
import { CheatSheet } from "@/components/CheatSheet";

export const metadata: Metadata = {
  title: "Ściągawka - Egzamin Slopowy",
};

export default async function CheatSheetPage() {
  const user = await requireAuth();

  return (
    <div className="flex flex-col min-h-[100dvh] bg-black text-white pt-safe pb-safe pl-safe pr-safe">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-gray-800 bg-black/80 px-4 py-3 backdrop-blur-md sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-2">
            <a 
              href="/dashboard" 
              className="flex items-center gap-2 rounded-lg bg-gray-800/50 px-3 py-2 text-sm text-gray-300 transition hover:bg-gray-800 hover:text-white active:scale-95"
            >
              <span>←</span>
              <span className="hidden sm:inline">Powrót do Dashboard</span>
              <span className="sm:hidden">Wróć</span>
            </a>
            <p className="text-xs sm:text-sm text-gray-400 truncate">
              <span className="hidden sm:inline">Zalogowany: </span>
              <span className="font-semibold text-gray-200">{user.username}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Cheat Sheet */}
      <main className="flex-1 px-4 py-6 sm:px-6">
        <CheatSheet />
      </main>
    </div>
  );
}