import React from "react";
import styles from "../edit-product-modal.module.scss";

type Props = {
  children?: React.ReactNode;
  enableStickySecondChildFooter?: boolean;
};

const EditProductStickyFrame = ({
  children = null,
  enableStickySecondChildFooter = true,
}: Props) =>
  children ? (
    <div
      className={
        enableStickySecondChildFooter
          ? styles.bottomStickyEditingPanelContainer
          : ""
      }
    >
      {children}
    </div>
  ) : null;

export default EditProductStickyFrame;
