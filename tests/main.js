var cli = require('../'),
    appdir = require('path').resolve(__dirname, 'fixtures/someapp');


cli.log.pause();// don't output anything

function noop() {
}

exports['missing command'] = function(t) {
    t.expect(4);

    cli.log.once('log.error', function(m) {
        t.equal(m.prefix, 'Missing command parameter.', 'err msg is wrong');
        process.nextTick(function() {
            t.deepEqual(m, cli.log.record.pop(), 'err msg obj is same');
            t.equal(0, cli.log.record.length, 'log stack empty');
            t.done();
        });
    });

    t.equal(cli.run([], noop), 'help');
};

exports['help'] = function(t) {
    t.expect(8);

    function cb(err, msg) {
        t.equals(err, null);
    }

    t.equals(cli.run([], cb), 'help', 'missing command');
    t.equals(cli.run(['--help'], cb), 'help');
    t.equals(cli.run(['help'], cb), 'help');
    t.equals(cli.run(['--foo', 'help'], cb), 'help');
    t.done();
};

exports['version'] = function(t) {
    t.expect(6);

    function cb(err, msg) {
        t.equals(err, null);
        t.ok(msg.match(/^mojito-cli v(\d+\.){2}.+/));
    }

    t.equals(cli.run(['version'], cb), 'version');
    t.equals(cli.run(['--version'], cb), 'version');
    t.done();
};

exports['fixme --version not treated as a bool flag'] = function(t) {
    // unexpected result since --version is not declared bool
    // { _: [], version: 'help' }
    // address after hooking up runner, cmd, user and app configs
    t.equals(cli.run(['--version', 'help'], noop), 'version');
    t.done();
};


exports['create'] = function(t) {
    t.equals(cli.run(['create', 'app/simple'], noop), 'create');
    t.done();
};

exports['nonesuch'] = function(t) {
    t.expect(2);

    var cwd = process.cwd(); //fixme
    process.chdir(appdir);

    function cb(err, msg) {
        t.equals(msg, 'you want me to nonesuch?');
        process.chdir(cwd);
    }

    t.equals(cli.run(['nonesuch', '--cwd', appdir], cb), 'nonesuch');
    t.done();
};

exports['-cleanup-'] = function(t) {
    //destroy accumulated log messages
    t.ok(cli.log.record.length);
    t.ok(cli.log._buffer.length);
    cli.log.record = [];
    cli.log._buffer = [];
    cli.log.resume();
    t.done();
};
