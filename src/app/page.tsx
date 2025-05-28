"use client";

import Section from "@/components/Section";
import DetailTask from "@/components/DetailTask";
import Link from "next/link";
import { useEffect, useState } from "react";
import CreateTask from "@/components/CreateTask";
import EditTask from "@/components/EditTask";
import TaskCard from "@/components/TaskCard";
import { Task } from "@/utils/definitions";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

const columns = [
  {
    id: "todos",
    title: "To-do",
  },
  {
    id: "doing",
    title: "Doing",
  },
  {
    id: "done",
    title: "Done",
  },
];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showDetail, setShowDetail] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const onShowCreate = () => {
    setShowCreate(!showCreate);
  };

  useEffect(() => {
    async function fetchTasks() {
      try {
        const res = await fetch(
          "https://2mqnmicei7.execute-api.us-east-1.amazonaws.com/dev/tasks/",
          {
            method: "GET",
            headers: {
              "x-user-id": "admin-test-999",
              "x-user-role": "admins",
              "Content-Type": "application/json",
            },
          }
        );
        if (!res.ok) throw new Error("Erro ao buscar tarefas");
        const data = await res.json();

        // Transforma os dados recebidos para o formato esperado pelo DnD
        const normalized = data.map((task: any) => ({
          ...task,
          id: String(task.taskId), // converte para `id` esperado
        }));

        setTasks(normalized);
      } catch (err) {
        console.error("Erro ao carregar tasks:", err);
      }
    }

    fetchTasks();
  }, []);

  const onShowEdit = () => {
    setShowEdit(!showEdit);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as Task["status"];

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: newStatus,
            }
          : task
      )
    );
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // só ativa o drag se mover mais de 8px
      },
    })
  );

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

          <div className="flex flex-col lg:flex-row lg:gap-4">
            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
              {columns.map((column) => (
                <Section
                  key={column.id}
                  title={column.title}
                  id={column.id}
                  onShowCreate={onShowCreate}
                >
                  {tasks
                    .filter((task) => task.status === column.id)
                    .map((task) => (
                      <TaskCard
                        key={task.id}
                        id={String(task.id)}
                        title={task.title}
                        createdAt={task.createdAt}
                        onClick={() => setShowDetail(true)}
                      />
                    ))}
                </Section>
              ))}
            </DndContext>
          </div>
        </div>

        {showDetail ||
          (showCreate && (
            <div className="fixed inset-0 bg-primary/50 z-10"></div>
          ))}

        {tasks.length > 0 && (
          <DetailTask
            isShowing={showDetail}
            onEdit={onShowEdit}
            onClose={() => setShowDetail(false)}
            task={tasks[0]} // Exemplo de tarefa, você pode passar a tarefa selecionada
          />
        )}
        <CreateTask
          isShowing={showCreate}
          onClose={() => setShowCreate(false)}
        />

        <EditTask isShowing={showEdit} onClose={() => setShowEdit(false)} />
      </main>
    </div>
  );
}
