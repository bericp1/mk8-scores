import 'server-only';
import orderBy from "lodash.orderby";
import {GoogleSpreadsheet, GoogleSpreadsheetCell} from "google-spreadsheet";
import {JWT} from "google-auth-library";
import {BRONZE, CupMetal, GOLD, POINTS_BY_METAL, Score, SILVER, TimestampedScores, WHITE} from "@/scores/common";

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

function calculateColorDistance(color1: { red: number, green: number, blue: number }, color2: {
  red: number,
  green: number,
  blue: number
}): number {
  const redDelta = color1.red - color2.red;
  const greenDelta = color1.green - color2.green;
  const blueDelta = color1.blue - color2.blue;
  return Math.sqrt(redDelta * redDelta + greenDelta * greenDelta + blueDelta * blueDelta);
}

function determineCupMetal(cupCell: GoogleSpreadsheetCell): CupMetal {
  const backgroundColor = cupCell.backgroundColor || {red: 255, green: 255, blue: 255};

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

export async function loadScores(): Promise<TimestampedScores> {
  const spreadsheet = getSheet();
  await spreadsheet.loadInfo();
  const latestScoresSheet = spreadsheet.sheetsByTitle['Latest Scores'];
  if (!latestScoresSheet) {
    throw new Error('Missing "Latest Scores" sheet.');
  }
  const rows = await latestScoresSheet.getRows();
  const {rowCount, columnCount} = latestScoresSheet;
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
      metalPoints: Object.entries(POINTS_BY_METAL).reduce((acc, [key, points]) => acc + points * metalCounts[key as CupMetal], 0)
    });
  });
  const orderedScores = orderBy(scores, ['points', 'metalCounts.Gold', 'metalCounts.Silver', 'metalCounts.Bronze'], ['desc', 'desc', 'desc', 'desc']);

  return {
    scores: orderedScores,
    fetchedAt: Date.now(),
  };
}