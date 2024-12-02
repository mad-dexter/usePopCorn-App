import { useState, useEffect } from "react";

export function useLocalStorageState(initialValue, key) {
  const [value, setValue] = useState(function () {
    const storedVal = localStorage.getItem(key);
    if (!storedVal) {
      return initialValue;
    }
    return JSON.parse(storedVal);
  });

  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );

  return [value, setValue];
}
