import React from "react";
import styles from "../edit-product-modal.module.scss";

type Props = {
  children?: React.ReactNode;
};

const EditProductScrollableFrame = ({ children = null }: Props) =>
  children ? (
    <div className={styles.editProductModalInfo}>{children}</div>
  ) : null;

export default EditProductScrollableFrame;
