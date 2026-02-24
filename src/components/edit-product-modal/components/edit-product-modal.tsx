import React, { useEffect, useRef, useState } from "react";
import {
  getEditColorSizeMapping,
  getInitialIndexes,
  getMatchingSku,
  isNullOrUndef,
  objectHasLength,
} from "../utils/edit-product-modal-utils";
import {
  resolveFirstChildRender,
  resolveLoadingFirstChildRender,
  resolveLoadingSecondChildRender,
  resolveSecondChildRender,
} from "./edit-product-modal-resolvers";
import SplitViewModal from "../../stub-ui-library/split-view-modal/split-view-modal";
import {
  ColorOption,
  ColorToSizeMap,
  Locale,
  MaybeSku,
  SizeOption,
  SizeToColorMap,
  Sku,
  SkuVariants,
} from "../types";
import styles from "./edit-product-modal.module.scss";

export type EditProductModalRenderArgs = {
  locale: Locale;
  currentColorIndex: number;
  prevColorIndex: number | undefined;
  currentSizeIndex: number;
  prevSizeIndex: number | undefined;
  setCurrentColorIndex: (index: number) => void;
  setCurrentSizeIndex: (index: number) => void;
  availableSkus: Sku[];
  colors: ColorOption[];
  sizes: SizeOption[];
  colorToSizeMap: ColorToSizeMap;
  sizeToColorMap: SizeToColorMap;
  imagesByColorCode: Record<string, string[]> | undefined;
  currentImagesUrls: string[] | undefined;
  currentColorDetails: ColorOption | undefined;
  currentSizeDetails: SizeOption | undefined;
};

export type EditProductModalProps = {
  mainHeading: string;
  productName: string;
  initialImageUrl: string | null;
  initialColorCode: string | null;
  initialSize: string | null;
  initialListPrice?: string | null;
  initialSalePrice?: string | null;
  skuVariants?: SkuVariants | null;
  locale: Locale;
  onDismiss: (args: { event: React.SyntheticEvent; currentMatchingSku: MaybeSku | null }) => void;
  enableStickySecondChildFooter?: boolean;
  renderLoadingSecondChild?: (args: { locale: Locale }) => React.ReactNode;
  renderLoadingSecondChildHeader?: (args: { locale: Locale }) => React.ReactNode;
  renderLoadingSecondChildFooterExtra?: (args: { locale: Locale }) => React.ReactNode;
  renderLoadingHeading?: () => React.ReactNode;
  renderLoadingAfterHeading?: () => React.ReactNode;
  renderLoadingPrice?: (args: { listPrice?: string | null; salePrice?: string | null }) => React.ReactNode;
  renderSecondChildHeader?: (args: EditProductModalRenderArgs & { currentMatchingSku: MaybeSku }) => React.ReactNode;
  renderAttrsSelectors?: (args: EditProductModalRenderArgs & { currentMatchingSku: MaybeSku }) => React.ReactNode;
  renderAfterAttrsSelectors?: (args: EditProductModalRenderArgs) => React.ReactNode;
  renderNotifications?: (args: {
    locale: Locale;
    isCurrentSkuAvailable: boolean | undefined;
    currentMatchingSkuId: string | undefined;
    currentColorDetails: ColorOption | undefined;
    currentColorIndex: number;
    currentSizeDetails: SizeOption | undefined;
    currentSizeIndex: number;
    prevColorIndex: number | undefined;
    prevSizeIndex: number | undefined;
    availableSkus: Sku[];
  }) => React.ReactNode;
  renderPrimaryCta?: (args: {
    locale: Locale;
    isCurrentSkuAvailable: boolean | undefined;
    currentMatchingSkuId: string | undefined;
    currentColorDetails: ColorOption | undefined;
    currentColorIndex: number;
    currentSizeDetails: SizeOption | undefined;
    currentSizeIndex: number;
    prevColorIndex: number | undefined;
    prevSizeIndex: number | undefined;
    currentMatchingSku: MaybeSku;
  }) => React.ReactNode;
  renderSecondaryCta?: (args: {
    locale: Locale;
    isCurrentSkuAvailable: boolean | undefined;
    currentMatchingSkuId: string | undefined;
    currentColorDetails: ColorOption | undefined;
    currentColorIndex: number;
    currentSizeDetails: SizeOption | undefined;
    currentSizeIndex: number;
    prevColorIndex: number | undefined;
    prevSizeIndex: number | undefined;
    currentMatchingSku: MaybeSku;
  }) => React.ReactNode;
  renderFirstChild?: (args: EditProductModalRenderArgs) => React.ReactNode;
  renderSecondChild?: (args: EditProductModalRenderArgs) => React.ReactNode;
  renderSpinner?: () => React.ReactNode;
  renderHeading?: () => React.ReactNode;
  renderAfterHeading?: () => React.ReactNode;
  renderPrice?: (args: { listPrice?: string | null; salePrice?: string | null }) => React.ReactNode;
};

