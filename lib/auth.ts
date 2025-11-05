import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";

export interface User {
  userId: string;
  email: string;
  name: string;
}

export async function getUser(): Promise<User | null> {
  try {
    let user = {
      id: "1",
      name: "Demo User",
      email: "demo@example.com",
      password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    };
    return user;
  } catch {
    return null;
  }
}

export async function requireAuth(): Promise<User> {
  const user = await getUser();
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}
