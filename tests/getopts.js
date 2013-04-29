var test = require('tap').test,
    fn = require('../lib/getopts');

test('no args', function(t) {
    var expected = {
            command: '',
            args: [],
            opts: {},
            orig: {}
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

test('command is lowercased', function(t) {
    t.equal(fn(['Version']).command, 'version');
    t.equal(fn(['hELp']).command, 'help');
    t.end();
});

test('options are lowercased', function(t) {
    t.same(fn(['--Version']).opts, {version: true});
    t.same(fn(['--hELp']).opts, {help: true});
    t.end();
});

test('111', {skip:1}, function(t) {
    var argv = ['--version', 'help'],
        actual = fn(argv);

    t.same(actual.opts, {});
    t.same(actual.opts.version, true);
    t.end();
});
