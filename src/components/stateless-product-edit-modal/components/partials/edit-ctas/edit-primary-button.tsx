import React from "react";
import cs from "classnames";
import styles from "./edit-ctas.module.scss";

type Props = {
  label: React.ReactNode;
  disabled?: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
};

const EditPrimaryButton = ({
  disabled = false,
  onClick,
  label,
  className = "",
}: Props) => (
  <button
    type="button"
    className={cs(styles.primaryButton, className)}
    disabled={disabled}
    onClick={onClick}
  >
    {label}
  </button>
);

export default EditPrimaryButton;
