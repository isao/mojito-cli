var test = require('tap').test;


test('index exports', function (t) {
    var module = require('../');
    t.equal('function', typeof module);
    t.same(Object.keys(module), ['log', 'load', 'getmeta']);
    t.end();
});

test('readpkg exports', function (t) {
    var module = require('../lib/readpkg');
    t.equal('function', typeof module);
    t.same(Object.keys(module), ['mojito']);
    t.end();
});

