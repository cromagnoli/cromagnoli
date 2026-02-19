import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import styles from './button-tile.module.scss';

const ButtonTile = forwardRef(
    (
        {
            children,
            className,
            eventAttribute,
            handleKeyDown,
            index,
            isDisabled,
            isSelected,
            onChangeSelection,
            selectedIndex,
            ...otherProps
        },
        ref
    ) => {
        const eventAttributeList = eventAttribute.split(' ');
        const eventHandlers = eventAttributeList.reduce(
            (accumulator, attribute) => {
                accumulator[attribute] = onChangeSelection
                    ? () => {
                        return onChangeSelection(index);
                    }
                    : null;
                return accumulator;
            },
            {}
        );

        const getRovingTabIndex = () =>
            isSelected || (selectedIndex === -1 && index === 0) ? 0 : -1;

        return (
            <div
                data-testid="button-tile"
                aria-checked={isSelected}
                className={cs(styles.buttonTile, { [className]: className })}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={ref}
                role="radio"
                tabIndex={getRovingTabIndex()}
                {...eventHandlers}
                {...otherProps}
            >
                {React.Children.map(children, (child) => {
                    const conditionalProps = {};
                    if (child.props.isSelected !== undefined) {
                        conditionalProps.isSelected = isSelected;
                    }
                    if (child.props.isDisabled !== undefined) {
                        conditionalProps.isDisabled = isDisabled;
                    }

                    return child
                        ? React.cloneElement(child, { ...conditionalProps })
                        : null;
                })}
            </div>
        );
    }
);

const propTypes = {
    /** Children to be rendered within the radio button */
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    /** See ButtonTileGroup */
    eventAttribute: PropTypes.string,
    /** Handler for keyboard navigation, generated in ButtonTileGroup component */
    handleKeyDown: PropTypes.func,
    /** See ButtonTileGroup */
    index: PropTypes.number,
    /** Whether to display children in a visually disabled state (note: it can still be selected) */
    isDisabled: PropTypes.bool,
    /** Whether to render in a selected state, generated in ButtonTileGroup component */
    isSelected: PropTypes.bool,
    /** See ButtonTileGroup */
    onChangeSelection: PropTypes.func,
    /** See ButtonTileGroup */
    selectedIndex: PropTypes.number,
};
const defaultProps = {
    className: '',
    eventAttribute: 'onClick',
    handleKeyDown: () => {},
    index: -1,
    isDisabled: false,
    isSelected: false,
    onChangeSelection: () => {},
    selectedIndex: -1,
};

ButtonTile.propTypes = propTypes;
ButtonTile.defaultProps = defaultProps;
export { ButtonTile, propTypes, defaultProps };