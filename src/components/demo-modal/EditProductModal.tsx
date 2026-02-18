
import React, { useState, useMemo } from "react";
import "./modal.css";

type Sku = {
  id: string;
  colorCode: string;
  size: string;
  available: boolean;
};

type SkuVariants = {
  colors: { colorCode: string; displayName: string }[];
  sizes: { size: string }[];
  availableSkus: Sku[];
};

type RenderContext = {
  selectedColor: string;
  selectedSize: string;
  isAvailable: boolean;
};

type Props = {
  renderPrimaryCta?: (context: RenderContext) => React.ReactNode;
};

const skuVariants: SkuVariants = {
  colors: [
    { colorCode: "WHT", displayName: "White" },
    { colorCode: "GPH", displayName: "Graphite" },
  ],
  sizes: [{ size: "8" }, { size: "9" }],
  availableSkus: [
    { id: "1", colorCode: "WHT", size: "8", available: true },
    { id: "2", colorCode: "WHT", size: "9", available: false },
    { id: "3", colorCode: "GPH", size: "8", available: false },
    { id: "4", colorCode: "GPH", size: "9", available: true },
  ],
};

const imageMap: Record<string, string> = {
  WHT: "/images/shoes-white.png",
  GPH: "/images/shoes-graphite.png",
};

function getSelectableSkus({
  skuVariants,
  selectedColorCode,
  selectedSize,
}: {
  skuVariants: SkuVariants;
  selectedColorCode?: string;
  selectedSize?: string;
}) {
  return skuVariants.availableSkus.filter((sku) => {
    const matchesColor =
      !selectedColorCode || sku.colorCode === selectedColorCode;

    const matchesSize =
      !selectedSize || sku.size === selectedSize;

    return matchesColor && matchesSize;
  });
}

function getAvailableAttrValues({
  selectableSkus,
  attrKey,
}: {
  selectableSkus: Sku[];
  attrKey: "colorCode" | "size";
}) {
  return selectableSkus
    .filter((sku) => sku.available)
    .map((sku) => sku[attrKey]);
}

function ModalContent({
  deviceType,
  renderPrimaryCta,
}: {
  deviceType: "mobile" | "desktop";
  renderPrimaryCta?: (context: RenderContext) => React.ReactNode;
}) {
  const [selectedColor, setSelectedColor] = useState("WHT");
  const [selectedSize, setSelectedSize] = useState("8");

  const selectableForColors = useMemo(() => {
    return getSelectableSkus({
      skuVariants,
      selectedSize,
    });
  }, [selectedSize]);

  const selectableForSizes = useMemo(() => {
    return getSelectableSkus({
      skuVariants,
      selectedColorCode: selectedColor,
    });
  }, [selectedColor]);

  const availableColors = useMemo(() => {
    return getAvailableAttrValues({
      selectableSkus: selectableForColors,
      attrKey: "colorCode",
    });
  }, [selectableForColors]);

  const availableSizes = useMemo(() => {
    return getAvailableAttrValues({
      selectableSkus: selectableForSizes,
      attrKey: "size",
    });
  }, [selectableForSizes]);

  const isCurrentAvailable = skuVariants.availableSkus.some(
    (sku) =>
      sku.colorCode === selectedColor &&
      sku.size === selectedSize &&
      sku.available
  );

  const context: RenderContext = {
    selectedColor,
    selectedSize,
    isAvailable: isCurrentAvailable,
  };

  return (
    <div className={`modalCard ${deviceType}`}>
      <div className="layout">
        <div className="imageColumn">
          <img src={imageMap[selectedColor]} alt="Product preview" />
        </div>

        <div className="contentColumn">
          <div className="section">
            <span className="label">Color</span>
            <div className="buttonGroup">
              {skuVariants.colors.map((c) => {
                const isUnavailable = !availableColors.includes(c.colorCode);
                return (
                  <button
                    key={c.colorCode}
                    onClick={() => setSelectedColor(c.colorCode)}
                    className={`optionButton 
                      ${selectedColor === c.colorCode ? "selected" : ""} 
                      ${isUnavailable ? "unavailable" : ""}`}
                    style={{
                      background:
                        c.colorCode === "WHT" ? "#ffffff" : "#444444",
                      color:
                        c.colorCode === "WHT" ? "#000000" : "#ffffff",
                    }}
                  >
                    {c.displayName}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="section">
            <span className="label">Size</span>
            <div className="buttonGroup">
              {skuVariants.sizes.map((s) => {
                const isUnavailable = !availableSizes.includes(s.size);
                return (
                  <button
                    key={s.size}
                    onClick={() => setSelectedSize(s.size)}
                    className={`optionButton 
                      ${selectedSize === s.size ? "selected" : ""} 
                      ${isUnavailable ? "unavailable" : ""}`}
                  >
                    {s.size}
                  </button>
                );
              })}
            </div>
          </div>

          {renderPrimaryCta ? (
            renderPrimaryCta(context)
          ) : (
            <button className="primaryButton" disabled={!isCurrentAvailable}>
              {isCurrentAvailable ? "Add to Cart" : "Unavailable"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EditProductModal({ renderPrimaryCta }: Props) {
  return (
    <div className="modalWrapper">
      <div className="deviceContainer">
        <div className="deviceLabel">Mobile view (simulated)</div>
        <div className="device mobile">
          <ModalContent
            deviceType="mobile"
            renderPrimaryCta={renderPrimaryCta}
          />
        </div>
      </div>

      <div className="deviceContainer">
        <div className="deviceLabel">Desktop view (simulated)</div>
        <div className="device desktop">
          <ModalContent
            deviceType="desktop"
            renderPrimaryCta={renderPrimaryCta}
          />
        </div>
      </div>
    </div>
  );
}
