"use server";

import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

const COOKIE_NAME = "user_id";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get(COOKIE_NAME)?.value;

  if (!userId) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });
    return user;
  } catch {
    return null;
  }
}

export async function login(username: string) {
  if (!username || username.trim().length === 0) {
    throw new Error("Username cannot be empty");
  }

  const trimmedUsername = username.trim();

  // Find or create user
  let user = await prisma.user.findUnique({
    where: { username: trimmedUsername },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        username: trimmedUsername,
      },
    });
  }

  // Set cookie
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, user.id.toString(), {
    maxAge: COOKIE_MAX_AGE,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return user;
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect("/login");
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}
