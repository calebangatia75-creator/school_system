export default function Loading() {
  return (
    <div className="min-h-screen bg-light">
      <div className="mx-auto max-w-6xl px-6 py-12 space-y-4">
        <div className="h-6 w-48 bg-slate-200 rounded" />
        <div className="h-10 w-72 bg-slate-200 rounded" />
        <div className="grid md:grid-cols-3 gap-4">
          <div className="h-28 bg-slate-200 rounded" />
          <div className="h-28 bg-slate-200 rounded" />
          <div className="h-28 bg-slate-200 rounded" />
        </div>
        <div className="h-64 bg-slate-200 rounded" />
      </div>
    </div>
  );
}