const EditProductModal = ({
  mainHeading = "",
  productName = "",
  initialImageUrl = null,
  initialColorCode = null,
  initialSize = null,
  initialListPrice = null,
  initialSalePrice = null,
  skuVariants = {},
  locale,
  onDismiss,
  enableStickySecondChildFooter = true,
  renderLoadingSecondChild = null,
  renderLoadingSecondChildHeader = null,
  renderLoadingSecondChildFooterExtra = null,
  renderLoadingHeading = null,
  renderLoadingAfterHeading = null,
  renderLoadingPrice = null,
  renderSecondChildHeader = null,
  renderAttrsSelectors = null,
  renderAfterAttrsSelectors = null,
  renderNotifications = null,
  renderPrimaryCta = null,
  renderSecondaryCta = null,
  renderFirstChild = null,
  renderSecondChild = null,
  renderSpinner = null,
  renderHeading = null,
  renderAfterHeading = null,
  renderPrice = null,
}: EditProductModalProps) => {
  const [colorSizeMapping, setColorSizeMapping] = useState<{
    colorToSizeMap?: ColorToSizeMap;
    sizeToColorMap?: SizeToColorMap;
  }>({});
  const [currentColorIndex, setCurrentColorIndex] = useState<number>();
  const prevColorIndex = useRef<number>();
  const [currentSizeIndex, setCurrentSizeIndex] = useState<number>();
  const prevSizeIndex = useRef<number>();

  const updateColorIndex = (newColorIndex: number) => {
    prevColorIndex.current = currentColorIndex;
    setCurrentColorIndex(newColorIndex);
  };
  const updateSizeIndex = (newSizeIndex: number) => {
    prevSizeIndex.current = currentSizeIndex;
    setCurrentSizeIndex(newSizeIndex);
  };

  useEffect(
    function setupInitialState() {
      if (
        objectHasLength(skuVariants) &&
        !isNullOrUndef(initialImageUrl) &&
        !isNullOrUndef(initialColorCode) &&
        !isNullOrUndef(initialSize)
      ) {
        /**
         * Indexes are not available until we get the data.
         * Using size/color from the item for initial display, color name formatting can differ.
         * Resolving initial indexes this way ensures we display consistent data at all times.
         */
        const { initialColorIdx, initialSizeIdx } = getInitialIndexes({
          skuVariants,
          initialSize,
          initialColorCode,
        });

        const colorSizeMap = getEditColorSizeMapping(
          skuVariants?.availableSkus
        );

        setCurrentColorIndex(initialColorIdx);
        setCurrentSizeIndex(initialSizeIdx);
        setColorSizeMapping(colorSizeMap);
      }
    },
    [skuVariants, initialImageUrl, initialColorCode, initialSize]
  );

  const { colorToSizeMap = {}, sizeToColorMap = {} } = colorSizeMapping;
  const commonRenderArgs = { locale };

  const shouldRenderLoadingExperience =
    isNullOrUndef(initialImageUrl) ||
    isNullOrUndef(initialColorCode) ||
    isNullOrUndef(initialSize) ||
    isNullOrUndef(skuVariants) ||
    isNullOrUndef(currentColorIndex) ||
    isNullOrUndef(currentSizeIndex);

  if (shouldRenderLoadingExperience) {
    const loadingFirstChild = resolveLoadingFirstChildRender({
      productName,
      currentImagesUrls: [initialImageUrl],
      commonRenderArgs,
      renderFirstChild,
    });

    const loadingSecondChild = resolveLoadingSecondChildRender({
      mainHeading,
      initialListPrice,
      initialSalePrice,
      renderLoadingSecondChildHeader,
      renderLoadingSecondChildFooterExtra,
      renderLoadingSecondChild,
      renderSpinner,
      renderLoadingHeading,
      renderLoadingAfterHeading,
      renderLoadingPrice,
      commonRenderArgs,
      enableStickySecondChildFooter,
    });

    const onUiLoadingModalDismiss = (event: React.SyntheticEvent) => {
      onDismiss({ event, currentMatchingSku: null });
    };

    return (
      <SplitViewModal
        onDismiss={onUiLoadingModalDismiss}
        firstChild={loadingFirstChild}
        secondChild={loadingSecondChild}
        classes={{ container: styles.container }}
      />
    );
  }

  const { availableSkus = [], colors = [], sizes = [], imagesByColorCode } =
    skuVariants ?? {};

  const currentColorDetails = colors?.[currentColorIndex ?? 0];
  const currentSizeDetails = sizes?.[currentSizeIndex ?? 0];
  const currentImagesUrls = imagesByColorCode?.[currentColorDetails?.colorCode];
  const currentMatchingSku: MaybeSku =
    getMatchingSku({
      skus: availableSkus,
      colorCodeToMatch: currentColorDetails?.colorCode,
      sizeToMatch: currentSizeDetails?.size,
    }) || {};

  const skuAttrsIndexes = {
    currentColorIndex: currentColorIndex ?? 0,
    prevColorIndex: prevColorIndex.current,
    currentSizeIndex: currentSizeIndex ?? 0,
    prevSizeIndex: prevSizeIndex.current,
  };

  const skuAttrsIndexesSetters = {
    setCurrentColorIndex: updateColorIndex,
    setCurrentSizeIndex: updateSizeIndex,
  };

  const restRenderArgs = {
    ...skuAttrsIndexes,
    ...skuAttrsIndexesSetters,
    availableSkus,
    colors,
    sizes,
    sizeToColorMap,
    colorToSizeMap,
    imagesByColorCode,
    currentImagesUrls,
    currentColorDetails,
    currentSizeDetails,
  };

  const firstChild = resolveFirstChildRender({
    productName,
    currentImagesUrls,
    commonRenderArgs,
    restRenderArgs,
    renderFirstChild,
  });

  const secondChild = resolveSecondChildRender({
    mainHeading,
    commonRenderArgs,
    restRenderArgs,
    renderSecondChildHeader,
    renderAttrsSelectors,
    renderAfterAttrsSelectors,
    renderNotifications,
    renderPrimaryCta,
    renderSecondaryCta,
    renderHeading,
    renderAfterHeading,
    renderPrice,
    renderSecondChild,
    enableStickySecondChildFooter,
  });

  const onUiCompleteModalDismiss = (event: React.SyntheticEvent) => {
    onDismiss({ event, currentMatchingSku });
  };

  return (
    <SplitViewModal
      onDismiss={onUiCompleteModalDismiss}
      firstChild={firstChild}
      secondChild={secondChild}
      classes={{ container: styles.container }}
    />
  );
};

export default EditProductModal;
