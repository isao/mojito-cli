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

    t.equals(cli(['version'], null, cb), 'version');
    //t.equals(cli(['--version'], null, cb), 'version');
});

test('mojito validate (app cwd)', function(t) {
    t.plan(3);
    reset();

    var cwd = __dirname + '/fixtures/someapp',
        errors = [],
        warns = [],
        expectedWarnings = ["{ config: 'context[0] -> actionTimeout',\n  message: 'Instance is not a required type' }",
                            "{ config: 'context[0] -> debugger',\n  message: 'Additional properties are not allowed' }",
                            "{ config: 'context[0] -> search-advanced-page -> verbs[2]',\n  message: 'Instance is not one of the possible values: get,post,put,delete,GET,POST,PUT,DELETE' }"
                           ];

    cli.log.on('log.error', function (m) {
        errors.push(m.message);
    });

    cli.log.on('log.warn', function (m) {
        warns.push(m.message);
    });

    function cb(err, msg) {
    }

    t.equals(cli(['validate'], cwd, cb), 'validate');
    setTimeout((function() {
        t.equals(errors.length, 2);
        t.same(warns, expectedWarnings);
    }), 3000);
});

// test('fixme --version not treated as a bool flag', function(t) {
//     // unexpected result since --version is not declared bool
//     // { _: [], version: 'help' }
//     // address after hooking up runner, cmd, user and app configs
//     t.equals(cli(['--version', 'help'], '', noop), 'version');
//     t.end();
// });
// 
// 
// test('create', function(t) {
//     t.equals(cli.run(['create', 'app/simple'], noop), 'create');
//     t.end();
// });
// 
// test('nonesuch', function(t) {
//     t.plan(2);
// 
//     function cb(err, msg) {
//         t.equals(err, 'unable to invoke command "nonesuch"');
//     }
// 
//     t.equals(cli.run(['nonesuch'], cb), 'nonesuch');
// });
