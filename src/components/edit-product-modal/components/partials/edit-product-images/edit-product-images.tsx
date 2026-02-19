import React from "react";
import cs from "classnames";
import EditProductCarousel from "./edit-product-carousel";
import styles from "./edit-product-images.module.scss";

type Props = {
  imageUrls: Array<string | null | undefined> | undefined;
  imagesAlt: string;
};

const FallbackImage = ({ className }: { className?: string }) => (
  <div className={cs(styles.fallbackImage, className)}>
    <span className={cs(styles.fallbackImageIcon)}>Fallback image stub</span>
  </div>
);

const getImageOrCarousel = ({ imageUrls, imagesAlt }: Props) => {
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

const EditProductImages = ({ imageUrls, imagesAlt }: Props) => (
  <div className={styles.editProductImages}>
    <div className={styles.aspectRatioBoxParent}>
      {getImageOrCarousel({ imageUrls, imagesAlt })}
    </div>
  </div>
);

export default EditProductImages;
