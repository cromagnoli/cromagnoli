export type Sku = {
  id: string;
  colorCode: string;
  size: string;
  listPrice: string;
  available: boolean;
};

export type SkuVariants = {
  colors: { colorCode: string; displayName: string }[];
  sizes: { size: string }[];
  availableSkus: Sku[];
};
