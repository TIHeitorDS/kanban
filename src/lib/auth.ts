import { cookies } from "next/headers";
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET!;

export async function getUserFromCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return payload as { id: string; name: string; email: string };
  } catch {
    return null;
  }
}
