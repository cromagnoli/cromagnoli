import React from "react";
import cs from "classnames";
import styles from "./edit-product-header.module.scss";

type Props = {
  children?: React.ReactNode;
  className?: string;
};

const EditProductHeading = ({ children = "", className }: Props) =>
  !!children && (
    <h2 className={cs("lll-text-xsmall", styles.heading, className)}>
      {children}
    </h2>
  );

export default EditProductHeading;
