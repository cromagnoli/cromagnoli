import React from "react";
import styles from "../stateless-product-edit-modal.module.scss";

type Props = {
  children?: React.ReactNode;
  enableStickySecondChildFooter?: boolean;
};

const EditStickyFrame = ({
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

export default EditStickyFrame;
