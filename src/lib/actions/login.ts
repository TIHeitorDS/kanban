"use server";

import { cookies } from "next/headers";

export async function loginUser(
  prevState: { error?: string } | undefined,
  formData: FormData
) {
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    const res = await fetch(
      "https://0vlmk1an13.execute-api.us-east-1.amazonaws.com/dev/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );
    
    const { token } = await res.json();

    if (!res.ok) {
      return { error: "Invalid email or password" };
    }

    (await cookies()).set("token", token, {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "An error occurred while logging in. Please try again." };
  }
}
