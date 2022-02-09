var exec = require('child_process').execFile;

var opt = function(){
      exec('./convertpdf/mergehtml//MergeHtml.exe', ["--filepath=..\\..\\public", "--pdftool=..\\wkhtmltopdf/bin/wkhtmltopdf.exe", "--toc=..\\..\\documentation/toc", "--configpath=..\\..\\config/variables/variables.json", "--mainpage=..\\..\\public/grafik/grafik/index.html"], function(err, data) {  
        console.log(err)
        console.log(data.toString());                       
    });  
}
opt();