"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login(username);
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Błąd podczas logowania"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="username" className="block text-sm text-gray-300">
          Nazwa użytkownika
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Podaj swoją nazwę"
          className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white placeholder-gray-500 transition focus:border-white focus:outline-none"
          disabled={isLoading}
          autoFocus
        />
      </div>

      {error && (
        <div className="rounded-lg bg-red-900/20 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || !username.trim()}
        className="w-full rounded-lg bg-white py-3 font-medium text-black transition hover:bg-gray-200 disabled:opacity-50"
      >
        {isLoading ? "Logowanie..." : "Wejdź"}
      </button>
    </form>
  );
}
