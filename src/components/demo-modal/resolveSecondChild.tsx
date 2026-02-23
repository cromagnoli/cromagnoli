
import React from "react";
import { ModalContext } from "./prepareModalContext";
import DefaultSecondChild from "./DefaultSecondChild";

type RenderFn = (context: ModalContext) => React.ReactNode;

export function resolveSecondChild(
  context: ModalContext,
  injected?: RenderFn
) {
  if (injected) return injected(context);
  return <DefaultSecondChild context={context} />;
}
