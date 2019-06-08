## Getting Started
### Versions
- node: v10.12.0
- npm: v6.4.1
- nvm: v0.33.6

### Installation
`npm install`

### Run
`npm run dev`: Runs the server with verbose logging. Useful for development.

`npm run start`: Runs the server.

`npm run build`: Creates optimized code for production.

Open your browser at localhost:3000

### Overview 

The entrypoint for the Front End is index.js. It's a simple React component that renders the output of the song data. 

The main entrypoint for the song analysis is songProcessor.js. All of the modules used to analyze the data are contained within the `utils/` folder. 

All of the songs data is in songs.json. I altered the structure of the json to be easier to work with. I use comma delimiting so that you can paste the json in an online json editor for easier viewing , as well as easy code manipulation 

Scaling:  

I made a few choices about the architecture for this project that I knew would not scale well but I thought would make the presentation of this tool better. This is a trade off I chose for this purpose of this exercise. Mainly, when reading through the exercise, this final section asked how one might build a tool or dashboard that would be viewable by others so that they could see the various methods for ranking artists. I made this a priority, and in the interest of time chose to handle most of this on the client side without persisting state. E.g my app is a small React frontend with a few utility modules that process json data and return smaller chunks of json and serves them to the client. I've been using Next.js, a react library, for rapid development and prototyping and I think the future of this application could be built using the same tools with a slightly different, more robust architecture. 

First of all, in reality, there would be a persisting database where all the song data should live. I imagine Genius has either a noSql or sql database where all the artists data lives.  I think this database could probably be well suited for noSql since it can be slightly better performance for reading values, and there is little writing to the database that needs to happen for this application. It could be structured similar to the final json structure I used for Part III of exercise: 
-id
-artistName 
-artistLyrics
-artistLyricSectionCount
-artistWordUniquenessCount 

Then, the system could be improved to include a layer of middleware that acts as an api layer between our database and our front end application. We could use the api for two things: 
-querying our database 
-processing our song data

Even at 2000 songs, the manipulation of all this data on the frontend is decidedly slow already. Moving all of these processes and calculations server side would improve performance dramatically. then we could add a layer to our client application that manages state globally, instead of storing all state locally the way I'm doing it currently. 

A few challenges I foresee at scale : 

-String manipulation
-String Storage
-Natural Language Processing

There's a lot of string manipulation happening throughout even this narrow analysis. The fact that most of Geniuses data is uploaded by the community and mostly unstructured there is a wide arrange of variability in the streams of text. 

Therefore most of the string manipulation, to me seems unreliable and would require a much larger spectrum of manipulation of those strings and a more foolproof system for handling them. I addressed what seems like a very small subset of edge cases in the data and feel like the system would need to be much larger and much more abstracted to be dynamic in the way we would like. 

Secondly, In order for us to analyze lyrics, at some point we need to be storing huge blobs of text, somewhere. This can easily become massive in size so there would need to be a clever system for selectively storing strings in the database, and do as much as possible to trim whitespaces and unecessary characters. 

Finally, there seems to be a real opportunity for some sort of language processing that could be useful in analyzing lyrics. I was exposed to a small sample of the many scenarios where synonyms can expose gaps in a veritable analysis of both the song attributions and the lyrics themselves. Rap especially is heavy in slang and colloquialisms, as well as contractions. How do we measure synonyms of all these pieces of text ? Where do we draw the line in terms of a word being deemed a duplicate or it being deemed something like a neologism ? For example, to create continuity in a rhyme scheme, an artist might use a common word, but add a -y to the end. This is perhaps a bad example but I wouldn't want to diminish the creativity of an artists writing because 90% of the word is the same. It would be a sin in my opinion to reduce all of Kid Cudi's hums to one word, or no words, because there is so much meaning contained in those sounds. I think it's Genius's unique position to highlight the 'genius' of these artists who are often under appreciatied for their creativity. And creating a system for how we recognize and convey this is crucial to that. 
