var cli = require('../');


cli.log.pause();// don't output anything

function noop() {
}

// exports['missing command'] = function(t) {
//
// FIXME!
// main
// ✖ missing command
//
// Error: Expected 4 assertions, 2 ran
//     at Object.exports.test.test.done (/Users/isao/Repos/wip/mojito-cli/node_modules/nodeunit/lib/types.js:121:25)
//     at Object.exports.missing command (/Users/isao/Repos/wip/mojito-cli/tests/main.js:21:7)
//     at Object.wrapTest (/Users/isao/Repos/wip/mojito-cli/node_modules/nodeunit/lib/core.js:235:16)
//     at wrapTest (/Users/isao/Repos/wip/mojito-cli/node_modules/nodeunit/lib/core.js:235:16)
//     at Object.exports.runTest (/Users/isao/Repos/wip/mojito-cli/node_modules/nodeunit/lib/core.js:69:9)
//     at exports.runSuite (/Users/isao/Repos/wip/mojito-cli/node_modules/nodeunit/lib/core.js:117:25)
//     at _concat (/Users/isao/Repos/wip/mojito-cli/node_modules/nodeunit/deps/async.js:508:13)
//     at async.forEachSeries.iterate (/Users/isao/Repos/wip/mojito-cli/node_modules/nodeunit/deps/async.js:118:13)
//     at async.forEachSeries (/Users/isao/Repos/wip/mojito-cli/node_modules/nodeunit/deps/async.js:134:9)
//     at _concat (/Users/isao/Repos/wip/mojito-cli/node_modules/nodeunit/deps/async.js:507:9)
//
//     t.expect(4);
//
//     cli.log.once('log.error', function(m) {
//         t.equal(m.prefix, 'Missing command parameter.', 'err msg is wrong');
//         process.nextTick(function() {
//             t.deepEqual(m, cli.log.record.pop(), 'err msg obj is same');
//             t.equal(0, cli.log.record.length, 'log stack empty');
//         });
//     });
//
//     t.equal(cli.run([], noop), 'help');
//     t.done();
// };

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

    function cb(err, msg) {
        t.equals(err, 'unable to invoke command "nonesuch"');
    }

    t.equals(cli.run(['nonesuch'], cb), 'nonesuch');
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
