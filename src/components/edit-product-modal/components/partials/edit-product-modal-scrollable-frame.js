import React from "react";
import PropTypes from "prop-types";
import styles from "../edit-product-modal.module.scss";

const EditProductScrollableFrame = ({ children }) =>
  children ? (
    <div className={styles.editProductModalInfo}>{children}</div>
  ) : null;

EditProductScrollableFrame.propTypes = {
  children: PropTypes.node,
};

EditProductScrollableFrame.defaultProps = {
  children: null,
};

export default EditProductScrollableFrame;
