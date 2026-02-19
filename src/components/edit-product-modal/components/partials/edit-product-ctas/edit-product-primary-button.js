import React from "react";
import PropTypes from "prop-types";
import cs from "classnames";
import styles from "./edit-product-ctas.module.scss";

const EditProductPrimaryButton = ({ disabled, onClick, label, className }) => (
  <button
    type="button"
    className={cs(styles.primaryButton, className)}
    disabled={disabled}
    onClick={onClick}
  >
    {label}
  </button>
);

EditProductPrimaryButton.propTypes = {
  label: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]),
};

EditProductPrimaryButton.defaultProps = {
  disabled: false,
  className: "",
};

export default EditProductPrimaryButton;
