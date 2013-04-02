var test = require('tap').test,
    resolve = require('path').resolve,
    readpkg = require('../lib/readpkg');


function fromhere(relpath) {
    return resolve(__dirname, relpath);
}

test('readpkg exports', function (t) {
    t.equal('function', typeof readpkg);
    t.same(Object.keys(readpkg), ['mojito']);
    t.end();
});

test("don't read own package.json", function(t) {
    var actual = readpkg(fromhere('../'));
    t.same(actual, false);
    t.end();
});

test('read someapp', function(t) {
    var pkg = require('./fixtures/someapp/package'),
        actual = readpkg(fromhere('./fixtures/someapp'));
    
    t.notSame(pkg, actual);
    t.same(pkg.name, actual.name);
    t.same(pkg.version, actual.version);
    t.same(pkg.description, actual.description);
    t.same(pkg.dependencies, actual.dependencies);
    t.end();
});

test('read mojito', function(t) {
    var actual = readpkg.mojito(fromhere('./fixtures/someapp')),
        cmds = ['build', 'compile', 'create', 'docs', 'gv', 'help', 'info', 'jslint', 'profiler', 'start', 'test', 'version'],
        schemas = [ {name: 'application', path: 'application.schema'},
                    {name: 'default', path: 'default.schema'},
                    {name: 'defaults', path: 'defaults.schema'},
                    {name: 'definition', path: 'definition.schema'},
                    {name: 'routes', path: 'routes.schema'} ];

    cmds.path = resolve(fromhere('./fixtures/someapp'), 'node_modules/mojito/lib/app/commands');
    schemas.path = resolve(fromhere('./fixtures/someapp'), 'node_modules/mojito/schemas');

    t.same(actual.commands, cmds);
    t.same(actual.schemas, schemas);
    t.end();
});