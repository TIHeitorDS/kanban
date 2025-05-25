export default function DetailTask({
  isShowing = false,
  onClose,
}: {
  isShowing?: boolean;
  onClose?: () => void;
}) {
  return (
    <div
      className={`rounded-[12px] inset-x-0 z-20 border-t-2 p-4 absolute bg-secondary divide-y-2 space-y-8 bottom-0 ${
        isShowing ? "translate-y-0" : "translate-y-full"
      } transition-transform duration-300`}
    >
      <div className="flex items-center justify-between pb-[10px]">
        <p className="font-bold text-3xl">Título Tarefa</p>

        <div className="flex items-center gap-4">
          <img src="/edit.svg" alt="" className="w-7" />

          <button onClick={onClose}>
            <img src="/close.svg" alt="" className="w-7" />
          </button>
        </div>
      </div>

      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi
        reiciendis eos autem, nisi incidunt quae repellat nostrum accusamus
        atque deleniti. Tempora nam dolor illum velit libero culpa cumque fugit
        sint!
      </p>
    </div>
  );
}
