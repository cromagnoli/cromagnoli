export type Locale = {
  lang: string;
  countryCode: string;
};

export type ColorOption = {
  colorCode: string;
  displayName?: string;
  available?: boolean;
};

export type SizeOption = {
  size: string;
  available?: boolean;
};

export type Sku = {
  id?: string;
  colorCode: string;
  size: string;
  listPrice?: string;
  salePrice?: string;
  available?: boolean;
};

export type MaybeSku = Sku | Record<string, unknown>;

export type SkuVariants = {
  sizes?: SizeOption[];
  colors?: ColorOption[];
  availableSkus?: Sku[];
  imagesByColorCode?: Record<string, string[]>;
};

export type ColorToSizeMap = Record<string, string[]>;
export type SizeToColorMap = Record<string, string[]>;
