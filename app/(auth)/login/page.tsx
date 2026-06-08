import { Metadata } from "next";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Login - Egzamin Slopowy",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-black pt-safe pb-safe pl-safe pr-safe">
      <div className="w-full max-w-md px-4 sm:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white tracking-tight">Egzamin Slopowy</h1>
          <p className="mt-2 text-sm text-gray-400">
            Nauka do egzaminów zawodowych
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}