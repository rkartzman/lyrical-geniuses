const songs = require('./songs.json');


const ARTISTS_TABLE = [];

function compare(a, b) {
  // if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
  //   // property doesn't exist on either object
  //   return 0;
  // }
  const propA = a.lyricSectionLength;
  const propB = b.lyricSectionLength;

  let comparison = 0;
  if (propA > propB) {
    comparison = -1;
  } else if (propA < propB) {
    comparison = 1;
  }
  return comparison;
}

function returnTopFiveArtists(sortedArray) {
  const topFive = sortedArray.slice(0, 5);
  // console.log(topFive);
  return sortedArray.slice(0, 5);
}

function sortArtistsBySectionTotals(artistsTable) {
  // we need to sort our lyricSections by length 
  const sorted = [...artistsTable].sort(compare);
  
  console.log({sorted});
  // we then need to return the top 5 artists by length;
  // returnTopFiveArtists(sorted);
}

exports.sortArtistsBySectionTotals = sortArtistsBySectionTotals;

function sortArtistsByLyricalUniqueness(artistsTable) {
  // we need to go through our artists table and sort by unique word count 
}

exports.sortArtistsByLyricalUniqueness = sortArtistsByLyricalUniqueness;

/* Part I: Process songs using the primary_artist for lyric section attribution */

function processSongs(songs) {
  // when building our data store we need to make sure not to create a duplicate entry for the artist
  // first we check if table['primary_artist'] exists 
  // if it does 
  //   we increment that lyricSectionLength value by our lyricText length 
  // if it doesn't 
  //   we create a new entry 
  songs.map(song => {
    const lyricText = song.lyrics_text.split('\n\n');
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
  });


  sortArtistsBySectionTotals(ARTISTS_TABLE);
}
exports.processSongs = processSongs;




// processSongs(songs);


/* Part II: Use the section headers of each lyric section to create the lyric section attribution */

function assignLyricSectionToArtist(artistAttributions) {
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
  // console.log(ARTISTS_TABLE);
  sortArtistsBySectionTotals(ARTISTS_TABLE);
}

function assignLyricTextToArtist(artistLyrics) {
  artistLyrics.map(node => {
    const found = ARTISTS_TABLE.some(el => el.artistName === node.artistName);
    if(!found) {
      let obj = {
        artistName: node.artistName,
        lyricSectionLength: 1,
        artistLyrics: node.artistLyrics.replace(/\n/g, ''),
      };

      ARTISTS_TABLE.push(obj);
    } else {
      ARTISTS_TABLE.map((el) => {
        if (el.artistName === node.artistName) {
          el.lyricSectionLength++;
          el.artistLyrics += node.artistLyrics.replace(/\n/g, '');
        }
      });
    }
  })
  assignWordCountToArtist(ARTISTS_TABLE);
}

function assignWordCountToArtist(artistsTable) {
  console.log('in here');
  artistsTable.map(artist => {
    // console.log(artist.artistLyrics);
    // return artist.artistLyrics.replace(/\n/g, '');
  })
  console.log(artistsTable);
}

function processSongsUsingSectionHeadings(songs) {
  // when building our data store we need to make sure not to create a duplicate entry for the artist
  // first we check if table['primary_artist'] exists 
  // if it does 
  //   we increment that lyricSectionLength value by our lyricText length 
  // if it doesn't 
  //   we create a new entry 
  const artistAttributions = [];
  songs.map(song => {
    // go through the lyrics_text and break out into lyric sections 
    const lyricText = song.lyrics_text.split('\n\n');
    // go through each item in the array of lyric sections and sanitize the data for more artist attributions 
    lyricText.map(section => {
      // now we are at the lyric section level for each song
      // we want to properly attribute a section to the artist or artists who sing it
      // we need to sanitize the string and return an array of artist(s)

      const sectionAttribution = section.match(/\[(.*?)\]/g);
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
        // TODO: super ugly ^ go back and fix this 

        headersStripped.map(artist => artistAttributions.push(artist.trim()));


      }
      
      
    });
  });
  // console.log(artistAttributions);

  assignLyricSectionToArtist(artistAttributions);
  
}
exports.processSongsUsingSectionHeadings = processSongsUsingSectionHeadings;

// processSongsUsingSectionHeadings(songs);



/* Part III: Find the artists who use the most unique words in their songs. Use the same criteria for lyric section attribution as in part II */

function processMostUniqueWords(songs) {
  // we will need to process lyric sections in the same way as part II 
  // next we will need to process lyric sections for unique words 
  // we will need two additional fields in our store for this section: 
  // we will need to store the lyric sections
  // we will also need to store the unique words count 
  const artistAttributions = [];
  const artistLyrics = [];
  songs.map(song => {
    // go through the lyrics_text and break out into lyric sections 
    const lyricText = song.lyrics_text.split('\n\n');
    // go through each item in the array of lyric sections and sanitize the data for more artist attributions 
    lyricText.map(section => {
      // now we are at the lyric section level for each song
      // we want to properly attribute a section to the artist or artists who sing it
      // we need to sanitize the string and return an array of artist(s)
      const regex = /\[(.*?)\]/g;
      const sectionAttribution = section.match(/\[(.*?)\]/g);
      const sectionLyricsSeparated = section.replace(regex, '');
      // console.log({sectionLyricsSeparated});
      // console.log({sectionAttribution});
      
      const attributionsHeadersSeparated = sectionAttribution[0].split(':');
      if (attributionsHeadersSeparated.length == 1) {
      // if length equals 1 it means there is no additional attribution on this section and we can attribute it to the primary_artist 
        artistAttributions.push(song.primary_artist);
        artistLyrics.push({
          artistName: song.primary_artist,
          artistLyrics: sectionLyricsSeparated
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
            artistLyrics: sectionLyricsSeparated
          }
          artistLyrics.push(obj);
 
        });


      }


    });
  });
  // console.log(artistAttributions);
  console.log(artistLyrics);

  // assignLyricSectionToArtist(artistAttributions);
  // assignLyricTextToArtist(artistLyrics);

}

exports.processMostUniqueWords = processMostUniqueWords;

processMostUniqueWords(songs);