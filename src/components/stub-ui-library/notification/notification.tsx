import React from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import styles from './notification.module.scss';

const Notification = ({
  children,
  className,
  type,
  visible,
  icon,
  ...otherProps
}) => {
    const roleValue = type === 'error' || type === 'warning' ? 'alert' : 'status';
    const iconContent = {
        error: errorIcon,
        info: infoIcon,
        success: successIcon,
        warning: warningIcon,
        message: infoIcon,
    };
    const iconContentValue = !icon ? iconContent[type] : icon;

    return (
        <div role={roleValue}>
            {visible ? (
                <div
                    className={cs(styles.notificationBlock, className, {
                        [styles.errorNotification]: type === 'error',
                        [styles.infoNotification]: type === 'info',
                        [styles.successNotification]: type === 'success',
                        [styles.warningNotification]: type === 'warning',
                        [styles.messageNotification]: type === 'message',
                    })}
                    {...otherProps}
                >
                    <span content={iconContentValue} className={styles.iconBlock} />
                    <div>{children}</div>
                </div>
            ) : null}
        </div>
    );
};

const propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    type: PropTypes.oneOf(['error', 'info', 'success', 'warning', 'message']),
    /** Prop to control whether or not the content within the Notification is rendered */
    visible: PropTypes.bool,
    icon: PropTypes.node,
};

const defaultProps = {
    className: null,
    type: 'info',
    visible: false,
    icon: null,
};

Notification.propTypes = propTypes;
Notification.defaultProps = defaultProps;

export { Notification, propTypes, defaultProps };