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
    <div className={styles.fallbackBrand}>
      <svg
        className={styles.fallbackImageIcon}
        viewBox="0 0 80 80"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="bmnMarkGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3f68b2" />
            <stop offset="100%" stopColor="#2a4678" />
          </linearGradient>
        </defs>
        <rect x="8" y="8" width="64" height="64" rx="18" fill="url(#bmnMarkGradient)" />
        <path
          d="M25 24h16c7 0 12 4 12 10 0 4-2 7-6 8 5 1 8 4 8 9 0 8-6 13-15 13H25V24zm13 16c4 0 6-2 6-5s-2-4-6-4h-5v9h5zm1 17c5 0 8-2 8-6 0-3-3-5-8-5h-6v11h6z"
          fill="#f4f7ff"
        />
      </svg>
      <span className={styles.fallbackBrandText}>
        <span className={styles.fallbackInitial}>b</span>uy
        <span className={styles.fallbackInitial}>m</span>e
        <span className={styles.fallbackInitial}>n</span>ot
      </span>
    </div>
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
