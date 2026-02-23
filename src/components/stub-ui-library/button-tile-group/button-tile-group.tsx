import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import styles from './button-tile-group.module.scss';

const ButtonTileGroup = forwardRef(
    (
        {
            children,
            className,
            eventAttribute,
            id,
            label,
            onSelectCallback,
            selectedIndex,
            wrapperComponent,
            ...otherProps
        },
        ref
        // eslint-disable-next-line sonarjs/cognitive-complexity
    ) => {
        const buttonTilesRef = [];

        const onChangeSelection = (index) =>
            onSelectCallback instanceof Function ? onSelectCallback(index) : false;

        const handleKeyDown = (event, index) => {
            const groupLength = children.length;
            switch (event.which) {
                case 32: {
                    // space
                    event.preventDefault();
                    // spacebar should check if not checked
                    onChangeSelection(index);
                    break;
                }
                case 40:
                case 39: {
                    event.preventDefault();
                    // right arrow
                    let newIndex = index + 1;
                    if (newIndex >= groupLength) {
                        // loop back to beginning
                        newIndex = 0;
                    }
                    onChangeSelection(newIndex);
                    buttonTilesRef[newIndex].focus();
                    break;
                }
                case 38:
                case 37: {
                    event.preventDefault();
                    // left arrow
                    let newIndex = index - 1;
                    if (newIndex < 0) {
                        // loop back to end
                        newIndex = groupLength - 1;
                    }
                    onChangeSelection(newIndex);
                    buttonTilesRef[newIndex].focus();
                    break;
                }
                default:
                    return true;
            }
            return true;
        };

        const clonedChildren = React.Children.map(children, (child, index) => {
            return child
                ? React.cloneElement(child, {
                    eventAttribute,
                    handleKeyDown,
                    index,
                    isSelected: selectedIndex === index,
                    onChangeSelection,
                    ref: (node) => {
                        buttonTilesRef[index] = node;
                    },
                    selectedIndex,
                })
                : null;
        });

        return (
            <fieldset
                data-testid="button-tile-group"
                className={styles.buttonTileGroupFieldset}
            >
                {label && (
                    <legend
                        id={id}
                        className={styles.buttonTileGroupTitle}
                        data-testid="button-tile-group__label"
                    >
                        {label}
                    </legend>
                )}
                <div
                    data-testid="button-tile-group__group"
                    className={cs({ [className]: className })}
                    role="radiogroup"
                    ref={ref}
                    {...otherProps}
                >
                    {wrapperComponent(clonedChildren)}
                </div>
            </fieldset>
        );
    }
);

const propTypes = {
    /** Expects ButtonTile components to be passed as children */
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    /** Specify which event attributes should trigger selection on the radio button; can pass multiple values separated by a space */
    eventAttribute: PropTypes.string,
    /** id attribute to be used on the label; do not specify if 'label' is omitted */
    id: PropTypes.string,
    /** Specify title text for this radio group; */
    label: PropTypes.string,
    /** Callback to be triggered when a selection is made */
    onSelectCallback: PropTypes.func,
    /** Index of the currently selected radio button in the group */
    selectedIndex: PropTypes.number,
    /** Specify an optional component to wrap the radio buttons, such as a carousel */
    wrapperComponent: PropTypes.func,
};
const defaultProps = {
    className: '',
    eventAttribute: 'onClick',
    id: 'button-tile-group-label',
    label: '',
    selectedIndex: -1,
    onSelectCallback: () => {},
    wrapperComponent: (childrenArg) => (
        <div
            data-testid="button-tile-group__component_wrapper"
            className={styles.buttonTileGroupWrapper}
        >
            {childrenArg}
        </div>
    ),
};

ButtonTileGroup.propTypes = propTypes;
ButtonTileGroup.defaultProps = defaultProps;
export { ButtonTileGroup, propTypes, defaultProps };