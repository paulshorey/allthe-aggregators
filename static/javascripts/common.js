function isEmpty(str) {
  return !str || str.trim().length == 0;
}

function roundNumber(num, dec) {
  return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
}

/*
	Load a script 
	* into the DOM, and execute it (from any URL - internal or external server)
	* RETURNS A PROMISE * which can be used to tell when the script has loaded.
*/
window.loadScript = function(url, loadAsynchronously) {
  return new Promise(function(resolve, reject) {
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName("head")[0];
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.async = loadAsynchronously || false;
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = function() {
      resolve();
    };
    script.onload = function() {
      resolve();
    };

    // Fire the loading
    head.appendChild(script);
  });
};

/*
    "Deep" copy an object
    NOTE: THIS IS NOT RECURSIVE - only 2 layers deep
*/
window.deepCopy = function(state) {
  var newState = {};
  for (let prop in state) {
    let value = state[prop];
    if (typeof value === "object") {
      if (value instanceof Set) {
        newState[prop] = new Set([...value]);
      } else if (value instanceof Array) {
        newState[prop] = [...value];
      } else {
        newState[prop] = { ...value };
      }
    } else {
      newState[prop] = value;
    }
  }
  return newState;
};
