import React from "react";
import PropTypes from "prop-types";
import cs from "classnames";
import styles from "./edit-product-header.module.scss";

// Simplification for demo – The real world implementation supports list and sale prices
const EditProductPrice = ({ price, className }) => (
  <div className={cs(styles.currency, className)}>
    {price ? <span>$ {price}</span> : null}
  </div>
);

EditProductPrice.propTypes = {
  listPrice: PropTypes.string,
  salePrice: PropTypes.string,
  currencyCode: PropTypes.string,
  showCurrencyCode: PropTypes.bool,
  locale: PropTypes.shape({
    lang: PropTypes.string,
    countryCode: PropTypes.string,
  }),
};

EditProductPrice.defaultProps = {
  listPrice: null,
  salePrice: null,
  currencyCode: null,
  showCurrencyCode: true,
  locale: null,
};

export default EditProductPrice;
