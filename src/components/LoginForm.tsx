"use client";

import Link from "next/link";
import Input from "./Input";

export default function LoginForm() {
  return (
    <form className="space-y-6">
      <Input
        type="email"
        label="E-mail"
        name="email"
        placeholder="Digite seu e-mail"
        required={true}
      />

      <Input
        type="password"
        label="Senha"
        name="password"
        placeholder="Digite sua senha"
        required={true}
      />

      <button
        type="submit"
        className="bg-green text-primary w-full py-[10px] rounded-full"
      >
        Entrar
      </button>

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
