import React, { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import styles from "./progressive-routing-demo.module.scss";
import { RoutingMode, RoutingPayload } from "./routing-simulator";

const ROUTE_EXAMPLE = "/pdp/{productCategory}/{productName}/{productId}";
const LANDING_ROUTE_EXAMPLE =
  "/cdp/{productCategory}/{productName}/{productId}";
const PRODUCT_CATEGORY = "running-sneakers";
const PRODUCT_SLUG = "white-loop-runner";
const PRODUCT_ID = "prod1234";
const LOCAL_API_BASE = "http://localhost:4001";
const REMOTE_API_BASE = "https://hybrid-routing-demo.onrender.com";
const resolveApiBase = () => {
  if (typeof window === "undefined") {
    return REMOTE_API_BASE;
  }
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1"
    ? LOCAL_API_BASE
    : REMOTE_API_BASE;
};
const API_BASE = resolveApiBase();

const buildPdpSrc = (simulateFailure: boolean, sessionId: string) => {
  const url = new URL(
    `${API_BASE}/pdp/${PRODUCT_CATEGORY}/${PRODUCT_SLUG}/${PRODUCT_ID}/`
  );
  url.searchParams.set("demoSessionId", sessionId);
  if (simulateFailure) {
    url.searchParams.set("simulateFailure", "true");
  }
  return url.toString();
};

const buildLandingSrc = (simulateFailure: boolean, sessionId: string) => {
  const url = new URL(
    `${API_BASE}/cdp/${PRODUCT_CATEGORY}/${PRODUCT_SLUG}/${PRODUCT_ID}/`
  );
  url.searchParams.set("demoSessionId", sessionId);
  if (simulateFailure) {
    url.searchParams.set("simulateFailure", "true");
  }
  return url.toString();
};

const formatIframeHtml = (html: string) => {
  const maxChars = 12000;
  return html.length > maxChars ? `${html.slice(0, maxChars)}\n<!-- truncated -->` : html;
};

const extractHtmlTitle = (html: string) => {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match?.[1]?.trim() ?? "";
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
  marker?: "SESSION_END" | "SESSION_BEGINNING";
  sessionId?: string;
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
  const [iframeTitle, setIframeTitle] = useState("");
  const [showRefreshHint, setShowRefreshHint] = useState(false);
  const [routingEvents, setRoutingEvents] = useState<RoutingEvent[]>([]);
  const [postFeedback, setPostFeedback] = useState(
    "Ready. Submit Product Name, then reload the embedded page to verify server-side updates."
  );
  const [serverPayload, setServerPayload] = useState<RoutingPayload | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastRoutingEventIdRef = useRef(0);
  const sessionId = useMemo(
    () =>
      `doc-${Date.now().toString(36)}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
    []
  );
  const [currentIframeUrl, setCurrentIframeUrl] = useState(() =>
    buildLandingSrc(false, sessionId)
  );

  useEffect(() => {
    const url = new URL(currentIframeUrl);
    if (simulateFailure) {
      url.searchParams.set("simulateFailure", "true");
    } else {
      url.searchParams.delete("simulateFailure");
    }
    url.searchParams.set("demoSessionId", sessionId);
    setCurrentIframeUrl(url.toString());
  }, [simulateFailure, sessionId]);

  useEffect(() => {
    if (!simulateFailure) {
      return;
    }

    try {
      const url = new URL(currentIframeUrl);
      const legacyForced = url.searchParams.get("legacy") === "true";
      if (!legacyForced) {
        return;
      }
    } catch {
      return;
    }

    setSimulateFailure(false);
  }, [currentIframeUrl, simulateFailure]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const fetchUrl = new URL(`${API_BASE}/resolve/${PRODUCT_ID}`);
    fetchUrl.searchParams.set("demoSessionId", sessionId);
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
        setError("Hybrid routing service unreachable.");
        setServerPayload(null);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [simulateFailure, reloadToken, sessionId]);

  const activeLabel = useMemo(() => {
    if (serverPayload?.queryLegacy) {
      return "Legacy forced via ?legacy=true";
    }
    if (serverPayload?.fallback) {
      return "Legacy fallback after NextGen error";
    }
    return serverPayload?.route === "nextgen"
      ? "NextGen - React Router/Remix (Reactive UI)"
      : "Hapi legacy controller (postback)";
  }, [serverPayload]);

  const activeLabelClassName = useMemo(() => {
    const isLegacyActive =
      serverPayload?.route === "legacy" ||
      serverPayload?.fallback ||
      serverPayload?.queryLegacy;
    return `${styles.modeHeroActiveLabel} ${
      isLegacyActive ? styles.modeHeroActiveLabelLegacy : styles.modeHeroActiveLabelNextGen
    }`;
  }, [serverPayload]);

  const serverLogLines = useMemo(() => {
    if (routingEvents.length > 0) {
      const lines: string[] = [];
      const events = routingEvents.slice(-12);

      for (const event of events) {
        if (event.marker === "SESSION_END") {
          lines.push(
            `[SESSION ${event.sessionId ?? "unknown"}] ---------`
          );
          continue;
        }
        if (event.marker === "SESSION_BEGINNING") {
          lines.push(
            `[SESSION ${event.sessionId ?? "unknown"}] ---------`
          );
          continue;
        }
        const time = formatEventTimestamp(event.at);
        lines.push(
          `${time} · ${event.method} ${event.path} · route=${event.route} reason=${event.reason} fallback=${event.fallback ? "yes" : "no"}`
        );
      }

      return lines;
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

  const isOnCategoryPage = useMemo(() => {
    try {
      return new URL(currentIframeUrl).pathname.includes("/cdp/");
    } catch {
      return false;
    }
  }, [currentIframeUrl]);

  const isOnProductDetailPage = useMemo(() => {
    try {
      return new URL(currentIframeUrl).pathname.includes("/pdp/");
    } catch {
      return false;
    }
  }, [currentIframeUrl]);
  const isLegacyForcedInUrl = useMemo(() => {
    try {
      return new URL(currentIframeUrl).searchParams.get("legacy") === "true";
    } catch {
      return false;
    }
  }, [currentIframeUrl]);
  const isNextGenProductDetailActive =
    isOnProductDetailPage &&
    !isLegacyForcedInUrl &&
    serverPayload?.route === "nextgen";
  const currentTabLabel =
    iframeTitle || (isOnCategoryPage ? "Category Detail" : "Product Detail");
  const frameUrl = useMemo(() => {
    const url = new URL(currentIframeUrl);
    url.searchParams.set("__reload", String(reloadToken));
    return url.toString();
  }, [currentIframeUrl, reloadToken]);

  const displayUrl = useMemo(() => {
    const url = new URL(currentIframeUrl);
    url.searchParams.delete("demoSessionId");
    url.searchParams.delete("__reload");
    url.searchParams.delete("routingMode");
    return url.toString();
  }, [currentIframeUrl]);

  const submitExternalPost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = productNameDraft.trim() || "White Loop Runner";
    const actionUrl = buildPdpSrc(simulateFailure, sessionId);
    setPostSubmitting(true);

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
      setPostFeedback("POST accepted. Click reload to apply in the iframe.");
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
    if (routingMode === "nextgen") {
      setCurrentIframeUrl((prev) => {
        try {
          const url = new URL(prev);
          url.searchParams.delete("legacy");
          url.searchParams.delete("fallbackReason");
          return url.toString();
        } catch {
          return prev;
        }
      });
    }
    setPostPending(true);
    setReloadToken((prev) => prev + 1);
  };

  const goBackToCategory = () => {
    if (postSubmitting || isOnCategoryPage) {
      return;
    }
    setPostPending(true);
    setCurrentIframeUrl(buildLandingSrc(simulateFailure, sessionId));
    setPostFeedback("Navigated back to category page.");
  };

  const handleIframeLoad = () => {
    setPostPending(false);
    requestIframeHtmlSnapshot(iframeRef.current?.contentWindow ?? null);
    try {
      const docTitle = iframeRef.current?.contentDocument?.title;
      if (docTitle) {
        setIframeTitle(docTitle);
      }
      const html = iframeRef.current?.contentDocument?.documentElement?.outerHTML;
      if (!html) {
        setIframeHtml("Unable to read iframe HTML.");
        return;
      }
      const parsedTitle = extractHtmlTitle(html);
      if (parsedTitle) {
        setIframeTitle(parsedTitle);
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

      const data = event.data as { type?: string; html?: string; href?: string };
      if (data?.type === "IFRAME_NAVIGATION_START") {
        setPostPending(true);
        return;
      }
      if (data?.type !== "IFRAME_HTML_SNAPSHOT") {
        return;
      }

      if (typeof data.href === "string" && data.href) {
        try {
          const nextUrl = new URL(data.href);
          nextUrl.searchParams.delete("routingMode");
          setCurrentIframeUrl(nextUrl.toString());
        } catch {
          setCurrentIframeUrl(data.href);
        }
      }

      const html = typeof data.html === "string" ? data.html : "";
      if (!html) {
        return;
      }
      const parsedTitle = extractHtmlTitle(html);
      if (parsedTitle) {
        setIframeTitle(parsedTitle);
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
      const configUrl = buildPdpSrc(simulateFailure, sessionId);
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
    <>
      <div className={styles.card}>
        <div className={styles.cardHeader}>Live User Flow Test Playground</div>

          <div className={`${styles.modeHero} ${styles.playgroundModeHero} ${styles.stickyModeHero}`}>
          <div className={styles.modeHeroTopRow}>
            <div className={styles.modeHeroLabel}>NextGen Rollout Feature Flag Switch for Product Detail Page</div>
          </div>
          <div className={styles.modeControlRow}>
            <div className={styles.modeSwitchWrap}>
              {showRefreshHint ? (
                  <div className={styles.modeTooltip}>
                    <span className={styles.modeTooltipText}>
                      If you are on the product detail page, use the embedded browser reload button to reload the current page with the selected renderer.
                    </span>
                  </div>
              ) : null}
              <button
                  type="button"
                  className={`${styles.modeSwitch} ${
                      routingMode === "legacy" ? styles.modeSwitchLegacy : ""
                  } ${
                      postSubmitting ? styles.modeSwitchLoading : ""
                  }`}
                  onClick={toggleRoutingMode}
                  aria-label="Toggle product detail page routing mode"
                  title="Toggle product detail page routing mode"
                  disabled={postSubmitting}
              >
                <span className={styles.modeState}>
                    {routingMode === "nextgen" ? "ON" : "OFF"}
                  </span>
                <span className={styles.modeThumb} />
              </button>
            </div>
            <div className={activeLabelClassName}>
              Current experience: {activeLabel}
            </div>
          </div>
        </div>

        <div className={styles.cardBody}>
          {error ? <div className={styles["error-note"]}>{error}</div> : null}

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
                        className={styles.backButton}
                        onClick={goBackToCategory}
                        title="Back to category"
                        disabled={postSubmitting || isOnCategoryPage}
                      >
                        <svg
                          viewBox="0 0 16 16"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path d="M9.75 3.25L4.25 8l5.5 4.75v-2.75h3v-4h-3z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className={styles.reloadButton}
                        onClick={reloadFrame}
                        title="Reload"
                        disabled={postSubmitting || postPending}
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
                    {currentTabLabel}
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
                  Optionally, copy this URL to test the route manually in a new tab.
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
        </div>
      </div>

      <div className={`${styles.modeHero} ${styles.sectionBlock}`}>
        <div className={styles.modeHeroTopRow}>
          <div className={styles.sectionLabel}>Simulate NextGen failure</div>
        </div>
        <div className={styles.modeHeroBodyText}>
          This flow is resilient by design: when NextGen fails, an error boundary
          redirects to legacy rendering to minimize user friction.
        </div>
        <div className={styles.modeControlRow}>
          <button
            type="button"
            className={styles.failureCta}
            disabled={!isNextGenProductDetailActive || simulateFailure}
            onClick={() => {
              setPostPending(true);
              setSimulateFailure((prev) => !prev);
            }}
          >
            {simulateFailure ? "Failure triggered 🔥" : "Trigger failure 🔥"}
          </button>
          {!isNextGenProductDetailActive ? (
            <div className={styles.modeHeroBodyText}>
              Disabled until the iframe is on NextGen product detail.
            </div>
          ) : null}
        </div>
      </div>

      <div className={`${styles.modeHero} ${styles.sectionBlock}`}>
        <div className={styles.modeHeroTopRow}>
          <div className={styles.sectionLabel}>Live Server Data Editing (REST)</div>
        </div>
        <div className={styles.modeHeroBodyText}>
          Use this control to verify that both renderers consume the same
          server-side source of truth. Submit an update, then reload the
          embedded page to confirm consistent data across legacy and NextGen.
        </div>
        <form className={styles.externalPostForm} onSubmit={submitExternalPost}>
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
      </div>

      <div className={styles.iframeCode}>
        <div className={styles.iframeCodeTitle}>Current iframe HTML</div>
        <div className={styles.iframeCodeHint}>
          Inspect the raw HTML payload returned by the active server renderer
          before client-side processing. Look for runtime markers such as Vite
          scripts to validate which stack served the page.
        </div>
        <pre className={styles.iframeCodePre}>{iframeHtml}</pre>
      </div>

      {loading ? (
        <div className={styles["spinner"]}>Fetching routing state...</div>
      ) : (
        <div className={styles.logsPanel}>
          <div className={styles.codeBlockTitle}>
            Server Log
          </div>
          <div className={styles.codeBlockHint}>
            Validate routing decisions by tracking which renderer served each
            request and, if applicable, why fallback happened.
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
    </>
  );
};

export default ProgressiveRoutingDemo;
