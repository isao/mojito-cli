var test = require('tape'),
    cli = require('../');


cli.log.pause();// don't output anything

function noop() {
}

test('missing command', function(t) {
    t.plan(4);

    cli.log.once('log.error', function(m) {
        t.equal(m.prefix, 'Missing command parameter.', 'err msg is wrong');
        process.nextTick(function() {
            t.equal(m, cli.log.record.pop(), 'err msg obj is same');
            t.equal(0, cli.log.record.length, 'log stack empty');
        });

    });

    t.equals(cli.run([], noop), 'help');
});

test('help', function(t) {
    t.plan(8);

    function cb(err, msg) {
        t.equals(err, null);
    }

    t.equals(cli.run([], cb), 'help', 'missing command');
    t.equals(cli.run(['--help'], cb), 'help');
    t.equals(cli.run(['help'], cb), 'help');
    t.equals(cli.run(['--foo', 'help'], cb), 'help');
});

test('version', function(t) {
    t.plan(6);

    function cb(err, msg) {
        t.equals(err, null);
        t.ok(msg.match(/^mojito-cli v(\d+\.){2}.+/));
    }

    t.equals(cli.run(['version'], cb), 'version');
    t.equals(cli.run(['--version'], cb), 'version');
});

test('fixme --version not treated as a bool flag', function(t) {
    // unexpected result since --version is not declared bool
    // { _: [], version: 'help' }
    // address after hooking up runner, cmd, user and app configs
    t.equals(cli.run(['--version', 'help'], noop), 'version');
    t.end();
});


test('create', function(t) {
    t.equals(cli.run(['create', 'app/simple'], noop), 'create');
    t.end();
});

test('SKIP', {skip:true}, function(t) {
    t.plan(2);

    function cb(err, msg) {
        t.equals(1, 2);
    }

    t.equals(cli.run(['nonesuch'], cb), 'nonesuch');
});

test('-cleanup-', function(t) {
    //destroy accumulated log messages
    t.ok(cli.log.record.length);
    t.ok(cli.log._buffer.length);
    cli.log.record = [];
    cli.log._buffer = [];
    cli.log.resume();
    t.end();
});
