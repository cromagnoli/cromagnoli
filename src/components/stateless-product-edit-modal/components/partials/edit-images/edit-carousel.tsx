import React, { useEffect, useState, Fragment } from "react";
import cs from "classnames";
import { Carousel } from "../../../../stub-ui-library/carousel/carousel";
import ImageWithFallback from "../../../../stub-ui-library/image-with-fallback";

import styles from "./edit-carousel.module.scss";

type Props = {
  imageUrls: Array<string | null | undefined>;
  imagesAlt?: string;
  fallbackElement?: React.ReactNode;
  preloadedImages?: number;
};

const EditCarousel = ({
  imageUrls,
  imagesAlt = "Carousel image",
  fallbackElement = <></>,
  preloadedImages = 3,
}: Props) => {
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    setSlideIndex(0);
  }, [imageUrls]);

  const images = imageUrls.map((imageUrl, index) => {
    if (!imageUrl) {
      return <Fragment key={`fallback-${index}`}>{fallbackElement}</Fragment>;
    }

    return index < slideIndex + preloadedImages ? (
      <ImageWithFallback
        key={`${imageUrl}-${index}`}
        lazy={false}
        src={imageUrl}
        alt={imagesAlt}
        maxWidth={985}
        fallbackElement={fallbackElement}
        className={styles.imageSlide}
      />
    ) : (
      <Fragment key={`${imageUrl ?? index}`}>{fallbackElement}</Fragment>
    );
  });

  return (
    <Carousel
      key={`${imageUrls[0] ?? "fallback"}`}
      showPagination
      showArrows
      slideIndex={slideIndex}
      onSlideIndexChange={(value) => setSlideIndex(value)}
      classes={{
        carousel: cs(styles.carousel),
        unorderedList: cs(styles.unorderedList),
        pagination: cs(styles.pagination, styles.extraSelectorWeight),
        leftArrow: cs(styles.arrow, styles.extraSelectorWeight),
        rightArrow: cs(styles.arrow, styles.extraSelectorWeight),
      }}
    >
      {images}
    </Carousel>
  );
};

export default EditCarousel;
