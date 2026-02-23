import React from "react";
import styles from "./code-header.module.scss";

type CodeHeaderProps = {
  path: string;
  href: string;
};

const CodeHeader = ({ path, href }: CodeHeaderProps) => {
  return (
    <div className={styles.header}>
      <div className={styles.box}>
        <span className={styles.path}>{path}</span>
        <a
          className={styles.link}
          href={href}
          target="_blank"
          rel="noreferrer noopener"
        >
          View Source on GitHub
        </a>
      </div>
    </div>
  );
};

export default CodeHeader;
