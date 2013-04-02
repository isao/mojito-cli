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

test('read incomplete', function(t) {
    var actual = readpkg(fromhere('./fixtures/incomplete'));

    t.same(actual.name, 'incomplete');
    t.same(actual.version, '0.2.1');
    t.same(actual.description, '(missing description)');
    t.same(actual.dependencies, {});
    t.end();
});