const STORE_SCROLL_KEY = "tv-house-return-scroll";
const STORE_SCROLL_PENDING_KEY = "tv-house-return-scroll-pending";

type StoreScrollPosition = {
  path: string;
  x: number;
  y: number;
};

export function rememberStoreScroll(path: string) {
  const position: StoreScrollPosition = { path, x: window.scrollX, y: window.scrollY };
  sessionStorage.setItem(STORE_SCROLL_KEY, JSON.stringify(position));
}

export function markStoreScrollRestore() {
  sessionStorage.setItem(STORE_SCROLL_PENDING_KEY, "true");
}

export function getStoreReturnPath() {
  try {
    const position = JSON.parse(sessionStorage.getItem(STORE_SCROLL_KEY) ?? "null") as StoreScrollPosition | null;
    return position?.path ?? null;
  } catch {
    return null;
  }
}

export function restoreStoreScroll(path: string) {
  if (sessionStorage.getItem(STORE_SCROLL_PENDING_KEY) !== "true") return;

  try {
    const position = JSON.parse(sessionStorage.getItem(STORE_SCROLL_KEY) ?? "null") as StoreScrollPosition | null;
    if (!position || position.path !== path) return;

    sessionStorage.removeItem(STORE_SCROLL_PENDING_KEY);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      window.scrollTo({ left: position.x, top: position.y, behavior: "auto" });
    }));
  } catch {
    sessionStorage.removeItem(STORE_SCROLL_PENDING_KEY);
  }
}
