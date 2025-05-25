export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w- h-svh px-4 pt-[147px] bg-linear-to-b from-secondary to-third ">
      {children}
    </div>
  );
}
