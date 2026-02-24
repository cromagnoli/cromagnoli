import React from "react";
import EditSelectorWrapper from "./edit-selector-wrapper";
import { ButtonTile } from "../../../../stub-ui-library/button-tile/button-tile";
import { ColorSwatch } from "../../../../stub-ui-library/color-swatch/color-swatch";
import cs from "classnames";
import sharedStyles from "./edit-selectors-shared.module.scss";
import styles from "./edit-color-selector.module.scss";
import { ColorOption } from "../../../types";

const COLOR_SELECTOR_TYPE = "color";

type Props = {
  currentName?: string;
  currentIndex: number;
  selectorState: ColorOption[];
  onSelectCallback: (index: number) => void;
  extraLabelClassName?: string;
};

const EditColorSelector = ({
  currentName,
  currentIndex,
  selectorState,
  onSelectCallback,
  extraLabelClassName,
}: Props) => {
  const label = `Color: ${currentName || "--"}`;

  return (
    <EditSelectorWrapper
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
          <ColorSwatch colorCode={colorCode} name={displayName} />
        </ButtonTile>
      ))}
    </EditSelectorWrapper>
  );
};

export default EditColorSelector;
