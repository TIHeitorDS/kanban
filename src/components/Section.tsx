import TaskCard from "./TaskCard";

export default function Section({ title }: { title: string }) {
  return (
    <section className=" mt-4">
      <div className="bg-dark font-medium px-2 h-14 flex items-center justify-between rounded-[12px]">
        <p className="font-urbanist text-xl ">
          {title} <span className="text-white/20">(3)</span>
        </p>

        <button className="bg-green rounded-[12px] w-9.5 h-9.5 text-primary text-[18px]">
          +
        </button>
      </div>

      <div className="h-fit mt-3 bg-third p-2 rounded-[12px]">
        <TaskCard />
      </div>
    </section>
  );
}
