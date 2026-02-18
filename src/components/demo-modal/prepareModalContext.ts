
import { SkuVariants } from "./types";

export type ModalContext = {
  selectedColor: string;
  selectedSize: string;
  setColor: (c: string) => void;
  setSize: (s: string) => void;
  currentSku: any;
  isAvailable: boolean;
  variants: SkuVariants;
};

export function prepareModalContext(
  variants: SkuVariants,
  selectedColor: string,
  selectedSize: string
) {
  const currentSku =
    variants.availableSkus.find(
      (s) => s.colorCode === selectedColor && s.size === selectedSize
    ) || null;

  return {
    currentSku,
    isAvailable: !!currentSku,
  };
}
