import React from "react";
import PropTypes from "prop-types";
import { isDefinedFn } from "../../../utils/edit-product-modal-utils";
import EditProductHeading from "./edit-product-heading";
import EditProductPrice from "./edit-product-price";
import sharedStyles from "../edit-product-selectors/edit-product-selectors-shared.module.scss";

const EditProductHeader = ({
  headingChildren,
  listPrice,
  salePrice,
  currencyCode,
  locale,
  renderHeading,
  renderAfterHeading,
  renderPrice,
}) => (
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
        currencyCode={currencyCode}
        locale={locale}
      />
    )}
  </div>
);

EditProductHeader.propTypes = {
  headingChildren: PropTypes.node,
  listPrice: PropTypes.string,
  salePrice: PropTypes.string,
  currencyCode: PropTypes.string,
  locale: PropTypes.shape({
    lang: PropTypes.string,
    countryCode: PropTypes.string,
  }),
  renderHeading: PropTypes.func,
  renderAfterHeading: PropTypes.func,
  renderPrice: PropTypes.func,
};

EditProductHeader.defaultProps = {
  headingChildren: null,
  listPrice: null,
  salePrice: null,
  currencyCode: null,
  locale: null,
  renderHeading: null,
  renderAfterHeading: null,
  renderPrice: null,
};

export default EditProductHeader;
