var test = require('tape');


test('index exports', function (t) {
    var module = require('../');
    t.same(Object.keys(module), ['log', 'load', 'getmeta']);
    t.end();
});
