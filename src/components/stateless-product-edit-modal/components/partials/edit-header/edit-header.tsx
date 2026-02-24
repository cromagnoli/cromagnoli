import React from "react";
import { isDefinedFn } from "../../../utils/edit-product-modal-utils";
import EditHeading from "./edit-heading";
import EditPrice from "./edit-price";
import sharedStyles from "../edit-selectors/edit-selectors-shared.module.scss";

type Props = {
  headingChildren?: React.ReactNode;
  listPrice?: string | null;
  salePrice?: string | null;
  renderHeading?: () => React.ReactNode;
  renderAfterHeading?: () => React.ReactNode;
  renderPrice?: (args: { listPrice?: string | null; salePrice?: string | null }) => React.ReactNode;
};

const EditHeader = ({
  headingChildren = null,
  listPrice = null,
  salePrice = null,
  renderHeading = null,
  renderAfterHeading = null,
  renderPrice = null,
}: Props) => (
  <div className={sharedStyles.container}>
    {isDefinedFn(renderHeading) ? (
      renderHeading()
    ) : (
      <EditHeading>{headingChildren}</EditHeading>
    )}

    {isDefinedFn(renderAfterHeading) && renderAfterHeading()}

    {isDefinedFn(renderPrice) ? (
      renderPrice({ listPrice, salePrice })
    ) : (
      <EditPrice
        listPrice={listPrice}
        salePrice={salePrice}
      />
    )}
  </div>
);

export default EditHeader;
