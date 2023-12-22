import useSWR from "swr";
import {TimestampedScores} from "@/scores/common";

export function useTimestampedScores({
  initialTimestampedScores,
}: {
  initialTimestampedScores?: TimestampedScores;
} = {}) {
  return useSWR<TimestampedScores>('/api/scores', {
    refreshInterval: 60000,
    fetcher: () => fetch('/api/scores')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }
        return res;
      })
      .then((res) => res.json()),
    fallbackData: initialTimestampedScores,
  });
}