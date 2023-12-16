import {loadScores} from "@/scores/fetch";
import {ScoresPage} from "@/components/ScoresPage";

export default async function Home() {
  const initialTimestampedScores = await loadScores();
  return (
    <main className="container mx-auto p-4">
      <ScoresPage initialTimestampedScores={initialTimestampedScores} />
    </main>
  )
}
