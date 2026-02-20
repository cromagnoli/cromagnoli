import React from "react";
import cs from "classnames";
import styles from "./edit-product-header.module.scss";
import { Locale } from "../../../types";

type Props = {
  className?: string;
  listPrice?: string | null;
  salePrice?: string | null;
  currencyCode?: string | null;
  showCurrencyCode?: boolean;
  locale?: Locale | null;
};

// Simplification for demo – The real world implementation supports list and sale prices
const EditProductPrice = ({ listPrice, salePrice, className }: Props) => (
  <div className={cs(styles.currency, className)}>
    {salePrice ? (
      <>
        <span className={styles.salePrice}>$ {salePrice}</span>
        {listPrice ? <span className={styles.listPrice}>$ {listPrice}</span> : null}
      </>
    ) : listPrice ? (
      <span>$ {listPrice}</span>
    ) : null}
  </div>
);

export default EditProductPrice;
