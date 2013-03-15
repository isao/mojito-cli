exports['index exports'] = function (t) {
    var module = require('../');
    t.deepEqual(Object.keys(module), ['run','log','name','version']);
    t.done();
};

exports['passthru exports'] = function (t) {
    var module = require('../passthru');
    t.deepEqual(Object.keys(module), ['run','isMojitoApp', 'setpath']);
    t.done();
};
