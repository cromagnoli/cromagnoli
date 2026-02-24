import React from "react";
import EditProductModal, {
  EditProductModalProps,
} from "../edit-product-modal/components/edit-product-modal";
import {
  EditProductPrimaryButton,
  EditProductSecondaryCta,
  EditProductColorSelector,
  EditProductSizeSelector,
  EditProductErrorNotification,
} from "../edit-product-modal/components/partials";
import {
  configurePanelByCurrentSelection,
  isDefinedFn,
} from "../edit-product-modal/utils/edit-product-modal-utils";
import { useEditProductModalDemo, EditingItem } from "./use-edit-product-modal-demo";
import { ModalMockData } from "./mockData";

const PRIMARY_BUTTON_LABEL = "Add to cart";
const SECONDARY_CTA_LABEL = "Go to product overview";
const OOS_NOTIFICATION = "Sold out. Please select another combination.";

const defaultRenderNotifications: NonNullable<
  EditProductModalProps["renderNotifications"]
> = ({ isCurrentSkuAvailable }) => (
  <EditProductErrorNotification visible={!isCurrentSkuAvailable}>
    {OOS_NOTIFICATION}
  </EditProductErrorNotification>
);

type Props = {
  editingItem: EditingItem;
  renderAfterHeading?: () => React.ReactNode;
  renderAfterAttrsSelectors?: EditProductModalProps["renderAfterAttrsSelectors"];
  renderNotifications?: EditProductModalProps["renderNotifications"];
  renderPrimaryCta?: EditProductModalProps["renderPrimaryCta"];
  renderSecondaryCta?: EditProductModalProps["renderSecondaryCta"];
  onModalDismiss?: () => void;
  mockModalData?: ModalMockData;
  fetchDelayMs?: number;
};

const EditProductModalStatefulDemo = ({
  editingItem,
  renderAfterHeading,
  renderAfterAttrsSelectors,
  renderNotifications,
  renderPrimaryCta,
  renderSecondaryCta,
  onModalDismiss = () => {},
  mockModalData,
  fetchDelayMs,
}: Props) => {
  const {
    imageUrl,
    colorCode,
    onDismiss,
    handleAddToBagClick,
    handleNavigateProductDetails,
    initialSize,
    productName,
    skuVariants,
    trackColorSelection,
  } = useEditProductModalDemo({
    editingItem,
    onModalDismiss,
    mockModalData,
    fetchDelayMs,
  });

  const defaultRenderPrimaryCta: NonNullable<
    EditProductModalProps["renderPrimaryCta"]
  > = ({ isCurrentSkuAvailable, currentMatchingSku }) => (
    <EditProductPrimaryButton
      label={PRIMARY_BUTTON_LABEL}
      disabled={!isCurrentSkuAvailable}
      onClick={() => handleAddToBagClick(currentMatchingSku)}
    />
  );

  const defaultRenderSecondaryCta: NonNullable<
    EditProductModalProps["renderSecondaryCta"]
  > = ({ currentMatchingSku }) => {
    const onClick = () => {
      handleNavigateProductDetails(currentMatchingSku);
    };

    return (
      <EditProductSecondaryCta
        label={SECONDARY_CTA_LABEL}
        onClick={onClick}
      />
    );
  };

  const resolvedRenderNotifications = isDefinedFn(renderNotifications)
    ? renderNotifications
    : defaultRenderNotifications;

  const resolvedRenderPrimaryCta = isDefinedFn(renderPrimaryCta)
    ? renderPrimaryCta
    : defaultRenderPrimaryCta;

  const resolvedRenderSecondaryCta = isDefinedFn(renderSecondaryCta)
    ? renderSecondaryCta
    : defaultRenderSecondaryCta;

  return (
    <EditProductModal
      mainHeading={productName}
      productName={productName}
      initialImageUrl={imageUrl}
      initialColorCode={colorCode}
      initialSize={initialSize}
      skuVariants={skuVariants}
      onDismiss={onDismiss}
      renderNotifications={resolvedRenderNotifications}
      renderPrimaryCta={resolvedRenderPrimaryCta}
      renderSecondaryCta={resolvedRenderSecondaryCta}
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
      renderAfterAttrsSelectors={renderAfterAttrsSelectors}
    />
  );
};

export default EditProductModalStatefulDemo;
