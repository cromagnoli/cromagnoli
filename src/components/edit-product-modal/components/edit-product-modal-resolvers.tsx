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
  MaybeSku,
  SizeOption,
  SizeToColorMap,
  Sku,
} from "../types";

const getImagesAlt = (productName?: string) => `${productName ?? "Product"} image`;

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
  renderFirstChild,
}: {
  productName: string;
  currentImagesUrls: Array<string | null | undefined>;
  renderFirstChild?: () => React.ReactNode;
}) => {
  return isDefinedFn(renderFirstChild) ? (
    renderFirstChild()
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
  restRenderArgs,
  renderFirstChild,
}: {
  productName: string;
  currentImagesUrls: string[] | undefined;
  restRenderArgs: RestRenderArgs;
  renderFirstChild?: (args: RestRenderArgs) => React.ReactNode;
}) => {
  const firstChildRenderArgs = { ...restRenderArgs };
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
  enableStickySecondChildFooter,
}: {
  mainHeading: string;
  initialListPrice?: string | null;
  initialSalePrice?: string | null;
  renderLoadingSecondChildHeader?: () => React.ReactNode;
  renderLoadingSecondChildFooterExtra?: () => React.ReactNode;
  renderLoadingSecondChild?: () => React.ReactNode;
  renderSpinner?: () => React.ReactNode;
  renderLoadingHeading?: () => React.ReactNode;
  renderLoadingPrice?: (args: { listPrice?: string | null; salePrice?: string | null }) => React.ReactNode;
  enableStickySecondChildFooter?: boolean;
}) => {
  let secondChild;
  if (isDefinedFn(renderLoadingSecondChild)) {
    secondChild = renderLoadingSecondChild();
  } else {
    secondChild = (
      <>
        <EditProductScrollableFrame>
          {isDefinedFn(renderLoadingSecondChildHeader) ? (
            renderLoadingSecondChildHeader()
          ) : (
            <EditProductHeader
              headingChildren={mainHeading}
              listPrice={initialListPrice}
              salePrice={initialSalePrice}
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
            renderLoadingSecondChildFooterExtra()}
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
  restRenderArgs,
  enableStickySecondChildFooter,
}: {
  mainHeading: string;
  renderSecondChildHeader?: (args: RestRenderArgs & { currentMatchingSku: MaybeSku }) => React.ReactNode;
  renderAttrsSelectors?: (args: RestRenderArgs & { currentMatchingSku: MaybeSku }) => React.ReactNode;
  renderAfterAttrsSelectors?: (args: RestRenderArgs) => React.ReactNode;
  renderNotifications?: (args: {
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
  renderSecondChild?: (args: RestRenderArgs) => React.ReactNode;
  renderHeading?: () => React.ReactNode;
  renderAfterHeading?: () => React.ReactNode;
  renderPrice?: (args: { listPrice?: string | null; salePrice?: string | null }) => React.ReactNode;
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

  const secondChildRenderArgs = { ...restRenderArgs };

  const attrsSelectorsRenderArgs = {
    ...restRenderArgs,
    currentMatchingSku,
  };

  const afterSizeSlotRenderArgs = {
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
    ...currentAttrs,
    ...prevAttrs,
    availableSkus,
  };

  const ctaRenderArgs = {
    ...currentAttrs,
    ...prevAttrs,
    currentMatchingSku,
  };

  const secondChildHeaderRenderArgs = {
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
