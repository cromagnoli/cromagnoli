import React from "react";
import PropTypes from "prop-types";
import EditProductSelectorWrapper from "./edit-product-selector-wrapper";
import { ButtonTile } from "../../../../stub-ui-library/button-tile/button-tile";
import { SizeTile } from "../../../../stub-ui-library/size-tile/size-tile";
import cs from "classnames";
import sharedStyles from "./edit-product-selectors-shared.module.scss";

const SIZE_SELECTOR_TYPE = "size";

const EditProductSizeSelector = ({
  currentSize,
  currentIndex,
  selectorState,
  onSelectCallback,
  label = `Size: ${currentSize || "--"}`,
  extraLabelClassName,
}) => {
  return (
    <EditProductSelectorWrapper
      currentIndex={currentIndex}
      onSelectCallback={onSelectCallback}
      extraLabelClassName={extraLabelClassName}
      label={label}
      type={SIZE_SELECTOR_TYPE}
    >
      {selectorState.map(({ size, available }) => (
        <ButtonTile
          isDisabled={!available}
          key={`${size}`.trim()}
          className={cs(sharedStyles.buttonTile)}
        >
          <SizeTile text={size} />
        </ButtonTile>
      ))}
    </EditProductSelectorWrapper>
  );
};

EditProductSizeSelector.propTypes = {
  currentSize: PropTypes.string.isRequired,
  currentIndex: PropTypes.number.isRequired,
  selectorState: PropTypes.arrayOf(
    PropTypes.shape({
      size: PropTypes.string,
      available: PropTypes.bool,
    })
  ).isRequired,
  onSelectCallback: PropTypes.func.isRequired,
};

export default EditProductSizeSelector;
