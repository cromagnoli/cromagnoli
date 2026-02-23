import React from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import styles from './color-swatch.module.scss';

const ColorSwatch = ({
     className,
     colorCode,
     isDisabled,
     isSelected,
     name,
     ...otherProps
 }) => (
    <span
        className={cs(styles.colorSwatch, {
            [styles.colorSwatchActive]: isSelected,
            [styles.colorSwatchDisabled]: isDisabled,
            [className]: className,
        })}
    >
      <span className={styles.colorSwatchImgWrapper}>
        <span className={styles.colorSwatchPicture} style={ { backgroundColor: `#${colorCode}` } }></span>
      </span>
    </span>
);

const propTypes = {
    className: PropTypes.string,
    /** Color ID, used to generate the color swatch image URL */
    colorCode: PropTypes.string.isRequired,
    /** Whether to show in a disabled state */
    isDisabled: PropTypes.bool,
    /** Whether to show in a selected state */
    isSelected: PropTypes.bool,
    /** Color name, used as alternative text for screen readers */
    name: PropTypes.string,
};

const defaultProps = {
    className: '',
    isDisabled: false,
    isSelected: false,
    name: '',
};

ColorSwatch.propTypes = propTypes;
ColorSwatch.defaultProps = defaultProps;
export { ColorSwatch, propTypes, defaultProps };
