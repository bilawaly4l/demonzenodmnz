import { Card } from "@/components/ui/card";

export function SkeletonCard() {
  return (
    <Card className="bg-card border-border p-5 flex flex-col gap-4 h-44">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="skeleton h-5 w-14 rounded" />
          <div className="skeleton h-6 w-20 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <div className="skeleton h-5 w-10 rounded" />
          <div className="skeleton h-5 w-14 rounded" />
        </div>
      </div>

      {/* Price grid */}
      <div className="grid grid-cols-3 gap-3 flex-1">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <div className="skeleton h-3.5 w-10 rounded" />
            <div className="skeleton h-4 w-16 rounded" />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-border/50">
        <div className="skeleton h-3.5 w-24 rounded" />
        <div className="skeleton h-3.5 w-32 rounded" />
      </div>
    </Card>
  );
}
