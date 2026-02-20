import React, { useEffect, useRef, useState } from "react";
import mockData from "./mockData";
import { Locale, MaybeSku, SkuVariants } from "../edit-product-modal/types";

export type ProductSummary = Record<string, unknown>;

export type EditingItem = {
  productName: string;
  productUrl: string;
  imageUrl: string;
  colorCode: string;
  size: string;
};

type TrackUserInteractionArgs = {
  userAction: string;
  productSummary: ProductSummary;
  activeSku: MaybeSku | null | undefined;
};

type PriceInfo = {
  currencyCode: string;
};

type UseEditProductModalDemoArgs = {
  editingItem: EditingItem;
  editingItemIndex: number;
  onModalDismiss: () => void;
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
  new Promise((resolve) => setTimeout(() => resolve(mockData), 1200));

const useLocaleStandard = (): Locale => ({ lang: "en", countryCode: "US" });
const usePriceInfo = (): PriceInfo => ({ currencyCode: "USD" });
const getParsedLocale = (): Locale => ({ lang: "en", countryCode: "US" });
const getPriceProps = (priceInfo?: PriceInfo) =>
  priceInfo ?? { currencyCode: "USD" };
const useRouter = () => ({ push: () => {} });

export const useEditProductModalDemo = ({
  editingItem,
  editingItemIndex,
  onModalDismiss,
}: UseEditProductModalDemoArgs) => {
  const standardLocale = useLocaleStandard();
  const priceInfo = usePriceInfo();
  const locale = getParsedLocale();
  const router = useRouter();
  const [skuVariants, setSkuVariants] = useState<SkuVariants>({});
  const [productSummary, setProductSummary] = useState<ProductSummary>({});
  const isMount = useRef(true);

  const { currencyCode } = getPriceProps(priceInfo);
  const { productName, productUrl, imageUrl, colorCode, size } = editingItem;
  void productUrl;
  void router;

  useEffect(() => {
    if (!isMount.current) {
      return;
    }

    isMount.current = false;

    fakeModalDataFetch()
      .then(({ skuVariants, productSummary }) => {
        setSkuVariants(skuVariants);
        setProductSummary(productSummary);

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
  }, [
    colorCode,
    editingItem,
    editingItemIndex,
    locale,
    onModalDismiss,
    productName,
    size,
    standardLocale,
  ]);

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

    alert(
      "In production, this action would close the modal. It stays open here for demo purposes."
    );

    onModalDismiss();
  };

  const handleAddToBagClick = async (activeSku: MaybeSku | null | undefined) => {
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

  const handleNavigateProductDetails = (currentMatchingSku: MaybeSku) => {
    trackUserInteraction({
      userAction: "modal:navigate-product-details",
      productSummary,
      activeSku: currentMatchingSku,
    });

    alert("This interaction would cause user navigation to product detail page");
    onModalDismiss();
  };

  const trackColorSelection = (
    currentMatchingSku: MaybeSku,
    currentColorIndex: number,
    prevColorIndex: number | undefined
  ) => {
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
  };

  return {
    currencyCode,
    imageUrl,
    colorCode,
    locale,
    onDismiss,
    handleAddToBagClick,
    handleNavigateProductDetails,
    initialSize: size,
    productName,
    skuVariants,
    trackColorSelection,
  };
};
