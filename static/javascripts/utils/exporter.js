// Converts data schemas to a CSV format. Each data schema
// is flattened completely and stripped of any commas.
// This is done to ensure the CSV can convert the json data
// to column data.
function Exporter() {

    // Holds a reference to the past journeys data.
    // The dictionary holds the following keys:
    //      1) data -> json data converted into sanitized string
    //      2) filename -> name of the file
    let _pastJourneysCSV = {};

    // Holds a reference to a vessel's port predictions data
    // The dictionary holds the following keys:
    //      1) data -> json data converted into sanitized string
    //      2) filename -> name of the file
    let _vesselPortPredictions = {};

    // Converts the past journey data to a CSV format. Additionally, the filename is
    // built using the passed in arguments.
    //
    // Arguments:
    //      * items -> past journey json data
    //      * uniqueId -> unique identifier of a vessel OR port used for an explicit filename
    //      * startDate -> filter for the past journeys used for an explicit filename
    //      * endDate -> filter for the past journeys used for an explicit filename
    this.convertPastJourneyDataToCSV = function(items, uniqueId, startDate, endDate) {
        var filename = uniqueId + '_journeys_' + startDate + "_to_" + endDate + '.csv';
        _convertDataToCSVHelper(_pastJourneysCSV, items, filename);
    };

    // Converts a vessel port prediction data to CSV format.
    //
    // Arguments:
    //      * portPredictions -> port prediction json data
    //      * imo -> unique identifier of a vessel used for an explicit filename
    this.convertVesselPortPredictionDataToCSV = function(portPredictions, imo) {
        var filename = imo + '_port_predictions.csv';
        _convertDataToCSVHelper(_vesselPortPredictions, portPredictions, filename);
    };

    // Converts all vessel's port prediction data to CSV format.
    //
    // Returns a dictionary containing the port prediction data and
    // filename.
    this.convertAllPortPredictionDataToCSV = function(items) {
        var allPortPredictionsCSV = {};
        _convertDataToCSVHelper(allPortPredictionsCSV, items, 'all_port_predictions.csv');
        return allPortPredictionsCSV;
    };

    // Retrieves the past journey data in CSV format
    this.getPastJourneyCSV = function() {
        return _pastJourneysCSV;
    };

    // Retrieves a vessel's port prediction data in CSV format
    this.getVesselPortPredictionsCSV = function() {
        return _vesselPortPredictions;
    };

    // Helper function for converting json data to CSV format.
    // Both the data and filename are created as saved in the specified
    // dictionary.
    //
    // Arguments:
    //      * csv -> dictionary representing the file data and filename
    //      * items -> json data being converted to CSV format
    //      * filename -> string representing the expected filename
    let _convertDataToCSVHelper = function(csv, items, filename) {
        var jsonObject = _createJsonObject(items);
        csv.data = _convertToCSV(jsonObject);
        csv.filename = filename;
    };

    // Helper function for creating a json object based on the
    // inputted json data. The data is sanitized by removing commas
    // in order for the data to be split into the CSV columns appropriately.
    // Additionally, the headers of the CSV columns are added into the json data.
    //
    // Arguments:
    //      * items -> json data
    //
    // Returns sanitized json object
    let _createJsonObject = function(items) {
        var sanitizeItems = _removeCommas(items);
        var headers = {};
        for (var key in sanitizeItems[0]) headers[key] = key;
        sanitizeItems.unshift(headers);
        return JSON.stringify(sanitizeItems);
    };

    // Helper function for converting the json data to its
    // most flattened structure. This is necessary in order for
    // the json data to be displayed across the various columns
    // in the CSV file.
    let _convertToCSV = function(objArray) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = '';
        for (var i = 0; i < array.length; i++) {
            var line = '';
            for (var index in array[i]) {
                if (line != '') line += ',';
                line += array[i][index];
            }
            str += line + '\r\n';
        }
        return str;
    };

    // Removes any commas that are present within the
    // data.
    //
    // Arguments:
    //      * data -> json structured data
    //
    // Returns the sanitized data without commas.
    let _removeCommas = function(data) {
        var copyData = [];
        for (var i = 0; i < data.length; i++) {
            var temp = {};
            for (var key in data[i]) {
                temp[key] = data[i][key];
                if (typeof data[i][key] == "string") {
                    temp[key] = temp[key].replace(/,/g, '');
                }
            }
            copyData.push(temp);
        }
        return copyData;
    };

    return this;
}