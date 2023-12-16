'use client';

import { ScoresTable } from "@/components/ScoresTable";
import {TimestampedScores} from "@/scores/common";
import {useTimestampedScores} from "@/components/useTimestampedScores";
import {Loading} from "@/components/Loading";

export interface ScoresPageProps {
  initialTimestampedScores?: TimestampedScores;
}

export function ScoresPage({
  initialTimestampedScores,
}: ScoresPageProps) {
  const {
    data,
    isLoading,
    isValidating,
    error,
    mutate,
  } = useTimestampedScores({
    initialTimestampedScores,
  });

  if (data) {
    return <ScoresTable isValidating={isValidating} timestampedScores={data} refresh={() => { mutate(); }} />;
  }
  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <div>Error: {error.name}: {error.message}</div>;
  }
  return null;
}