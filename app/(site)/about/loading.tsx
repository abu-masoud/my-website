export default function Loading() {
  return (
    <div className="pt-32 pb-24 px-6 md:px-10 max-w-7xl mx-auto">
      <div className="mb-20">
        <div className="h-2.5 w-40 bg-[#1a1a1a] rounded mb-4 animate-pulse" />
        <div className="h-16 w-48 bg-[#1a1a1a] rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 mb-24 pb-24 border-b border-[#1e1e1e]">
        <div className="space-y-6">
          <div className="h-4 w-full bg-[#1a1a1a] rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-[#1a1a1a] rounded animate-pulse" />
          <div className="h-4 w-4/5 bg-[#1a1a1a] rounded animate-pulse" />
          <div className="grid grid-cols-3 gap-6 pt-4 border-t border-[#1e1e1e]">
            {[1, 2, 3].map(i => (
              <div key={i}>
                <div className="h-10 w-16 bg-[#1a1a1a] rounded mb-2 animate-pulse" />
                <div className="h-2.5 w-24 bg-[#1a1a1a] rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="aspect-[3/4] bg-[#1a1a1a] animate-pulse" />
          <div className="border border-[#1e1e1e] p-6 space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-3 w-32 bg-[#1a1a1a] rounded animate-pulse" />)}
          </div>
        </div>
      </div>
    </div>
  );
}
