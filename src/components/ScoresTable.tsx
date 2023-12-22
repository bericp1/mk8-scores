'use client';

import {CupMetal, TimestampedScores} from "@/scores/common";
import {Timestamp} from "@/components/Timestamp";

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
        <th className="px-8 py-8 font-bold text-4xl uppercase">Cup Pts</th>
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
          <td className="px-4 py-8 text-4xl uppercase">{score.metalPoints}</td>
          <td className="px-4 py-8 text-4xl uppercase">{score.points}</td>
        </tr>
      ))}
      </tbody>
      <tfoot>
      <tr className="border-b-red-600 border-b-2 border-solid">
        <td className="px-2 py-2 text-md uppercase" colSpan={6}>
          <span className="leading-8">
            {'Loaded at '}
            <Timestamp value={fetchedAt} ssrValue="..." />
            {' (local)'}
          </span>
          {!!refresh && <>{' • '} <button className="uppercase text-sm leading-6 border border-solid border-black w-[100px]" type="button" onClick={() => { refresh(); }}>{isValidating ? 'Loading...' : 'Reload'}</button></>}
        </td>
      </tr>
      </tfoot>
    </table>
  );
}