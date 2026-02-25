import React, { useEffect, useState } from "react";
import styles from "./api-reference-drawer.module.scss";
import StatelessModalApiContent from "./stateless-modal-api-content.mdx";

type Props = {
  label?: string;
  inline?: boolean;
};

const ApiReferenceDrawer = ({
  label = "API",
  inline = false,
}: Props) => {
  const DRAWER_ANIMATION_MS = 220;
  const [open, setOpen] = useState(false);
  const [shouldRenderDrawer, setShouldRenderDrawer] = useState(false);

  useEffect(() => {
    if (open) {
      setShouldRenderDrawer(true);
      return;
    }
    if (!shouldRenderDrawer) {
      return;
    }
    const timeoutId = window.setTimeout(
      () => setShouldRenderDrawer(false),
      DRAWER_ANIMATION_MS
    );
    return () => window.clearTimeout(timeoutId);
  }, [open, shouldRenderDrawer]);

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
        <aside
          className={`${styles.drawer} ${open ? styles.drawerActive : styles.drawerInactive}`}
          onClick={() => setOpen(false)}
        >
          <div
            className={`${styles.drawerPanel} ${open ? styles.drawerOpen : styles.drawerClosed}`}
            onClick={(event) => event.stopPropagation()}
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
            <div className={styles.content}>
              <StatelessModalApiContent />
            </div>
          </div>
        </aside>
      ) : null}
    </>
  );
};

export default ApiReferenceDrawer;
