var fs = require("fs"), json;


exports.get_monitors = function(file) {
    
    var filepath = __dirname + '/' + file;
    return readJsonFileSync(filepath);
}

function readJsonFileSync(filepath, encoding) {

    if (typeof (encoding) == 'undefined') {
        encoding = 'utf8';
    }
    var file = fs.readFileSync(filepath, encoding);
    return JSON.parse(file);
}