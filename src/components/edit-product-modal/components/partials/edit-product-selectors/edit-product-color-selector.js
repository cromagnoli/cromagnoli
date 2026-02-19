import React from "react";
import PropTypes from "prop-types";
import EditProductSelectorWrapper from "./edit-product-selector-wrapper";
import { ButtonTile } from "../../../../stub-ui-library/button-tile/button-tile";
import { ColorSwatch } from "../../../../stub-ui-library/color-swatch/color-swatch";
import cs from "classnames";
import sharedStyles from "./edit-product-selectors-shared.module.scss";
import styles from "./edit-product-color-selector.module.scss";

const COLOR_SELECTOR_TYPE = "color";

const EditProductColorSelector = ({
  currentName,
  currentIndex,
  selectorState,
  onSelectCallback,
  extraLabelClassName,
}) => {
  const label = `Color: ${currentName || "--"}`;

  return (
    <EditProductSelectorWrapper
      currentIndex={currentIndex}
      onSelectCallback={onSelectCallback}
      extraLabelClassName={extraLabelClassName}
      label={label}
      type={COLOR_SELECTOR_TYPE}
      extraGroupClassName={cs(
        styles.capitalizeColorName,
        styles.colorButtonTileGroup
      )}
    >
      {selectorState.map(({ colorCode, displayName, available }) => (
        <ButtonTile
          isDisabled={!available}
          key={`${displayName}`.trim()}
          id={`${colorCode}_color_code`}
          className={cs(sharedStyles.buttonTile)}
        >
          <ColorSwatch id={colorCode} name={displayName} />
        </ButtonTile>
      ))}
    </EditProductSelectorWrapper>
  );
};

EditProductColorSelector.propTypes = {
  currentName: PropTypes.string.isRequired,
  currentIndex: PropTypes.number.isRequired,
  selectorState: PropTypes.arrayOf(
    PropTypes.shape({
      colorCode: PropTypes.string,
      name: PropTypes.string,
      available: PropTypes.bool,
    })
  ).isRequired,
  onSelectCallback: PropTypes.func.isRequired,
};

export default EditProductColorSelector;
