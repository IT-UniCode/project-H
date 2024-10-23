export function setLocalStorage(key: string, value: any) {
  const newValue = JSON.stringify(value);
  localStorage.setItem(key, newValue);
  window.dispatchEvent(new StorageEvent("storage", { key, newValue }));
}

export function getLocalStorage<T>(key: string): T | null {
  return JSON.parse(localStorage.getItem(key) || "null");
}
