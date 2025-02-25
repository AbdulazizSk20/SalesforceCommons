const fs = require("fs");
const path = require("path");

let package = JSON.parse(fs.readFileSync('package.json'))
fs.writeFileSync("dist/package.json", `
{
    "name": "${package.name}",
    "version": "${package.version}",
    "description": "${package.description}",
    "main": "index.js",
    "types": "index.d.js"
}
`)

function copyRecursiveSync(src, dest) {
    var exists = fs.existsSync(src);
    var stats = exists && fs.statSync(src);
    var isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
      if(!fs.existsSync(dest)){
        fs.mkdirSync(dest);
      }        
      fs.readdirSync(src).forEach(function(childItemName) {
        copyRecursiveSync(path.join(src, childItemName),
                          path.join(dest, childItemName));
      });
    } else {
      fs.copyFileSync(src, dest);
    }
}
copyRecursiveSync('./lib/steps', './dist/steps');
copyRecursiveSync('./lib/helper', './dist/helper');
copyRecursiveSync('./lib/config', './dist/config');
// copyRecursiveSync('./lib/url', './dist/url');
copyRecursiveSync('./lib/xpath', './dist/xpath');
