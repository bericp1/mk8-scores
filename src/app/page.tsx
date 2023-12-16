import {loadScores} from "@/scores/fetch";
import {ScoresPage} from "@/components/ScoresPage";

export default async function Home() {
  const initialTimestampedScores = await loadScores();
  return (
    <ScoresPage initialTimestampedScores={initialTimestampedScores} />
  )
}
