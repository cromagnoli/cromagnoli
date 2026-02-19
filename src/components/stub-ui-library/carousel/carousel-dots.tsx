import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import styles from './carousel.module.scss';

/**
 * Props injected by React-Multi-Carousel:
 * index
 * active
 * onClick
 * carouselState
 */
const Dot = ({
     active,
     index,
     onClick,
     pagination,
     carouselState,
     className,
     totalItems,
 }) => {
    if (carouselState.totalItems <= carouselState.slidesToShow) {
        return null;
    }

    const baseLabel = `slide ${index + 1} of ${totalItems}`;
    const labelText = active ? `${baseLabel} (Current Slide)` : baseLabel;

    const content = pagination ? (
        pagination[index]
    ) : (
        <span className={styles.dotInner} />
    );

    return (
        <li>
            <button
                aria-label={labelText}
                className={cn(
                    styles.dot,
                    {
                        [styles.dotActive]: active,
                    },
                    className
                )}
                data-testid="carousel-dot"
                onClick={onClick}
                type="button"
            >
                {content}
            </button>
        </li>
    );
};

const propTypes = {
    active: PropTypes.bool,
    carouselState: PropTypes.shape({
        slidesToShow: PropTypes.number.isRequired,
        totalItems: PropTypes.number.isRequired,
    }).isRequired,
    index: PropTypes.number,
    onClick: PropTypes.func,
    pagination: PropTypes.arrayOf(PropTypes.node),
    className: PropTypes.string,
    totalItems: PropTypes.number.isRequired,
};
const defaultProps = {
    active: false,
    carouselState: {
        totalItems: 0,
        slidesToShow: 0,
    },
    index: 0,
    onClick: null,
    pagination: null,
    className: null,
};

Dot.propTypes = propTypes;

Dot.defaultProps = defaultProps;

export { Dot, propTypes, defaultProps };