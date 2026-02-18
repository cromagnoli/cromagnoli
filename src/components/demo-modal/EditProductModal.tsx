
import React, { useState } from "react";
import { SkuVariants } from "./types";
import { prepareModalContext, ModalContext } from "./prepareModalContext";
import { resolveSecondChild } from "./resolveSecondChild";
import "./modal.css";

type RenderFn = (context: ModalContext) => React.ReactNode;

type Props = {
  variants: SkuVariants;
  renderPrimaryCta?: RenderFn;
};

const imageMap: Record<string, string> = {
  WHT: "/images/shoes-white.png",
  GPH: "/images/shoes-graphite.png",
};

function ModalContent({
  variants,
  renderPrimaryCta,
  deviceType,
}: Props & { deviceType: "mobile" | "desktop" }) {
  const [color, setColor] = useState(variants.colors[0].colorCode);
  const [size, setSize] = useState(variants.sizes[0].size);

  const { currentSku, isAvailable } = prepareModalContext(
    variants,
    color,
    size
  );

  const context: ModalContext = {
    selectedColor: color,
    selectedSize: size,
    setColor,
    setSize,
    currentSku,
    isAvailable,
    variants,
  };

  return (
    <div className={`modalCard ${deviceType}`}>
      <div className="layout">
        <div className="imageColumn">
          <img src={imageMap[color]} alt="Product preview" />
        </div>

        <div className="contentColumn">
          <div className="section">
            <span className="label">Color</span>
            <div className="buttonGroup">
              {variants.colors.map((c) => (
                <button
                  key={c.colorCode}
                  onClick={() => setColor(c.colorCode)}
                  className={`optionButton ${
                    color === c.colorCode ? "optionButtonSelected" : ""
                  }`}
                  style={{
                    background:
                      c.colorCode === "WHT" ? "#ffffff" : "#444444",
                    color:
                      c.colorCode === "WHT" ? "#000000" : "#ffffff",
                    border: "1px solid #cbd5e1"
                  }}
                >
                  {c.displayName}
                </button>
              ))}
            </div>
          </div>

          <div className="section">
            <span className="label">Size</span>
            <div className="buttonGroup">
              {variants.sizes.map((s) => (
                <button
                  key={s.size}
                  onClick={() => setSize(s.size)}
                  className={`optionButton ${
                    size === s.size ? "optionButtonSelected" : ""
                  }`}
                >
                  {s.size}
                </button>
              ))}
            </div>
          </div>

          {resolveSecondChild(context, renderPrimaryCta)}
        </div>
      </div>
    </div>
  );
}

export default function EditProductModal(props: Props) {
  return (
    <div className="modalWrapper">
      <div className="deviceContainer">
        <div className="deviceLabel">Mobile view (simulated)</div>
        <div className="device mobile">
          <ModalContent {...props} deviceType="mobile" />
        </div>
      </div>

      <div className="deviceContainer">
        <div className="deviceLabel">Desktop view (simulated)</div>
        <div className="device desktop">
          <ModalContent {...props} deviceType="desktop" />
        </div>
      </div>
    </div>
  );
}
