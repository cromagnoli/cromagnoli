
import { SkuVariants } from "./types";

export const mockVariants: SkuVariants = {
  colors: [
    { colorCode: "WHT", displayName: "White" },
    { colorCode: "GPH", displayName: "Graphite" }
  ],
  sizes: [{ size: "S" }, { size: "M" }, { size: "L" }],
  availableSkus: [
    { id: "1", colorCode: "BLK", size: "S", listPrice: "$58", available: true },
    { id: "2", colorCode: "BLK", size: "M", listPrice: "$58", available: true },
    { id: "3", colorCode: "GRY", size: "M", listPrice: "$58", available: true },
  ],
};
