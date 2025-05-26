"use client";

import Link from "next/link";
import Input from "./Input";
import SubmitButton from "./SubmitButton";

export default function SignUpForm() {
  return (
    <form className="space-y-6">
      {" "}
      <Input
        type="text"
        label="Nome"
        name="name"
        placeholder="Digite seu nome"
        required={true}
      />
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
      <SubmitButton title={"Criar conta"} />
      <p className="text-gray w-full text-sm text-center mt-28">
        Já possui uma conta?{" "}
        <Link href="/auth/login" className="text-green underline">
          {" "}
          Faça login agora
        </Link>
      </p>
    </form>
  );
}
