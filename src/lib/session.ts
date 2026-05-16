// Anonymous browser session id, persisted in localStorage. Used to scope cart rows.
const KEY = "aetheria_session_id";

export function getSessionId(): string {
  if (typeof window === "undefined") return "ssr-no-session";
  let id = window.localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(KEY, id);
  }
  return id;
}
