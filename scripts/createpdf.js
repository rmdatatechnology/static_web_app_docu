var exec = require('child_process').execFile;

const config = require('../config/variables/variables.json');


var opt = function(product){
      
	  let mainfile = "grafik/products/index/index.html";
	  if(product.toLowerCase() === "rmgeo")
		  mainfile = "rmgeo/rmgeo/index.html";
	  else if(product.toLowerCase() === "geodiscoverer")
		  mainfile = "grafik/geodiscoverer/index/index.html";
	   else if(product.toLowerCase() === "rmkatoffice")
		  mainfile = "rmkatoffice/index/index.html";
	   else if(product.toLowerCase() === "3dworx")
		  mainfile = "3dworx/index/index.html";
	  
	  exec('./convertpdf/mergehtml//MergeHtml.exe', ["--filepath=..\\..\\public", "--pdftool=..\\wkhtmltopdf/bin/wkhtmltopdf.exe", "--toc=..\\..\\documentation/toc", "--configpath=..\\..\\config/variables/variables.json", "--mainpage=" + mainfile], function(err, data) {  
        console.log(err)
        console.log(data.toString());                       
    });  
}
opt(config.productused);