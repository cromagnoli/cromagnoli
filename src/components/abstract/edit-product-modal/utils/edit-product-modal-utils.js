export const isNullOrUndef = (value) => value == null;

export const objectHasLength = (value) =>
  !isNullOrUndef(value) &&
  typeof value === "object" &&
  Object.keys(value)?.length;

export const isDefinedFn = (value) => value && typeof value === "function";

export const getMatchingSku = ({ skus, colorCodeToMatch, sizeToMatch }) =>
  skus.find(
    (sku) => colorCodeToMatch === sku.colorCode && sizeToMatch === sku.size
  );

export const buildDummyUnavailableColor = ({
  colorCode,
  displayName,
} = {}) => ({
  colorCode,
  displayName,
  available: false,
});

export const buildDummyUnavailableSize = (size) => ({ size, available: false });

const getColorsWithMatchingSize = ({ colors, skus }) =>
  colors?.filter((color) =>
    skus?.some((sku) => sku?.colorCode === color?.colorCode)
  );

const getSizesWithMatchingColor = ({ sizes, skus }) =>
  sizes?.filter((size) => skus?.some((sku) => sku?.size === size?.size));

export const getFilteredMatchingAttrs = ({ skus, colors, sizes }) => {
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
}) => {
  const { colors = [], sizes = [] } = skuVariants;

  const initialColorIdx = colors.findIndex(
    (it) => it.colorCode === initialColorCode
  );

  const initialSizeIdx = sizes.findIndex((it) => it.size === initialSize);

  return { initialColorIdx, initialSizeIdx };
};

export const getEditColorSizeMapping = (skus) => {
  const colorToSizeMap = {};
  const sizeToColorMap = {};
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
}) =>
  sizes.map((it) => ({
    ...it,
    available: colorToSizeMap[colorCodeToMatch]?.includes(it.size) || false,
  }));

export const formatColorOptionsStateBySize = ({
  sizeToMatch,
  colors,
  sizeToColorMap,
}) =>
  colors.map((it) => ({
    ...it,
    available: sizeToColorMap[sizeToMatch]?.includes(it.colorCode) || false,
  }));

export const configurePanelByCurrentSelection = (
  currentColorCode,
  currentSize,
  colors,
  sizes,
  colorToSizeMap,
  sizeToColorMap
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
