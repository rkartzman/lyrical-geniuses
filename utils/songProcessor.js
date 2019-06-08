const ARTISTS_TABLE = [];
const ARTISTS_TABLE_FINAL = [];
import { sortArtistsBySectionTotals } from './sortArtistsBySectionTotals';
import { assignLyricSectionToArtist } from './assignSectionToArtist';
import { assignLyricTextToArtist } from './assignLyricTextToArtist';

function processUsingPrimaryArtist(song, lyricText) {
  const found = ARTISTS_TABLE.some(el => el.artistName === song.primary_artist);
  if (!found) {
    // create a new entry for this artist
    let obj = {
      artistName: song.primary_artist,
      lyricSections: [],
      lyricSectionLength: null,
    };
    // go through the lyrics_text and break out into lyric sections 
    obj.lyricSectionLength = lyricText.length;
    lyricText.map(lyricSection => {
      obj.lyricSections.push(lyricSection);
    });
    ARTISTS_TABLE.push(obj);
  } else {
    // primary_artist already exists in db 
    // find artist in db
    // increment the lyricSectionLength value by our lyricText length
    ARTISTS_TABLE.map((el) => {
      if (el.artistName === song.primary_artist) {
        el.lyricSectionLength += lyricText.length;
      }
    });

  }
  return ARTISTS_TABLE;
}
function processUsingSectionHeaders(lyricText, song, artistAttributions) {
  // const found = ARTISTS_TABLE.some(el => el.artistName === song.primary_artist);
  lyricText.map(section => {


    const sectionAttribution = section.match(/\[(.*?)\]/g);
    // console.log(sectionAttribution);
    if (sectionAttribution != undefined) {
      const songPartSeparated = sectionAttribution[0].split(':');
      if (songPartSeparated.length == 1) {
        // if length equals 1 it means there is no additional attribution on this section and we can attribute it to the primary_artist 
        artistAttributions.push(song.primary_artist);
      } else {
        // else continue to find artists in headers 
        const artistStr = songPartSeparated[1].replace(/]/i, '');
        const artistStr2 = artistStr.replace(/Both/i, '');
        // noticed there were occurrences of the word Both throughout some of the data 
  
        const headersStripped = artistStr2
          .split(',').join('').split('+').join('').split('&')
  
        headersStripped.map(artist => artistAttributions.push(artist.trim()));
  
  
      }
    }


  });
  return artistAttributions;

}

/* Part III: Find the artists who use the most unique words in their songs. Use the same criteria for lyric section attribution as in part II */
function processUsingLyricalUniqueness(lyricText, song, artistLyricsArray, artistAttributions) {
  lyricText.map(section => {
    // now we are at the lyric section level for each song
    // we want to properly attribute a section to the artist or artists who sing it
    // we need to sanitize the string and return an array of artist(s)
    const regex = /\[(.*?)\]/g;
    const sectionAttribution = section.match(/\[(.*?)\]/g);
    const sectionLyricsSeparated = section.replace(regex, '');
    // console.log({sectionLyricsSeparated});
    // console.log({sectionAttribution});
    if (sectionAttribution != undefined ) {
      const attributionsHeadersSeparated = sectionAttribution[0].split(':');
      if (attributionsHeadersSeparated.length == 1) {
        // if length equals 1 it means there is no additional attribution on this section and we can attribute it to the primary_artist 
        artistAttributions.push(song.primary_artist);
        artistLyricsArray.push({
          artistName: song.primary_artist,
          artistLyrics: sectionLyricsSeparated,
        });
  
  
      } else {
        // else continue to find artists in headers 
        const artistStr = attributionsHeadersSeparated[1].replace(/]/i, '');
        const artistStr2 = artistStr.replace(/Both/i, '');
        // noticed there were occurrences of the word Both throughout some of the data 
  
        const headersStripped = artistStr2
          .split(',').join('').split('+').join('').split('&')
        // TODO: super ugly ^ go back and fix this 
        headersStripped.map(artist => {
          artistAttributions.push(artist.trim())
          const trimmedName = artist.trim();
          let obj = {
            artistName: trimmedName,
            artistLyrics: sectionLyricsSeparated,
          }
          artistLyricsArray.push(obj);
  
        });
  
  
      }
    }


  });
  return artistLyricsArray;
}

export function processSongs(songs, type) {
  let artistAttributions = [];
  let artistLyricsArray = [];
  songs.map(song => {
    const lyricText = song.lyrics_text.split('\n\n');

    if (type == 'type-1') {
      processUsingPrimaryArtist(song, lyricText)
      return sortArtistsBySectionTotals(ARTISTS_TABLE);
    } else if (type == 'type-2') {
      artistAttributions = processUsingSectionHeaders(lyricText, song, artistAttributions)
    } else if (type == 'type-3') {
      artistLyricsArray = processUsingLyricalUniqueness(lyricText, song, artistLyricsArray, artistAttributions)
    } else {

    }

  });

  if (type == 'type-1') {
    return sortArtistsBySectionTotals(ARTISTS_TABLE);
  } else if (type == 'type-2') {
    return assignLyricSectionToArtist(artistAttributions, ARTISTS_TABLE);
  } else if (type == 'type-3') {
    return assignLyricTextToArtist(artistLyricsArray, ARTISTS_TABLE_FINAL);
  }
  
}
