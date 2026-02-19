import React from "react";
import cs from "classnames";
import styles from "./edit-product-ctas.module.scss";

type Props = {
  label: string;
  href?: string;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement>;

const EditProductSecondaryCta = ({
  href = "",
  label,
  className = "",
  ...otherProps
}: Props) => {
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

export default EditProductSecondaryCta;
