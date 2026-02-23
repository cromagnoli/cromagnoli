import React from "react";
import { ButtonTileGroup } from "../../../../stub-ui-library/button-tile-group/button-tile-group";
import cs from "classnames";
import sharedStyles from "./edit-product-selectors-shared.module.scss";

type Props = {
  type: string;
  label: string;
  children: React.ReactNode;
  currentIndex: number;
  onSelectCallback: (index: number) => void;
  extraLabelClassName?: string;
  extraGroupClassName?: string;
};

const EditProductSelectorWrapper = ({
  type,
  label,
  children,
  currentIndex,
  onSelectCallback,
  extraLabelClassName,
  extraGroupClassName,
}: Props) => {
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

export default EditProductSelectorWrapper;
