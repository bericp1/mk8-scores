'use client';

import {useAutoRefresh} from "@/common/useAutoRefresh";

export function AutoRefresh({ delay }: { delay: number }) {
  useAutoRefresh({ delay });
  return null;
}