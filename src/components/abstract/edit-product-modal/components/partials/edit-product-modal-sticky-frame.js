import React from "react";
import PropTypes from "prop-types";
import styles from "../edit-product-modal.module.scss";

const EditProductStickyFrame = ({ children, enableStickySecondChildFooter }) =>
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

EditProductStickyFrame.propTypes = {
  children: PropTypes.node,
  enableStickySecondChildFooter: PropTypes.bool,
};

EditProductStickyFrame.defaultProps = {
  children: null,
  enableStickySecondChildFooter: true,
};

export default EditProductStickyFrame;
