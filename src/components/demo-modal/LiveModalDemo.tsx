
import React from "react";
import { mockVariants } from "./mockData";
import EditProductModal from "./EditProductModal";
import "./modal.css";

export default function LiveModalDemo() {
  return (
    <div>
      <div className="demoSection">
        <h3>Default Behavior</h3>
        <EditProductModal variants={mockVariants} />
      </div>

      <div>
        <h3>Injected CTA</h3>
        <EditProductModal
          variants={mockVariants}
          renderPrimaryCta={(context) => (
            <button
              className="primaryButton"
              disabled={!context.isAvailable}
            >
              {context.isAvailable
                ? `Confirm ${context.selectedSize}`
                : "Select valid combination"}
            </button>
          )}
        />
      </div>
    </div>
  );
}
