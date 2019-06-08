import uniq from 'lodash/uniq';
import { sortArtistsByWordCount } from './sortArtistsByWordCount';
function assignWordCountToArtist(artistsTable) {
  artistsTable.map(artist => {
    const tokens = artist.artistLyrics.split(/\W+/);
    const lowercased = tokens.map(token => token.toLowerCase());
    const uniqueWords = uniq(lowercased);
    const uniqueWordLength = uniqueWords.length;
    artist.uniqueWordCount = uniqueWordLength;
  })
  return sortArtistsByWordCount(artistsTable);
  
}

export function assignLyricTextToArtist(artistLyrics, ARTISTS_TABLE) {
  artistLyrics.map(node => {
    const found = ARTISTS_TABLE.some(el => el.artistName === node.artistName);
    if (!found) {
      let obj = {
        artistName: node.artistName,
        lyricSectionLength: 1,
        artistLyrics: node.artistLyrics.replace(/\n/g, ' '),
      };

      ARTISTS_TABLE.push(obj);
    } else {
      ARTISTS_TABLE.map((el) => {
        if (el.artistName === node.artistName) {
          el.lyricSectionLength++;
          el.artistLyrics += node.artistLyrics.replace(/\n/g, ' ');
        }
      });
    }
  })
  return assignWordCountToArtist(ARTISTS_TABLE);
}

