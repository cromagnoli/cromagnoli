
import React, { useState } from "react";
import "./modal.css";

const variants = [
  { colorCode: "WHT", size: "8", available: true },
  { colorCode: "WHT", size: "9", available: false },
  { colorCode: "GPH", size: "8", available: false },
  { colorCode: "GPH", size: "9", available: true },
];

const imageMap = {
  WHT: "/images/shoes-white.png",
  GPH: "/images/shoes-graphite.png",
};

function isAvailable(color: string, size: string) {
  return variants.some(
    (v) => v.colorCode === color && v.size === size && v.available
  );
}

function ModalContent({ deviceType }: { deviceType: "mobile" | "desktop" }) {
  const [color, setColor] = useState("WHT");
  const [size, setSize] = useState("8");

  const sizes = ["8", "9"];
  const colors = [
    { code: "WHT", label: "White" },
    { code: "GPH", label: "Graphite" },
  ];

  const available = isAvailable(color, size);

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
              {colors.map((c) => (
                <button
                  key={c.code}
                  onClick={() => setColor(c.code)}
                  className={`optionButton ${color === c.code ? "selected" : ""}`}
                  style={{
                    background: c.code === "WHT" ? "#ffffff" : "#444444",
                    color: c.code === "WHT" ? "#000000" : "#ffffff"
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="section">
            <span className="label">Size</span>
            <div className="buttonGroup">
              {sizes.map((s) => {
                const comboAvailable = isAvailable(color, s);
                return (
                  <button
                    key={s}
                    onClick={() => comboAvailable && setSize(s)}
                    className={`optionButton 
                      ${size === s ? "selected" : ""} 
                      ${!comboAvailable ? "disabled" : ""}`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          <button className="primaryButton" disabled={!available}>
            {available ? "Add to Cart" : "Unavailable"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EditProductModal() {
  return (
    <div className="modalWrapper">
      <div className="deviceContainer">
        <div className="deviceLabel">Mobile view (simulated)</div>
        <div className="device mobile">
          <ModalContent deviceType="mobile" />
        </div>
      </div>

      <div className="deviceContainer">
        <div className="deviceLabel">Desktop view (simulated)</div>
        <div className="device desktop">
          <ModalContent deviceType="desktop" />
        </div>
      </div>
    </div>
  );
}
