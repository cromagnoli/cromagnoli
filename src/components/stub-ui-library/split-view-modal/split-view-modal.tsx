import React from "react";
import cs from "classnames";
import { Modal } from "../modal/modal";
import styles from "./split-view-modal.module.scss";

type Props = {
  firstChild: React.ReactNode;
  secondChild: React.ReactNode;
  classes?: {
    container?: string;
    firstChild?: string;
    secondChild?: string;
  };
  onDismiss: (event: React.SyntheticEvent) => void;
};

const SplitViewModal = ({
  firstChild,
  secondChild,
  classes,
  onDismiss,
}: Props) => {
  const {
    container: containerClass,
    firstChild: firstChildClass,
    secondChild: secondChildClass,
  } = classes || {};

  return (
    <Modal
      visible
      messages={{ close: "Close" }}
      classes={{
        container: cs(styles.splitViewModalContainer),
        modal: cs(styles.splitViewModal),
      }}
      onRequestClose={onDismiss}
    >
      <div
        className={cs(styles.splitViewModalContentContainer, containerClass)}
      >
        <div className={firstChildClass}>{firstChild}</div>
        <div className={cs(styles.splitViewModalSecondChild, secondChildClass)}>
          {secondChild}
        </div>
      </div>
    </Modal>
  );
};

export default SplitViewModal;
