"use client";

import Section from "@/components/Section";
import DetailTask from "@/components/DetailTask";
import Link from "next/link";
import { useState } from "react";
import CreateTask from "@/components/CreateTask";
import EditTask from "@/components/EditTask";

export default function Home() {
  const [showDetail, setShowDetail] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const onShowDetail = () => {
    setShowDetail(!showDetail);
  };

  const onShowCreate = () => {
    setShowCreate(!showCreate);
  };

  const onShowEdit = () => {
    setShowEdit(!showEdit);
    setShowDetail(false);
  };

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

      <main className="relative overflow-hidden -mx-4">
        <div className="mx-4">
          <div className="mt-8">
            <input
              type="text"
              name="search"
              id="search"
              placeholder="Pesquisar"
              className="bg-primary p-[10px] w-full ring-0 rounded-[8px] outline-0 outline-transparent focus:outline-green focus:outline-1 transition-all duration-300 bg-[url('/search.svg')] bg-no-repeat pl-[54px] bg-[position:10px_center]"
            />
          </div>

          <Section
            title="To-do"
            onShowDetail={onShowDetail}
            onShowCreate={onShowCreate}
          />

          <Section
            title="Doing"
            onShowDetail={onShowDetail}
            onShowCreate={onShowCreate}
          />

          <Section
            title="Done"
            onShowDetail={onShowDetail}
            onShowCreate={onShowCreate}
          />
        </div>

        {showDetail ||
          (showCreate && (
            <div className="fixed inset-0 bg-primary/50 z-10"></div>
          ))}

        <DetailTask
          isShowing={showDetail}
          onEdit={onShowEdit}
          onClose={() => setShowDetail(false)}
        />

        <CreateTask
          isShowing={showCreate}
          onClose={() => setShowCreate(false)}
        />

        <EditTask isShowing={showEdit} onClose={() => setShowEdit(false)} />
      </main>
    </div>
  );
}
