import React, { useEffect, useState } from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./api-reference-drawer.module.scss";

type Props = {
  path?: string;
  label?: string;
  inline?: boolean;
};

const ApiReferenceDrawer = ({
  path = "/case-studies/stateless-configurable-modal-api",
  label = "API",
  inline = false,
}: Props) => {
  const DRAWER_ANIMATION_MS = 220;
  const [open, setOpen] = useState(false);
  const [shouldRenderDrawer, setShouldRenderDrawer] = useState(false);
  const apiUrl = useBaseUrl(`${path}?embedded=1`);

  useEffect(() => {
    if (open) {
      setShouldRenderDrawer(true);
      return;
    }
    const timeoutId = window.setTimeout(
      () => setShouldRenderDrawer(false),
      DRAWER_ANIMATION_MS
    );
    return () => window.clearTimeout(timeoutId);
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        className={`${styles.trigger} ${inline ? styles.triggerInline : ""}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? "Close API" : `${label} Reference`}
      </button>

      {shouldRenderDrawer ? (
        <aside className={styles.drawer}>
          <div
            className={`${styles.drawerPanel} ${open ? styles.drawerOpen : styles.drawerClosed}`}
          >
            <div className={styles.header}>
            <strong>Stateless Modal API</strong>
            <button
              type="button"
              className={styles.close}
              aria-label="Close API reference"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
            </div>
            <iframe title="API Reference" src={apiUrl} className={styles.frame} />
          </div>
        </aside>
      ) : null}
    </>
  );
};

export default ApiReferenceDrawer;
