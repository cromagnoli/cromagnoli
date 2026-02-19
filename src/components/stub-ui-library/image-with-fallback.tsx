import React from "react";
import PropTypes from "prop-types";

const ImageWithFallback = React.forwardRef(
    ({ alt, className, src, fallbackElement, ...rest }, ref) => {
        const [hasError, setError] = React.useState(false);

        return hasError ? (
            fallbackElement
        ) : (
            <img
                alt={alt}
                className={className}
                src={src}
                onError={() => setError(true)}
                {...rest}
                ref={ref}
            />
        );
    }
);

ImageWithFallback.defaultProps = {
    alt: "",
    className: "",
};

ImageWithFallback.propTypes = {
    alt: PropTypes.string,
    className: PropTypes.string,
    src: PropTypes.string.isRequired,
};

ImageWithFallback.displayName = "ImageWithFallback";

export default ImageWithFallback;
