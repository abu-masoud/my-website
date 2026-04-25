export default function Loading() {
  return (
    <div className="pt-32 pb-24 px-6 md:px-10 max-w-7xl mx-auto">
      <div className="mb-16">
        <div className="h-2.5 w-32 bg-[#1a1a1a] rounded mb-4 animate-pulse" />
        <div className="h-14 w-44 bg-[#1a1a1a] rounded animate-pulse" />
      </div>
      {/* Featured card skeleton */}
      <div className="flex flex-col md:flex-row bg-[#111111] mb-px overflow-hidden">
        <div className="md:w-1/2 aspect-[16/9] md:aspect-auto bg-[#1a1a1a] animate-pulse" />
        <div className="md:w-1/2 p-8 md:p-12 space-y-4">
          <div className="h-2.5 w-16 bg-[#1a1a1a] rounded animate-pulse" />
          <div className="h-8 w-3/4 bg-[#1a1a1a] rounded animate-pulse" />
          <div className="h-2.5 w-full bg-[#1a1a1a] rounded animate-pulse" />
          <div className="h-2.5 w-5/6 bg-[#1a1a1a] rounded animate-pulse" />
        </div>
      </div>
      {/* Row skeletons */}
      <div className="flex flex-col divide-y divide-[#1e1e1e] border-y border-[#1e1e1e]">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-7 gap-6">
            <div className="flex gap-4 items-center">
              <div className="hidden md:block w-16 h-16 bg-[#1a1a1a] animate-pulse" />
              <div className="space-y-2">
                <div className="h-2 w-16 bg-[#1a1a1a] rounded animate-pulse" />
                <div className="h-5 w-56 bg-[#1a1a1a] rounded animate-pulse" />
              </div>
            </div>
            <div className="h-2.5 w-12 bg-[#1a1a1a] rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
