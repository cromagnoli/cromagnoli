import React from "react";
import PropTypes from "prop-types";
import { ButtonTileGroup } from "../../../../stub-ui-library/button-tile-group/button-tile-group";
import cs from "classnames";
import sharedStyles from "./edit-product-selectors-shared.module.scss";

const EditProductSelectorWrapper = ({
  type,
  label,
  children,
  currentIndex,
  onSelectCallback,
  extraLabelClassName,
  extraGroupClassName,
}) => {
  return (
    <div className={sharedStyles.container}>
      <label
        id={`selected-${type}-swatch-id`}
        className={cs(sharedStyles.buttonTileGroupTitle, extraLabelClassName)}
      >
        {label}
      </label>
      <ButtonTileGroup
        selectedIndex={currentIndex}
        onSelectCallback={onSelectCallback}
        id={`${type}-tile-button-tile-group`}
        className={cs(sharedStyles.buttonTileGroup, extraGroupClassName)}
        aria-labelledby={`selected-${type}-swatch-id`}
      >
        {children}
      </ButtonTileGroup>
    </div>
  );
};

EditProductSelectorWrapper.propTypes = {
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  currentIndex: PropTypes.number.isRequired,
  onSelectCallback: PropTypes.func.isRequired,
};

export default EditProductSelectorWrapper;
