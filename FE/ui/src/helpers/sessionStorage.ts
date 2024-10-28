export function setSessionStorage(key: string, value: any) {
  const newValue = JSON.stringify(value);
  sessionStorage.setItem(key, newValue);
  window.dispatchEvent(new StorageEvent("storage", { key, newValue }));
}

export function getSessionStorage<T>(key: string): T | null {
  return JSON.parse(sessionStorage.getItem(key) || "null");
}
