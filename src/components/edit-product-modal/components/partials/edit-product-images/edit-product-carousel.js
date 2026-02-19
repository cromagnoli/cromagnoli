import React, { useEffect, useState, Fragment } from "react";
import PropTypes from "prop-types";
import cs from "classnames";
import { Carousel } from "../../../../stub-ui-library/carousel/carousel";
import ImageWithFallback from "../../../../stub-ui-library/image-with-fallback";

import styles from "./edit-product-carousel.module.scss";

const EditProductCarousel = ({
  imageUrls,
  imagesAlt,
  fallbackElement,
  preloadedImages,
}) => {
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    setSlideIndex(0);
  }, [imageUrls]);

  const images = imageUrls.map((imageUrl, index) => {
    return index < slideIndex + preloadedImages ? (
      <ImageWithFallback
        key={imageUrl}
        lazy={false}
        src={imageUrl}
        alt={imagesAlt}
        maxWidth={985}
        fallbackElement={fallbackElement}
        className={styles.imageSlide}
      />
    ) : (
      <Fragment key={imageUrl}>{fallbackElement}</Fragment>
    );
  });

  return (
    <Carousel
      key={imageUrls[0]}
      showPagination
      showArrows
      slideIndex={slideIndex}
      onSlideIndexChange={(value) => setSlideIndex(value)}
      classes={{
        pagination: cs(styles.pagination, styles.extraSelectorWeight),
        leftArrow: cs(styles.arrow, styles.extraSelectorWeight),
        rightArrow: cs(styles.arrow, styles.extraSelectorWeight),
      }}
    >
      {images}
    </Carousel>
  );
};

EditProductCarousel.propTypes = {
  imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
  imagesAlt: PropTypes.string.isRequired,
  fallbackElement: PropTypes.node,
  preloadedImages: PropTypes.number,
};

EditProductCarousel.defaultProps = {
  imagesAlt: "Carousel image",
  fallbackElement: <></>,
  preloadedImages: 3,
};

export default EditProductCarousel;
