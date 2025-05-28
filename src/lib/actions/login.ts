"use server";

import { cookies } from "next/headers";

export async function loginUser(
  prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const response = await fetch(
      "https://0vlmk1an13.execute-api.us-east-1.amazonaws.com/dev/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          username: email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { error: "Invalid email or password" };
    }

    // Supondo que a API retorne um token no formato { token: "..." }
    const token = data.token;

    if (!token) {
      throw new Error("Token não recebido");
    }

    // Configura o cookie com o token recebido
    (await cookies()).set("token", token, {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24, // 1 dia
    });

    return { sucsess: true };
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return { error: "An error occurred while logging in. Please try again." };
  }
}
