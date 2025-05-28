export default function Category({ category }: { category?: string }) {
  return (
    <span className="bg-purple py-1 px-3 rounded-[12px] font-medium text-sm">
      {category || "Sem categoria"}
    </span>
  );
}
