'use client';

import {useEffect, useRef} from "react";

export function useInterval(callback: () => void, delay: number) {
  const savedCallback = useRef<(() => void)|null>();
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    function func() {
      savedCallback.current?.();
    }
    if (delay !== null) {
      let id = setInterval(func, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}