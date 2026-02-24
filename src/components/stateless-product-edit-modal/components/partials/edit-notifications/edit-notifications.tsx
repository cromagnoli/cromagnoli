import React from "react";
import cs from "classnames";
import { Notification } from "../../../../stub-ui-library/notification/notification";
import styles from "./edit-notifications.module.scss";

type BaseProps = {
  children: React.ReactNode;
  type: "error" | "warning";
  visible: boolean;
  className?: string;
};

const EditNotification = ({
  visible,
  children,
  type,
  className,
}: BaseProps) =>
  children ? (
    <Notification
      type={type}
      visible={visible}
      className={cs(styles.notification, className)}
    >
      {children}
    </Notification>
  ) : null;

type NotificationProps = {
  children: React.ReactNode;
  visible: boolean;
  className?: string;
};

export const EditErrorNotification = ({
  children,
  className,
  visible,
}: NotificationProps) => (
  <EditNotification className={className} type="error" visible={visible}>
    {children}
  </EditNotification>
);

export const EditWarningNotification = ({
  children,
  className,
  visible,
}: NotificationProps) => (
  <EditNotification
    className={className}
    type="warning"
    visible={visible}
  >
    {children}
  </EditNotification>
);
