import React from "react";
import { isDefinedFn } from "../../../utils/edit-product-modal-utils";
import EditProductHeading from "./edit-product-heading";
import EditProductPrice from "./edit-product-price";
import sharedStyles from "../edit-product-selectors/edit-product-selectors-shared.module.scss";

type Props = {
  headingChildren?: React.ReactNode;
  listPrice?: string | null;
  salePrice?: string | null;
  renderHeading?: () => React.ReactNode;
  renderAfterHeading?: () => React.ReactNode;
  renderPrice?: (args: { listPrice?: string | null; salePrice?: string | null }) => React.ReactNode;
};

const EditProductHeader = ({
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
      <EditProductHeading>{headingChildren}</EditProductHeading>
    )}

    {isDefinedFn(renderAfterHeading) && renderAfterHeading()}

    {isDefinedFn(renderPrice) ? (
      renderPrice({ listPrice, salePrice })
    ) : (
      <EditProductPrice
        listPrice={listPrice}
        salePrice={salePrice}
      />
    )}
  </div>
);

export default EditProductHeader;
