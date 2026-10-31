const URL_PARAM = "erpInitData";
const INIT_DATA_MESSAGE = "erp-miniapp:init-data";
const REQUEST_MESSAGE = "erp-miniapp:request-init-data";

/**
 * Mount prefix the browser sees. Behind ERP Traefik that is `/apps/<slug>-<id>/`;
 * the proxy strips it before Next sees the request. Nested client routes must
 * not be part of the base — only the mount does.
 * Local `next dev` has no `/apps/…` prefix → `/`.
 */
export function appBase(): string {
  if (typeof window === "undefined") return "/";
  const match = window.location.pathname.match(/^(\/apps\/[^/]+)/);
  if (!match) return "/";
  return `${match[1]}/`;
}

export function appUrl(path: string): string {
  return `${appBase()}${path.replace(/^\//, "")}`;
}

/** Reads the signed string the host put in the URL when it opened the frame. */
export function readInitDataFromLocation(): string | null {
  if (typeof window === "undefined") return null;
  for (const raw of [window.location.hash.slice(1), window.location.search.slice(1)]) {
    const value = new URLSearchParams(raw).get(URL_PARAM);
    if (value) return value;
  }
  return null;
}

/**
 * Asks the host app for a fresh initData and waits for its postMessage reply.
 * Any origin may answer: the string is only a claim until the backend trades it
 * for a session. That keeps a single build working across workspaces.
 */
export function requestInitData(timeoutMs = 10_000): Promise<string> {
  if (window.parent === window) {
    return Promise.reject(
      new Error("App is running outside ERP — open it from inside the ERP host"),
    );
  }

  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      window.removeEventListener("message", onMessage);
      reject(new Error("Did not receive initData from ERP"));
    }, timeoutMs);

    function onMessage(event: MessageEvent) {
      const data = event.data as { type?: string; initData?: string } | null;
      if (data?.type !== INIT_DATA_MESSAGE || !data.initData) return;

      window.clearTimeout(timer);
      window.removeEventListener("message", onMessage);
      resolve(data.initData);
    }

    window.addEventListener("message", onMessage);
    window.parent.postMessage({ type: REQUEST_MESSAGE }, "*");
  });
}
