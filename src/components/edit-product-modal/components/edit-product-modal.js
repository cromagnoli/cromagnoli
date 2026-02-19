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
import SplitViewModal from "../../split-view-modal/split-view-modal";
import PropTypes from "prop-types";

const EditProductModal = ({
  mainHeading,
  productName,
  initialImageUrl,
  initialColorCode,
  initialSize,
  initialListPrice,
  initialSalePrice,
  currencyCode,
  skuVariants,
  locale,
  onDismiss,
  enableStickySecondChildFooter,
  renderLoadingSecondChild,
  renderLoadingSecondChildHeader,
  renderLoadingSecondChildFooterExtra,
  renderLoadingHeading,
  renderLoadingAfterHeading,
  renderLoadingPrice,
  renderSecondChildHeader,
  renderAttrsSelectors,
  renderAfterAttrsSelectors,
  renderNotifications,
  renderPrimaryCta,
  renderSecondaryCta,
  renderSecondChildFooterExtra,
  renderFirstChild,
  renderSecondChild,
  renderSpinner,
  renderHeading,
  renderAfterHeading,
  renderPrice,
}) => {
  const [{ colorToSizeMap, sizeToColorMap }, setColorSizeMapping] = useState(
    {}
  );
  const [currentColorIndex, setCurrentColorIndex] = useState();
  const prevColorIndex = useRef();
  const [currentSizeIndex, setCurrentSizeIndex] = useState();
  const prevSizeIndex = useRef();

  const updateColorIndex = (newColorIndex) => {
    prevColorIndex.current = currentColorIndex;
    setCurrentColorIndex(newColorIndex);
  };
  const updateSizeIndex = (newSizeIndex) => {
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

        const colorSizeMapping = getEditColorSizeMapping(
          skuVariants?.availableSkus
        );

        setCurrentColorIndex(initialColorIdx);
        setCurrentSizeIndex(initialSizeIdx);
        setColorSizeMapping(colorSizeMapping);
      }
    },
    [skuVariants, initialImageUrl, initialColorCode, initialSize, currencyCode]
  );

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
    });

    const onUiLoadingModalDismiss = (event) => {
      onDismiss({ event, currentMatchingSku: null });
    };

    return (
      <SplitViewModal
        onDismiss={onUiLoadingModalDismiss}
        firstChild={loadingFirstChild}
        secondChild={loadingSecondChild}
      />
    );
  }

  const { availableSkus, colors, sizes, imagesByColorCode } = skuVariants;

  const currentColorDetails = colors?.[currentColorIndex];
  const currentSizeDetails = sizes?.[currentSizeIndex];
  const currentImagesUrls = imagesByColorCode?.[currentColorDetails?.colorCode];
  const currentMatchingSku =
    getMatchingSku({
      skus: availableSkus,
      colorCodeToMatch: currentColorDetails?.colorCode,
      sizeToMatch: currentSizeDetails?.size,
    }) || {};

  const skuAttrsIndexes = {
    currentColorIndex,
    prevColorIndex: prevColorIndex.current,
    currentSizeIndex,
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
    currencyCode,
    commonRenderArgs,
    restRenderArgs,
    renderSecondChildHeader,
    renderAttrsSelectors,
    renderAfterAttrsSelectors,
    renderNotifications,
    renderPrimaryCta,
    renderSecondaryCta,
    renderSecondChildFooterExtra,
    renderHeading,
    renderAfterHeading,
    renderPrice,
    renderSecondChild,
    enableStickySecondChildFooter,
  });

  const onUiCompleteModalDismiss = (event) => {
    onDismiss({ event, currentMatchingSku });
  };

  return (
    <SplitViewModal
      onDismiss={onUiCompleteModalDismiss}
      firstChild={firstChild}
      secondChild={secondChild}
    />
  );
};

EditProductModal.propTypes = {
  mainHeading: PropTypes.string.isRequired,
  productName: PropTypes.string.isRequired,
  initialImageUrl: PropTypes.string.isRequired,
  initialColorCode: PropTypes.string.isRequired,
  initialSize: PropTypes.string.isRequired,
  initialListPrice: PropTypes.string,
  initialSalePrice: PropTypes.string,
  currencyCode: PropTypes.string,
  skuVariants: PropTypes.shape({
    sizes: PropTypes.arrayOf(
      PropTypes.shape({
        available: PropTypes.bool,
        size: PropTypes.string,
      })
    ),
    colors: PropTypes.arrayOf(
      PropTypes.shape({
        colorCode: PropTypes.string,
        available: PropTypes.bool,
        displayName: PropTypes.string,
      })
    ),
    availableSkus: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        colorCode: PropTypes.string,
        size: PropTypes.string,
        listPrice: PropTypes.string,
        salePrice: PropTypes.string,
        available: PropTypes.bool,
      })
    ),
    imagesByColorCode: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
  }),
  locale: PropTypes.shape({
    lang: PropTypes.string.isRequired,
    countryCode: PropTypes.string.isRequired,
  }).isRequired,
  onDismiss: PropTypes.func.isRequired,
  enableStickySecondChildFooter: PropTypes.bool,
  renderLoadingSecondChild: PropTypes.func,
  renderLoadingSecondChildHeader: PropTypes.func,
  renderLoadingSecondChildFooterExtra: PropTypes.func,
  renderSecondChildHeader: PropTypes.func,
  renderAttrsSelectors: PropTypes.func,
  renderAfterAttrsSelectors: PropTypes.func,
  renderNotifications: PropTypes.func,
  renderPrimaryCta: PropTypes.func,
  renderSecondaryCta: PropTypes.func,
  renderSecondChildFooterExtra: PropTypes.func,
  renderFirstChild: PropTypes.func,
  renderSecondChild: PropTypes.func,
  renderSpinner: PropTypes.func,
  renderHeading: PropTypes.func,
  renderAfterHeading: PropTypes.func,
  renderPrice: PropTypes.func,
};

EditProductModal.defaultProps = {
  mainHeading: "",
  productName: "",
  initialImageUrl: null,
  initialColorCode: null,
  initialSize: null,
  initialListPrice: null,
  initialSalePrice: null,
  currencyCode: null,
  skuVariants: {},
  enableStickySecondChildFooter: true,
  renderLoadingSecondChild: null,
  renderLoadingSecondChildHeader: null,
  renderLoadingSecondChildFooterExtra: null,
  renderSecondChildHeader: null,
  renderAttrsSelectors: null,
  renderAfterAttrsSelectors: null,
  renderNotifications: null,
  renderPrimaryCta: null,
  renderSecondaryCta: null,
  renderSecondChildFooterExtra: null,
  renderFirstChild: null,
  renderSecondChild: null,
  renderSpinner: null,
  renderHeading: null,
  renderAfterHeading: null,
  renderPrice: null,
};

export default EditProductModal;
