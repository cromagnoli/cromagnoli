import {
  ColorOption,
  SizeOption,
  Sku,
  SkuVariants,
  ColorToSizeMap,
  SizeToColorMap,
} from "../types";

export const isNullOrUndef = (value: unknown): value is null | undefined =>
  value == null;

export const objectHasLength = (value: unknown) =>
  !isNullOrUndef(value) &&
  typeof value === "object" &&
  Object.keys(value as Record<string, unknown>)?.length;

export const isDefinedFn = (value: unknown): value is (...args: never[]) => unknown =>
  !!value && typeof value === "function";

export const getMatchingSku = ({
  skus,
  colorCodeToMatch,
  sizeToMatch,
}: {
  skus: Sku[];
  colorCodeToMatch?: string;
  sizeToMatch?: string;
}) =>
  skus.find(
    (sku) => colorCodeToMatch === sku.colorCode && sizeToMatch === sku.size
  );

export const buildDummyUnavailableColor = ({
  colorCode,
  displayName,
}: Partial<ColorOption> = {}): ColorOption => ({
  colorCode: colorCode ?? "",
  displayName,
  available: false,
});

export const buildDummyUnavailableSize = (size?: string): SizeOption => ({
  size: size ?? "",
  available: false,
});

const getColorsWithMatchingSize = ({
  colors,
  skus,
}: {
  colors?: ColorOption[];
  skus?: Sku[];
}) =>
  colors?.filter((color) =>
    skus?.some((sku) => sku?.colorCode === color?.colorCode)
  );

const getSizesWithMatchingColor = ({
  sizes,
  skus,
}: {
  sizes?: SizeOption[];
  skus?: Sku[];
}) => sizes?.filter((size) => skus?.some((sku) => sku?.size === size?.size));

export const getFilteredMatchingAttrs = ({
  skus,
  colors,
  sizes,
}: {
  skus?: Sku[];
  colors?: ColorOption[];
  sizes?: SizeOption[];
}) => {
  // Filtering out colors that do not have matching sizes (Do not rely on potentially matching props input)
  const colorsWithMatchingSize = getColorsWithMatchingSize({
    colors,
    skus,
  });
  // Filtering out sizes that do not have matching colors (Do not rely on potentially matching props input)
  const sizesWithMatchingColor = getSizesWithMatchingColor({
    sizes,
    skus,
  });

  return {
    filteredColors: colorsWithMatchingSize,
    filteredSizes: sizesWithMatchingColor,
  };
};

export const getInitialIndexes = ({
  skuVariants,
  initialSize,
  initialColorCode,
}: {
  skuVariants: SkuVariants;
  initialSize?: string;
  initialColorCode?: string;
}) => {
  const { colors = [], sizes = [] } = skuVariants;

  const initialColorIdx = colors.findIndex(
    (it) => it.colorCode === initialColorCode
  );

  const initialSizeIdx = sizes.findIndex((it) => it.size === initialSize);

  return { initialColorIdx, initialSizeIdx };
};

export const getEditColorSizeMapping = (skus: Sku[] = []) => {
  const colorToSizeMap: ColorToSizeMap = {};
  const sizeToColorMap: SizeToColorMap = {};
  skus.forEach((sku) => {
    colorToSizeMap[sku.colorCode] = [
      ...(colorToSizeMap?.[sku?.colorCode] || []),
      ...(sku.available === true ? [sku?.size] : []),
    ];
    sizeToColorMap[sku.size] = [
      ...(sizeToColorMap?.[sku?.size] || []),
      ...(sku.available === true ? [sku?.colorCode] : []),
    ];
  });

  return { colorToSizeMap, sizeToColorMap };
};

export const formatSizeOptionsStateByColor = ({
  colorCodeToMatch,
  sizes,
  colorToSizeMap,
}: {
  colorCodeToMatch?: string;
  sizes: SizeOption[];
  colorToSizeMap: ColorToSizeMap;
}) =>
  sizes.map((it) => ({
    ...it,
    available: colorToSizeMap[colorCodeToMatch ?? ""]?.includes(it.size) || false,
  }));

export const formatColorOptionsStateBySize = ({
  sizeToMatch,
  colors,
  sizeToColorMap,
}: {
  sizeToMatch?: string;
  colors: ColorOption[];
  sizeToColorMap: SizeToColorMap;
}) =>
  colors.map((it) => ({
    ...it,
    available:
      sizeToColorMap[sizeToMatch ?? ""]?.includes(it.colorCode) || false,
  }));

export const configurePanelByCurrentSelection = (
  currentColorCode: string | undefined,
  currentSize: string | undefined,
  colors: ColorOption[],
  sizes: SizeOption[],
  colorToSizeMap: ColorToSizeMap,
  sizeToColorMap: SizeToColorMap
) => {
  const sizeSelectorState = formatSizeOptionsStateByColor({
    colorCodeToMatch: currentColorCode,
    sizes,
    colorToSizeMap,
  });

  const colorSelectorState = formatColorOptionsStateBySize({
    sizeToMatch: currentSize,
    colors,
    sizeToColorMap,
  });

  return { sizeSelectorState, colorSelectorState };
};
