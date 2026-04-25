export default function Loading() {
  return (
    <div className="pt-32 pb-24 px-6 md:px-10 max-w-7xl mx-auto">
      <div className="mb-16">
        <div className="h-2.5 w-28 bg-[#1a1a1a] rounded mb-4 animate-pulse" />
        <div className="h-14 w-52 bg-[#1a1a1a] rounded animate-pulse" />
      </div>
      <div className="flex gap-3 flex-wrap mb-14 border-b border-[#1e1e1e] pb-8">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-8 w-20 bg-[#1a1a1a] rounded animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1e1e1e]">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-[#111111] aspect-[3/4] animate-pulse" />
        ))}
      </div>
    </div>
  );
}
