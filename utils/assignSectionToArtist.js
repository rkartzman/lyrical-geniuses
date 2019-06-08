import { sortArtistsBySectionTotals } from './sortArtistsBySectionTotals';
export function assignLyricSectionToArtist(artistAttributions, ARTISTS_TABLE) {
  artistAttributions.map(artist => {
    const found = ARTISTS_TABLE.some(el => el.artistName === artist);
    if (!found) {
      // create a new entry for this artist
      let obj = {
        artistName: artist,
        lyricSectionLength: 1,
      };

      ARTISTS_TABLE.push(obj);
    } else {
      ARTISTS_TABLE.map((el) => {
        if (el.artistName === artist) {
          el.lyricSectionLength++;
        }
      });
    }
  })
  return sortArtistsBySectionTotals(ARTISTS_TABLE);
}