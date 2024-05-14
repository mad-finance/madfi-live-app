// @see: https://github.com/uidotdev/usehooks/blob/main/index.js#L616C22-L616C22
import { useCallback, useEffect, useSyncExternalStore } from "react";

function dispatchStorageEvent(key: any, newValue: string) {
  window.dispatchEvent(new StorageEvent("storage", { key, newValue }));
}

const setLocalStorageItem = (key: string, value) => {
  const stringifiedValue = JSON.stringify(value);
  window.localStorage.setItem(key, stringifiedValue);
  dispatchStorageEvent(key, stringifiedValue);
};

const removeLocalStorageItem = (key: string) => {
  window.localStorage.removeItem(key);
  dispatchStorageEvent(key, null);
};

const getLocalStorageItem = (key: string) => {
  return window.localStorage.getItem(key);
};

const useLocalStorageSubscribe = (callback: {
  (this: Window, ev: StorageEvent): any;
  (this: Window, ev: StorageEvent): any;
}) => {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
};

const getLocalStorageServerSnapshot = () => {
  throw Error("useLocalStorage is a client-only hook");
};

export function useLocalStorage<T>(key: string, initialValue?: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const getSnapshot = () => getLocalStorageItem(key);

  const store = useSyncExternalStore(useLocalStorageSubscribe, getSnapshot, getLocalStorageServerSnapshot);

  const setState = useCallback(
    (v: (arg0: any) => any) => {
      try {
        const nextState = typeof v === "function" ? v(JSON.parse(store)) : v;

        if (nextState === undefined || nextState === null) {
          removeLocalStorageItem(key);
        } else {
          setLocalStorageItem(key, nextState);
        }
      } catch (e) {
        console.warn(e);
      }
    },
    [key, store]
  );

  useEffect(() => {
    if (getLocalStorageItem(key) === null && typeof initialValue !== "undefined") {
      setLocalStorageItem(key, initialValue);
    }
  }, [key, initialValue]);

  return [store ? JSON.parse(store) : initialValue, setState];
}
