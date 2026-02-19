import React from "react";
import cs from "classnames";
import styles from "./edit-product-header.module.scss";
import { Locale } from "../../../types";

type Props = {
  price?: string;
  className?: string;
  listPrice?: string | null;
  salePrice?: string | null;
  currencyCode?: string | null;
  showCurrencyCode?: boolean;
  locale?: Locale | null;
};

// Simplification for demo – The real world implementation supports list and sale prices
const EditProductPrice = ({ price, className }: Props) => (
  <div className={cs(styles.currency, className)}>
    {price ? <span>$ {price}</span> : null}
  </div>
);

export default EditProductPrice;
