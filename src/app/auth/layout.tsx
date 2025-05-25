export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-svh px-4 bg-linear-to-b from-secondary to-third ">
      {children}
    </div>
  );
}
