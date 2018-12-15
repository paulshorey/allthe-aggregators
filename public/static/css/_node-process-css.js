// ([(|,|-| |:]*?)([0-9]*?)px
// $1($2/16)rem

var fs = require('fs');

function readWriteAsync(fileName) {

  fs.readFile(fileName, 'utf-8', function(err, fileContent){

    if (err) throw err;
    try {
			fileContent = fileContent.replace(/([(|,|-| |:]*?)([0-9]*?)px/g, (matchedString, first, second) => {
			  //$1($2/16)rem
			  return `${first}${(second/16)}rem`
			});
		} catch(e) {
			console.log('\nError: '+e,'\n');
		}
    fs.writeFile(fileName, fileContent, 'utf-8', function (err) {
      if (err) throw err;
      console.log('filelistAsync complete');
    });

  });

}
readWriteAsync("./blueprint-datetime-rem.css");