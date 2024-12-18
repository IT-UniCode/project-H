export function useLocalStorage(key: string) {
  function get<T>(): T | null {
    return JSON.parse(localStorage.getItem(key) || "null");
  }

  function set(value: any) {
    const newValue = JSON.stringify(value);
    localStorage.setItem(key, newValue);
    window.dispatchEvent(new StorageEvent("storage", { key, newValue }));
  }

  function remove() {
    localStorage.removeItem(key);
    window.dispatchEvent(new StorageEvent("storage", { key }));
  }

  return { set, get, remove };
}
