import React from "react";
import PropTypes from "prop-types";
import cs from "classnames";
import styles from "./edit-product-header.module.scss";

const EditProductHeading = ({ children, className }) =>
  !!children && (
    <h2 className={cs("lll-text-xsmall", styles.heading, className)}>
      {children}
    </h2>
  );

EditProductHeading.propTypes = {
  children: PropTypes.node,
};

EditProductHeading.defaultProps = {
  children: "",
};

export default EditProductHeading;
