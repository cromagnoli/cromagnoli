import React from "react";
import StatelessProductEditModal, {
  StatelessProductEditModalProps,
} from "../stateless-product-edit-modal/components/stateless-product-edit-modal";
import {
  EditPrimaryButton,
  EditSecondaryCta,
  EditColorSelector,
  EditSizeSelector,
  EditErrorNotification,
} from "../stateless-product-edit-modal/components/partials";
import {
  configurePanelByCurrentSelection,
  isDefinedFn,
} from "../stateless-product-edit-modal/utils/edit-product-modal-utils";
import { useStatelessProductEditModalDemo, EditingItem } from "./use-edit-product-modal-demo";
import { ModalMockData } from "./mockData";

const PRIMARY_BUTTON_LABEL = "Add to cart";
const SECONDARY_CTA_LABEL = "Go to product overview";
const OOS_NOTIFICATION = "Sold out. Please select another combination.";

const defaultRenderNotifications: NonNullable<
  StatelessProductEditModalProps["renderNotifications"]
> = ({ isCurrentSkuAvailable }) => (
  <EditErrorNotification visible={!isCurrentSkuAvailable}>
    {OOS_NOTIFICATION}
  </EditErrorNotification>
);

type Props = {
  editingItem: EditingItem;
  renderAfterHeading?: () => React.ReactNode;
  renderAfterAttrsSelectors?: StatelessProductEditModalProps["renderAfterAttrsSelectors"];
  renderNotifications?: StatelessProductEditModalProps["renderNotifications"];
  renderPrimaryCta?: StatelessProductEditModalProps["renderPrimaryCta"];
  renderSecondaryCta?: StatelessProductEditModalProps["renderSecondaryCta"];
  onModalDismiss?: () => void;
  mockModalData?: ModalMockData;
  fetchDelayMs?: number;
};

const StatelessProductEditModalStatefulDemo = ({
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
  } = useStatelessProductEditModalDemo({
    editingItem,
    onModalDismiss,
    mockModalData,
    fetchDelayMs,
  });

  const defaultRenderPrimaryCta: NonNullable<
    StatelessProductEditModalProps["renderPrimaryCta"]
  > = ({ isCurrentSkuAvailable, currentMatchingSku }) => (
    <EditPrimaryButton
      label={PRIMARY_BUTTON_LABEL}
      disabled={!isCurrentSkuAvailable}
      onClick={() => handleAddToBagClick(currentMatchingSku)}
    />
  );

  const defaultRenderSecondaryCta: NonNullable<
    StatelessProductEditModalProps["renderSecondaryCta"]
  > = ({ currentMatchingSku }) => {
    const onClick = () => {
      handleNavigateProductDetails(currentMatchingSku);
    };

    return (
      <EditSecondaryCta
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
    <StatelessProductEditModal
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
            <EditColorSelector
              currentName={currentColorDetails?.displayName}
              currentIndex={currentColorIndex}
              selectorState={colorSelectorState}
              onSelectCallback={setCurrentColorIndex}
            />
            <EditSizeSelector
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

export default StatelessProductEditModalStatefulDemo;
