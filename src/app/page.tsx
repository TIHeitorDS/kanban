"use client";

import Section from "@/components/Section";
import DetailTask from "@/components/DetailTask";
import Link from "next/link";
import { useState } from "react";
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

const initialTasks: Task[] = [
  {
    id: "1",
    status: "todos",
    title: "Tarefa 1",
    createdAt: "2025-03-06T00:00:00Z",
    description: "Descrição da tarefa 1",
    category: "Categoria 1",
  },
  {
    id: "2",
    status: "doing",
    title: "Tarefa 2",
    createdAt: "2025-03-07T00:00:00Z",
  },
  {
    id: "3",
    status: "done",
    title: "Tarefa 3",
    createdAt: "2025-03-08T00:00:00Z",
  },
  {
    id: "4",
    status: "todos",
    title: "Tarefa 4",
    createdAt: "2025-03-09T00:00:00Z",
  },
  {
    id: "5",
    status: "doing",
    title: "Tarefa 5",
    createdAt: "2025-03-10T00:00:00Z",
  },
];

export default function Home() {
  const [tasks, setTasks] = useState(initialTasks);
  const [showDetail, setShowDetail] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const onShowCreate = () => {
    setShowCreate(!showCreate);
  };

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
                    .map((task, key) => (
                      <TaskCard
                        key={key}
                        id={task.id}
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

        <DetailTask
          isShowing={showDetail}
          onEdit={onShowEdit}
          onClose={() => setShowDetail(false)}
          task={tasks[0]} // Exemplo de tarefa, você pode passar a tarefa selecionada
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
