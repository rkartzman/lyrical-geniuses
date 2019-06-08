import { compareValues } from './compare';
import { returnTopFiveArtists } from './topFiveArtists';
export function sortArtistsBySectionTotals(artistsTable) {
  // we need to sort our lyricSections by length 
  const sorted = [...artistsTable].sort(compareValues('lyricSectionLength', 'desc'));

  // console.log({ sorted });
  // we then need to return the top 5 artists by length;
  return returnTopFiveArtists(sorted);
}