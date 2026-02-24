import React, { useState } from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./api-reference-drawer.module.scss";

type Props = {
  path?: string;
  label?: string;
};

const ApiReferenceDrawer = ({
  path = "/case-studies/stateless-configurable-modal-api",
  label = "API",
}: Props) => {
  const [open, setOpen] = useState(false);
  const apiUrl = useBaseUrl(`${path}?embedded=1`);

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? "Close API" : `${label} Reference`}
      </button>

      {open ? (
        <aside className={styles.drawer}>
          <div className={styles.header}>
            <strong>Stateless Modal API</strong>
          </div>
          <iframe title="API Reference" src={apiUrl} className={styles.frame} />
        </aside>
      ) : null}
    </>
  );
};

export default ApiReferenceDrawer;
