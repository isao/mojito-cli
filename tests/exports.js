var test = require('tape');


test('index exports', function (t) {
    var module = require('../');
    t.same(Object.keys(module), ['run','log','name','version']);
    t.end();
});

test('passthru exports', function (t) {
    var module = require('../passthru');
    t.same(Object.keys(module), ['run','isMojitoApp', 'setpath']);
    t.end();
});
