import React from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import styles from './size-tile.module.scss';

const SizeTile = ({
  className,
  isDisabled,
  isSelected,
  text,
  ...otherProps
}) => {
    return (
        <span
            className={cs(styles.sizeTile, {
                [styles.sizeTileActive]: isSelected,
                [styles.sizeTileDisabled]: isDisabled,
                [className]: className,
            })}
            {...otherProps}
        >
      {text}
            {isDisabled && (
                <span className="lll-hidden-visually">&nbsp;(not available)</span>
            )}
    </span>
    );
};

const propTypes = {
    className: PropTypes.string,
    /** Whether to show in a disabled state */
    isDisabled: PropTypes.bool,
    /** Whether to show in a selected state */
    isSelected: PropTypes.bool,
    text: PropTypes.string.isRequired,
};
const defaultProps = {
    className: '',
    isDisabled: false,
    isSelected: false,
};

SizeTile.propTypes = propTypes;
SizeTile.defaultProps = defaultProps;
export { SizeTile, defaultProps, propTypes };