import {loadScores} from "@/scores/fetch";

export const dynamic = 'force-dynamic';

export async function GET() {
  const timestampedScores = await loadScores();
  return Response.json(timestampedScores);
}