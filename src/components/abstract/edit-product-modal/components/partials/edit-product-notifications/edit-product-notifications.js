import React from "react";
import PropTypes from "prop-types";
import cs from "classnames";
import { Notification } from "../../../../notification";
import styles from "./edit-product-notifications.module.scss";

const EditProductNotification = ({ visible, children, type, className }) =>
  children ? (
    <Notification
      type={type}
      visible={visible}
      className={cs(styles.notification, className)}
    >
      {children}
    </Notification>
  ) : null;

EditProductNotification.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]),
};
EditProductNotification.defaultProps = {
  className: "",
};

export const EditProductErrorNotification = ({
  children,
  className,
  visible,
}) => (
  <EditProductNotification className={className} type="error" visible={visible}>
    {children}
  </EditProductNotification>
);

EditProductErrorNotification.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]),
  visible: PropTypes.bool.isRequired,
};
EditProductErrorNotification.defaultProps = {
  className: "",
};

export const EditProductWarningNotification = ({
  children,
  className,
  visible,
}) => (
  <EditProductNotification
    className={className}
    type="warning"
    visible={visible}
  >
    {children}
  </EditProductNotification>
);

EditProductWarningNotification.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]),
  visible: PropTypes.bool.isRequired,
};
EditProductWarningNotification.defaultProps = {
  className: "",
};
