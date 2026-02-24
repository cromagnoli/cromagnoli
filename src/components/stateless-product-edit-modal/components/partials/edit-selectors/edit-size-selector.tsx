import React from "react";
import EditSelectorWrapper from "./edit-selector-wrapper";
import { ButtonTile } from "../../../../stub-ui-library/button-tile/button-tile";
import { SizeTile } from "../../../../stub-ui-library/size-tile/size-tile";
import cs from "classnames";
import sharedStyles from "./edit-selectors-shared.module.scss";
import { SizeOption } from "../../../types";

const SIZE_SELECTOR_TYPE = "size";

type Props = {
  currentSize?: string;
  currentIndex: number;
  selectorState: SizeOption[];
  onSelectCallback: (index: number) => void;
  label?: string;
  extraLabelClassName?: string;
};

const EditSizeSelector = ({
  currentSize,
  currentIndex,
  selectorState,
  onSelectCallback,
  label = `Size: ${currentSize || "--"}`,
  extraLabelClassName,
}: Props) => {
  return (
    <EditSelectorWrapper
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
    </EditSelectorWrapper>
  );
};

export default EditSizeSelector;
