import { SkuVariants as ModalSkuVariants } from "../edit-product-modal/types";
import sneakersFfffff from "@site/static/images/sneakers-ffffff.png";
import sneakersFfffff_2 from "@site/static/images/sneakers-ffffff-2.png";
import sneakers444444 from "@site/static/images/sneakers-444444.png";
import sneakers444444_2 from "@site/static/images/sneakers-444444-2.png";
import sneakersC7d2fe from "@site/static/images/sneakers-c7d2fe.png";
import sneakersC7d2fe_2 from "@site/static/images/sneakers-c7d2fe-2.png";
import sneakers93c5fd from "@site/static/images/sneakers-93c5fd.png";
import sneakers93c5fd_2 from "@site/static/images/sneakers-93c5fd-2.png";
import sneakers60a5fa from "@site/static/images/sneakers-60a5fa.png";
import sneakers60a5fa_2 from "@site/static/images/sneakers-60a5fa-2.png";
import sneakersFbcfe8 from "@site/static/images/sneakers-fbcfe8.png";
import sneakersFbcfe8_2 from "@site/static/images/sneakers-fbcfe8-2.png";
import sneakersFda4af from "@site/static/images/sneakers-fda4af.png";
import sneakersFda4af_2 from "@site/static/images/sneakers-fda4af-2.png";
import sneakersFde68a from "@site/static/images/sneakers-fde68a.png";
import sneakersFde68a_2 from "@site/static/images/sneakers-fde68a-2.png";
import sneakersA7f3d0 from "@site/static/images/sneakers-a7f3d0.png";
import sneakersA7f3d0_2 from "@site/static/images/sneakers-a7f3d0-2.png";
import sneakers22c55e from "@site/static/images/sneakers-22c55e.png";
import sneakers22c55e_2 from "@site/static/images/sneakers-22c55e-2.png";
import sneakersBae6fd from "@site/static/images/sneakers-bae6fd.png";
import sneakersBae6fd_2 from "@site/static/images/sneakers-bae6fd-2.png";
import sneakersCbd5e1 from "@site/static/images/sneakers-cbd5e1.png";
import sneakersCbd5e1_2 from "@site/static/images/sneakers-cbd5e1-2.png";

export type ModalMockData = {
  skuVariants: ModalSkuVariants;
  productSummary: { productId: string; displayName: string };
};

const modalMockData: ModalMockData = {
  skuVariants: {
    colors: [
      { colorCode: "ffffff", displayName: "White", available: true },
      { colorCode: "444444", displayName: "Graphite", available: true },
    ],
    sizes: [
      { size: "10", available: true },
      { size: "11", available: true },
      { size: "12", available: true },
    ],
    availableSkus: [
      { id: "1", colorCode: "ffffff", size: "10", listPrice: "128.00", salePrice: "98.00", available: true },
      { id: "2", colorCode: "ffffff", size: "11", listPrice: "128.00", available: false },
      { id: "3", colorCode: "ffffff", size: "12", listPrice: "128.00", available: true },
      { id: "4", colorCode: "444444", size: "10", listPrice: "128.00", available: false },
      { id: "5", colorCode: "444444", size: "11", listPrice: "128.00", available: true },
      { id: "6", colorCode: "444444", size: "12", listPrice: "128.00", available: true },
    ],
    imagesByColorCode: {
      "ffffff": [sneakersFfffff, sneakersFfffff_2],
      "444444": [sneakers444444, sneakers444444_2],
    },
  },
  productSummary: {
    productId: "prod1234",
    displayName: "BuyMeNot Sneakers",
  },
};

const HIGH_VOLUME_COLOR_CODES = [
  "ffffff",
  "444444",
  "c7d2fe",
  "93c5fd",
  "60a5fa",
  "fbcfe8",
  "fda4af",
  "fde68a",
  "a7f3d0",
  "22c55e",
  "bae6fd",
  "cbd5e1",
];

const HIGH_VOLUME_COLOR_NAMES = [
  "Cloud White",
  "Urban Graphite",
  "Soft Lilac",
  "Sky Blue",
  "Ocean Blue",
  "Pink Bloom",
  "Coral Blush",
  "Sun Sand",
  "Mint Leaf",
  "Vivid Green",
  "Ice Blue",
  "Silver Mist",
];

