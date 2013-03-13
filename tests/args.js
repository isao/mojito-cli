var test = require('tape'),
    main = require('../');

function noop() {}

test('version', function(t) {
    t.plan(6);

    function cb(err, msg) {
        t.equals(err, null);
        t.ok(msg.match(/^mojito-cli v(\d+\.){2}.+/));
    }

    t.equals(main(['version'], cb), 'version');
    t.equals(main(['--version'], cb), 'version');
});

test('fixme --version not treated as a bool flag', function(t) {
    // unexpected result since --version is not declared bool
    // { _: [], version: 'help' }
    // address after hooking up runner, cmd, user and app configs
    t.equals(main(['--version', 'help'], noop), 'version');
    t.end();
});

test('help', function(t) {
    t.plan(8);

    function cb(err, msg) {
        t.equals(err, null);
    }

    t.equals(main([], cb), 'help');
    t.equals(main(['--help'], cb), 'help');
    t.equals(main(['help'], cb), 'help');
    t.equals(main(['--foo', 'help'], cb), 'help');
});

test('info', {skip:true}, function(t) {
    t.plan(2);

    function cb(err, msg) {
        t.equals(1, 2);
    }

    t.equals(main(['nonesuch'], cb), 'nonesuch');
});

test('create', function(t) {
    t.equals(main(['create', 'app/simple'], noop), 'create');
    t.end();
});
