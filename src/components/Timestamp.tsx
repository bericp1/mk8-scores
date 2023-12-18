import type {ReactNode} from "react";

export interface TimestampProps {
  value: number | Date;
  ssrValue?: ReactNode;
}

export function Timestamp({
  value: rawValue,
  ssrValue = null,
}: TimestampProps) {
  if (typeof window === 'undefined') {
    return ssrValue;
  }
  const date = typeof rawValue === 'number' ? new Date(rawValue) : rawValue;
  return date.toLocaleDateString();
}