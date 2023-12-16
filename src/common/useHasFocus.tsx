'use client';

import { useState, useEffect } from "react";

export const useHasFocus = () => {
  // get the initial state
  const [focus, setFocus] = useState(document.hasFocus?.() || false);

  useEffect(() => {
    const onFocus = () => setFocus(true);
    const onBlur = () => setFocus(false);

    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);

    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  // return the status
  return focus;
};