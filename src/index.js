/**
 * **********************************************************
 * ******************* Library required *********************
 * **********************************************************
 */

path = require('path'),
    fs = require('fs');

/**
 * **********************************************************
 * **************** Build object file data ******************
 * **********************************************************
 */

function ayoFileObject (fileURL, cb) {
    this.fileURL = fileURL;
    this.cb = cb;
}

/**
 * **********************************************************
 * ********************* Reader Object **********************
 * **********************************************************
 */

var ayoReader = {

    // The place of cursor
    cursor : 0,

    // Number of file actually in reading
    fileInRead : 0,

    // Max file reading simultaneous
    fileReadLimit : 100,

    // File in waiting to reading
    waitingFile : [],

    /**
     * Clean the reader params
     */
    clearReader : function() {
        this.cursor = 0;
        this.fileInRead = 0;
        this.waitingFile = [];

    },

    launchReading : function() {

        var self = this;

        if (this.fileInRead < this.fileReadLimit && this.cursor < this.waitingFile.length) {

            // Increment file in read counter
            this.fileInRead++;

            var inRead = this.cursor;

            var fileURL = this.waitingFile[this.cursor].fileURL;

            fs.readFile(fileURL, 'utf8', function (err, mapData) {
                if (err) {
                    console.log('Error on reading : ' + err);
                    return;
                }

                // Launch callback
                self.waitingFile[inRead].cb(err, mapData, fileURL);

                // Decrement file in reading counter
                self.fileInRead--;

                // If no file are in reading, clear Reader
                if (self.fileInRead == 0) {
                    self.clearReader();
                }

                // Relaunch loading
                self.launchReading();
            });

            // Increment reader counter
            this.cursor++;
        }
    }
};

module.exports = {

    /**
     * This function allow to param reader
     * @param data                  The data must be parameter
     */
    Param : function(data) {
        if (data.readLimit) {
            if (data.readLimit > 0 && data.readLimit <= 1000) {
                if (typeof data.readLimit === 'number' && isFinite(data.readLimit)) {
                    ayoReader.fileReadLimit = data.readLimit;
                } else {
                    throw("Read limit must be a number");
                }
            } else {
                throw("Read limit should be between 1 and 1000");
            }
        }
    },

    /**
     * This function allow to dispatcher reading charge
     * @param fileURL               The URL of file
     * @param cb                    Callback when file is reading
     */
    Read : function (fileURL, cb) {
        // Push file in reading queu
        ayoReader.waitingFile.push(new ayoFileObject(fileURL, cb));

        // Launch reading
        ayoReader.launchReading();
    }
}