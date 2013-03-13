var test = require('tape'),
    optimist = require('optimist'),
    main = require('../');

function noop() {}

test('version', function(t) {
    t.plan(6);

    var opts;

    function cb(err, msg) {
        t.equals(err, null);
        t.ok(msg.match(/^mojito-cli v(\d+\.){2}.+$/));
    }

    opts = optimist.parse(['version']);
    t.equals(main(opts, cb), 'version');

    opts = optimist.parse(['--version']);
    t.equals(main(opts, cb), 'version');
});

test('fixme? --version not treated as a bool flag', function(t) {
    var opts = optimist.parse(['--version', 'help']);
    // unexpected result since --version is not declared bool
    // { _: [], version: 'help' }
    t.equals(main(opts, noop), 'version');
    t.end();
});

test('help', function(t) {
    t.plan(8);

    var opts;

    function cb(err, msg) {
        t.equals(err, null);
    }

    opts = optimist.parse([]);
    t.equals(main(opts, cb), 'help');

    opts = optimist.parse(['--help']);
    t.equals(main(opts, cb), 'help');

    opts = optimist.parse(['help']);
    t.equals(main(opts, cb), 'help');

    opts = optimist.parse(['--foo', 'help']);
    t.equals(main(opts, cb), 'help');
});

test('nonesuch', {skip:true}, function(t) {
    t.plan(2);

    var opts = optimist.parse(['nonesuch']);

    function cb(err, msg) {
        t.equals(1, 2);
    }

    t.equals(main(opts, cb), 'nonesuch');
});

test('create', function(t) {
    var opts = optimist.parse(['create', 'app/simple']);

    t.equals(main(opts, noop), 'create');
    t.end();
});
