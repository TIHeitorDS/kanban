"use client";

import Link from "next/link";
import Input from "./Input";
import SubmitButton from "./SubmitButton";
import { loginUser } from "@/lib/actions/login";
import { useActionState, useEffect, useState } from "react";
import { redirect } from "next/navigation";

export default function LoginForm() {
  const [state, formAction] = useActionState(loginUser, undefined);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (state?.sucsess) {
      redirect("/");
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-6 lg:w-1/2 lg:mx-auto">
      <Input
        type="email"
        label="E-mail"
        name="email"
        placeholder="Digite seu e-mail"
        required={true}
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />

      <Input
        type="password"
        label="Senha"
        name="password"
        placeholder="Digite sua senha"
        required={true}
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />

      <SubmitButton title="Entrar" />

      {state?.error && (
        <p className="text-red-500 text-sm text-center">{state.error}</p>
      )}

      <p className="text-gray w-full text-sm text-center mt-28">
        Não possui uma conta?{" "}
        <Link href={"/auth/signup"} className="text-green underline">
          {" "}
          Cadastre-se agora
        </Link>
      </p>
    </form>
  );
}
