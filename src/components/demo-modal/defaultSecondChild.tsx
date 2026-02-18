
import React from "react";
import { ModalContext } from "./prepareModalContext";
import "./modal.css";

export default function DefaultSecondChild({ context }: { context: ModalContext }) {
  return (
    <button className="primaryButton" disabled={!context.isAvailable}>
      {context.isAvailable ? "Update Item" : "Unavailable"}
    </button>
  );
}
