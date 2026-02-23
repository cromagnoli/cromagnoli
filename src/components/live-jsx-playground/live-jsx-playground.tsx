import React, { useEffect, useMemo, useState } from "react";
import styles from "./live-jsx-playground.module.scss";

type Scope = Record<string, unknown>;

type LiveJsxPlaygroundProps = {
  title?: string;
  initialCode: string;
  initialDataCode?: string;
  dataVarName?: string;
  dataTitle?: string;
  initialInitializationCode?: string;
  initializationVarName?: string;
  initializationTitle?: string;
  scope?: Scope;
  minEditorHeight?: number;
};

let tsModulePromise: Promise<typeof import("typescript")> | null = null;

const loadTypeScript = () => {
  if (!tsModulePromise) {
    tsModulePromise = import("typescript");
  }
  return tsModulePromise;
};

const resolvePreviewNode = (value: unknown) => {
  if (React.isValidElement(value)) {
    return value;
  }

  if (typeof value === "function") {
    return React.createElement(value as React.ComponentType);
  }

  return <pre>{String(value ?? "")}</pre>;
};

const LiveJsxPlayground = ({
  title = "Live JSX",
  initialCode,
  initialDataCode,
  dataVarName = "localData",
  dataTitle = "Data",
  initialInitializationCode,
  initializationVarName = "initializationData",
  initializationTitle = "Initialization Data",
  scope = {},
  minEditorHeight = 190,
}: LiveJsxPlaygroundProps) => {
  const [code, setCode] = useState(initialCode.trim());
  const [dataCode, setDataCode] = useState(initialDataCode?.trim() ?? "");
  const [initializationCode, setInitializationCode] = useState(
    initialInitializationCode?.trim() ?? ""
  );
  const [preview, setPreview] = useState<React.ReactNode>(null);
  const [error, setError] = useState<string>("");

  const scopeEntries = useMemo(() => Object.entries(scope), [scope]);

  useEffect(() => {
    let cancelled = false;
    const timeoutId = setTimeout(async () => {
      try {
        const ts = await loadTypeScript();
        const source = `
          function __factory() {
            ${initialDataCode ? `const ${dataVarName} = (${dataCode});` : ""}
            ${
              initialInitializationCode
                ? `const ${initializationVarName} = (${initializationCode});`
                : ""
            }
            return (${code});
          }
        `;

        const transpiled = ts.transpileModule(source, {
          compilerOptions: {
            jsx: ts.JsxEmit.React,
            target: ts.ScriptTarget.ES2018,
            module: ts.ModuleKind.ESNext,
          },
        });

        const scopeKeys = scopeEntries.map(([key]) => key);
        const scopeValues = scopeEntries.map(([, value]) => value);
        const evaluator = new Function(
          "React",
          ...scopeKeys,
          `${transpiled.outputText}; return __factory();`
        );

        const rendered = evaluator(React, ...scopeValues);
        if (!cancelled) {
          setPreview(resolvePreviewNode(rendered));
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
        }
      }
    }, 180);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [
    code,
    dataCode,
    dataVarName,
    initialDataCode,
    initializationCode,
    initializationVarName,
    initialInitializationCode,
    scopeEntries,
  ]);

  return (
    <div className={styles.playground}>
      <div className={styles.toolbar}>
        <div className={styles.title}>{title}</div>
        <button
          type="button"
          className={styles.button}
          onClick={() => {
            setCode(initialCode.trim());
            setDataCode(initialDataCode?.trim() ?? "");
            setInitializationCode(initialInitializationCode?.trim() ?? "");
          }}
        >
          Reset
        </button>
      </div>

      {initialInitializationCode ? (
        <div className={styles.editorBlock}>
          <div className={styles.editorLabel}>{initializationTitle}</div>
          <textarea
            className={styles.editor}
            style={{ minHeight: `${minEditorHeight}px` }}
            value={initializationCode}
            onChange={(event) => setInitializationCode(event.target.value)}
            spellCheck={false}
          />
        </div>
      ) : null}

      {initialDataCode ? (
        <div className={styles.editorBlock}>
          <div className={styles.editorLabel}>{dataTitle}</div>
          <textarea
            className={styles.editor}
            style={{ minHeight: `${minEditorHeight}px` }}
            value={dataCode}
            onChange={(event) => setDataCode(event.target.value)}
            spellCheck={false}
          />
        </div>
      ) : null}

      <div className={styles.editorBlock}>
        <div className={styles.editorLabel}>Component Code</div>
      <textarea
        className={styles.editor}
        style={{ height: "300px" }}
        value={code}
        onChange={(event) => setCode(event.target.value)}
        spellCheck={false}
      />
      </div>

      {error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <div className={styles.preview}>{preview}</div>
      )}
    </div>
  );
};

export default LiveJsxPlayground;
