import { useEffect } from "react";

const EmbeddedPageMode = () => {
  useEffect(() => {
    const hasEmbeddedQuery = new URLSearchParams(window.location.search).has(
      "embedded"
    );
    const root = document.documentElement;
    const selectors = [
      ".navbar",
      ".theme-doc-sidebar-container",
      ".table-of-contents",
      ".theme-doc-toc-desktop",
      ".theme-doc-toc-mobile",
      ".tocCollapsible_ETCw",
      ".tocMobile_ITEo",
      ".theme-doc-breadcrumbs",
      ".breadcrumbs",
    ];
    const hiddenNodes: Array<{ node: HTMLElement; prevDisplay: string }> = [];

    if (hasEmbeddedQuery) {
      root.classList.add("embedded-doc-mode");
      selectors.forEach((selector) => {
        document.querySelectorAll<HTMLElement>(selector).forEach((node) => {
          hiddenNodes.push({ node, prevDisplay: node.style.display });
          node.style.display = "none";
        });
      });
    } else {
      root.classList.remove("embedded-doc-mode");
    }

    return () => {
      root.classList.remove("embedded-doc-mode");
      hiddenNodes.forEach(({ node, prevDisplay }) => {
        node.style.display = prevDisplay;
      });
    };
  }, []);

  return null;
};

export default EmbeddedPageMode;
