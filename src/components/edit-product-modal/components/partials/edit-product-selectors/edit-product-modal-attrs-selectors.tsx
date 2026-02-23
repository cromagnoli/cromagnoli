import React from "react";
import EditProductColorSelector from "./edit-product-color-selector";
import EditProductSizeSelector from "./edit-product-size-selector";
import { configurePanelByCurrentSelection } from "../../../utils/edit-product-modal-utils";
import {
  ColorOption,
  ColorToSizeMap,
  SizeOption,
  SizeToColorMap,
} from "../../../types";

type Props = {
  currentColorCode?: string;
  currentColorName?: string;
  currentSize?: string;
  currentColorIndex: number;
  onColorSelectCallback: (index: number) => void;
  currentSizeIndex: number;
  onSizeSelectCallback: (index: number) => void;
  colors: ColorOption[];
  sizes: SizeOption[];
  colorToSizeMap: ColorToSizeMap;
  sizeToColorMap: SizeToColorMap;
};

const EditProductAttrsSelectors = ({
  currentColorCode,
  currentColorName,
  currentSize,
  currentColorIndex,
  onColorSelectCallback,
  currentSizeIndex,
  onSizeSelectCallback,
  colors,
  sizes,
  colorToSizeMap,
  sizeToColorMap,
}: Props) => {
  const selectorsPanelState = configurePanelByCurrentSelection(
    currentColorCode,
    currentSize,
    colors,
    sizes,
    colorToSizeMap,
    sizeToColorMap
  );
  const { sizeSelectorState, colorSelectorState } = selectorsPanelState;

  return (
    <>
      <EditProductColorSelector
        currentName={currentColorName}
        currentIndex={currentColorIndex}
        selectorState={colorSelectorState}
        onSelectCallback={onColorSelectCallback}
      />
      <EditProductSizeSelector
        currentSize={currentSize}
        currentIndex={currentSizeIndex}
        selectorState={sizeSelectorState}
        onSelectCallback={onSizeSelectCallback}
      />
    </>
  );
};

export default EditProductAttrsSelectors;
