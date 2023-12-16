'use client';

import {CupMetal, TimestampedScores} from "@/scores/common";

function formatMetalCount(count: number): string {
  if (count === 0) {
    return '-';
  }
  return count.toString();
}

export interface ScoresTableProps {
  timestampedScores: TimestampedScores;
  isValidating?: boolean;
  refresh?: () => void;
}

export function ScoresTable({
  timestampedScores,
  isValidating,
  refresh,
}: ScoresTableProps) {
  const {
    scores,
    fetchedAt,
  } = timestampedScores;
  return (
    <table className="table-auto text-center mx-auto">
      <thead>
      <tr className="border-b-red-600 border-b-2 border-solid">
        <th className="px-8 py-8 font-bold text-4xl uppercase">Racer</th>
        <th className="px-8 py-8 font-bold text-4xl uppercase text-gold">Gold</th>
        <th className="px-8 py-8 font-bold text-4xl uppercase text-silver">Silver</th>
        <th className="px-8 py-8 font-bold text-4xl uppercase text-bronze">Bronze</th>
        <th className="px-8 py-8 font-bold text-4xl uppercase">Pts</th>
      </tr>
      </thead>
      <tbody>
      {scores.map((score) => (
        <tr key={score.playerName} className="border-b-red-600 border-b-2 border-solid">
          <td className="px-4 py-8 text-4xl uppercase">{score.playerName}</td>
          <td className="px-4 py-8 text-4xl uppercase text-gold">{formatMetalCount(score.metalCounts[CupMetal.Gold])}</td>
          <td className="px-4 py-8 text-4xl uppercase text-silver">{formatMetalCount(score.metalCounts[CupMetal.Silver])}</td>
          <td className="px-4 py-8 text-4xl uppercase text-bronze">{formatMetalCount(score.metalCounts[CupMetal.Bronze])}</td>
          <td className="px-4 py-8 text-4xl uppercase">{score.points}</td>
        </tr>
      ))}
      </tbody>
      <tfoot>
      <tr className="border-b-red-600 border-b-2 border-solid">
        <td className="px-2 py-2 text-md uppercase" colSpan={5}>
          {`Loaded at ${new Date(fetchedAt).toLocaleTimeString()} (local)`}
          {isValidating && ' • (refreshing...)'}
          {(!isValidating && !!refresh) && <>{' • '} <button className="border border-solid border-black px-4" type="button" onClick={() => { refresh(); }}>Reload</button></>}
        </td>
      </tr>
      </tfoot>
    </table>
  );
}