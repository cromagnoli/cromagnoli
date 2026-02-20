import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import cs from 'classnames';
import PropTypes from 'prop-types';
import { FocusTrap } from '../focus-trap';
import styles from './modal.module.scss';

const canUseDOM = typeof document !== 'undefined';

const mobileBp = 768;
const tabletBp = 992;

export const BREAKPOINTS = {
    MOBILE: 'mobile',
    TABLET: 'tablet',
    DESKTOP: 'desktop',
};

export function getBreakpoint() {
    if (typeof window === 'undefined') {
        return undefined;
    }

    const deviceSize = window.innerWidth;

    if (deviceSize < mobileBp) {
        return BREAKPOINTS.MOBILE;
    }

    if (deviceSize < tabletBp) {
        return BREAKPOINTS.TABLET;
    }

    return BREAKPOINTS.DESKTOP;
}

export const useBreakpoint = () => {
    const [breakpoint, setBreakpoint] = useState(getBreakpoint());

    useEffect(() => {
        const handleResize = () => setBreakpoint(getBreakpoint());
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return breakpoint;
};

export const constructSizes = (breakpoints) => {
    const defaultSlotSize =
        breakpoints.find((bp) => !bp.breakpoint) &&
        breakpoints.find((bp) => !bp.breakpoint).slotSize;

    const validatedBreakpointsWithoutDefault = breakpoints.filter(
        (bp) => !!bp.breakpoint && bp.breakpoint.includes('px')
    );

    return validatedBreakpointsWithoutDefault
        .sort((a, b) => b.breakpoint.split('px')[0] - a.breakpoint.split('px')[0])
        .reduce(
            (acc, { breakpoint, slotSize }) => [
                ...acc,
                `(min-width: ${breakpoint}) ${slotSize}`,
            ],
            []
        )
        .concat(defaultSlotSize || [])
        .join(', ');
};

/**
 * A hook used to mitigate warnings with `uselayoutEffect` hook when implementing SSR
 */
export const useIsomorphicLayoutEffect =
    typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export const usePortal = () => {
    const portalContainerRef = useRef();

    if (canUseDOM && !portalContainerRef.current) {
        portalContainerRef.current = window.document.createElement('div');
    }

    // Portal DOM node
    useLayoutEffect(() => {
        document.body.appendChild(portalContainerRef.current);

        return () => {
            const el = portalContainerRef.current;
            el.parentNode.removeChild(el);
        };
    }, []);

    return portalContainerRef;
};

export const useAriaHideSiblings = (active, selector, ref) => {
    // Manage aria-hidden on other DOM nodes
    useEffect(() => {
        if (active) {
            const rootNodes = document.querySelectorAll(selector);
            const transformedNodes = Array.prototype.map.call(rootNodes, (node) => {
                // eslint-disable-next-line sonarjs/no-duplicate-string
                const ariaHidden = node.getAttribute('aria-hidden');

                // Side-effect in map!
                if (node !== ref) {
                    node.setAttribute('aria-hidden', 'true');
                }

                return { node, ariaHidden };
            });

            if (ref.getAttribute('aria-hidden') !== null) {
                ref.removeAttribute('aria-hidden');
            }

            return () => {
                transformedNodes.forEach((item) => {
                    if (item.ariaHidden === null) {
                        item.node.removeAttribute('aria-hidden');
                    } else {
                        item.node.setAttribute('aria-hidden', item.ariaHidden);
                    }
                });
            };
        }

        return () => {};
    }, [active, ref, selector]);
};

export const useHandleEscapeKey = (active, callback) => {
    // Escape key handling
    useEffect(() => {
        const handleEscapeKey = (ev) => {
            const escapeCode = 27;

            if (ev.keyCode === escapeCode) {
                callback();
            }
        };

        if (active) {
            window.addEventListener('keydown', handleEscapeKey);
        }

        return () => {
            window.removeEventListener('keydown', handleEscapeKey);
        };
    }, [active, callback]);
};

let modalsOpen = 0;

export const usePreventBodyScroll = (active) => {
    useEffect(() => {
        if (active && canUseDOM) {
            Object.assign(document.body.style, {
                top: `-${window.pageYOffset}px`,
                position: 'fixed',
                width: '100%',
            });
            modalsOpen += 1;

            return () => {
                modalsOpen -= 1;

                if (modalsOpen < 1) {
                    const scrollY = document.body.style.top;
                    Object.assign(document.body.style, {
                        position: '',
                        top: '',
                        width: '',
                    });
                    window.scrollTo(0, parseInt(scrollY || 0, 10) * -1);
                }
            };
        }

        return () => {};
    }, [active]);
};

/**
 * A hook to listen to a media query and return a boolean of if the window matches the query
 * @param {String} text
 * @return {Boolean}
 */
export const useMatchMedia = (query) => {
    const getMatches = (query) => {
        // Prevents SSR issues
        if (typeof window !== 'undefined') {
            return window.matchMedia(query).matches;
        }
        return false;
    };

    const [matches, setMatches] = useState(getMatches(query));

    useEffect(() => {
        const matchMedia = window.matchMedia(query);
        const handleChange = () => {
            setMatches(getMatches(query));
        };
        // Triggered at the first client-side load and if query changes
        handleChange();

        matchMedia.addEventListener('change', handleChange);

        return () => {
            matchMedia.removeEventListener('change', handleChange);
        };
    }, [query]);

    return matches;
};

const Modal = ({
   cancelProps,
   children,
   classes,
   closeFocusRef,
   fullScreen,
   fullScreenMobile,
   inline,
   messages,
   onClose,
   onRequestClose,
   openFocusRef,
   primaryContentSelector,
   visible,
   voiceOver,
   ...otherProps
}) => {
    const portalContainerRef = usePortal();
    const shouldUseOverlay = visible && !inline;

    useHandleEscapeKey(shouldUseOverlay, onRequestClose);
    usePreventBodyScroll(shouldUseOverlay);
    useAriaHideSiblings(
        shouldUseOverlay,
        primaryContentSelector,
        portalContainerRef.current
    );

    const modalRef = useRef();

    // onClose callback
    useEffect(() => {
        return () => {
            if (visible && onClose) {
                onClose();
            }
        };
    }, [visible, onClose]);

    if (!visible) {
        return null;
    }

    if (inline) {
        return (
            <div
                data-testid="container"
                className={cs(styles.modalContainer, styles.inlineModalContainer, classes.container, {
                    [styles.fullScreenContainer]: fullScreen,
                    [styles.fullScreenMobileContainer]: fullScreenMobile,
                })}
                onClick={(ev) => {
                    if (ev.target === ev.currentTarget) {
                        onRequestClose(ev);
                    }
                }}
            >
                <div
                    aria-label={voiceOver.title}
                    aria-modal="true"
                    role="dialog"
                    className={cs(styles.modal, styles.inlineModal, classes.modal, {
                        [styles.fullScreenModal]: fullScreen,
                        [styles.fullScreenMobileModal]: fullScreenMobile,
                    })}
                    ref={modalRef}
                    {...otherProps}
                >
                    <button
                        type="button"
                        aria-label={messages.close}
                        className={styles.closeButton}
                        onClick={onRequestClose}
                        {...cancelProps}
                    >
                        x
                    </button>
                    <div className={classes.modalContent}>{children}</div>
                </div>
            </div>
        );
    }

    if (!canUseDOM) {
        return null;
    }

    return (
        // Portal needs to be wrapped in a Fragment for
        // react docgen detection:
        // https://github.com/reactjs/react-docgen/issues/336
        <>
            {createPortal(
                <>
                    <div className={cs(styles.backdrop, classes.backdrop)} />
                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                    <div
                        data-testid="container"
                        className={cs(styles.modalContainer, classes.container, {
                            [styles.fullScreenContainer]: fullScreen,
                            [styles.fullScreenMobileContainer]: fullScreenMobile,
                        })}
                        onClick={(ev) => {
                            // If click is directly on container, meaning it's
                            // not on the modal or modal content, you've clicked
                            // outside of the modal and can close it
                            if (ev.target === ev.currentTarget) {
                                onRequestClose(ev);
                            }
                        }}
                    >
                        <FocusTrap
                            openFocusRef={openFocusRef}
                            closeFocusRef={closeFocusRef}
                            childRef={modalRef}
                        >
                            <div
                                aria-label={voiceOver.title}
                                aria-modal="true"
                                role="dialog"
                                className={cs(styles.modal, classes.modal, {
                                    [styles.fullScreenModal]: fullScreen,
                                    [styles.fullScreenMobileModal]: fullScreenMobile,
                                })}
                                ref={modalRef}
                                {...otherProps}
                            >
                                <button
                                    type="button"
                                    aria-label={messages.close}
                                    className={styles.closeButton}
                                    onClick={onRequestClose}
                                    {...cancelProps}
                                >
                                    x
                                </button>
                                <div className={classes.modalContent}>{children}</div>
                            </div>
                        </FocusTrap>
                    </div>
                </>,
                portalContainerRef.current
            )}
        </>
    );
};

const propTypes = {
    /** Props set on the cancel button */
    // eslint-disable-next-line react/forbid-prop-types
    cancelProps: PropTypes.object,
    /** Passes modal content */
    children: PropTypes.node,
    /** CSS classNames applied to modal elements */
    classes: PropTypes.shape({
        modal: PropTypes.string,
        backdrop: PropTypes.string,
        container: PropTypes.string,
        modalContent: PropTypes.string,
    }),
    /** Use with EXTREME caution.
     * Parameters around use are very narrow, if used incorrectly
     * this causes a11y errors.
     * Element ref for the element that should gain focus when
     * the modal closes. Defaults to the last focused element
     * (the button you clicked to open the modal, typically).
     */
    closeFocusRef: PropTypes.shape({
        current: PropTypes.object,
    }),
    /** Flag to enable fullscreen styles on mobile and desktop browsers */
    fullScreen: PropTypes.bool,
    /**  Flag to enable fullscreen styles on mobile browsers */
    fullScreenMobile: PropTypes.bool,
    /** Render in place without portal/backdrop/focus trap */
    inline: PropTypes.bool,
    messages: PropTypes.shape({
        /** Label for the close button */
        close: PropTypes.string.isRequired,
    }).isRequired,
    /** Callback fired when the modal closes */
    onClose: PropTypes.func,
    /** Callback fired when a user attempts to close the modal.
     * Use this to update the `visible` prop. */
    onRequestClose: PropTypes.func,
    /** Element ref for the element that should gain focus when
     * the modal opens. Defaults to the first tabbable element
     * in the modal (the close button, usually).
     */
    openFocusRef: PropTypes.shape({
        current: PropTypes.object,
    }),
    /** A CSS selector to select your primary page content.
     * This content is hidden from screen readers while the
     * modal is open.
     */
    primaryContentSelector: PropTypes.string,
    /** Flag indicating whether the modal should display or not */
    visible: PropTypes.bool,
    voiceOver: PropTypes.shape({
        /** Label for the modal */
        title: PropTypes.string.isRequired,
    }),
};

const defaultProps = {
    cancelProps: null,
    children: undefined,
    classes: {},
    closeFocusRef: undefined,
    fullScreenMobile: false,
    fullScreen: false,
    inline: false,
    messages: { close: 'Close' },
    onClose: undefined,
    onRequestClose: undefined,
    openFocusRef: undefined,
    primaryContentSelector: 'body > *',
    visible: false,
    voiceOver: { title: 'Modal' },
};

Modal.propTypes = propTypes;

Modal.defaultProps = defaultProps;

export { Modal };
