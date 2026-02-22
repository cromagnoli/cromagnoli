export type RoutingMode = "nextgen" | "legacy";

export type RoutingContext = {
  productId: string;
  routingMode: RoutingMode;
  simulateFailure: boolean;
  legacyQuery: boolean;
};

export type RoutingEvaluation = {
  route: RoutingMode;
  reason: string;
  fallback: boolean;
  queryLegacy: boolean;
  manifestInjected: boolean;
  singletonActive: boolean;
};

export const evaluateRouting = ({
  routingMode,
  simulateFailure,
  legacyQuery,
}: RoutingContext): RoutingEvaluation => {
  const evaluation: RoutingEvaluation = {
    route: "nextgen",
    reason: "nextgen-active",
    fallback: false,
    queryLegacy: legacyQuery,
    manifestInjected: true,
    singletonActive: true,
  };

  if (legacyQuery) {
    evaluation.route = "legacy";
    evaluation.reason = "forced-by-query";
    evaluation.manifestInjected = false;
    evaluation.singletonActive = false;
  } else if (routingMode === "legacy") {
    evaluation.route = "legacy";
    evaluation.reason = "feature-flag-off";
    evaluation.manifestInjected = false;
    evaluation.singletonActive = false;
  } else if (simulateFailure) {
    evaluation.route = "legacy";
    evaluation.reason = "nextgen-error";
    evaluation.singletonActive = true;
    evaluation.manifestInjected = true;
    evaluation.fallback = true;
  }

  return evaluation;
};

export type RoutingForm = {
  heading: string;
  description: string;
  fields: Array<{ label: string; value: string }>;
};

export type RoutingPayload = RoutingEvaluation & {
  productId: string;
  form: RoutingForm;
  productName?: string;
  routingMode?: RoutingMode;
  simulateFailure?: boolean;
};

export const buildPayload = ({ productId, ...context }: RoutingContext): RoutingPayload => {
  const evaluation = evaluateRouting({ productId, ...context });
  const form: RoutingForm =
    evaluation.route === "nextgen"
      ? {
          heading: "NextGen edit suite",
          description: "Modern form served by viteDevServerSingleton.",
    fields: [
      { label: "Listing title", value: "BuyMeNot Horizon" },
      { label: "Platform", value: "React Router 7" },
      { label: "Status", value: "Editable" },
      { label: "Variant ID", value: "RR7-01-EXP" },
    ],
  }
      : {
          heading: "Legacy Hapi listing view",
          description: "Plain Hapi controller from the 2000s codebase.",
      fields: [
        { label: "Listing title", value: "BuyMeNot Horizon" },
        { label: "Form hint", value: "HTML tables + inline styles" },
        { label: "Status", value: "Read-only" },
        { label: "Variant ID", value: "HAPI-LEG-02" },
      ],
        };

  return {
    ...evaluation,
    productId,
    form,
  };
};
