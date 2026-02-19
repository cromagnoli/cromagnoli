import React from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import styles from './loading-indicator.module.scss';

const LoadingIndicator = ({ className, color, ...otherProps }) => {
    return (
        <div
            data-testid="loading-indicator"
            className={cs(className)}
            {...otherProps}
        >
            <svg
                width="44px"
                height="44px"
                className={cs(styles.progress)}
                viewBox="0 0 40 40"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle
                    className={cs(styles.progressCircle, styles[color])}
                    cx="20"
                    cy="20"
                    r="15"
                />
            </svg>
        </div>
    );
};

const propTypes = {
    color: PropTypes.oneOf(['red', 'gray', 'white']),
    className: PropTypes.string,
};
const defaultProps = {
    color: 'gray',
    className: null,
};

LoadingIndicator.propTypes = propTypes;
LoadingIndicator.defaultProps = defaultProps;

export { LoadingIndicator, propTypes, defaultProps };