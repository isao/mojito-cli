var test = require('tap').test,
    cli = require('../');


// buffer log msgs instead of outputing them
cli.log.pause();

function reset(t) {
    if(t) {
        t.same(cli.log.record, cli.log._buffer, 'records & buffer are same');
        t.ok(cli.log.record.length, 'have records buffered');
    }
    cli.log.record = cli.log._buffer = [];
}

function noop() {
}

function noCb(t) {
    return function (err, msg) {
        t.ok((err === undefined) && (msg === undefined), 'no cb params');
    }
}

test('index exports', function (t) {
    var module = require('../');
    t.equal('function', typeof module);
    t.same(Object.keys(module), ['log', 'load', 'getmeta']);
    t.end();
});

test('mojito (no subcmd)', function(t) {
    t.plan(7);
    reset();

    function cb2(m) {
        t.equal(m.message, 'No command...', 'err msg emitted');
        process.nextTick(function() {
            t.equal(cli.log.record[0], m, 'err msg obj is 1st elem');
            t.ok(cli.log.record.length > 1, 'plus some other msgs');
            reset(t);
        });
    }

    cli.log.once('log.error', cb2);
    t.equals(cli([], '', noCb(t)), 'help');
});

test('mojito help|--help|-h', function(t) {
    t.plan(6)
    t.equals(cli(['help'], '', noCb(t)), 'help');
    t.equals(cli(['--help'], '', noCb(t)), 'help');
    t.equals(cli(['-h'], '', noCb(t)), 'help');
});

test('mojito help (app cwd)', function(t) {
    t.plan(3)

    var cwd = __dirname + '/fixtures/someapp',
        msgs = [];

    cli.log.on('log.info', function (m) {
        msgs.push(m.message);
    });

    function cb(err, msg) {
        t.equal(err, null);
        t.equal(msg, 'mock usage for mojito/lib/app/commands/jslint.js');
    }

    t.equals(cli(['help', 'jslint'], cwd, cb), 'help');
});

test('mojito version', function(t) {
    t.plan(2);

    function cb(err, msg) {
        t.equals(err, undefined);
    }

    t.equals(cli(['version'], '', cb), 'version');
    //t.equals(cli(['--version'], null, cb), 'version');
});

test('command takes priority over atl cmd flag', function(t) {
    t.equals(cli(['--version', 'help'], '', noop), 'help');
    t.end();
});


// test('create', function(t) {
//     t.equals(cli(['create', 'app/simple', 'foo'], '', noop), 'create');
//     t.end();
// });

test('nonesuch', function(t) {
    t.plan(2);

    function cb(err, msg) {
        t.equals(err, 'Unable to invoke command nonesuch');
    }

    t.equals(cli(['nonesuch'], '', cb), 'nonesuch');
});
