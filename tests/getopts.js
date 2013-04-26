var test = require('tap').test,
    fn = require('../lib/getopts');

test('no args', function(t) {
    var expected = {
            command: undefined,
            args: [],
            opts: {}
        };

    t.same(fn([]), expected);
    t.end();
});

test('help|--help|-h', function(t) {
    var expected = 'help';

    t.same(fn(['help']).command, expected);
    t.same(fn(['--help']).command, expected);
    t.same(fn(['-h']).command, expected);
    t.end();
});

test('version|--version|-v', function(t) {
    var expected = 'version';

    t.same(fn(['version']).command, expected);
    t.same(fn(['--version']).command, expected);
    t.same(fn(['-v']).command, expected);
    t.end();
});
