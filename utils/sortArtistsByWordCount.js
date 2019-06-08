import { compareValues } from './compare';
import { returnTopFiveArtists } from './topFiveArtists';
export function sortArtistsByWordCount(artistsTable) {
  // we need to sort our lyricSections by length 
  // console.log(artistsTable);
  const sorted = [...artistsTable].sort(compareValues('uniqueWordCount', 'desc'));

  // we then need to return the top 5 artists by length;
  return returnTopFiveArtists(sorted);
}