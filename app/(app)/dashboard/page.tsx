import { Metadata } from "next";
import { requireAuth, logout } from "@/lib/auth";
import { getUserStats } from "@/lib/progress";
import { Dashboard } from "@/components/Dashboard";

export const metadata: Metadata = {
  title: "Dashboard - Egzamin Slopowy",
};

export default async function DashboardPage() {
  const user = await requireAuth();
  const stats = await getUserStats();

  return (
    <div className="flex flex-col min-h-[100dvh] bg-black text-white pt-safe pb-safe pl-safe pr-safe">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-gray-800 bg-black/80 px-4 py-3 backdrop-blur-md sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Egzamin Slopowy</h1>
              <p className="text-xs sm:text-sm text-gray-400 truncate max-w-[200px] sm:max-w-none">
                Zalogowany: <span className="font-semibold text-gray-200">{user.username}</span>
              </p>
            </div>
            <form action={logout}>
              <button className="rounded-lg bg-gray-800/50 px-4 py-2 text-sm text-gray-300 transition hover:bg-gray-800 hover:text-white active:scale-95">
                Wyloguj
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 sm:px-6">
        <Dashboard stats={stats} />
      </main>
    </div>
  );
}