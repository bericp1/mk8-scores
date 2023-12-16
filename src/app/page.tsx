import {GoogleSpreadsheet, GoogleSpreadsheetCell} from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import orderBy from 'lodash.orderby';

function getSheet(): GoogleSpreadsheet {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
    throw new Error('Missing GOOGLE_SERVICE_ACCOUNT_EMAIL environment variable.');
  }
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY) {
    throw new Error('Missing GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY environment variable.');
  }
  if (!process.env.GOOGLE_SHEET_ID) {
    throw new Error('Missing GOOGLE_SHEET_ID environment variable.');
  }
  const serviceAccountAuth = new JWT({
    key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
    ],
  });
  return new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
}

enum CupMetal {
  Gold = 'Gold',
  Silver = 'Silver',
  Bronze = 'Bronze',
  None = 'None',
}

const WHITE = { red: 1, green: 1, blue: 1 };
const GOLD = { red: 0.9843, green: 0.7373, blue: 0.0157 };
const SILVER = { red: 0.8509, green: 0.8509, blue: 0.8509 };
const BRONZE = { red: 0.7059, green: 0.3725, blue: 0.0235 };

function calculateColorDistance(color1: { red: number, green: number, blue: number }, color2: { red: number, green: number, blue: number }): number {
  const redDelta = color1.red - color2.red;
  const greenDelta = color1.green - color2.green;
  const blueDelta = color1.blue - color2.blue;
  return Math.sqrt(redDelta * redDelta + greenDelta * greenDelta + blueDelta * blueDelta);
}

function determineCupMetal(cupCell: GoogleSpreadsheetCell): CupMetal {
  const backgroundColor = cupCell.backgroundColor || { red: 255, green: 255, blue: 255 };

  const distances = {
    [CupMetal.Gold]: calculateColorDistance(backgroundColor, GOLD),
    [CupMetal.Silver]: calculateColorDistance(backgroundColor, SILVER),
    [CupMetal.Bronze]: calculateColorDistance(backgroundColor, BRONZE),
    [CupMetal.None]: calculateColorDistance(backgroundColor, WHITE),
  };

  return Object.entries(distances).reduce((acc, [key, distance]): CupMetal => {
    if (distance < distances[acc]) {
      return key as CupMetal;
    }
    return acc;
  }, CupMetal.None as CupMetal);
}

function determineCupMetalCounts(cupCells: GoogleSpreadsheetCell[]): { [key in CupMetal]: number } {
  return cupCells.reduce((acc, cupCell) => {
    const cupMetal = determineCupMetal(cupCell);
    return {
      ...acc,
      [cupMetal]: acc[cupMetal] + 1,
    };
  }, {
    [CupMetal.Gold]: 0,
    [CupMetal.Silver]: 0,
    [CupMetal.Bronze]: 0,
    [CupMetal.None]: 0,
  });
}

interface Score {
  playerName: string;
  points: number;
  metalCounts: { [key in CupMetal]: number };
}

async function loadScores(): Promise<Score[]> {
  const spreadsheet = getSheet();
  await spreadsheet.loadInfo();
  const latestScoresSheet = spreadsheet.sheetsByTitle['Latest Scores'];
  if (!latestScoresSheet) {
    throw new Error('Missing "Latest Scores" sheet.');
  }
  const rows = await latestScoresSheet.getRows();
  const { rowCount, columnCount } = latestScoresSheet;
  console.log(`Loaded ${rowCount} rows and ${columnCount} columns.`);
  await latestScoresSheet.loadCells();
  const cupCellIndexes = latestScoresSheet.headerValues.map((key, idx) => (key !== 'Player' && key !== 'Total') ? idx : null).filter((idx): idx is number => idx !== null);
  const scores = rows.map((row): Score => {
    const cupCells = cupCellIndexes.map((idx) => latestScoresSheet.getCell(row.rowNumber - 1, idx));
    const metalCounts = determineCupMetalCounts(cupCells);
    return ({
      playerName: row.get('Player'),
      points: parseInt(row.get('Total'), 10),
      metalCounts,
    } as Score);
  });
  return orderBy(scores, ['points', 'metalCounts.Gold', 'metalCounts.Silver', 'metalCounts.Bronze'], ['desc', 'desc', 'desc', 'desc']);
}

function formatMetalCount(count: number): string {
  if (count === 0) {
    return '-';
  }
  return count.toString();
}

export default async function Home() {
  const scores = await loadScores();
  return (
    <main className="container mx-auto p-4 text-center">
      <table className="table-auto">
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
    </main>
  )
}
