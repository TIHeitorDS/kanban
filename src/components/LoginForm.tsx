"use client";

export default function LoginForm() {
  return (
    <form className="space-y-6">
      <div className="gap-1">
        <label htmlFor="username">E-mail</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Digite seu e-mail"
          className="bg-primary p-[10px] w-full ring-0 rounded-[8px] outline-0 outline-transparent focus:outline-green focus:outline-1 transition-all duration-300"
          required
        />
      </div>

      <div className="gap-1">
        <label htmlFor="password">Senha</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Digite sua senha"
          className="bg-primary p-[10px] w-full ring-0 rounded-[8px] outline-0 outline-transparent focus:outline-green focus:outline-1 transition-all duration-300"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-green text-primary w-full py-[10px] rounded-full"
      >
        Login
      </button>

      <p className="text-gray w-full text-sm text-center mt-28">
        Não possui uma conta?{" "}
        <span className="text-green underline"> Cadastre-se agora</span>
      </p>
    </form>
  );
}
