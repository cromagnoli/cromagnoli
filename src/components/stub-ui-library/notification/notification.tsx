import React from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import styles from './notification.module.scss';

const buildIcon = (children, viewBox = '0 0 24 24') => (
    <svg width="18" height="18" viewBox={viewBox} aria-hidden="true" focusable="false">
        {children}
    </svg>
);

const errorIcon = buildIcon(
    <>
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M8 8 L16 16 M16 8 L8 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
);

const warningIcon = buildIcon(
    <>
        <path d="M12 3 L22 21 H2 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M12 9 V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="17.2" r="1.1" fill="currentColor" />
    </>
);

const infoIcon = buildIcon(
    <>
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M12 10 V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="7.5" r="1.1" fill="currentColor" />
    </>
);

const successIcon = buildIcon(
    <>
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M7 12.5 L10.5 16 L17 9.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </>
);

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
                    <span className={styles.iconBlock}>{iconContentValue}</span>
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
