var path = require('path');

function isMojitoApp(dir) {
    var pkg;
    try {
        pkg = require(path.resolve(dir, 'package.json'));
    } catch(err) {
    	
    }
}

function main(mojito_cmd, opts) {
    
}

module.exports = {
    main: main
};