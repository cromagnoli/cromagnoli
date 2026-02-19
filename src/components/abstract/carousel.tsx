import React, {
    forwardRef,
    useCallback,
    useEffect,
    useRef,
    useMemo,
    cloneElement,
    Children,
} from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { useInView } from 'react-intersection-observer';
import { getClones } from 'react-multi-carousel/lib/utils';
import CarouselComponent from 'react-multi-carousel';
import { Dot } from './carousel-dots';
import styles from './carousel.module.scss';

// Stub from internal UI libs in client
const CarouselButton = ({
    direction,
    disabled,
    disableKeyboardNavigation,
    className,
    onAfterClick,
    onClick,
    style,
}) => {
    const left = direction === 'left';
    const labelText = left ? 'Previous Slide' : 'Next Slide';
    const accessibilityProps = disableKeyboardNavigation
        ? {
            tabIndex: '-1',
            'aria-hidden': 'true',
        }
        : {
            'aria-label': labelText,
        };

    const handleClick = () => {
        onClick();
        onAfterClick();
    };

    return (
        <button
            type="button"
            className={cn(
                'lll-text-primary',
                styles.carouselArrows,
                {
                    [styles.carouselArrowsRight]: !left,
                    [styles.carouselArrowsLeft]: left,
                },
                className
            )}
            {...accessibilityProps}
            onClick={handleClick}
            {...{ disabled, style }}
        >
            {left ? "<" : ">"}
        </button>
    );
};

function useDragging(children) {
    const draggingRef = useRef(false);

    const afterChange = useCallback(() => {
        draggingRef.current = false;
    }, [draggingRef]);

    const beforeChange = useCallback(() => {
        draggingRef.current = true;
    }, [draggingRef]);

    const clonedChildren = useMemo(() => {
        const childrenArray = Children.toArray(children);

        return childrenArray.map((child, index) => {
            const onClick = child.props?.onClick;
            const className = child.props?.className;
            return cloneElement(child, {
                className: cn(className, styles.carouselItem),
                'aria-label': `slide ${index + 1} of ${childrenArray.length}`,
                onClick: (event) => {
                    if (draggingRef.current) {
                        event.preventDefault();
                        return;
                    }

                    if (onClick) {
                        onClick(event);
                    }
                },
            });
        });
    }, [children]);

    return {
        afterChange,
        beforeChange,
        clonedChildren,
    };
}

// Disable draggable property for each image inside the carousel.
// Draggable property causes a poor drag scrolling experience in react-multi-carousel.
// This doesn't work for infinite mode because the carousel adds empty extra children.
const useDisableDraggableImgs = (componentInView, children) => {
    useEffect(() => {
        const imgs = document.querySelectorAll('.react-multi-carousel-list img');
        if (!imgs.length) return;
        const disableDraggable = (img) => img.setAttribute('draggable', false);
        imgs.forEach(disableDraggable);
    }, [componentInView, children]);
};

// % operator in javascript does not handle negative numbers
function modulo(n, m) {
    return ((n % m) + m) % m;
}

