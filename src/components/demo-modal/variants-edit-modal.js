import React, { useEffect, useRef, useState } from "react";
import Pill from "../abstract/pill";
import EditProductModal from "../abstract/edit-product-modal/components/edit-product-modal";
import {
  EditProductPrimaryButton,
  EditProductSecondaryCta,
  EditProductColorSelector,
  EditProductErrorNotification,
} from "../abstract/edit-product-modal/components/partials";
import mockData from "./mockData";

const PRIMARY_BUTTON_LABEL = "Add to cart";
const SECONDARY_CTA_LABEL = "View product details";
const OOS_NOTIFICATION = "Sold out";

const trackUserInteraction = ({
  userAction,
  productSummary,
  activeSku,
}) => {
  console.log(`Tracking user interaction: ${userAction}`, { productSummary, activeSku });
};

const fakeModalDataFetch = () => new Promise((resolve, reject) => setTimeout(resolve(mockData), 500));

const VariantsEditProductModal = ({
  editingItem,
  editingItemIndex,
  onModalDismiss,
}) => {
  const standardLocale = useLocaleStandard();
  const priceInfo = usePriceInfo();
  const locale = getParsedLocale();
  const router = useRouter();
  const [skuVariants, setSkuVariants] = useState({});
  const [productSummary, setProductSummary] = useState({});
  const isMount = useRef(true);

  const onDismiss = ({ currentMatchingSku }) => {
    trackUserInteraction({
      userAction: "modal:close",
      productSummary,
      activeSku: currentMatchingSku,
    });

    onModalDismiss();
  };

  const handleAddToBagClick = async (activeSku) => {
    try {
      alert("Item added to cart!")

      trackUserInteraction({
        userAction: "modal:addToCart",
        productSummary,
        activeSku,
      });

      onModalDismiss();
    } catch (error) {
      // Ellipsis
    }
  };
  const { currencyCode } = getPriceProps(priceInfo);

  const { productName, productUrl, imageUrl, colorCode, size } = editingItem;

  useEffect(() => {
    if (isMount.current) {
      isMount.current = false;

      fakeModalDataFetch()
        .then(({ skuVariants, productSummary }) => {
          setSkuVariants(skuVariants);
          setProductSummary(productSummary);

          // Temporary for AB Test - Upon productization all activeSku details
          // would be available even before fetching variants. In such case this
          // logic should be removed.
          const activeSku = skuVariants?.availableSkus?.find(
            (sku) => sku.colorCode === colorCode && sku.size === size
          );

          trackUserInteraction({
            userAction: "modal:view",
            productSummary,
            activeSku,
          });
        })
        .catch(() => {
          onModalDismiss();
        });
    }
  }, [
    colorCode,
    productName,
    editingItem,
    editingItemIndex,
    locale,
    onModalDismiss,
    size,
    standardLocale,
  ]);

  return (
    <EditProductModal
      mainHeading={productName}
      productName={productName}
      initialImageUrl={imageUrl}
      initialColorCode={colorCode}
      initialSize={size}
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
      renderSecondaryCta={({
        currentColorDetails,
        currentSizeDetails,
        currentMatchingSku,
      }) => {
        const onClick = () => {
          trackUserInteraction({
            userAction: "modal:navigate-product-details",
            productSummary,
            activeSku: currentMatchingSku,
          });

          alert("This interaction would cause user navigation to product detail page");

          onModalDismiss();
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
        setCurrentColorIndex,
        availableSkus,
      }) => {
        const onSelectCallback = (index) => {
          setCurrentColorIndex(index);
        };

        if (
          typeof prevColorIndex === "number" &&
          currentColorIndex !== prevColorIndex
        ) {
          trackUserInteraction({
            userAction: "modal:color-selection",
            productSummary,
            activeSku: currentMatchingSku,
          });
        }

        return (
          <EditProductColorSelector
            currentName={currentColorDetails?.displayName}
            currentIndex={currentColorIndex}
            selectorState={colors}
            onSelectCallback={onSelectCallback}
          />
        );
      }}
      renderAfterHeading={<Pill>NEW</Pill>}
    />
  );
};
VariantsEditProductModal.propTypes = {
  editingItem: shape({
    productName: string.isRequired,
    productUrl: string.isRequired,
    imageUrl: string.isRequired,
    colorCode: string.isRequired,
    size: string.isRequired,
  }).isRequired,
  editingItemIndex: number.isRequired,
  onModalDismiss: func,
};
VariantsEditProductModal.defaultProps = {
  onModalDismiss: () => {},
};

export default VariantsEditProductModal;
