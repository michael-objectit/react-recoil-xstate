import { useCallback, useState } from "react";

export default function useLocalStorage(key: string, defaultValue: any = {}) {
  const [store, setStore] = useState(() => initLocalStorage());

  function initLocalStorage() {
    const data = localStorage.getItem(key);
    if (data) {
      return ["undefined", "null"].includes(data) ? null : JSON.parse(data);
    }

    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }

  const updateLocalStorage = useCallback(
    (data: any) => {
      localStorage.setItem(key, JSON.stringify(data));
      setStore(data);
    },
    [key]
  );

  const resetLocalStorage = useCallback(
    (data: any) => {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      setStore(defaultValue);
    },
    [defaultValue, key]
  );

  return [store, updateLocalStorage, resetLocalStorage];
}
