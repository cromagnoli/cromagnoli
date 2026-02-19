import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { tabbable } from 'tabbable';

const FocusTrap = ({ children, openFocusRef, closeFocusRef, childRef }) => {
    const beforeRef = useRef();
    const afterRef = useRef();

    // Trap focus within container element
    useEffect(() => {
        const handleFocus = (ev) => {
            const { target } = ev;
            const tabbables = tabbable(childRef.current);

            if (target === beforeRef.current) {
                tabbables[tabbables.length - 1].focus();
            } else if (target === afterRef.current) {
                tabbables[0].focus();
            }
        };

        document.addEventListener('focusin', handleFocus);

        return () => {
            document.removeEventListener('focusin', handleFocus);
        };
    }, [childRef]);

    // Move focus to and from focus trap on mount/unmount
    useEffect(() => {
        const lastFocused = document.activeElement;
        const closeFocus = closeFocusRef ? closeFocusRef.current : null;

        if (openFocusRef) {
            openFocusRef.current.focus();
        } else {
            const tabbables = tabbable(childRef.current);

            if (tabbables.length) {
                tabbables[0].focus();
            }
        }

        return () => {
            if (closeFocus) {
                closeFocus.focus();
            } else {
                lastFocused.focus();
            }
        };
    }, [closeFocusRef, openFocusRef, childRef]);

    return (
        <>
            {/* Tab catcher elements that redirect focus back into the trap */}
            {/* eslint-disable jsx-a11y/no-noninteractive-tabindex */}
            <div aria-hidden tabIndex="0" ref={beforeRef} />
            {children}
            <div aria-hidden tabIndex="0" ref={afterRef} />
            {/* eslint-enable jsx-a11y/no-noninteractive-tabindex */}
        </>
    );
};

const propTypes = {
    children: PropTypes.node,
    openFocusRef: PropTypes.shape({
        current: PropTypes.object,
    }),
    closeFocusRef: PropTypes.shape({
        current: PropTypes.object,
    }),
    childRef: PropTypes.shape({
        current: PropTypes.object,
    }).isRequired,
};

const defaultProps = {
    children: undefined,
    openFocusRef: undefined,
    closeFocusRef: undefined,
};

FocusTrap.propTypes = propTypes;

FocusTrap.defaultProps = defaultProps;

export { FocusTrap, propTypes, defaultProps };
