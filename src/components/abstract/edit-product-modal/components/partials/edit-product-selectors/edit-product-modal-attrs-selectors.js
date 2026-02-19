import React from "react";
import EditProductColorSelector from "./edit-product-color-selector";
import EditProductSizeSelector from "./edit-product-size-selector";
import { configurePanelByCurrentSelection } from "../../../utils/edit-product-modal-utils";
import PropTypes from "prop-types";

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
}) => {
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

EditProductAttrsSelectors.propTypes = {
  currentColorCode: PropTypes.string.isRequired,
  currentColorName: PropTypes.string.isRequired,
  currentSize: PropTypes.string.isRequired,
  currentColorIndex: PropTypes.number.isRequired,
  onColorSelectCallback: PropTypes.func.isRequired,
  currentSizeIndex: PropTypes.number.isRequired,
  onSizeSelectCallback: PropTypes.func.isRequired,
  colors: PropTypes.arrayOf(
    PropTypes.shape({
      colorCode: PropTypes.string,
      name: PropTypes.string,
      available: PropTypes.bool,
    })
  ).isRequired,
  sizes: PropTypes.arrayOf(
    PropTypes.shape({
      size: PropTypes.string,
      available: PropTypes.bool,
    })
  ).isRequired,
  colorToSizeMap: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string))
    .isRequired,
  sizeToColorMap: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string))
    .isRequired,
};

export default EditProductAttrsSelectors;
