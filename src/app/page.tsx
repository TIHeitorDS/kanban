import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full px-4 h-svh bg-secondary divide-y-2 divide-white">
      <header className="flex py-[10px]">
        <Link
          href="/auth/login"
          className="bg-red rounded-[12px] p-2 w-fit flex items-center"
        >
          <img src="/exit.svg" alt="" />
        </Link>

        <p className="text-2xl font-bold grow text-center">
          Tarefas de leninha
        </p>
      </header>

      <p></p>
    </div>
  );
}
