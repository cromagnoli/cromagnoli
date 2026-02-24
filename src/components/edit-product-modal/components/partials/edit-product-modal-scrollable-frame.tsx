import React, { useEffect, useRef, useState } from "react";
import styles from "../edit-product-modal.module.scss";

type Props = {
  children?: React.ReactNode;
};

const EditProductScrollableFrame = ({ children = null }: Props) => {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    const node = frameRef.current;
    if (!node) {
      return;
    }

    const updateOverflowState = () => {
      setHasOverflow(node.scrollHeight > node.clientHeight + 1);
    };

    updateOverflowState();

    const resizeObserver = new ResizeObserver(updateOverflowState);
    resizeObserver.observe(node);
    window.addEventListener("resize", updateOverflowState);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateOverflowState);
    };
  }, [children]);

  return children ? (
    <div
      ref={frameRef}
      className={`${styles.editProductModalInfo} ${hasOverflow ? styles.hasScrollHint : ""}`}
    >
      {children}
    </div>
  ) : null;
};

export default EditProductScrollableFrame;
