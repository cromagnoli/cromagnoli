import React from "react";
import cs from "classnames";
import styles from "./edit-header.module.scss";

type Props = {
  className?: string;
  listPrice?: string | null;
  salePrice?: string | null;
};

// Simplification for demo – The real world implementation supports list and sale prices
const EditPrice = ({ listPrice, salePrice, className }: Props) => {
  if (!salePrice && !listPrice) {
    return null;
  }

  return (
    <div className={cs(styles.currency, className)}>
      {salePrice ? (
        <>
          <span className={styles.salePrice}>$ {salePrice}</span>
          {listPrice ? <span className={styles.listPrice}>$ {listPrice}</span> : null}
        </>
      ) : (
        <span>$ {listPrice}</span>
      )}
    </div>
  );
};

export default EditPrice;
