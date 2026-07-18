import { LOW_STOCK_THRESHOLD } from "./constants";

export type StockLevel = "in_stock" | "low_stock" | "out_of_stock";

export function getStockLevel(stock: number): StockLevel {
  if (stock <= 0) return "out_of_stock";
  if (stock <= LOW_STOCK_THRESHOLD) return "low_stock";
  return "in_stock";
}

export function getStockLabel(stock: number): string {
  switch (getStockLevel(stock)) {
    case "out_of_stock":
      return "Out of stock";
    case "low_stock":
      return stock === 1 ? "Only 1 left" : `Only ${stock} left`;
    default:
      return "In stock";
  }
}
