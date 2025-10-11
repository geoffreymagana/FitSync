export function PageHeader({ title, children }: { title: string, children?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
      {children}
    </div>
  );
}
