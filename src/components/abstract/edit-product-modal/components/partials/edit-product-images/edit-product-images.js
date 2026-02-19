import React from "react";
import PropTypes from "prop-types";
import cs from "classnames";
import EditProductCarousel from "./edit-product-carousel";
import styles from "./edit-product-images.module.scss";

const FallbackImage = ({ className }) => (
  <div className={cs(styles.fallbackImage, className)}>
    <span className={cs(styles.fallbackImageIcon)}>Fallback image stub</span>
  </div>
);

const getImageOrCarousel = ({ imageUrls, imagesAlt }) => {
  if (!imageUrls?.length) {
    return <FallbackImage className={cs(styles.aspectRatioBoxChild)} />;
  }

  return (
    <div className={styles.aspectRatioBoxChild}>
      <EditProductCarousel
        imageUrls={imageUrls}
        imagesAlt={imagesAlt}
        fallbackElement={
          <FallbackImage className={cs(styles.fallbackImageError)} />
        }
      />
    </div>
  );
};

const EditProductImages = ({ imageUrls, imagesAlt }) => (
  <div className={styles.editProductImages}>
    <div className={styles.aspectRatioBoxParent}>
      {getImageOrCarousel({ imageUrls, imagesAlt })}
    </div>
  </div>
);

EditProductImages.propTypes = {
  imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
  imagesAlt: PropTypes.string.isRequired,
};

export default EditProductImages;
