var test = require('tap').test,
    help = require('../commands/help');


test('help usage', function(t) {
    t.equal('function', typeof help);
    t.end();
});
