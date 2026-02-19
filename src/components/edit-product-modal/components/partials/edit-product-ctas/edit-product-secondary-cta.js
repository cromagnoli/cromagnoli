import React from "react";
import PropTypes from "prop-types";
import cs from "classnames";
import styles from "./edit-product-ctas.module.scss";

const EditProductSecondaryCta = ({ href, label, className, ...otherProps }) => {
  const Tag = href ? "a" : "button";
  const linkProps = href ? { href } : {};

  return (
    <Tag
      className={cs("lll-link-primary", styles.secondaryCta, className)}
      {...linkProps}
      {...otherProps}
    >
      {label}
    </Tag>
  );
};

EditProductSecondaryCta.propTypes = {
  label: PropTypes.string.isRequired,
  href: PropTypes.string,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]),
};

EditProductSecondaryCta.defaultProps = {
  href: "",
  className: "",
};

export default EditProductSecondaryCta;
