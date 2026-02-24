import React from "react";
import { LoadingIndicator } from "../../stub-ui-library/loading-indicator/loading-indicator";
import {
  EditProductHeader,
  EditProductImages,
  EditProductAttrsSelectors,
  EditProductStickyFrame,
  EditProductScrollableFrame,
} from "./partials";
import { isDefinedFn, getMatchingSku } from "../utils/edit-product-modal-utils";
import styles from "./edit-product-modal.module.scss";
import {
  ColorOption,
  ColorToSizeMap,
  Locale,
  MaybeSku,
  SizeOption,
  SizeToColorMap,
  Sku,
} from "../types";

const getImagesAlt = (productName?: string) => `${productName ?? "Product"} image`;

type CommonRenderArgs = {
  locale: Locale;
};

type RestRenderArgs = {
  currentColorDetails: ColorOption | undefined;
  currentSizeDetails: SizeOption | undefined;
  currentColorIndex: number;
  prevColorIndex: number | undefined;
  setCurrentColorIndex: (index: number) => void;
  currentSizeIndex: number;
  prevSizeIndex: number | undefined;
  setCurrentSizeIndex: (index: number) => void;
  availableSkus: Sku[];
  colors: ColorOption[];
  sizes: SizeOption[];
  colorToSizeMap: ColorToSizeMap;
  sizeToColorMap: SizeToColorMap;
};

export const resolveLoadingFirstChildRender = ({
  productName,
  currentImagesUrls,
  commonRenderArgs,
  renderFirstChild,
}: {
  productName: string;
  currentImagesUrls: Array<string | null | undefined>;
  commonRenderArgs: CommonRenderArgs;
  renderFirstChild?: (args: CommonRenderArgs) => React.ReactNode;
}) => {
  return isDefinedFn(renderFirstChild) ? (
    renderFirstChild(commonRenderArgs)
  ) : (
    <EditProductImages
      imageUrls={currentImagesUrls}
      imagesAlt={getImagesAlt(productName)}
    />
  );
};

export const resolveFirstChildRender = ({
  productName,
  currentImagesUrls,
  commonRenderArgs,
  restRenderArgs,
  renderFirstChild,
}: {
  productName: string;
  currentImagesUrls: string[] | undefined;
  commonRenderArgs: CommonRenderArgs;
  restRenderArgs: RestRenderArgs;
  renderFirstChild?: (args: CommonRenderArgs & RestRenderArgs) => React.ReactNode;
}) => {
  const firstChildRenderArgs = {
    ...commonRenderArgs,
    ...restRenderArgs,
  };
  return isDefinedFn(renderFirstChild) ? (
    renderFirstChild(firstChildRenderArgs)
  ) : (
    <EditProductImages
      imageUrls={currentImagesUrls}
      imagesAlt={getImagesAlt(productName)}
    />
  );
};

export const resolveLoadingSecondChildRender = ({
  mainHeading,
  initialListPrice,
  initialSalePrice,
  renderLoadingSecondChildHeader,
  renderLoadingSecondChildFooterExtra,
  renderLoadingSecondChild,
  renderSpinner,
  renderLoadingHeading,
  renderLoadingPrice,
  commonRenderArgs,
  enableStickySecondChildFooter,
}: {
  mainHeading: string;
  initialListPrice?: string | null;
  initialSalePrice?: string | null;
  renderLoadingSecondChildHeader?: (args: CommonRenderArgs) => React.ReactNode;
  renderLoadingSecondChildFooterExtra?: (args: CommonRenderArgs) => React.ReactNode;
  renderLoadingSecondChild?: (args: CommonRenderArgs) => React.ReactNode;
  renderSpinner?: () => React.ReactNode;
  renderLoadingHeading?: () => React.ReactNode;
  renderLoadingPrice?: (args: { listPrice?: string | null; salePrice?: string | null }) => React.ReactNode;
  commonRenderArgs: CommonRenderArgs;
  enableStickySecondChildFooter?: boolean;
}) => {
  let secondChild;
  if (isDefinedFn(renderLoadingSecondChild)) {
    secondChild = renderLoadingSecondChild(commonRenderArgs);
  } else {
    secondChild = (
      <>
        <EditProductScrollableFrame>
          {isDefinedFn(renderLoadingSecondChildHeader) ? (
            renderLoadingSecondChildHeader(commonRenderArgs)
          ) : (
            <EditProductHeader
              headingChildren={mainHeading}
              listPrice={initialListPrice}
              salePrice={initialSalePrice}
              locale={commonRenderArgs?.locale}
              renderHeading={renderLoadingHeading}
              renderPrice={renderLoadingPrice}
            />
          )}

          {isDefinedFn(renderSpinner) ? (
            renderSpinner()
          ) : (
            <LoadingIndicator className={styles.loadingIndicator} color="blue" />
          )}
        </EditProductScrollableFrame>
        <EditProductStickyFrame
          enableStickySecondChildFooter={enableStickySecondChildFooter}
        >
          {isDefinedFn(renderLoadingSecondChildFooterExtra) &&
            renderLoadingSecondChildFooterExtra(commonRenderArgs)}
        </EditProductStickyFrame>
      </>
    );
  }

  return secondChild;
};

