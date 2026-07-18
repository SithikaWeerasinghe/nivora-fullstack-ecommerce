import { cn } from "@/lib/cn";
import { getStockLabel, getStockLevel, type StockLevel } from "@/lib/stock";

const levelClasses: Record<StockLevel, string> = {
  in_stock: "bg-success/10 text-success",
  low_stock: "bg-warning/10 text-warning",
  out_of_stock: "bg-error/10 text-error",
};

export function StockBadge({ stock }: { stock: number }) {
  const level = getStockLevel(stock);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium",
        levelClasses[level],
      )}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {getStockLabel(stock)}
    </span>
  );
}
