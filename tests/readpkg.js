var test = require('tap').test,
    resolve = require('path').resolve,
    readpkg = require('../lib/readpkg');


function fromhere(relpath) {
    return resolve(__dirname, relpath);
}

test('readpkg exports', function (t) {
    t.equal('function', typeof readpkg);
    t.same(Object.keys(readpkg), ['cli', 'mojito']);
    t.end();
});

test('readpkg nonesuch', function(t) {
    var actual = readpkg(fromhere('fixtures'));
    t.equal(actual, false);
    t.end();
});

test('readpkg.cli()', function(t) {
    var clipkg = fromhere('../package.json'),
        expected = require(clipkg),
        actual = readpkg.cli(fromhere('../'));

    t.notSame(actual, expected);
    t.equal(actual.name, expected.name);
    t.equal(actual.version, expected.version);
    t.equal(actual.description, expected.description);
    t.same(actual.dependencies, expected.dependencies);
    t.equal(actual.commands.build, 'mojito-build');
    t.equal(actual.commands.help, './commands/help');
    t.equal(actual.commands.version, './commands/version');
    t.end();
});

test('readpkg someapp', function(t) {
    var expected = require('./fixtures/someapp/package.json'),
        actual = readpkg(fromhere('./fixtures/someapp'));

    t.notSame(actual, expected);
    t.equal(actual.name, expected.name);
    t.equal(actual.version, expected.version);
    t.equal(actual.description, expected.description);
    t.same(actual.dependencies, expected.dependencies);
    t.equal(actual.config, undefined);
    t.end();
});

test('read.mojito() nonesuch', function(t) {
    var actual = readpkg.mojito(fromhere('./fixtures'));
    t.equal(actual, false);
    t.end();
});

test('readMojito someapp’s mojito', function(t) {
    var expected = require('./fixtures/someapp/node_modules/mojito/package.json'),
        actual = readpkg.mojito(fromhere('./fixtures/someapp')),
        cmds = ['build', 'compile', 'create', 'docs', 'gv', 'help', 'info', 'jslint', 'profiler', 'start', 'test', 'version'];

    t.notSame(actual, expected);
    t.equal(actual.name, expected.name);
    t.equal(actual.version, expected.version);
    t.equal(actual.description, expected.description);
    t.same(actual.dependencies, expected.dependencies);
    t.equal(actual.config, undefined);

    // extra props for mojito
    t.equal(actual.commandsPath, fromhere('./fixtures/someapp/node_modules/mojito/lib/app/commands'));
    t.same(actual.commands.sort(), cmds.sort());
    t.end();
});

test('read incomplete', function(t) {
    var actual = readpkg(fromhere('./fixtures/incomplete'));

    t.equal(actual.name, 'incomplete');
    t.equal(actual.version, '0.2.1');
    t.equal(actual.description, '(missing description)');
    t.same(actual.dependencies, {});
    t.equal(actual.config, undefined);
    t.end();
});
