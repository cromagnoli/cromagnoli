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

const getImagesAlt = (productName) => `${productName ?? "Product"} image`;

export const resolveLoadingFirstChildRender = ({
  productName,
  currentImagesUrls,
  commonRenderArgs,
  renderLoadingFirstChild,
}) => {
  return isDefinedFn(renderLoadingFirstChild) ? (
    renderLoadingFirstChild(commonRenderArgs)
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
  currencyCode,
  renderLoadingSecondChildHeader,
  renderLoadingSecondChildFooterExtra,
  renderLoadingSecondChild,
  renderSpinner,
  renderLoadingHeading,
  renderLoadingAfterHeading,
  renderLoadingPrice,
  commonRenderArgs,
  enableStickySecondChildFooter,
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
              currencyCode={currencyCode}
              locale={commonRenderArgs?.locale}
              renderHeading={renderLoadingHeading}
              renderAfterHeading={renderLoadingAfterHeading}
              renderPrice={renderLoadingPrice}
            />
          )}

          {isDefinedFn(renderSpinner) ? (
            renderSpinner()
          ) : (
            <LoadingIndicator className={styles.loadingIndicator} color="red" />
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
  currencyCode,
  renderSecondChildHeader,
  renderAttrsSelectors,
  renderAfterAttrsSelectors,
  renderNotifications,
  renderPrimaryCta,
  renderSecondaryCta,
  renderSecondChildFooterExtra,
  renderSecondChild,
  renderHeading,
  renderAfterHeading,
  renderPrice,
  commonRenderArgs,
  restRenderArgs,
  enableStickySecondChildFooter,
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

  const currentMatchingSku =
    getMatchingSku({
      skus: availableSkus,
      colorCodeToMatch: currentColorDetails?.colorCode,
      sizeToMatch: currentSizeDetails?.size,
    }) || {};

  const { id: currentMatchingSkuId, available: isCurrentSkuAvailable } =
    currentMatchingSku;

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

  const secondChildFooterRenderArgs = {
    ...commonRenderArgs,
    ...restRenderArgs,
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
              currencyCode={currencyCode}
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

          {isDefinedFn(renderSecondChildFooterExtra) &&
            renderSecondChildFooterExtra(secondChildFooterRenderArgs)}
        </EditProductStickyFrame>
      </>
    );
  }

  return secondChild;
};