export const resolveSecondChildRender = ({
  mainHeading,
  renderSecondChildHeader,
  renderAttrsSelectors,
  renderAfterAttrsSelectors,
  renderNotifications,
  renderPrimaryCta,
  renderSecondaryCta,
  renderSecondChild,
  renderHeading,
  renderAfterHeading,
  renderPrice,
  commonRenderArgs,
  restRenderArgs,
  enableStickySecondChildFooter,
}: {
  mainHeading: string;
  renderSecondChildHeader?: (args: CommonRenderArgs & RestRenderArgs & { currentMatchingSku: MaybeSku }) => React.ReactNode;
  renderAttrsSelectors?: (args: CommonRenderArgs & RestRenderArgs & { currentMatchingSku: MaybeSku }) => React.ReactNode;
  renderAfterAttrsSelectors?: (args: CommonRenderArgs & RestRenderArgs) => React.ReactNode;
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
  renderSecondChild?: (args: CommonRenderArgs & RestRenderArgs) => React.ReactNode;
  renderHeading?: () => React.ReactNode;
  renderAfterHeading?: () => React.ReactNode;
  renderPrice?: (args: { listPrice?: string | null; salePrice?: string | null }) => React.ReactNode;
  commonRenderArgs: CommonRenderArgs;
  restRenderArgs: RestRenderArgs;
  enableStickySecondChildFooter?: boolean;
}) => {
  const {
    currentColorDetails,
    currentSizeDetails,
    currentColorIndex,
    prevColorIndex,
    setCurrentColorIndex,
    currentSizeIndex,
    prevSizeIndex,
    setCurrentSizeIndex,
    availableSkus,
    colors,
    sizes,
    colorToSizeMap,
    sizeToColorMap,
  } = restRenderArgs;

  const currentMatchingSku: MaybeSku =
    getMatchingSku({
      skus: availableSkus,
      colorCodeToMatch: currentColorDetails?.colorCode,
      sizeToMatch: currentSizeDetails?.size,
    }) || {};

  const { id: currentMatchingSkuId, available: isCurrentSkuAvailable } =
    currentMatchingSku as Partial<Sku>;

  const secondChildRenderArgs = {
    ...commonRenderArgs,
    ...restRenderArgs,
  };

  const attrsSelectorsRenderArgs = {
    ...commonRenderArgs,
    ...restRenderArgs,
    currentMatchingSku,
  };

  const afterSizeSlotRenderArgs = {
    ...commonRenderArgs,
    currentSizeIndex,
    currentSizeDetails,
    sizes,
    currentColorIndex,
    currentColorDetails,
    colors,
    colorToSizeMap,
    sizeToColorMap,
  };

  const currentAttrs = {
    isCurrentSkuAvailable,
    currentMatchingSkuId,
    currentColorDetails,
    currentColorIndex,
    currentSizeDetails,
    currentSizeIndex,
  };

  const prevAttrs = {
    prevColorIndex,
    prevSizeIndex,
  };

  const notificationsRenderArgs = {
    ...commonRenderArgs,
    ...currentAttrs,
    ...prevAttrs,
    availableSkus,
  };

  const ctaRenderArgs = {
    ...commonRenderArgs,
    ...currentAttrs,
    ...prevAttrs,
    currentMatchingSku,
  };

  const secondChildHeaderRenderArgs = {
    ...commonRenderArgs,
    ...restRenderArgs,
    currentMatchingSku,
  };

  let secondChild;
  if (isDefinedFn(renderSecondChild)) {
    secondChild = renderSecondChild(secondChildRenderArgs);
  } else {
    const defaultAttrsSelectors = (
      <EditProductAttrsSelectors
        currentColorCode={currentColorDetails?.colorCode}
        currentColorName={currentColorDetails?.displayName}
        currentSize={currentSizeDetails?.size}
        currentColorIndex={currentColorIndex}
        onColorSelectCallback={setCurrentColorIndex}
        currentSizeIndex={currentSizeIndex}
        onSizeSelectCallback={setCurrentSizeIndex}
        colors={colors}
        sizes={sizes}
        colorToSizeMap={colorToSizeMap}
        sizeToColorMap={sizeToColorMap}
      />
    );

    secondChild = (
      <>
        <EditProductScrollableFrame>
          {isDefinedFn(renderSecondChildHeader) ? (
            renderSecondChildHeader(secondChildHeaderRenderArgs)
          ) : (
            <EditProductHeader
              headingChildren={mainHeading}
              listPrice={currentMatchingSku?.listPrice}
              salePrice={currentMatchingSku?.salePrice}
              locale={commonRenderArgs?.locale}
              renderHeading={renderHeading}
              renderAfterHeading={renderAfterHeading}
              renderPrice={renderPrice}
            />
          )}

          {isDefinedFn(renderAttrsSelectors)
            ? renderAttrsSelectors(attrsSelectorsRenderArgs)
            : defaultAttrsSelectors}

          {isDefinedFn(renderAfterAttrsSelectors) &&
            renderAfterAttrsSelectors(afterSizeSlotRenderArgs)}
        </EditProductScrollableFrame>
        <EditProductStickyFrame
          enableStickySecondChildFooter={enableStickySecondChildFooter}
        >
          {isDefinedFn(renderNotifications) &&
            renderNotifications(notificationsRenderArgs)}

          {isDefinedFn(renderPrimaryCta) && renderPrimaryCta(ctaRenderArgs)}

          {isDefinedFn(renderSecondaryCta) && renderSecondaryCta(ctaRenderArgs)}
        </EditProductStickyFrame>
      </>
    );
  }

  return secondChild;
};
