import React, { useEffect, useRef, useState } from "react";
import Pill from "../stub-ui-library/pill";
import EditProductModal from "../edit-product-modal/components/edit-product-modal";
import {
  EditProductPrimaryButton,
  EditProductSecondaryCta,
  EditProductColorSelector,
  EditProductErrorNotification,
} from "../edit-product-modal/components/partials";
import mockData from "./mockData";
import { Locale, MaybeSku, SkuVariants } from "../edit-product-modal/types";

const PRIMARY_BUTTON_LABEL = "Add to cart";
const SECONDARY_CTA_LABEL = "View product details";
const OOS_NOTIFICATION = "Sold out";

type ProductSummary = Record<string, unknown>;

type TrackUserInteractionArgs = {
  userAction: string;
  productSummary: ProductSummary;
  activeSku: MaybeSku | null | undefined;
};

type EditingItem = {
  productName: string;
  productUrl: string;
  imageUrl: string;
  colorCode: string;
  size: string;
};

type Props = {
  editingItem: EditingItem;
  editingItemIndex: number;
  onModalDismiss?: () => void;
};

type PriceInfo = {
  currencyCode: string;
};

const trackUserInteraction = ({
  userAction,
  productSummary,
  activeSku,
}: TrackUserInteractionArgs) => {
  console.log(`Tracking user interaction: ${userAction}`, {
    productSummary,
    activeSku,
  });
};

const fakeModalDataFetch = ():
  Promise<{ skuVariants: SkuVariants; productSummary: ProductSummary }> =>
  new Promise((resolve) => setTimeout(() => resolve(mockData), 500));

const useLocaleStandard = (): Locale => ({ lang: "en", countryCode: "US" });
const usePriceInfo = (): PriceInfo => ({ currencyCode: "USD" });
const getParsedLocale = (): Locale => ({ lang: "en", countryCode: "US" });
const getPriceProps = (priceInfo?: PriceInfo) => priceInfo ?? { currencyCode: "USD" };
const useRouter = () => ({ push: () => {} });

const VariantsEditProductModal = ({
  editingItem,
  editingItemIndex,
  onModalDismiss = () => {},
}: Props) => {
  const standardLocale = useLocaleStandard();
  const priceInfo = usePriceInfo();
  const locale = getParsedLocale();
  const router = useRouter();
  const [skuVariants, setSkuVariants] = useState<SkuVariants>({});
  const [productSummary, setProductSummary] = useState<ProductSummary>({});
  const isMount = useRef(true);

  const onDismiss = ({
    currentMatchingSku,
  }: {
    event: React.SyntheticEvent;
    currentMatchingSku: MaybeSku | null;
  }) => {
    trackUserInteraction({
      userAction: "modal:close",
      productSummary,
      activeSku: currentMatchingSku,
    });

    onModalDismiss();
  };

  const handleAddToBagClick = async (
    activeSku: MaybeSku | null | undefined
  ) => {
    try {
      alert("Item added to cart!");

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
  void productUrl;
  void router;

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
        void currentColorDetails;
        void currentSizeDetails;
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
        void availableSkus;
        const onSelectCallback = (index: number) => {
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

export default VariantsEditProductModal;
