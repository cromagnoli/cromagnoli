
import { SkuVariants } from "./types";

export const mockVariants: SkuVariants = {
  colors: [
    { colorCode: "BLK", displayName: "Black" },
    { colorCode: "GRY", displayName: "Graphite" },
  ],
  sizes: [{ size: "S" }, { size: "M" }, { size: "L" }],
  availableSkus: [
    { id: "1", colorCode: "BLK", size: "S", listPrice: "$58", available: true },
    { id: "2", colorCode: "BLK", size: "M", listPrice: "$58", available: true },
    { id: "3", colorCode: "GRY", size: "M", listPrice: "$58", available: true },
  ],
};