const HIGH_VOLUME_SIZES = Array.from({ length: 40 }, (_, idx) => {
  const value = 5 + idx * 0.5;
  const isSingleDigit = value < 10;

  const sizeLabel = isSingleDigit
    ? value.toFixed(1)
    : Number.isInteger(value)
      ? String(value)
      : value.toFixed(1);

  return {
    size: sizeLabel,
    available: true,
  };
});

const HIGH_VOLUME_COLORS = HIGH_VOLUME_COLOR_CODES.map((colorCode, idx) => ({
  colorCode,
  displayName: HIGH_VOLUME_COLOR_NAMES[idx] ?? `Tone ${idx + 1}`,
  available: true,
}));

const HIGH_VOLUME_AVAILABLE_SKUS = HIGH_VOLUME_COLORS.flatMap(
  (color, colorIdx) =>
    HIGH_VOLUME_SIZES.map((size, sizeIdx) => ({
      id: `hv-${colorIdx + 1}-${sizeIdx + 1}`,
      colorCode: color.colorCode,
      size: size.size,
      listPrice: "138.00",
      salePrice: (colorIdx + sizeIdx) % 5 === 0 ? "118.00" : undefined,
      available: (colorIdx + sizeIdx) % 4 !== 0,
    }))
);

const HIGH_VOLUME_IMAGES_BY_CODE: Record<string, string[]> = {
  ffffff: [sneakersFfffff, sneakersFfffff_2],
  "444444": [sneakers444444, sneakers444444_2],
  c7d2fe: [sneakersC7d2fe, sneakersC7d2fe_2],
  "93c5fd": [sneakers93c5fd, sneakers93c5fd_2],
  "60a5fa": [sneakers60a5fa, sneakers60a5fa_2],
  fbcfe8: [sneakersFbcfe8, sneakersFbcfe8_2],
  fda4af: [sneakersFda4af, sneakersFda4af_2],
  fde68a: [sneakersFde68a, sneakersFde68a_2],
  a7f3d0: [sneakersA7f3d0, sneakersA7f3d0_2],
  "22c55e": [sneakers22c55e, sneakers22c55e_2],
  bae6fd: [sneakersBae6fd, sneakersBae6fd_2],
  cbd5e1: [sneakersCbd5e1, sneakersCbd5e1_2],
};

const HIGH_VOLUME_IMAGES_BY_COLOR_CODE = Object.fromEntries(
  HIGH_VOLUME_COLORS.map((color) => [
    color.colorCode,
    HIGH_VOLUME_IMAGES_BY_CODE[color.colorCode] ?? [sneakersFfffff, sneakersFfffff_2],
  ])
);

export const highVolumeModalMockData: ModalMockData = {
  skuVariants: {
    colors: HIGH_VOLUME_COLORS,
    sizes: HIGH_VOLUME_SIZES,
    availableSkus: HIGH_VOLUME_AVAILABLE_SKUS,
    imagesByColorCode: HIGH_VOLUME_IMAGES_BY_COLOR_CODE,
  },
  productSummary: {
    productId: "prod-overflow-3001",
    displayName: "BuyMeNot Sneakers",
  },
};

const DEFAULT_HIGH_VOLUME_COLOR_CODE = "22c55e";

export const highVolumeFirstSku =
  highVolumeModalMockData.skuVariants.availableSkus?.find(
    (sku) => !sku.available && sku.colorCode === DEFAULT_HIGH_VOLUME_COLOR_CODE
  ) ??
  highVolumeModalMockData.skuVariants.availableSkus?.find(
    (sku) => !sku.available
  ) ??
  highVolumeModalMockData.skuVariants.availableSkus?.find(
    (sku) => sku.available
  ) ??
  highVolumeModalMockData.skuVariants.availableSkus?.[0];

export const highVolumeEditingItem = {
  productName: highVolumeModalMockData.productSummary.displayName,
  productUrl: `/products/${highVolumeModalMockData.productSummary.productId}`,
  imageUrl:
    highVolumeFirstSku &&
    highVolumeModalMockData.skuVariants.imagesByColorCode?.[
      highVolumeFirstSku.colorCode
    ]?.[0]
      ? highVolumeModalMockData.skuVariants.imagesByColorCode[
          highVolumeFirstSku.colorCode
        ][0]
      : sneakersFfffff,
  colorCode: highVolumeFirstSku?.colorCode ?? DEFAULT_HIGH_VOLUME_COLOR_CODE,
  size: highVolumeFirstSku?.size ?? "5.0",
};

export default modalMockData;
