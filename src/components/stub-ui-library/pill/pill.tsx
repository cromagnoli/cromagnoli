import React from "react";
import styles from "./pill.module.scss";

type Props = {
  children: React.ReactNode;
};

const Pill = ({ children }: Props) => <span className={styles.pill}>{children}</span>;

export default Pill;
