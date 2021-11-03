var fs = require('fs');
var fse = require('fs-extra');

var sourceDir = './documentation/static';
var destDir = './static';


// if folder doesn't exists create it
if (!fs.existsSync(destDir)){
    fs.mkdirSync(destDir, { recursive: true });
}

//copy directory content including subfolders
fse.copy(sourceDir, destDir, function (err) {
  if (err) {
    console.error(err);
  } else {
    console.log("success!");
  }
}); 