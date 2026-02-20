import React from "react";
import EditProductModal from "../edit-product-modal/components/edit-product-modal";
import {
  EditProductPrimaryButton,
  EditProductSecondaryCta,
  EditProductColorSelector,
  EditProductSizeSelector,
  EditProductErrorNotification,
} from "../edit-product-modal/components/partials";
import { configurePanelByCurrentSelection } from "../edit-product-modal/utils/edit-product-modal-utils";
import { useEditProductModalDemo, EditingItem } from "./use-edit-product-modal-demo";

const PRIMARY_BUTTON_LABEL = "Add to cart";
const SECONDARY_CTA_LABEL = "Go to product overview";
const OOS_NOTIFICATION = "Sold out";

type Props = {
  editingItem: EditingItem;
  editingItemIndex: number;
  renderAfterHeading?: () => React.ReactNode;
  onModalDismiss?: () => void;
};

const EditProductModalStatefulDemo = ({
  editingItem,
  editingItemIndex,
  renderAfterHeading,
  onModalDismiss = () => {},
}: Props) => {
  const {
    currencyCode,
    imageUrl,
    colorCode,
    locale,
    onDismiss,
    handleAddToBagClick,
    handleNavigateProductDetails,
    initialSize,
    productName,
    skuVariants,
    trackColorSelection,
  } = useEditProductModalDemo({
    editingItem,
    editingItemIndex,
    onModalDismiss,
  });

  return (
    <EditProductModal
      mainHeading={productName}
      productName={productName}
      initialImageUrl={imageUrl}
      initialColorCode={colorCode}
      initialSize={initialSize}
      currencyCode={currencyCode}
      skuVariants={skuVariants}
      locale={locale}
      onDismiss={onDismiss}
      renderNotifications={({ isCurrentSkuAvailable }) => (
        <EditProductErrorNotification visible={!isCurrentSkuAvailable}>
          {OOS_NOTIFICATION}3
        </EditProductErrorNotification>
      )}
      renderPrimaryCta={({ isCurrentSkuAvailable, currentMatchingSku }) => (
        <EditProductPrimaryButton
          label={PRIMARY_BUTTON_LABEL}
          disabled={!isCurrentSkuAvailable}
          onClick={() => handleAddToBagClick(currentMatchingSku)}
        />
      )}
      renderSecondaryCta={({ currentMatchingSku }) => {
        const onClick = () => {
          handleNavigateProductDetails(currentMatchingSku);
        };

        return (
          <EditProductSecondaryCta
            label={SECONDARY_CTA_LABEL}
            onClick={onClick}
          />
        );
      }}
      renderAttrsSelectors={({
        currentMatchingSku,
        currentColorDetails,
        currentColorIndex,
        prevColorIndex,
        colors,
        sizes,
        currentSizeDetails,
        currentSizeIndex,
        setCurrentColorIndex,
        setCurrentSizeIndex,
        colorToSizeMap,
        sizeToColorMap,
      }) => {
        const { sizeSelectorState, colorSelectorState } =
          configurePanelByCurrentSelection(
            currentColorDetails?.colorCode,
            currentSizeDetails?.size,
            colors,
            sizes,
            colorToSizeMap,
            sizeToColorMap
          );

        trackColorSelection(
          currentMatchingSku,
          currentColorIndex,
          prevColorIndex
        );

        return (
          <>
            <EditProductColorSelector
              currentName={currentColorDetails?.displayName}
              currentIndex={currentColorIndex}
              selectorState={colorSelectorState}
              onSelectCallback={setCurrentColorIndex}
            />
            <EditProductSizeSelector
              currentSize={currentSizeDetails?.size}
              currentIndex={currentSizeIndex}
              selectorState={sizeSelectorState}
              onSelectCallback={setCurrentSizeIndex}
            />
          </>
        );
      }}
      renderAfterHeading={renderAfterHeading}
    />
  );
};

export default EditProductModalStatefulDemo;
