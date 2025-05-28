"use client";

import Link from "next/link";
import Input from "./Input";
import SubmitButton from "./SubmitButton";
import { useState } from "react";

export default function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form className="space-y-6 lg:w-1/2 lg:mx-auto">
      {" "}
      <Input
        type="text"
        label="Nome"
        name="name"
        placeholder="Digite seu nome"
        required={true}
        onChange={(e) => setName(e.target.value)}
        value={name}
      />
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
