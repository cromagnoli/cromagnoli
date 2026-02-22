import React, { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import styles from "./progressive-routing-demo.module.scss";
import {
  buildPayload,
  RoutingMode,
  RoutingPayload,
} from "./routing-simulator";

const ROUTE_EXAMPLE = "/pdp/{productCategory}/{productName}/{productId}";
const PRODUCT_CATEGORY = "running-sneakers";
const PRODUCT_SLUG = "white-loop-runner";
const PRODUCT_ID = "prod1234";
// const API_BASE =
//   "https://hybrid-routing-demo.onrender.com";
const API_BASE = "http://localhost:4001";

const buildIframeSrc = (simulateFailure: boolean) => {
  const url = new URL(
    `${API_BASE}/pdp/${PRODUCT_CATEGORY}/${PRODUCT_SLUG}/${PRODUCT_ID}/`
  );
  if (simulateFailure) {
    url.searchParams.set("simulateFailure", "true");
  }
  return url.toString();
};

const formatIframeHtml = (html: string) => {
  const maxChars = 12000;
  return html.length > maxChars ? `${html.slice(0, maxChars)}\n<!-- truncated -->` : html;
};

const requestIframeHtmlSnapshot = (targetWindow: Window | null) => {
  if (!targetWindow) {
    return;
  }
  targetWindow.postMessage({ type: "REQUEST_HTML_SNAPSHOT" }, "*");
};

const formatEventTimestamp = (isoTimestamp: string) => {
  const date = new Date(isoTimestamp);
  if (Number.isNaN(date.getTime())) {
    return isoTimestamp;
  }
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  }).format(date);
};

type RoutingEvent = {
  id: number;
  at: string;
  method: string;
  path: string;
  productId: string;
  route: "nextgen" | "legacy";
  reason: string;
  fallback: boolean;
  legacyQuery: boolean;
  routingMode: "nextgen" | "legacy";
  simulateFailure: boolean;
};

