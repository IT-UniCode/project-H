export function useSessionStorage(key: string) {
  function get<T>(): T | null {
    return JSON.parse(sessionStorage.getItem(key) || "null");
  }

  function set(value: any) {
    const newValue = JSON.stringify(value);
    sessionStorage.setItem(key, newValue);
    window.dispatchEvent(new StorageEvent("storage", { key, newValue }));
  }

  function remove() {
    sessionStorage.removeItem(key);
    window.dispatchEvent(new StorageEvent("storage", { key }));
  }

  return { set, get, remove };
}