const Carousel = forwardRef(
    (
        {
            centered,
            children,
            clickToChange,
            infinite,
            onLeftArrowClick,
            onRightArrowClick,
            onSlideIndexChange,
            partialVisible,
            pagination,
            paginationLocation,
            responsive,
            showArrows,
            showPagination,
            slideIndex,
            slidesPerPage,
            slidesPerScroll,
            classes,
            ...rest
        },
        ref
    ) => {
        const [containerRef, inView] = useInView({ triggerOnce: true });
        useDisableDraggableImgs(inView, children);
        const carouselRef = useRef();
        const infiniteIndexOffset =
            children.length - (children.length - slidesPerPage * 2); // matches value set in react-multi-carousel/src/utils/clones.ts

        const { afterChange, beforeChange, clonedChildren } = useDragging(children);

        const getActualSlideIndex = useCallback(
            (internalSlideIndex) => {
                if (!infinite) {
                    return internalSlideIndex;
                }

                // internal slideIndex state contains extra slides for infinite mode
                return modulo(
                    internalSlideIndex - infiniteIndexOffset,
                    clonedChildren.length
                );
            },
            [infinite, clonedChildren, infiniteIndexOffset]
        );

        const getInternalSlideIndex = useCallback(
            (actualSlideIndex) => {
                if (!infinite) {
                    return actualSlideIndex;
                }

                // internal index is offset for additional slides
                return modulo(
                    slideIndex + infiniteIndexOffset,
                    carouselRef.current.state.totalItems
                );
            },
            [infinite, infiniteIndexOffset, slideIndex]
        );

        const handleAfterChange = useCallback(
            (_, ref) => {
                afterChange();

                // If in controlled mode, pass the current slide to the callback
                if (onSlideIndexChange) {
                    onSlideIndexChange(getActualSlideIndex(ref.currentSlide));
                }
            },
            [afterChange, onSlideIndexChange, getActualSlideIndex]
        );

        // Monitor controlled slideIndex and update underlying component if out-of-sync.
        useEffect(() => {
            if (!carouselRef.current) return;

            if (infinite) {
                // internal index is offset for additional slides
                const intendedInternalSlideIndex = getInternalSlideIndex(slideIndex);
                const originalSlide = clonedChildren[slideIndex];
                const clones = getClones(
                    carouselRef.current.state.slidesToShow,
                    clonedChildren
                );

                // get matching cloned slides in the internal set of slides
                const matchingClonedSlideIndices = clones
                    .map((c, i) => (originalSlide.key === c.key ? i : ''))
                    .filter(String); // filters out empty strings

                // if the slide it is on currently matches a clone, then no need to update
                if (
                    matchingClonedSlideIndices.includes(
                        carouselRef.current.state.currentSlide
                    )
                ) {
                    return;
                }

                carouselRef.current.goToSlide(intendedInternalSlideIndex);
            } else if (carouselRef.current.state.currentSlide !== slideIndex) {
                carouselRef.current.goToSlide(slideIndex);
            }
        }, [
            carouselRef,
            slideIndex,
            clonedChildren,
            infinite,
            infiniteIndexOffset,
            getInternalSlideIndex,
        ]);

        const responsiveOptions = useMemo(() => {
            return (
                responsive || {
                    mobile: {
                        breakpoint: { max: Number.MAX_SAFE_INTEGER, min: 0 },
                        items: slidesPerPage,
                        slidesToSlide: slidesPerScroll,
                    },
                }
            );
        }, [responsive, slidesPerPage, slidesPerScroll]);

        return (
            <div
                ref={containerRef}
                className={cn(
                    styles.wrapper,
                    {
                        [styles.wrapperReverse]: paginationLocation === 'top',
                    },
                    classes.wrapper
                )}
            >
                <CarouselComponent
                    afterChange={handleAfterChange}
                    arrows={showArrows}
                    beforeChange={beforeChange}
                    centerMode={centered}
                    containerClass={classes.carousel}
                    customDot={
                        <Dot
                            pagination={pagination}
                            className={classes.pagination}
                            totalItems={clonedChildren.length}
                        />
                    }
                    customLeftArrow={
                        <CarouselButton
                            className={classes.leftArrow}
                            direction="left"
                            onAfterClick={onLeftArrowClick}
                        />
                    }
                    customRightArrow={
                        <CarouselButton
                            className={classes.rightArrow}
                            direction="right"
                            onAfterClick={onRightArrowClick}
                        />
                    }
                    deviceType="mobile"
                    dotListClass={styles.dots}
                    focusOnSelect={clickToChange}
                    infinite={infinite}
                    keyBoardControl={false}
                    partialVisible={partialVisible}
                    renderDotsOutside
                    responsive={responsiveOptions}
                    showDots={showPagination}
                    ssr
                    ref={ref}
                    {...rest}
                >
                    {clonedChildren}
                </CarouselComponent>
            </div>
        );
    }
);

const propTypes = {
    /** centers the current active slide */
    centered: PropTypes.bool,
    children: PropTypes.node,
    /** can overwrite any arrows styles. By default, arrows will disappear if
     the first or last slide is reached */
    classes: PropTypes.shape({
        wrapper: PropTypes.string,
        carousel: PropTypes.string,
        pagination: PropTypes.string,
        leftArrow: PropTypes.string,
        rightArrow: PropTypes.string,
    }),
    /** allows clicking on the next slide to make it an active slide */
    clickToChange: PropTypes.bool,
    /** infinite scroll, will change how slide index is calculated negative when going
     backwards, positive when going forward. Source code does provide a conversion function */
    infinite: PropTypes.bool,
    /** Callback fired when left arrow is clicked */
    onLeftArrowClick: PropTypes.func,
    /** Callback fired when right arrow is clicked */
    onRightArrowClick: PropTypes.func,
    /** callback with the index as parameter */
    onSlideIndexChange: PropTypes.func,
    partialVisible: PropTypes.bool,
    /** allows you to provide your own paginations */
    pagination: PropTypes.arrayOf(PropTypes.node),
    paginationLocation: PropTypes.oneOf(['top', 'bottom']),
    showArrows: PropTypes.bool,
    showPagination: PropTypes.bool,
    slideIndex: PropTypes.number,
    slidesPerPage: PropTypes.number,
    slidesPerScroll: PropTypes.number,
    // eslint-disable-next-line react/forbid-prop-types
    responsive: PropTypes.object,
};

const defaultProps = {
    centered: false,
    children: null,
    classes: {},
    clickToChange: false,
    infinite: false,
    onLeftArrowClick: () => {},
    onRightArrowClick: () => {},
    onSlideIndexChange: () => {},
    partialVisible: false,
    pagination: null,
    paginationLocation: 'bottom',
    showArrows: false,
    showPagination: false,
    slideIndex: 0,
    slidesPerPage: 1,
    slidesPerScroll: 1,
    responsive: null,
};

Carousel.propTypes = propTypes;
Carousel.defaultProps = defaultProps;

export { Carousel, propTypes, defaultProps };