const ProgressiveRoutingDemo = () => {
  const [routingMode, setRoutingMode] = useState<RoutingMode>("nextgen");
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [productNameDraft, setProductNameDraft] = useState("White Loop Runner");
  const [postPending, setPostPending] = useState(true);
  const [postSubmitting, setPostSubmitting] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [iframeHtml, setIframeHtml] = useState("Waiting for iframe load...");
  const [showRefreshHint, setShowRefreshHint] = useState(false);
  const [routingEvents, setRoutingEvents] = useState<RoutingEvent[]>([]);
  const [postFeedback, setPostFeedback] = useState(
    "Ready. Submit Product Name to compare reactive update vs full postback."
  );
  const [serverPayload, setServerPayload] = useState<RoutingPayload | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastRoutingEventIdRef = useRef(0);
  const localTimeZone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    []
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const fetchUrl = new URL(`${API_BASE}/resolve/${PRODUCT_ID}`);
    fetchUrl.searchParams.set("simulateFailure", simulateFailure ? "true" : "false");
    fetchUrl.searchParams.set("legacy", "false");

    fetch(fetchUrl.toString())
      .then((res) => {
        if (!res.ok) {
          throw new Error("Server unreachable");
        }
        return res.json();
      })
      .then((payload: RoutingPayload) => {
        if (cancelled) {
          return;
        }
        setServerPayload(payload);
        if (typeof payload.productName === "string" && payload.productName.trim()) {
          setProductNameDraft(payload.productName);
        }
        if (payload.routingMode === "nextgen" || payload.routingMode === "legacy") {
          setRoutingMode(payload.routingMode);
        }
        if (typeof payload.simulateFailure === "boolean") {
          setSimulateFailure(payload.simulateFailure);
        }
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) {
          return;
        }
        setError(
          "Hybrid routing service unreachable. Falling back to local simulation."
        );
        const fallbackPayload = buildPayload({
          productId: PRODUCT_ID,
          routingMode,
          simulateFailure,
          legacyQuery: false,
        });
        setServerPayload(fallbackPayload);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [routingMode, simulateFailure, reloadToken]);

  const activeLabel = useMemo(() => {
    if (serverPayload?.queryLegacy) {
      return "Legacy forced via ?legacy=true";
    }
    if (serverPayload?.fallback) {
      return "Legacy fallback after NextGen error";
    }
    return serverPayload?.route === "nextgen"
      ? "React Router 7 (NextGen) via viteDevServerSingleton"
      : "Hapi legacy controller";
  }, [serverPayload]);

  const signalClass = useMemo(() => {
    const base = [styles.signal];
    if (
      serverPayload?.route === "legacy" ||
      serverPayload?.fallback ||
      serverPayload?.queryLegacy
    ) {
      base.push(styles.legacy);
    }
    return base.join(" ");
  }, [serverPayload]);

  const serverLogLines = useMemo(() => {
    if (routingEvents.length > 0) {
      return routingEvents.slice(-8).map((event) => {
        const time = formatEventTimestamp(event.at);
        return `${time} · ${event.method} ${event.path} · route=${event.route} reason=${event.reason} fallback=${event.fallback ? "yes" : "no"}`;
      });
    }
    if (!serverPayload) {
      return ["Waiting for the routing service to respond..."];
    }
    if (serverPayload.queryLegacy) {
      return ["Routing hint: ?legacy=true present → skip NextGen.", "Invoking listings.singleListing via Hapi."];
    }
    if (serverPayload.fallback) {
      return [
        "NextGen routing activated but a runtime error surfaced.",
        "Resolver falls back to the legacy Hapi handler (notFound fallback).",
      ];
    }
    if (serverPayload.route === "nextgen") {
      return [
        "NextGen routing active → hitting React Router 7 entrypoint.",
        "viteDevServerSingleton reused; manifest injected on demand.",
      ];
    }
    return ["Feature flag disabled → legacy Hapi controller handles the route."];
  }, [serverPayload, routingEvents]);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const serverLogRef = useRef<HTMLDivElement | null>(null);
  const refreshHintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldStickServerLogToBottomRef = useRef(true);
  const apiOrigin = useMemo(() => new URL(API_BASE).origin, []);

  useEffect(
    () => () => {
      if (refreshHintTimeoutRef.current) {
        clearTimeout(refreshHintTimeoutRef.current);
      }
    },
    []
  );

  useEffect(() => {
    const node = serverLogRef.current;
    if (!node) {
      return;
    }
    if (!shouldStickServerLogToBottomRef.current) {
      return;
    }
    node.scrollTop = node.scrollHeight;
  }, [serverLogLines]);

  const handleServerLogScroll = () => {
    const node = serverLogRef.current;
    if (!node) {
      return;
    }
    const distanceToBottom = node.scrollHeight - node.scrollTop - node.clientHeight;
    shouldStickServerLogToBottomRef.current = distanceToBottom < 24;
  };

  useEffect(() => {
    let cancelled = false;

    const poll = () => {
      const url = new URL(`${API_BASE}/routing-events`);
      url.searchParams.set("after", String(lastRoutingEventIdRef.current));

      fetch(url.toString())
        .then((res) => {
          if (!res.ok) {
            throw new Error("events unavailable");
          }
          return res.json();
        })
        .then((payload: { events?: RoutingEvent[]; latestId?: number }) => {
          if (cancelled || !Array.isArray(payload.events) || payload.events.length === 0) {
            return;
          }

          setRoutingEvents((prev) => [...prev, ...payload.events].slice(-40));
          const last = payload.events[payload.events.length - 1];
          if (last && typeof last.id === "number") {
            lastRoutingEventIdRef.current = last.id;
          } else if (typeof payload.latestId === "number") {
            lastRoutingEventIdRef.current = payload.latestId;
          }
        })
        .catch(() => {
          // silent fallback
        });
    };

    poll();
    const timer = window.setInterval(poll, 1200);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  const activeRouteIsLegacy = serverPayload?.route === "legacy";
  const frameUrl = useMemo(() => {
    const url = new URL(buildIframeSrc(simulateFailure));
    url.searchParams.set("__reload", String(reloadToken));
    return url.toString();
  }, [simulateFailure, reloadToken]);

  const displayUrl = useMemo(() => {
    const url = new URL(buildIframeSrc(simulateFailure));
    return url.toString();
  }, [simulateFailure]);

  const submitExternalPost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = productNameDraft.trim() || "White Loop Runner";
    const actionUrl = buildIframeSrc(simulateFailure);
    setPostSubmitting(true);

    if (activeRouteIsLegacy) {
      try {
        const body = new URLSearchParams({ productName: trimmedName });
        const response = await fetch(actionUrl, {
          method: "POST",
          body,
        });
        if (!response.ok) {
          throw new Error("POST failed");
        }
        setProductNameDraft(trimmedName);
        setPostFeedback(
          "Legacy POST accepted. Click reload to render the full postback."
        );
      } catch {
        setPostFeedback("Legacy POST failed. Check service availability.");
      } finally {
        setPostSubmitting(false);
      }
      return;
    }

    setPostFeedback("NextGen POST in progress (reactive update, no iframe reload)...");

    try {
      const reactiveUrl = new URL(actionUrl);
      reactiveUrl.searchParams.set("reactive", "1");
      const body = new URLSearchParams({ productName: trimmedName });

      const response = await fetch(reactiveUrl.toString(), {
        method: "POST",
        body,
      });

      if (!response.ok) {
        throw new Error("POST failed");
      }

      const payload = (await response.json()) as { productName?: string };
      const resolvedName =
        typeof payload.productName === "string" && payload.productName.trim()
          ? payload.productName
          : trimmedName;

      iframeRef.current?.contentWindow?.postMessage(
        { type: "PDP_NAME_UPDATE", productName: resolvedName },
        "*"
      );

      setProductNameDraft(resolvedName);
      setPostFeedback("NextGen POST completed reactively (same iframe document).");
    } catch {
      setPostFeedback("POST failed. Check service availability.");
    } finally {
      setPostSubmitting(false);
    }
  };

  const reloadFrame = () => {
    if (postSubmitting) {
      return;
    }
    setPostPending(true);
    setReloadToken((prev) => prev + 1);
  };

  const handleIframeLoad = () => {
    setPostPending(false);
    requestIframeHtmlSnapshot(iframeRef.current?.contentWindow ?? null);
    try {
      const html = iframeRef.current?.contentDocument?.documentElement?.outerHTML;
      if (!html) {
        setIframeHtml("Unable to read iframe HTML.");
        return;
      }
      setIframeHtml(formatIframeHtml(html));
    } catch {
      setIframeHtml("Cross-origin iframe: waiting for postMessage HTML snapshot...");
    }
  };

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source !== iframeRef.current?.contentWindow) {
        return;
      }

      const expectedOrigin = new URL(displayUrl).origin;
      if (event.origin !== apiOrigin && event.origin !== expectedOrigin) {
        return;
      }

      const data = event.data as { type?: string; html?: string };
      if (data?.type !== "IFRAME_HTML_SNAPSHOT") {
        return;
      }

      const html = typeof data.html === "string" ? data.html : "";
      if (!html) {
        return;
      }
      setIframeHtml(formatIframeHtml(html));
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [apiOrigin, displayUrl]);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(displayUrl);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 1200);
    } catch {
      setCopiedAddress(false);
    }
  };

  const toggleRoutingMode = async () => {
    const nextRoutingMode = routingMode === "nextgen" ? "legacy" : "nextgen";
    setRoutingMode(nextRoutingMode);
    setPostSubmitting(true);
    setPostFeedback(`Updating routing mode to ${nextRoutingMode} via POST...`);

    try {
      const configUrl = buildIframeSrc(simulateFailure);
      const body = new URLSearchParams({ routingMode: nextRoutingMode });
      const response = await fetch(configUrl, { method: "POST", body });
      if (!response.ok) {
        throw new Error("POST failed");
      }
      setShowRefreshHint(true);
      if (refreshHintTimeoutRef.current) {
        clearTimeout(refreshHintTimeoutRef.current);
      }
      refreshHintTimeoutRef.current = setTimeout(
        () => setShowRefreshHint(false),
        10000
      );
      setPostFeedback(
        `Routing mode updated to ${nextRoutingMode}. Click reload to apply in iframe.`
      );
    } catch {
      setRoutingMode((prev) => (prev === "nextgen" ? "legacy" : "nextgen"));
      setPostFeedback("Routing mode POST failed. Check service availability.");
    } finally {
      setPostSubmitting(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.controls}>
        <div className={styles.group}>
          NextGen
          <div className={styles.modeSwitchWrap}>
            {showRefreshHint ? (
              <div className={styles.modeTooltip}>
                <span className={styles.modeTooltipText}>
                  Refresh with the embedded browser reload button.
                </span>
              </div>
            ) : null}
            <button
              type="button"
              className={`${styles.modeSwitch} ${
                routingMode === "legacy" ? styles.modeSwitchLegacy : ""
              }`}
              onClick={toggleRoutingMode}
              aria-label="Toggle routing mode"
              title="Toggle routing mode"
              disabled={postSubmitting}
            >
              <span className={styles.modeState}>
                {routingMode === "nextgen" ? "ON" : "OFF"}
              </span>
              <span className={styles.modeThumb} />
            </button>
          </div>
        </div>
        <div className={styles.group}>
          Simulate NextGen failure
          <button
            type="button"
            disabled={routingMode === "legacy"}
            onClick={() => {
              setPostPending(true);
              setSimulateFailure((prev) => !prev);
            }}
          >
            {simulateFailure ? "Failure triggered 🔥" : "Trigger failure 🔥"}
          </button>
        </div>
      </div>
      <div className={styles.status}>
        <div className={signalClass}>
          <div className={styles["signal-title"]}>{activeLabel}</div>
          <div className={styles["signal-subtitle"]}>
            Path under test: <code>{ROUTE_EXAMPLE}</code>
          </div>
        </div>
      </div>

      {error ? <div className={styles["error-note"]}>{error}</div> : null}

      <form className={styles.postPanel} onSubmit={submitExternalPost}>
        <label htmlFor="pdp-name">Product Name (external POST)</label>
        <div className={styles.postFormRow}>
          <input
            id="pdp-name"
            value={productNameDraft}
            onChange={(event) => setProductNameDraft(event.target.value)}
          />
          <button type="submit" disabled={postPending}>
            {postSubmitting ? "Posting..." : "POST to server"}
          </button>
        </div>
        <div className={styles.postFeedback}>{postFeedback}</div>
      </form>

      <div className={styles.iframeWrapper}>
        <div className={styles.browserChrome}>
          <div className={styles.browserTopBar}>
            <div className={styles.browserLeft}>
              <div className={styles.browserControls}>
                <div className={styles.trafficLights} aria-hidden="true">
                  <span className={`${styles.light} ${styles.red}`} />
                  <span className={`${styles.light} ${styles.yellow}`} />
                  <span className={`${styles.light} ${styles.green}`} />
                </div>
                <div className={styles.browserStatus}>
                  <button
                    type="button"
                    className={styles.reloadButton}
                    onClick={reloadFrame}
                    title="Reload"
                    disabled={postSubmitting}
                  >
                    ⟳
                  </button>
                </div>
              </div>
              <div className={styles.browserTab} aria-hidden="true">
                {postPending ? (
                  <span className={`${styles.tabSpinner} ${styles.spinning}`} />
                ) : (
                  <span className={styles.tabBuyMeNotIcon}>B</span>
                )}
                Product Detail
              </div>
            </div>
            <div className={styles.addressRow}>
              <code className={styles.address}>{displayUrl}</code>
              <button
                type="button"
                className={`${styles.copyButton} ${
                  copiedAddress ? styles.copyButtonCopied : ""
                }`}
                onClick={copyAddress}
                title="Copy address"
              >
                {copiedAddress ? "✓ Copied" : "Copy address"}
              </button>
            </div>
            <div className={styles.addressHint}>
              Copy this URL to test the route manually in a new tab.
            </div>
          </div>
        </div>
        <iframe
          key={frameUrl}
          ref={iframeRef}
          className={styles.previewFrame}
          src={frameUrl}
          onLoad={handleIframeLoad}
          title="Progressive routing preview"
        />
      </div>
      <div className={styles.iframeCode}>
        <div className={styles.iframeCodeTitle}>Current iframe HTML</div>
        <pre className={styles.iframeCodePre}>{iframeHtml}</pre>
      </div>

      {loading ? (
        <div className={styles["spinner"]}>Fetching routing state...</div>
    ) : (
        <div className={styles.logsPanel}>
          <div className={styles.codeBlockTitle}>
            Server Log
          </div>
          <div
            ref={serverLogRef}
            className={styles["code-block"]}
            onScroll={handleServerLogScroll}
          >
            {serverLogLines.map((line) => (
              <div key={line}>{line}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressiveRoutingDemo;
