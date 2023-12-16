'use client';

import {useCallback} from "react";
import {useRouter} from "next/navigation";
import {useInterval} from "./useInterval";
import {useHasFocus} from "@/common/useHasFocus";

export function useAutoRefresh({ delay }: { delay: number }) {
  const focused = useHasFocus();
  const router = useRouter();
  const callback = useCallback(() => {
    if (focused) {
      router.refresh();
    }
  }, [router, focused]);
  useInterval(callback, delay);
}