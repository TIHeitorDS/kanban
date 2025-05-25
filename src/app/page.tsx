import Section from "@/components/Section";
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

      <main>
        <div className="mt-8">
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Pesquisar"
            className="bg-primary p-[10px] w-full ring-0 rounded-[8px] outline-0 outline-transparent focus:outline-green focus:outline-1 transition-all duration-300 bg-[url('/search.svg')] bg-no-repeat pl-[54px] bg-[position:10px_center]"
          />
        </div>

        <Section title="To-do" />

        <Section title="Doing" />

        <Section title="Done" />
      </main>
    </div>
  );
}
