export default function SubmitButton({ title }: { title: string }) {
  return (
    <button
      type="submit"
      className="bg-green text-primary w-full py-[10px] rounded-full"
    >
      {title}
    </button>
  );
}
