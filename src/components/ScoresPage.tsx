'use client';

import { ScoresTable } from "@/components/ScoresTable";
import {useTimestampedScores} from "@/components/useTimestampedScores";
import {Loading} from "@/components/Loading";

export function ScoresPage() {
  const {
    data,
    isLoading,
    isValidating,
    error,
    mutate,
  } = useTimestampedScores();

  if (data) {
    return <ScoresTable isValidating={isValidating} timestampedScores={data} refresh={() => { mutate(); }} />;
  }
  if (isLoading) {
    return <main className="mx-auto container"><Loading /></main>;
  }
  if (error) {
    return <div>Error: {error.name}: {error.message}</div>;
  }
  return null;
}