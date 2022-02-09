var fs = require('fs');
var fse = require('fs-extra');

var sourceDir = './convertpdf/mergehtml';
var destDir = './static';

// if folder doesn't exists create it
if (!fs.existsSync(destDir)){
    fs.mkdirSync(destDir, { recursive: true });
}

 fse.readdirSync(sourceDir).forEach(file => {
    if (file.endsWith('.pdf') || file.endsWith('.txt')) {
      console.log(`copying file ${file}`);
      fse.copy(`${sourceDir}/${file}`, `${destDir}/${file}`)
        .then(() => console.log('success!'))
        .catch(err => console.error(err));
    }
  });