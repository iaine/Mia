/**
 * Mia is the project name for a language. 
 *
 * @author: Iain Emsley
 */

/**
 *  Empty envelope for temp variable handling
 *  @type {Array}
 */
let envelope = [];

/* Error handling */

/**
 * Error handling for message and possible noise
 * @param message
 */
handleError = (message) => {
    console.error(message);
    playError();
};

/**
 * Function to play pink noise
 */
playError = () => {

};

/* Sources */
/**
 * Source handling
 *
 * @param _type
 * @param location
 * @param pipeline
 */
source = (_type, location, pipeline) => {

    switch (_type) {
        case 'db':
            sourceDb(location, pipeline);
            break;
        case 'json':
            sourceJSON(location.replace('"', ''), pipeline);
            break;
        case 'socket':
            sourceSocket(location, pipeline);
            break;
        case 'sse':
            sourceSSE(location, pipeline);
            break;
        default:
            handleError("Source not known");
            break;
    }
};

/**
 * Function to wrap around JSON
 *
 * @param location
 * @param pipeline
 */
sourceJSON = (location, pipeline) => {

  fetch(location)
      .then(function(response) { return response.json(); })
      .then(function(jsonData) { return pipe(pipeline.pipeline)(jsonData) })
      .then(function(notesData) { playNotes(notesData, pipeline.sound)})
      .catch(error => handleError("Fetching source failed: " + location + error.toString()));
};

sourceDb = () => {};

sourceSocket = () => {};

/**
 * Function to handle Socket Server Events
 * @param location
 * @param pipeline
 */
sourceSSE = (location, pipeline) => {
    if (window.EventSource) {
        let evtSource = new EventSource(location);

        evtSource.onmessage = function(e) {
            pipe(pipeline.pipeline)(e.data);
            playNote(notesData, pipeline.sound);
        };

        evtSource.onerror = function(e) {
            console.error(e);
        };
    } else {
        handleError("Fetching source failed: " + location);
    }
};

/* Functions */

/**
 * Filter for data and map to note
 *
 * @param data
 * @param searchStr
 * @returns {string}
 */
filterStr = (data, searchStr) => {

    //@todo: check if not already parsed.
    // perhaps handle at final bit.
    if (data['content']['description'].indexOf(searchStr) > -1) {
        console.info(searchStr);
        //@todo: refactor me.
        //data.freq = sessionStorage.getItem(searchStr);
        data.freq = 340.35;
    } else {
        data.freq = 230.76;
    }
    return data;
};

filterStrs = (data, searchStr) => {
    data.map(_data => filterStr(_data, searchStr) );
    return data;
};

/**
 *
 */

//Begin the language.

/* Time Intervals */
findInterval = (data, searchKey) => {
    const _search = searchKey.replace("'", '');
    //
    data.idx = data[_search]/100000;
    return data;
};

findIntervals = (data, searchKey) => {
    data.map(_d => findInterval(_d,  searchKey));
    return data;
};

/**
 * Function to create the notes in memory
 *
 * @param noteObj
 */
createNote = (noteObj) => {
    envelope['note'] = noteObj;
};

//set up the locations for each point
//@todo: Move this into a Map() for efficient access?
const geojson = [{"location":"London", "lat": 51.509865, "long":-0.118092},
    {"location":"Amsterdam", "lat": 52.379189,"long": 4.899431},
    {"location":"Roan", "lat": 49.439903,"long": 1.094819},
    {"location":"Rouen", "lat": 49.439903,"long": 1.094819},
    {"location":"Antwerp", "lat": 51.260197,"long":4.402771},
    {"location":"Cambridge", "lat": 52.294491,"long":-0.048706},
    {"location":"Oxford", "lat": 51.752022,"long": -1.257677},
    {"location":"Saint-Omer", "lat": 50.4446,"long": 2.1542},
    {"location":"Emden", "lat":53.3594, "long": 7.206}];

/**
 * Function to map a data point into the geolocation
 * @param data
 */
mapGeoJson = (data) => {

    let mapData = (point) => {
        geojson.forEach(place => {
            if (point["Place"].trim() === place['location']) {
                return {'lat': place['lat'], 'long': place['long']}
            }
        });
    };

    return mapData(data);
};

/**
 * Function to map a series of data points into the geolocation
 * @param data
 */
mapGeoJsons = (data) => {
    data.filter(place => {
        mapGeoJson(place);
    });
    return data;
};



/**
 * Function to get the position from the
 * @param data
 * @param type
 */
mapPosition = (data, type) => {
    if (type ==='cartographic') {

    }
};

/**
 * Function to play
 *
 * @param _note
 * @param noteType
 */
playNote = (_note, noteType) => {

    let n = new Note();
    console.info(mapNote(_note));
    switch (noteType) {
        case 'simple':
        case 'plain':
            n.playSimpleTone(mapNote(_note));
            break;
        case 'envelope':
            n.playEnvelopeTone(mapNote(_note));
            break;
        case 'spatial':
            n.playSpatialTone(mapNote(_note));
            break;
        default:
            break;
    }
};

/**
 * Filter note to the interface
 * @param _n
 * @returns {{freq: (number|*), idx: *}}
 */
mapNote = (_n) => {  return {freq: _n.freq, idx: _n.idx};  };

/**
 * Function to play a series of notes
 *
 * @param pipeline
 * @param noteType
 */
playNotes = (pipeline, noteType) => {
    console.info('note ' + noteType);
    pipeline.forEach( note => {
        playNote(note, noteType);
    });
};

/**
 * Reduce function to act as a pipe.
 *
 * @todo: Can the function read the tree and get any arguments
 * @param functions
 * @returns {function(*=): *}
 */
pipe = (...[functions]) => (value) => {

    return functions.reduce((currentValue, currentFunction) => {

        //check if args in the object and how to apply. Maybe apply()?
        //handle the local scope here somehow.
        return (currentFunction.args) ? self[currentFunction["func"]](currentValue, currentFunction.args) :
                self[currentFunction["func"]](currentValue);
    }, value);
};

//Web Worker thread
onmessage = function(e) {
    console.info(e);
  compile(e.data[0]);
};
/**
 *  Method to split the code and send to evaluation
 */
var compile = function (code) {

    try {
        //var code = _code;

        let tmpcode = code.trim().split("\n");
        let programme =  {};
        tmpcode.forEach(ln => {
            let spln = ln.split('=');
            if (spln[0].toString().trim() === "pipeline") {
                let _tmp = spln[1].replace(';','').trim();
                programme[spln[0].trim()] = JSON.parse(_tmp);
            } else {
                if (spln[0].trim() === 'source') {
                    let _t = spln[1].replace(';', '').replace('"', '').trim();
                    programme[spln[0].trim()] = _t.split(' ');
                } else {
                    programme[spln[0].trim()] = spln[1].replace(';', '').trim();
                }
            }
        });

        //todo: consider if returns are caught and printed to screen
        // existing thought goes with not yet. Concentrating on audio
        evaluate(programme);
        //console.log(pipe(programme.pipeline)({ name: programme.source }));
    } catch (err) {
        console.log(err);
    }
};

evaluate = (parseTree) => {
    let _pipe = source(parseTree.source[0], parseTree.source[1], parseTree);
    console.log(_pipe);
};

/**
 * Holder to allow the user to create a new function in a local scope
 * @param funcName
 * @param args
 * @param definition
 */
defFunc = (funcName, args, definition) => {
    envelope[funcName] = new Function(','.join(args), definition);
};