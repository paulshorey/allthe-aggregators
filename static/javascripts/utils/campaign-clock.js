// This object will provide a centralized place for other objects to ask for
// the current time being represented by the UI. It also allows other
// objects to attach listeners to modify their state based on time changes.
// Objects will also be able to modify the current time being represented with
// this object.
function CampaignClock() {
    let that = this;
    let times = [];
    // Determines whether the clock continues advancing if currently advancing.
    let shouldPlay = true;
    // Determines whether the clock continues reversing if currently reversing.
    let shouldReverse = true;
    // Holds listener functions that will be called when the clock changes time.
    let listeners = [];
    let currentTimePos = 0;
    
    const DEFAULT_SPEED = 2000; // Default speed in ms for clock movement
    let currentSpeed = DEFAULT_SPEED;

    // Gets the current position of the clock.
    //
    // @returns A Number that represents the current time position.
    this.getPosition = function () {
        return currentTimePos;
    };

    // Gets the current time being of the campaign clock.
    //
    // @returns A String representing the current time.
    this.getTime = function () {
        return times[currentTimePos];
    }

    this.getTimesLength = function () {
        return times.length;
    };
    
    // Sets the position of the CampaignClock.
    //
    // @param pos An integer representing the position of the time that is to be the
    //             current time.
    this.setPosition = function (pos) {
        if (pos >= 0 && pos <= times.length - 1) {
            if (pos !== currentTimePos) {
                currentTimePos = pos;
                listeners.forEach(listenerFunc => {
                    listenerFunc(this.getPosition(), this.getTime());
                });
            }
        }
    };

    // Adds a function to an array of functions that will be called when
    // the clock changes time.
    //
    // @param listenerFunc A function that will be called with the current campaign clock
    //                     time position and time as parameters.
    this.addTimeChangeListener = function (listenerFunc) {
        listeners.push(listenerFunc);
    };

    // Removes a function from the clock change listeners.
    //
    // @param listenerFunc A function that was listening to clock change events.
    this.removeTimeChangeListener = function (listenerFunc) {
        listeners.forEach((func, index) => {
            if (func === listenerFunc) {
                listeners.splice(index, 1);
                return;
            }
        });
    };

    // Loads an array of time strings into the CampaignClock.
    //
    // @param A JSON object containing time-series data returned from rteviz.
    this.loadTimes = function (series) {
        times.length = 0;
        listeners.length = 0;
        series.forEach(dataFrame => {
            times.push(dataFrame["date"]);
        });
        this.setPosition(this.getPosition());
    };

    // Advance the clock from its current time to the ending time unless
    // interrupted by shouldPlay being set to false.
    //
    // @param pos A Number that represents the time position to start playback.
    //
    // @param endPos A Number that determines where to stop advancing.
    //
    // @param posInc A Number that determines the amount to increment by with every
    //               iteration.
    let advanceClock = function (pos, endPos, posInc) {
        that.setPosition(pos);
        window.setTimeout(function () {
            if (shouldPlay && pos < endPos) {
                advanceClock(pos + posInc, endPos, posInc);
            }
        }, currentSpeed);
    };

    // Reverse the clock from its current time to the ending time unless
    // interrupted by shouldReverse being set to false.
    //
    // @param pos A Number that represents the time position to start reversal.
    //
    // @param endPos A Number that determines where to stop advancing.
    //
    // @param posDec A Number that determines the amount to deccrement by with every
    //               iteration.
    let reverseClock = function (pos, endPos, posDec) {
        that.setPosition(pos);
        window.setTimeout(function () {
            if (shouldReverse && pos > endPos) {
                reverseClock(pos - posDec, endPos, posDec);
            }
        }, currentSpeed);
    };

    // Starts advancing the clock from its current position.
    this.play = function () {
        shouldPlay = true;
        shouldReverse = false;
        advanceClock(that.getPosition(), times.length - 1, 1);
        // $('.controls-replay .controls-buttons .control-button').css('display','none');
        // $('.controls-replay .controls-buttons #button-pause').css('display','inline-block');
        // $('.controls-replay .controls-buttons #button-reverse').css('display','inline-block');
    };

    // Starts advancing the clock from its current position.
    this.reverse = function () {
        shouldPlay = false;
        shouldReverse = true;
        reverseClock(that.getPosition(), 0, 1);
        // $('.controls-replay .controls-buttons .control-button').css('display','none');
        // $('.controls-replay .controls-buttons #button-play').css('display','inline-block');
        // $('.controls-replay .controls-buttons #button-pause').css('display','inline-block');
    };

    // Stops advancing the clock at its current position.
    this.pause = function () {
        shouldPlay = false;
        shouldReverse = false;
        // $('.controls-replay .controls-buttons .control-button').css('display','none');
        // $('.controls-replay .controls-buttons #button-play').css('display','inline-block');
        // $('.controls-replay .controls-buttons #button-reverse').css('display','inline-block');
    };

    // Resets to the beginning of the loaded time and pauses the clock.
    this.reset = function () {
        that.pause();
        that.setPosition(0);
        // $('.controls-replay .controls-buttons .control-button').css('display','none');
        // $('.controls-replay .controls-buttons #button-play').css('display','inline-block');
    };

    // Sets the speed multiplier for the campaign clock.
    //
    // @param speedMult A number that gets multiplied to the default speed value.
    this.setSpeedMultiplier = function (speedMult) {
        currentSpeed = DEFAULT_SPEED / speedMult;
    };

    return this;
};