export default function TaskCard() {
  return (
    <div className="bg-dark rounded-[12px] p-3">
      <span className="bg-purple py-1 px-3 rounded-[12px] font-medium text-sm">Pessoal</span>

      <div className="divide-y-2 divide-white space-y-4">
        <p className="font-bold text-3xl py-4">Título Tarefa</p>

        <div className="flex items-center gap-2">
          <img src="/calendar-days.svg" alt="" />

          <p>6 Mar 2025</p>
        </div>
      </div>
    </div>
  );
}
