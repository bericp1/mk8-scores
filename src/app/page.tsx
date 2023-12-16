import {loadScores} from "@/scores/fetch";
import {CupMetal} from "@/scores/common";
import {AutoRefresh} from "@/common/AutoRefresh";

function formatMetalCount(count: number): string {
  if (count === 0) {
    return '-';
  }
  return count.toString();
}

export default async function Home() {
  const scores = await loadScores();
  return (
    <main className="container mx-auto p-4">
      <AutoRefresh delay={10_000} />
      <table className="table-auto text-center">
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
      </table>
      <div className="py-4">{`Last updated: ${new Date().toLocaleTimeString()} (local)`}</div>
    </main>
  )
}
